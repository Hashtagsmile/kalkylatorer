import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator } from '../components/Calculator'
import { Chart } from '../components/Chart'
import { TargetCalculator } from '../components/TargetCalculator'
import { YearTable } from '../components/YearTable'
import { AffiliateSection } from '../components/AffiliateSection'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { AdSlot } from '../components/AdSlot'
import { ShareButton } from '../components/ShareButton'
import { PrintResultButton } from '../components/PrintResultButton'
import { Disclaimer } from '../components/Disclaimer'
import { PageMeta } from '../components/PageMeta'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { Footer } from '../components/Footer'
import { getParamsFromUrl, updateUrlParams } from '../lib/urlParams'
import { calculateCompoundInterest, runMonteCarlo } from '../lib/compoundInterest'
import { affiliate } from '../config'
import type { TaxMode } from '../components/Calculator'
import type { ChartType } from '../components/Chart'

const DEFAULT = { initial: 10000, monthly: 2000, rate: 7, years: 10 }

function getInitialState() {
  const params = getParamsFromUrl()
  return {
    initial: params.initial ?? DEFAULT.initial,
    monthly: params.monthly ?? DEFAULT.monthly,
    rate: params.rate ?? DEFAULT.rate,
    years: params.years ?? DEFAULT.years,
    taxMode: (params.tax ?? 'ingen') as TaxMode,
    monthlyIncreasePercent: params.inc ?? 0,
    chartType: (params.chart ?? 'detaljerad') as ChartType,
  }
}

type ViewMode = 'nyckeltal' | 'tabell'

export function RantapaRanta() {
  const init = getInitialState()
  const [initial, setInitial] = useState(init.initial)
  const [monthly, setMonthly] = useState(init.monthly)
  const [rate, setRate] = useState(init.rate)
  const [years, setYears] = useState(init.years)
  const [taxMode, setTaxMode] = useState<TaxMode>(init.taxMode)
  const [monthlyIncreasePercent, setMonthlyIncreasePercent] = useState(init.monthlyIncreasePercent)
  const [chartType, setChartType] = useState<ChartType>(init.chartType)
  const [viewMode, setViewMode] = useState<ViewMode>('nyckeltal')

  useEffect(() => {
    updateUrlParams({ initial, monthly, rate, years, tax: taxMode, inc: monthlyIncreasePercent, chart: chartType })
  }, [initial, monthly, rate, years, taxMode, monthlyIncreasePercent, chartType])

  const data = calculateCompoundInterest({
    initial,
    monthly,
    rate,
    years,
    taxMode,
    monthlyIncreasePercent,
  })
  const final = data[data.length - 1]
  const totalTax = data.reduce((s, d) => s + (d.tax ?? 0), 0)
  const monteCarlo = chartType === 'slumpad' ? runMonteCarlo({ initial, monthly, years, taxMode, monthlyIncreasePercent }) : undefined

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="rantapaRanta" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Ränta på ränta"
          subtitle="Se hur dina pengar växer med sammansatt ränta. Ju längre du sparar, desto snabbare växer pengarna."
          accentColor="emerald"
          icon={<span className="font-bold text-lg">%</span>}
        >
          <Accordion summary="Läs mer om ränta på ränta – tips och minnesregler" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-stone-600">
              <p>
                Du får avkastning inte bara på dina pengar, utan också på den tidigare avkastningen – effekten blir exponentiell över tid.
              </p>
              <p>
                <strong>72-regeln:</strong> Dela 72 med räntan för att få ungefär hur många år det tar att dubbla pengarna. Vid 7 % avkastning: 72 ÷ 7 ≈ 10 år.
              </p>
              <p>
                <strong>12-12-12-principen:</strong> Spara 12 kr/mån i ca 12 år för att sedan få ut ca 12 kr/mån resten av livet. Fungerar för vilket belopp som helst.
              </p>
              <p>
                <strong>7 % kan man förvänta sig:</strong> Historisk snittavkastning för globala indexfonder. Inga garantier för framtiden.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="scroll-mt-24 no-print">
          <Calculator
            initial={initial}
            monthly={monthly}
            rate={rate}
            years={years}
            taxMode={taxMode}
            monthlyIncreasePercent={monthlyIncreasePercent}
            chartType={chartType}
            onInitialChange={setInitial}
            onMonthlyChange={setMonthly}
            onRateChange={setRate}
            onYearsChange={setYears}
            onTaxModeChange={setTaxMode}
            onMonthlyIncreaseChange={setMonthlyIncreasePercent}
            onChartTypeChange={setChartType}
          />
        </div>

        {final && (
          <section className="mt-6 sm:mt-8 p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
            <div className="hidden print:block mb-6 pb-4 border-b border-stone-300">
              <h1 className="text-xl font-bold text-stone-900">Kalkylatorer – Beräkningsresultat</h1>
              <p className="text-sm text-stone-600 mt-1">
                Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
              </p>
              <div className="mt-3 text-sm text-stone-600">
                <p>Startkapital: {initial.toLocaleString('sv-SE')} kr · Månadligt: {monthly.toLocaleString('sv-SE')} kr · Avkastning: {rate} % · Sparhorisont: {years} år{taxMode !== 'ingen' ? ` · Skatt: ${taxMode}` : ''}{monthlyIncreasePercent > 0 ? ` · Ökning: ${monthlyIncreasePercent} %` : ''}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
              <div className="flex items-center gap-2 no-print text-stone-500">
                <ShareButton initial={initial} monthly={monthly} rate={rate} years={years} tax={taxMode} inc={monthlyIncreasePercent} chart={chartType} />
                <span aria-hidden>·</span>
                <PrintResultButton />
              </div>
            </div>

            <p className="text-lg sm:text-xl font-semibold text-stone-800 mb-6">
              Beloppet efter {years} år blir <span className="text-emerald-600 tabular-nums">{final.total.toLocaleString('sv-SE')} kr</span> tack vare ränta-på-ränta-effekten.
            </p>

            <div className="flex flex-wrap gap-2 mb-4 no-print">
              <button
                type="button"
                onClick={() => setViewMode('nyckeltal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'nyckeltal' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Nyckeltal
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tabell')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'tabell' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tabell
              </button>
            </div>

            {viewMode === 'nyckeltal' && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 mb-4">
                <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Slutsumma</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                    {final.total.toLocaleString('sv-SE')} kr
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Efter {years} år</p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Ränta på ränta</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    +{final.interest.toLocaleString('sv-SE')} kr
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Startvärde</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    {initial.toLocaleString('sv-SE')} kr
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Månadssparande (totalt)</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    {Array.from({ length: years }, (_, y) => monthly * 12 * Math.pow(1 + monthlyIncreasePercent / 100, y)).reduce((a, b) => a + b, 0).toLocaleString('sv-SE')} kr
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Sparhorisont</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                    {years} år
                  </p>
                </div>
                {totalTax > 0 && (
                  <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Skatt</p>
                    <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                      {Math.round(totalTax).toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'tabell' && (
              <div className="overflow-x-auto">
                <YearTable data={data} years={years} showTax={taxMode !== 'ingen'} />
              </div>
            )}

            {viewMode === 'nyckeltal' && final.total > 0 && (
              <p className="mt-3 text-sm text-stone-600">
                <strong>{(100 * final.interest / final.total).toFixed(0)} %</strong> av totalen kommer från ränta-på-ränta – ju längre du sparar, desto större andel.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-stone-100 no-print">
              {affiliate.isk ? (
                <a href={affiliate.isk} target="_blank" rel="nofollow sponsored" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
                  Vill du börja spara? Jämför ISK-konton →
                </a>
              ) : (
                <a href="#faq-och-kallor" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
                  Vill du börja spara? Läs mer om sparande nedan →
                </a>
              )}
            </div>
          </section>
        )}

        <Chart data={data} chartType={chartType} monteCarlo={monteCarlo} />

        {final && (
          <div className="no-print">
            <TargetCalculator initial={initial} rate={rate} years={years} onApplyMonthly={setMonthly} />
          </div>
        )}

        <div className="no-print">
          <AdSlot placement="middle" />
        </div>

        {data.length > 0 && (
          <Accordion
            id="year-table-details"
            summary={<span className="print:hidden">Visa tabell år för år (utskrift)</span>}
            className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block print:mt-4"
          >
            <YearTable data={data} years={years} showTax={taxMode !== 'ingen'} />
          </Accordion>
        )}

        <p className="hidden print:block mt-8 pt-4 text-xs text-stone-500 border-t border-stone-200">
          Beräkning från Kalkylatorer – gratis ränta-på-ränta-kalkylator. Inga garantier för framtida avkastning.
        </p>

        <div className="no-print">
          <Disclaimer />
        </div>

        <div className="no-print">
          <AdSlot placement="bottom" />
        </div>

        <div className="no-print">
          <AffiliateSection />
        </div>

        <div className="no-print">
          <CalculatorInfoSection calculatorId="rantapa-ranta" />
        </div>

        <div className="mt-8 no-print">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="emerald" shortText />
    </div>
  )
}
