import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateEffektivRanta } from '../lib/effektivRantaCalculations'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { ChartIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { ROUTES } from '../config/links'

const DEFAULT_LOAN = 100000
const DEFAULT_RATE = 10
const DEFAULT_YEARS = 5
const DEFAULT_SETUP = 0
const DEFAULT_MONTHLY_FEE = 0

const SCENARIOS = [
  { id: 'personlan', title: 'Personlån', loan: 100000, rate: 10, years: 5, setup: 0, monthlyFee: 0, desc: 'Typiskt personlån' },
  { id: 'med-avgift', title: 'Med uppläggningsavgift', loan: 50000, rate: 8, years: 3, setup: 500, monthlyFee: 0, desc: 'Uppläggningsavgift påverkar effektiv ränta' },
  { id: 'billan', title: 'Billån', loan: 200000, rate: 6, years: 5, setup: 0, monthlyFee: 29, desc: 'Ev. månadsavgift (aviavgift)' },
] as const

function buildShareUrl(params: {
  loan: number
  rate: number
  years: number
  setup?: number
  monthlyFee?: number
}): string {
  const search = new URLSearchParams({
    loan: String(params.loan),
    rate: String(params.rate),
    years: String(params.years),
  })
  if ((params.setup ?? 0) > 0) search.set('setup', String(params.setup))
  if ((params.monthlyFee ?? 0) > 0) search.set('fee', String(params.monthlyFee))
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<{
    loan: number
    rate: number
    years: number
    setup: number
    monthlyFee: number
  }> = {}
  const loan = params.get('loan')
  if (loan != null) {
    const v = parseInt(loan, 10)
    if (!isNaN(v) && v > 0) result.loan = Math.min(v, 50000000)
  }
  const rate = params.get('rate')
  if (rate != null) {
    const v = parseFloat(rate)
    if (!isNaN(v) && v >= 0 && v <= 30) result.rate = v
  }
  const years = params.get('years')
  if (years != null) {
    const v = parseInt(years, 10)
    if (!isNaN(v) && v >= 1 && v <= 50) result.years = v
  }
  const setup = params.get('setup')
  if (setup != null) {
    const v = parseInt(setup, 10)
    if (!isNaN(v) && v >= 0) result.setup = v
  }
  const fee = params.get('fee')
  if (fee != null) {
    const v = parseInt(fee, 10)
    if (!isNaN(v) && v >= 0) result.monthlyFee = v
  }
  return result
}

function formatProcent(value: number): string {
  return value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

export function EffektivRanta() {
  const url = getParamsFromUrl()
  const [loan, setLoan] = useState(url.loan ?? DEFAULT_LOAN)
  const [rate, setRate] = useState(url.rate ?? DEFAULT_RATE)
  const [years, setYears] = useState(url.years ?? DEFAULT_YEARS)
  const [setupFee, setSetupFee] = useState(url.setup ?? DEFAULT_SETUP)
  const [monthlyFee, setMonthlyFee] = useState(url.monthlyFee ?? DEFAULT_MONTHLY_FEE)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState(
      {},
      '',
      buildShareUrl({ loan, rate, years, setup: setupFee, monthlyFee })
    )
  }, [loan, rate, years, setupFee, monthlyFee])

  const result = calculateEffektivRanta({
    loanAmount: loan,
    nominalRate: rate,
    years,
    setupFee,
    monthlyFee,
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="effektivRanta" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Effektiv ränta"
          subtitle="Jämför nominell ränta med verklig kostnad. Avgifter höjer den effektiva räntan – här ser du hur mycket."
          accentColor="indigo"
          icon={<ChartIcon />}
        >
          <Accordion summary="Läs mer om effektiv ränta" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-stone-600">
              <p>
                <strong>Nominell ränta</strong> är den grundläggande räntesatsen utan avgifter. <strong>Effektiv ränta</strong> visar den totala kostnaden – inkl. uppläggningsavgift, aviavgift och andra avgifter.
              </p>
              <p>
                Finansinspektionen kräver att alla långivare anger effektiv ränta så du kan jämföra låneerbjudanden rättvist. Vid jämförelse – titta alltid på den effektiva räntan, inte bara den nominella.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Låneuppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive =
                  loan === s.loan &&
                  Math.abs(rate - s.rate) < 0.05 &&
                  years === s.years &&
                  setupFee === s.setup &&
                  monthlyFee === s.monthlyFee
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setLoan(DEFAULT_LOAN)
                        setRate(DEFAULT_RATE)
                        setYears(DEFAULT_YEARS)
                        setSetupFee(DEFAULT_SETUP)
                        setMonthlyFee(DEFAULT_MONTHLY_FEE)
                      } else {
                        setLoan(s.loan)
                        setRate(s.rate)
                        setYears(s.years)
                        setSetupFee(s.setup)
                        setMonthlyFee(s.monthlyFee)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1 ${
                      isActive
                        ? 'border-stone-800 bg-stone-800 text-white'
                        : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    aria-label={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="loan" className="block text-sm font-medium text-stone-700 mb-1">
                Lånebelopp (kr)
              </label>
              <InputWithUnit
                id="loan"
                type="number"
                min={1000}
                max={50000000}
                step={1000}
                value={loan || ''}
                onChange={(e) => setLoan(Math.min(50000000, Math.max(1000, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="indigo"
              />
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-stone-700 mb-1">
                Nominell ränta (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">Räntesatsen utan avgifter – som banken annonserar.</p>
              <InputWithUnit
                id="rate"
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-stone-700 mb-1">
                Återbetalningstid (år)
              </label>
              <InputWithUnit
                id="years"
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
            <div>
              <label htmlFor="setup" className="block text-sm font-medium text-stone-700 mb-1">
                Uppläggningsavgift (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">Engångsavgift vid lånetillträde. 0 om ingen.</p>
              <InputWithUnit
                id="setup"
                type="number"
                min={0}
                max={100000}
                value={setupFee}
                onChange={(e) => setSetupFee(Math.min(100000, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
            <div>
              <label htmlFor="monthlyFee" className="block text-sm font-medium text-stone-700 mb-1">
                Månadsavgift (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">T.ex. aviavgift. 0 om ingen.</p>
              <InputWithUnit
                id="monthlyFee"
                type="number"
                min={0}
                max={500}
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Math.min(500, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
          </div>
        </div>

        <section
          className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg"
          aria-live="polite"
          aria-label="Beräkningsresultat"
        >
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Effektiv ränta – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Nominell ränta</p>
              <p className="text-2xl font-bold text-stone-700 tabular-nums">{formatProcent(rate)} %</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50 border border-stone-200">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-700 mb-1">Effektiv ränta</p>
              <p className="text-2xl font-bold text-indigo-800 tabular-nums">
                {formatProcent(result.effectiveRate)} %
              </p>
            </div>
          </div>

          {result.effectiveRate > result.nominalRate && (
            <p className="text-sm text-stone-600 mb-4">
              Avgifterna höjer den effektiva räntan med {formatProcent(result.effectiveRate - result.nominalRate)} procentenheter.
            </p>
          )}

          <div className="space-y-2 text-sm text-stone-600">
            <p>
              Månadskostnad: <strong className="text-stone-800">{Math.round(result.monthlyPayment).toLocaleString('sv-SE')} kr</strong>
            </p>
            <p>
              Total kostnad (lån + ränta + avgifter):{' '}
              <strong className="text-stone-800">{Math.round(result.totalCost).toLocaleString('sv-SE')} kr</strong>
            </p>
            {result.totalFees > 0 && (
              <p>
                Av det: {Math.round(result.totalFees).toLocaleString('sv-SE')} kr i avgifter
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.aterbetalningstid} className="text-stone-600 hover:text-stone-900 hover:underline">
              Återbetalningstid
            </Link>
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">
              Ränta på ränta
            </Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="effektivRanta" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">
            ← Fler kalkylatorer
          </Link>
        </div>
      </main>

      <Footer accentColor="indigo" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ loan, rate, years, setup: setupFee, monthlyFee })}
        title="Dela effektiv ränta-beräkningen"
      />
    </div>
  )
}
