import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/links'
import { calculateInflation, futureValue } from '../lib/inflationCalculations'
import { YEAR, UI_REFERENCE } from '../config/yearly'
import { ShareModal } from '../components/ShareModal'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { ChartIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { YearValueTable } from '../components/YearValueTable'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'

const DEFAULT_AMOUNT = 10000
const DEFAULT_INFLATION = 2
const DEFAULT_YEARS = 10

const AMOUNT_PRESETS = [10000, 25000, 50000, 100000, 500000] as const
const INFLATION_PRESETS = [1, 2, 3, 5] as const
const YEARS_PRESETS = [5, 10, 20, 30] as const

const INFLATION_SCENARIOS = [
  { id: '50k-10ar', title: '50 k om 10 år', amount: 50000, inflation: 2, years: 10, dir: 'forward' as const, desc: 'Vad 50 000 kr idag motsvarar om 10 år' },
  { id: 'lon-1990', title: 'Lön 1990→idag', amount: 15000, inflation: 2.5, years: 35, dir: 'backward' as const, desc: 'Vad 15 000 kr/mån 1990 motsvarar i dagens köpkraft' },
  { id: 'sparande', title: 'Sparande 20 år', amount: 100000, inflation: 2, years: 20, dir: 'forward' as const, desc: '100 000 kr idag om 20 år' },
  { id: 'riksbanken', title: 'Riksbankens mål', amount: 10000, inflation: 2, years: 10, dir: 'forward' as const, desc: '2 % inflation, Riksbankens KPIF-mål' },
] as const

function buildShareUrl(params: { amount: number; inflation: number; years: number; dir: string }): string {
  const search = new URLSearchParams({
    amt: String(params.amount),
    inf: String(params.inflation),
    yrs: String(params.years),
    dir: params.dir,
  })
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<{ amount: number; inflation: number; years: number; dir: 'forward' | 'backward' }> = {}
  const amt = params.get('amt')
  if (amt != null) {
    const v = parseInt(amt, 10)
    if (!isNaN(v) && v > 0) result.amount = Math.min(v, 100000000)
  }
  const inf = params.get('inf')
  if (inf != null) {
    const v = parseFloat(inf)
    if (!isNaN(v) && v >= 0 && v <= 20) result.inflation = v
  }
  const yrs = params.get('yrs')
  if (yrs != null) {
    const v = parseInt(yrs, 10)
    if (!isNaN(v) && v >= 1 && v <= 100) result.years = v
  }
  const dir = params.get('dir')
  if (dir === 'backward' || dir === 'forward') result.dir = dir
  return result
}

function getInitialState() {
  const url = getParamsFromUrl()
  return {
    amount: url.amount ?? DEFAULT_AMOUNT,
    inflation: url.inflation ?? DEFAULT_INFLATION,
    years: url.years ?? DEFAULT_YEARS,
    direction: (url.dir ?? 'forward') as 'forward' | 'backward',
  }
}

export function Inflationskalkylator() {
  const [amount, setAmount] = useState(() => getInitialState().amount)
  const [inflation, setInflation] = useState(() => getInitialState().inflation)
  const [years, setYears] = useState(() => getInitialState().years)
  const [direction, setDirection] = useState<'forward' | 'backward'>(() => getInitialState().direction)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ amount, inflation, years, dir: direction }))
  }, [amount, inflation, years, direction])

  const result = calculateInflation({
    amount,
    inflationRate: inflation,
    years,
    direction,
  })

  const inflationPath = Array.from({ length: years + 1 }, (_, t) => ({
    year: t,
    value: futureValue(amount, inflation, t),
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="inflationskalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Inflationskalkylator"
          subtitle="Se hur mycket pengar motsvarar vid olika inflationsnivåer. Riksbankens mål är 2% (KPIF)."
          accentColor="purple"
          icon={<ChartIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Beräkna framåt: vad X kr idag motsvarar om Y år. Eller bakåt: vad ett belopp från förr motsvarar i dagens köpkraft.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {INFLATION_SCENARIOS.map((s) => {
                const isActive = amount === s.amount && inflation === s.inflation && years === s.years && direction === s.dir
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setAmount(DEFAULT_AMOUNT)
                        setInflation(DEFAULT_INFLATION)
                        setYears(DEFAULT_YEARS)
                        setDirection('forward')
                      } else {
                        setAmount(s.amount)
                        setInflation(s.inflation)
                        setYears(s.years)
                        setDirection(s.dir)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation focus:outline-none focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Typ av beräkning</label>
              <p className="text-xs text-stone-500 mb-2">
                Framåt: vad X kr idag blir om Y år. Bakåt: vad ett belopp från förr motsvarar i dagens köpkraft.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('forward')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    direction === 'forward' ? 'bg-purple-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Vad blir X kr om Y år?
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('backward')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    direction === 'backward' ? 'bg-purple-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Vad motsvarar X kr idag?
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                Belopp (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Beloppet du vill omvandla – t.ex. lön, sparande, köp eller vad som helst du vill se i framtida/dagens värde.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {AMOUNT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      amount === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    {p >= 1000 ? `${(p / 1000).toFixed(0)} k kr` : `${p} kr`}
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="amount"
                type="number"
                min={1}
                max={100000000}
                value={amount || ''}
                onChange={(e) => setAmount(Math.min(100000000, Math.max(1, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="purple"
              />
            </div>

            <div>
              <label htmlFor="inflation" className="block text-sm font-medium text-slate-700 mb-1">
                Inflation (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Riksbankens mål är 2 % (KPIF). KPIF {YEAR}: ca {UI_REFERENCE.inflationForvantadMin}–{UI_REFERENCE.inflationForvantadMax} %.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {INFLATION_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInflation(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      inflation === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    {p} %
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="inflation"
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={inflation}
                onChange={(e) => setInflation(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="purple"
              />
            </div>

            <div>
              <label htmlFor="years" className="block text-sm font-medium text-slate-700 mb-1">
                Antal år
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Tidsperioden för beräkningen – t.ex. 10 år för sparande eller 30 år för pension.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {YEARS_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setYears(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      years === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    {p} år
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="years"
                type="number"
                min={1}
                max={100}
                value={years}
                onChange={(e) => setYears(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="purple"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Inflationskalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })} · {direction === 'forward' ? 'Framåt' : 'Bakåt'}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Belopp: {amount.toLocaleString('sv-SE')} kr · Inflation: {inflation} % · År: {years}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Hero metric */}
          <div className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              {direction === 'forward' ? 'Värde om X år' : 'Värde idag'}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-800 tabular-nums">
              {Math.round(result).toLocaleString('sv-SE')} kr
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {direction === 'forward'
                ? `${amount.toLocaleString('sv-SE')} kr idag → ${years} år vid ${inflation}% inflation`
                : `${amount.toLocaleString('sv-SE')} kr om ${years} år → idag vid ${inflation}% inflation`}
            </p>
          </div>

          <div className="mt-6 no-print">
            <TimeSeriesChart
              data={inflationPath}
              title={direction === 'forward' ? 'Köpkraft över tid' : 'Köpkraft från förr till idag'}
              valueLabel="Värde"
              accentColor="purple"
            />
          </div>

          <Accordion
            id="year-table-details"
            summary="Visa tabell år för år"
            className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
          >
            <YearValueTable
              rows={inflationPath}
              valueHeader={direction === 'forward' ? 'Framtida värde' : 'Värde'}
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
            />
          </Accordion>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">Ränta-på-ränta</Link>
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="inflation" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="purple" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ amount, inflation, years, dir: direction })}
        title="Dela inflationsberäkningen"
      />
    </div>
  )
}
