import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateAterbetalningstid, getAterbetalningstidYearlySchedule } from '../lib/aterbetalningstidCalculations'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { HouseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { YearValueTable } from '../components/YearValueTable'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { getNum, getFloat, buildQueryString, replaceUrl } from '../lib/urlParams'
import { ROUTES } from '../config/links'

const DEFAULT_LOAN = 500000
const DEFAULT_PAYMENT = 5000
const DEFAULT_RATE = 5

const SCENARIOS = [
  { id: 'csn', title: 'CSN-lån', loan: 300000, payment: 1500, rate: 0.5, desc: 'Typisk CSN-skuld och amortering' },
  { id: 'bolan', title: 'Bolån', loan: 2500000, payment: 15000, rate: 4.5, desc: 'Bolån med amortering' },
  { id: 'billan', title: 'Billån', loan: 200000, payment: 4000, rate: 6, desc: 'Typiskt billån' },
  { id: 'personlan', title: 'Personlån', loan: 100000, payment: 3000, rate: 8, desc: 'Mindre personlån' },
] as const

function buildShareUrl(params: { loan: number; payment: number; rate: number }): string {
  const q = buildQueryString(params)
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return {
    loan: getNum(params, 'loan', { min: 1, max: 100000000 }),
    payment: getNum(params, 'payment', { min: 1, max: 5000000 }),
    rate: getFloat(params, 'rate', { min: 0, max: 30 }),
  }
}

export function Aterbetalningstid() {
  const url = getParamsFromUrl()
  const [loan, setLoan] = useState(url.loan ?? DEFAULT_LOAN)
  const [payment, setPayment] = useState(url.payment ?? DEFAULT_PAYMENT)
  const [rate, setRate] = useState(url.rate ?? DEFAULT_RATE)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    replaceUrl(window.location.pathname, { loan, payment, rate })
  }, [loan, payment, rate])

  const result = calculateAterbetalningstid({ loanAmount: loan, monthlyPayment: payment, interestRate: rate })
  const yearlySchedule = getAterbetalningstidYearlySchedule({ loanAmount: loan, monthlyPayment: payment, interestRate: rate })
  const yearlyBalance = yearlySchedule.map(({ year, balance }) => ({ year, value: balance }))

  const formatYears = (years: number) => {
    if (years >= 1) {
      const y = Math.floor(years)
      const m = Math.round((years - y) * 12)
      if (m === 0) return `${y} år`
      return `${y} år och ${m} mån`
    }
    return `${Math.round(years * 12)} mån`
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="aterbetalningstid" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Återbetalningstid"
          subtitle="Hur lång tid tar det att betala tillbaka ett lån? Ange lånebelopp, månadsbetalning och ränta."
          accentColor="blue"
          icon={<HouseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Beräkningen gäller annuitetslån med fast ränta. Månadsbetalningen måste överstiga räntekostnaden – annars betalas lånet aldrig av.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Låneuppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = loan === s.loan && payment === s.payment && Math.abs(rate - s.rate) < 0.05
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setLoan(DEFAULT_LOAN)
                        setPayment(DEFAULT_PAYMENT)
                        setRate(DEFAULT_RATE)
                      } else {
                        setLoan(s.loan)
                        setPayment(s.payment)
                        setRate(s.rate)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
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
              <label htmlFor="loan" className="block text-sm font-medium text-slate-700 mb-1">
                Lånebelopp (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Det totala lånebeloppet du vill räkna på.
              </p>
              <InputWithUnit
                id="loan"
                type="number"
                min={1000}
                max={100000000}
                step={10000}
                value={loan || ''}
                onChange={(e) => setLoan(Math.min(100000000, Math.max(1000, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
            </div>

            <div>
              <label htmlFor="payment" className="block text-sm font-medium text-slate-700 mb-1">
                Månadsbetalning (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Den fasta månatliga betalningen (ränta + amortering).
              </p>
              <InputWithUnit
                id="payment"
                type="number"
                min={100}
                max={5000000}
                step={500}
                value={payment || ''}
                onChange={(e) => setPayment(Math.min(5000000, Math.max(100, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-slate-700 mb-1">
                Ränta (% per år)
              </label>
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
                focusRingColor="blue"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Återbetalningstid – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Lån: {loan.toLocaleString('sv-SE')} kr · Månadsbetalning: {payment.toLocaleString('sv-SE')} kr · Ränta: {rate} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {result.impossible ? (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-800">Månadsbetalningen är för låg</p>
              <p className="text-sm text-amber-700 mt-1">
                Den första månaden betalar du {Math.round(loan * (rate / 100 / 12)).toLocaleString('sv-SE')} kr i ränta.
                Betalningen måste överstiga räntekostnaden för att lånet ska kunna betalas av.
              </p>
            </div>
          ) : (
            <>
              {/* Hero metrics */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
                <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Återbetalningstid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800 tabular-nums">
                    {formatYears(result.years)}
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Månader</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    {result.months}
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Total räntekostnad</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    {Math.round(result.totalInterest).toLocaleString('sv-SE')} kr
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-600">
                Total kostnad: {Math.round(result.totalCost).toLocaleString('sv-SE')} kr (lån + ränta).
              </p>

              {yearlyBalance.length >= 2 && (
                <>
                  <div className="mt-6 no-print">
                    <TimeSeriesChart
                      data={yearlyBalance}
                      title="Kvarvarande skuld över tid"
                      valueLabel="Skuld"
                      accentColor="blue"
                    />
                  </div>
                  <Accordion
                    id="year-table-details"
                    summary="Visa tabell år för år"
                    className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
                  >
                    <YearValueTable
                      rows={yearlyBalance}
                      valueHeader="Kvarvarande skuld"
                      valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
                    />
                  </Accordion>
                </>
              )}

              <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
                <Link to={ROUTES.bolanekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Bolånekalkylator</Link>
                <Link to={ROUTES.csnKalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">CSN-kalkylator</Link>
              </div>
            </>
          )}
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="loan" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="aterbetalningstid" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="blue" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ loan, payment, rate })}
        title="Dela återbetalningstidsberäkningen"
      />
    </div>
  )
}
