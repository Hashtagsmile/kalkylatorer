import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateCagr } from '../lib/cagrCalculations'
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
import { FormulaBlock } from '../components/FormulaBlock'
import { Footer } from '../components/Footer'
import { getNum, getFloat, buildQueryString, replaceUrl } from '../lib/urlParams'
import { ROUTES } from '../config/links'

const DEFAULT_START = 100000
const DEFAULT_END = 150000
const DEFAULT_YEARS = 5

const SCENARIOS = [
  { id: 'fond-5', title: 'Fond 5 år', start: 100000, end: 150000, years: 5, desc: '100k → 150k på 5 år' },
  { id: 'fond-10', title: 'Fond 10 år', start: 50000, end: 100000, years: 10, desc: '50k → 100k på 10 år' },
  { id: 'dubbel', title: 'Dubblering', start: 100000, end: 200000, years: 10, desc: 'Vid vilken årsavkastning dubblas pengarna?' },
] as const

function buildShareUrl(params: { start: number; end: number; years: number }): string {
  const q = buildQueryString(params)
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return {
    start: getFloat(params, 'start', { min: 0.001 }),
    end: getFloat(params, 'end', { min: 0 }),
    years: getNum(params, 'years', { min: 1, max: 100 }),
  }
}

function formatProcent(value: number): string {
  return value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

export function Cagr() {
  const url = getParamsFromUrl()
  const [startValue, setStartValue] = useState(url.start ?? DEFAULT_START)
  const [endValue, setEndValue] = useState(url.end ?? DEFAULT_END)
  const [years, setYears] = useState(url.years ?? DEFAULT_YEARS)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    replaceUrl(window.location.pathname, { start: startValue, end: endValue, years })
  }, [startValue, endValue, years])

  const result = calculateCagr({
    startValue,
    endValue,
    years,
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="cagr" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="CAGR – genomsnittlig årlig avkastning"
          subtitle="Vad var den genomsnittliga avkastningen per år? Beräkna från start- och slutvärde."
          accentColor="teal"
          icon={<ChartIcon />}
        >
          <Accordion summary="Läs mer om CAGR" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-stone-600">
              <p>
                <strong>CAGR</strong> (Compound Annual Growth Rate) visar vilken konstant årlig tillväxt som ger samma slutresultat. Om en fond gick från 100 000 kr till 150 000 kr på 5 år – vad motsvarar det i genomsnitt per år?
              </p>
              <p>
                CAGR tar hänsyn till ränta-på-ränta-effekten. Den förutsätter jämn tillväxt och ignorerar volatilitet – det är ett genomsnittsmått, inte verklig avkastning år för år.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive =
                  startValue === s.start &&
                  endValue === s.end &&
                  years === s.years
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setStartValue(DEFAULT_START)
                        setEndValue(DEFAULT_END)
                        setYears(DEFAULT_YEARS)
                      } else {
                        setStartValue(s.start)
                        setEndValue(s.end)
                        setYears(s.years)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-1 ${
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
              <label htmlFor="start" className="block text-sm font-medium text-stone-700 mb-1">
                Startvärde (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">Investeringsvärdet i början av perioden.</p>
              <InputWithUnit
                id="start"
                type="number"
                min={1}
                max={1000000000}
                step={1000}
                value={startValue || ''}
                onChange={(e) =>
                  setStartValue(
                    Math.min(1000000000, Math.max(1, parseFloat(e.target.value) || 0))
                  )
                }
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-stone-700 mb-1">
                Slutvärde (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">Värdet i slutet av perioden. 0 om du förlorade allt.</p>
              <InputWithUnit
                id="end"
                type="number"
                min={0}
                max={1000000000}
                step={1000}
                value={endValue || ''}
                onChange={(e) =>
                  setEndValue(
                    Math.min(1000000000, Math.max(0, parseFloat(e.target.value) || 0))
                  )
                }
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-stone-700 mb-1">
                Antal år
              </label>
              <InputWithUnit
                id="years"
                type="number"
                min={1}
                max={100}
                value={years}
                onChange={(e) => setYears(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="teal"
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
            <h1 className="text-xl font-bold text-stone-900">CAGR – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {result ? (
            <>
              <div className="mb-5 p-4 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50 border border-stone-200">
                <p className="text-xs font-medium uppercase tracking-wider text-teal-700 mb-1">
                  Genomsnittlig årlig avkastning (CAGR)
                </p>
                <p className="text-3xl font-bold text-teal-800 tabular-nums">
                  {formatProcent(result.cagrPercent)} %
                </p>
              </div>

              <p className="text-sm text-stone-600">
                Total avkastning över {years} {years === 1 ? 'år' : 'år'}:{' '}
                <strong className="text-stone-800">{formatProcent(result.totalReturnPercent)} %</strong>
              </p>

              <FormulaBlock
                legend={[{ symbol: 'n', meaning: 'antal år' }]}
                note="CAGR tar hänsyn till ränta-på-ränta."
                className="mt-4"
              >
                CAGR = (slutvärde ÷ startvärde)<sup>1⁄n</sup> − 1
              </FormulaBlock>
            </>
          ) : (
            <p className="text-stone-600">Ange giltiga siffror – startvärde och antal år måste vara större än noll.</p>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">
              Ränta på ränta
            </Link>
            <Link to={ROUTES.inflationskalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">
              Inflationskalkylator
            </Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="cagr" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">
            ← Fler kalkylatorer
          </Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ start: startValue, end: endValue, years })}
        title="Dela CAGR-beräkningen"
      />
    </div>
  )
}
