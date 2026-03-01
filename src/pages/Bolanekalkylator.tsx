import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateBolan, getAmorteringskrav, getAmorteringsfrittComparison } from '../lib/bolanCalculations'
import { YEAR, UI_REFERENCE } from '../config/yearly'
import { ShareModal } from '../components/ShareModal'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { HouseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { BolanChart } from '../components/BolanChart'
import { BolanRantaAmortChart } from '../components/BolanRantaAmortChart'
import { Chip } from '../components/Chip'
import { StackedBarChart } from '../components/StackedBarChart'
import { YearValueTable } from '../components/YearValueTable'
import { Footer } from '../components/Footer'
import { ROUTES } from '../config/links'
import { PageMeta } from '../components/PageMeta'
import { getNum, getFloat, buildQueryString, replaceUrl } from '../lib/urlParams'

const DEFAULT_LOAN = 3000000
const DEFAULT_RATE = 2.9
const DEFAULT_YEARS = 30
const DEFAULT_BELANING = 85

const LOAN_PRESETS = [2000000, 3000000, 4000000, 5000000, 6000000] as const
const RATE_PRESETS = [2.5, 2.9, 3.5, 4, 5] as const
const YEARS_PRESETS = [20, 25, 30, 35, 50] as const
const BELANING_PRESETS = [50, 70, 75, 80, 85] as const

/** Scenario-presets baserade på vanliga marknadsmönster */
const SCENARIOS = [
  { id: 'ny-bostad', title: 'Ny bostad 3M', loan: 3000000, rate: 2.9, years: 30, belaning: 85, desc: 'Typiskt förstaköp, 85 % belåningsgrad' },
  { id: 'bostadsratt', title: 'Bostadsrätt 2M', loan: 2000000, rate: 2.9, years: 25, belaning: 70, desc: 'Mindre bostadsrätt, lägre belåningsgrad' },
  { id: 'refinansiera', title: 'Refinansiera', loan: 2500000, rate: 2.7, years: 30, belaning: 75, desc: 'Byta bank, ofta bättre ränta' },
  { id: 'stor-villa', title: 'Stor villa 5M', loan: 5000000, rate: 3.2, years: 30, belaning: 80, desc: 'Högre belopp, något högre ränta' },
  { id: 'spara-lag', title: 'Spara låg belåning', loan: 1500000, rate: 2.5, years: 20, belaning: 50, desc: '50 % belåningsgrad, inget amorteringskrav' },
] as const

const COMPARE_YEARS = 5

function AmorteringsfrittJämförelse({
  loan,
  rate,
  years,
  belaning,
}: {
  loan: number
  rate: number
  years: number
  belaning: number
}) {
  const cmp = getAmorteringsfrittComparison(
    { loanAmount: loan, interestRate: rate, years, belaningsgrad: belaning },
    Math.min(COMPARE_YEARS, years)
  )
  const diff = cmp.amortFreeRemaining - cmp.withAmortRemaining
  return (
    <div className="mt-2 space-y-4 text-sm text-stone-600">
      <p>
        Under de första {cmp.years} åren: Med amortering betalar du mer varje månad, men skulden minskar.
        Amorteringsfritt ger lägre månadskostnad men skulden är oförändrad.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white border border-stone-200">
          <p className="font-medium text-stone-700 mb-1">Med amortering</p>
          <p>Månad: {Math.round(cmp.withAmortMonthly).toLocaleString('sv-SE')} kr</p>
          <p>Betalt {cmp.years} år: {Math.round(cmp.withAmortTotalPaid).toLocaleString('sv-SE')} kr</p>
          <p>Kvar att betala: {Math.round(cmp.withAmortRemaining).toLocaleString('sv-SE')} kr</p>
        </div>
        <div className="p-3 rounded-lg bg-white border border-stone-200">
          <p className="font-medium text-stone-700 mb-1">Amorteringsfritt</p>
          <p>Månad: {Math.round(cmp.amortFreeMonthly).toLocaleString('sv-SE')} kr</p>
          <p>Betalt {cmp.years} år: {Math.round(cmp.amortFreeTotalPaid).toLocaleString('sv-SE')} kr</p>
          <p>Kvar att betala: {Math.round(cmp.amortFreeRemaining).toLocaleString('sv-SE')} kr</p>
        </div>
      </div>
      <p className="font-medium text-amber-800">
        Amorteringsfritt: du sparar {Math.round(cmp.withAmortMonthly - cmp.amortFreeMonthly).toLocaleString('sv-SE')} kr/mån nu,
        men efter {cmp.years} år är skulden {Math.round(diff).toLocaleString('sv-SE')} kr högre. Total kostnad över lånetiden blir högre.
      </p>
    </div>
  )
}

function buildShareUrl(params: { loan: number; rate: number; years: number; belaning: number }): string {
  const q = buildQueryString(params)
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const loan = getNum(params, 'loan', { min: 1, max: 50000000 })
  const rate = getFloat(params, 'rate', { min: 0, max: 15 })
  const years = getNum(params, 'years', { min: 1, max: 50 })
  const belaning = getNum(params, 'belaning', { min: 0, max: 100 })
  return { loan, rate, years, belaning }
}

function getInitialState() {
  const url = getParamsFromUrl()
  return {
    loan: url.loan ?? DEFAULT_LOAN,
    rate: url.rate ?? DEFAULT_RATE,
    years: url.years ?? DEFAULT_YEARS,
    belaning: url.belaning ?? DEFAULT_BELANING,
  }
}

export function Bolanekalkylator() {
  const [loan, setLoan] = useState(() => getInitialState().loan)
  const [rate, setRate] = useState(() => getInitialState().rate)
  const [years, setYears] = useState(() => getInitialState().years)
  const [belaning, setBelaning] = useState(() => getInitialState().belaning)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    replaceUrl(window.location.pathname, { loan, rate, years, belaning })
  }, [loan, rate, years, belaning])

  const result = calculateBolan({
    loanAmount: loan,
    interestRate: rate,
    years,
    belaningsgrad: belaning,
  })

  const amortKrav = getAmorteringskrav(belaning)

  const yearlyBalance = [
    { year: 0, value: loan },
    ...Array.from({ length: years }, (_, y) => {
      const monthIdx = (y + 1) * 12 - 1
      const row = result.schedule[monthIdx]
      return { year: y + 1, value: row ? row.balance : 0 }
    }),
  ]

  const lastYear = result.schedule.length > 0 ? Math.ceil(result.schedule.length / 12) : years

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="bolanekalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Bolånekalkylator"
          subtitle="Se månadskostnad, räntekostnad och total kostnad. Amorteringskrav enligt Finansinspektionen."
          accentColor="amber"
          icon={<HouseIcon />}
        >
          <Accordion summary="Så fungerar beräkningen" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-stone-600">
              <p>
                <strong>Annuitetslån:</strong> Samma månadskostnad varje månad. Andelen ränta minskar över tid, amorteringen ökar. Formeln tar hänsyn till ränta och återbetalningstid.
              </p>
              <p>
                <strong>Amorteringskrav (FI):</strong> Under 50 % belåningsgrad ingen, 50–70 % minst 1 % per år, över 70 % minst 2 % per år av lånebeloppet.
              </p>
              <p>
                <strong>Belåningsgrad:</strong> Lånebelopp ÷ bostadens värde. 85 % = 15 % kontantinsats. Ju högre belåningsgrad, desto högre amorteringskrav.
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
                const isActive = loan === s.loan && Math.abs(rate - s.rate) < 0.05 && years === s.years && belaning === s.belaning
                return (
                  <Chip
                    key={s.id}
                    isActive={isActive}
                    onClick={() => {
                      if (isActive) {
                        setLoan(DEFAULT_LOAN)
                        setRate(DEFAULT_RATE)
                        setYears(DEFAULT_YEARS)
                        setBelaning(DEFAULT_BELANING)
                      } else {
                        setLoan(s.loan)
                        setRate(s.rate)
                        setYears(s.years)
                        setBelaning(s.belaning)
                      }
                    }}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    ariaLabel={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                    accentColor="amber"
                    variant="scenario"
                  >
                    {s.title}
                  </Chip>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="loan" className="block text-sm font-medium text-slate-700 mb-1">
                Lånebelopp (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Det totala bolånebeloppet du vill räkna på. Vanligtvis 70–85 % av bostadens värde.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {LOAN_PRESETS.map((p) => (
                  <Chip
                    key={p}
                    isActive={loan === p}
                    onClick={() => setLoan(p)}
                    accentColor="amber"
                  >
                    {(p / 1_000_000).toFixed(1)} M kr
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="loan"
                type="number"
                min={100000}
                max={50000000}
                step={100000}
                value={loan || ''}
                onChange={(e) => setLoan(Math.min(50000000, Math.max(100000, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-slate-700 mb-1">
                Ränta (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din rörliga eller bundna ränta. Kolla din bank eller lånelöfte för aktuellt erbjudande.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {RATE_PRESETS.map((p) => (
                  <Chip
                    key={p}
                    isActive={Math.abs(rate - p) < 0.05}
                    onClick={() => setRate(p)}
                    accentColor="amber"
                  >
                    {p} %
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="rate"
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Math.min(15, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="amber"
              />
              <p className="text-xs text-stone-500 mt-1">
                Rörlig ränta {YEAR}: ca {UI_REFERENCE.bolanRantaMin}–{UI_REFERENCE.bolanRantaMax}% (SCB)
              </p>
            </div>

            <div>
              <label htmlFor="years" className="block text-sm font-medium text-slate-700 mb-1">
                Lånetid (år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Vanligtvis 20–30 år för bolån. Ju längre tid, desto lägre månadskostnad men högre total räntekostnad.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {YEARS_PRESETS.map((p) => (
                  <Chip
                    key={p}
                    isActive={years === p}
                    onClick={() => setYears(p)}
                    accentColor="amber"
                  >
                    {p} år
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="years"
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="amber"
              />
            </div>

            <div>
              <label htmlFor="belaning" className="block text-sm font-medium text-slate-700 mb-1">
                Belåningsgrad (%)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Lånebelopp ÷ bostadens värde. 85 % = 15 % kontantinsats. Under 50 % inget amorteringskrav, 50–70 % minst 1 %, över 70 % minst 2 % per år.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {BELANING_PRESETS.map((p) => (
                  <Chip
                    key={p}
                    isActive={belaning === p}
                    onClick={() => setBelaning(p)}
                    accentColor="amber"
                  >
                    {p} %
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="belaning"
                type="number"
                min={0}
                max={100}
                value={belaning}
                onChange={(e) => setBelaning(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="amber"
              />
              <p className="text-xs text-stone-500 mt-1">
                Ditt amorteringskrav: {amortKrav === 0 ? 'Inget' : `minst ${amortKrav} % per år`} enligt FI
              </p>
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Bolånekalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Lån: {loan.toLocaleString('sv-SE')} kr · Ränta: {rate} % · Lånetid: {years} år · Belåningsgrad: {belaning} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-white border-l-4 border-l-[#1a4d2e]">
              <p className="text-xs text-stone-500 mb-0.5">Månadskostnad</p>
              <p className="text-xl font-semibold text-stone-800 tabular-nums">
                {Math.round(result.monthlyPayment).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-4 rounded-lg border border-stone-200 bg-white">
              <p className="text-xs text-stone-500 mb-0.5">Total räntekostnad</p>
              <p className="text-lg font-semibold text-stone-800 tabular-nums">
                {Math.round(result.totalInterest).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-4 rounded-lg border border-stone-200 bg-white sm:col-span-2">
              <p className="text-xs text-stone-500 mb-0.5">Total kostnad (lån + ränta)</p>
              <p className="text-lg font-semibold text-stone-800 tabular-nums">
                {Math.round(result.totalCost).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-stone-600">
            Den första månaden: {Math.round(result.schedule[0]?.interest ?? 0).toLocaleString('sv-SE')} kr ränta, {Math.round(result.schedule[0]?.amortization ?? 0).toLocaleString('sv-SE')} kr amortering.
          </p>

          <p className="mt-6 text-base text-slate-700 no-print">
            <strong className="tabular-nums">Avbetalt om {lastYear} år.</strong> Då har du betalat {Math.round(result.totalInterest).toLocaleString('sv-SE')} kr i ränta och {Math.round(loan).toLocaleString('sv-SE')} kr i amortering.
          </p>

          <div className="mt-6 no-print">
            <StackedBarChart
              segments={[
                { name: 'Betalt till banken (ränta)', value: result.totalInterest, color: '#94a3b8' },
                { name: 'Amorterat (lånebelopp)', value: loan, color: '#10b981' },
              ]}
              title="Total kostnad – ränta vs amortering"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
              embedded
            />
          </div>

          <div className="mt-6 no-print">
            <BolanChart schedule={result.schedule} initialLoan={loan} years={years} />
          </div>

          <div className="mt-6 no-print">
            <BolanRantaAmortChart schedule={result.schedule} />
          </div>

          <Accordion
            id="year-table-details"
            summary="Visa tabell år för år"
            className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
          >
            <YearValueTable
              rows={yearlyBalance}
              valueHeader="Kvarvarande skuld"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
            />
          </Accordion>

          <Accordion
            summary="Amorteringsfritt vs amortering – jämför kostnad"
            className="mt-6 p-4 bg-amber-50/50 rounded-lg border border-amber-100 no-print"
          >
            <AmorteringsfrittJämförelse
              loan={loan}
              rate={rate}
              years={years}
              belaning={belaning}
            />
          </Accordion>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
            <Link to={ROUTES.kontantinsats} className="text-stone-600 hover:text-stone-900 hover:underline">Kontantinsats</Link>
            <Link to={ROUTES.kalpKalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">KALP</Link>
            <Link to={ROUTES.rantabilitet} className="text-stone-600 hover:text-stone-900 hover:underline">Räntabilitet</Link>
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">Ränta på ränta</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="loan" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="bolan" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="amber" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ loan, rate, years, belaning })}
        title="Dela bolåneberäkningen"
      />
    </div>
  )
}
