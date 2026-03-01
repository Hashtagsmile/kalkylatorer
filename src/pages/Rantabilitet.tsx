import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateRantabilitet } from '../lib/rantabilitetCalculations'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { ChartIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { ComparisonBarChart } from '../components/ComparisonBarChart'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { getFloat, buildQueryString, replaceUrl } from '../lib/urlParams'
import { ROUTES } from '../config/links'

const DEFAULT_LAN_RANTA = 3.5
const DEFAULT_SPARKONTO_RANTA = 3.0

const SCENARIOS = [
  { id: 'bolan-vs-sparkonto', title: 'Bolån vs sparkonto', lanRanta: 4.5, sparkontoRanta: 3.5, desc: 'Typisk bolåneränta mot sparkontoränta' },
  { id: 'amortera', title: 'Amortera', lanRanta: 5.5, sparkontoRanta: 3, desc: 'Hög låneränta – amortera först' },
  { id: 'spara', title: 'Spara', lanRanta: 3, sparkontoRanta: 4, desc: 'Låg bolåneränta, bra sparkonto' },
  { id: 'lika', title: 'Nästan lika', lanRanta: 4, sparkontoRanta: 3.5, desc: 'Små skillnader – buffert viktig' },
] as const

/** Svenska decimalformat (komma) för konsekvens med inputfält */
function formatProcent(value: number): string {
  return value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

function buildShareUrl(params: { lanRanta: number; sparkontoRanta: number }): string {
  const q = buildQueryString({ lan: params.lanRanta, spar: params.sparkontoRanta })
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return {
    lanRanta: getFloat(params, 'lan', { min: 0, max: 20 }),
    sparkontoRanta: getFloat(params, 'spar', { min: 0, max: 20 }),
  }
}

export function Rantabilitet() {
  const url = getParamsFromUrl()
  const [lanRanta, setLanRanta] = useState(url.lanRanta ?? DEFAULT_LAN_RANTA)
  const [sparkontoRanta, setSparkontoRanta] = useState(url.sparkontoRanta ?? DEFAULT_SPARKONTO_RANTA)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    replaceUrl(window.location.pathname, { lan: lanRanta, spar: sparkontoRanta })
  }, [lanRanta, sparkontoRanta])

  const result = calculateRantabilitet({ lanRanta, sparkontoRanta })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="rantabilitet" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Räntabilitet – sparkonto vs lån"
          subtitle="När lönar det sig att amortera? Jämför låneränta med sparkontoränta efter skatt."
          accentColor="purple"
          icon={<ChartIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Ränta på sparkonto beskattas som kapitalinkomst (~30 %). Bolåneränta ger ingen skattereduktion för privatpersoner.
              Om låneräntan är högre än sparkontoräntan efter skatt lönar det sig att amortera.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = Math.abs(lanRanta - s.lanRanta) < 0.05 && Math.abs(sparkontoRanta - s.sparkontoRanta) < 0.05
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setLanRanta(DEFAULT_LAN_RANTA)
                        setSparkontoRanta(DEFAULT_SPARKONTO_RANTA)
                      } else {
                        setLanRanta(s.lanRanta)
                        setSparkontoRanta(s.sparkontoRanta)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 ${
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
              <label htmlFor="lanRanta" className="block text-sm font-medium text-stone-700 mb-1">
                Låneränta (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din bolåneränta eller annan låneränta. Kolla din bank för aktuellt erbjudande.
              </p>
              <InputWithUnit
                id="lanRanta"
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={lanRanta}
                onChange={(e) => setLanRanta(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="purple"
              />
            </div>

            <div>
              <label htmlFor="sparkontoRanta" className="block text-sm font-medium text-stone-700 mb-1">
                Sparkontoränta (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Räntan på ditt sparkonto före skatt. Jämför med räntor på t.ex. SBAB, Avanza, Lunar.
              </p>
              <InputWithUnit
                id="sparkontoRanta"
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={sparkontoRanta}
                onChange={(e) => setSparkontoRanta(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="purple"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Räntabilitet – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Låneränta: {lanRanta} % · Sparkontoränta: {sparkontoRanta} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Visuell jämförelse */}
          <div className="mb-5 no-print">
            <ComparisonBarChart
              data={[
                { name: 'Låneränta', value: lanRanta, color: '#7c3aed' },
                { name: 'Sparkonto efter skatt', value: result.sparkontoEfterSkatt, color: '#10b981' },
              ]}
              title="Jämförelse: låneränta vs sparkonto"
              valueSuffix="%"
            />
          </div>

          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 mb-5">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Låneränta</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-800 tabular-nums">
                {formatProcent(lanRanta)} %
              </p>
              <p className="text-xs text-stone-500 mt-1">Din kostnad</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Sparkonto efter skatt</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-800 tabular-nums">
                {formatProcent(result.sparkontoEfterSkatt)} %
              </p>
              <p className="text-xs text-stone-500 mt-1">30 % skatt</p>
            </div>
          </div>

          {/* Rekommendation – kort och tydlig */}
          <div className={`p-4 rounded-lg mb-4 ${
            result.rekommendation === 'amortera' ? 'bg-purple-50 border border-purple-200' :
            result.rekommendation === 'spara' ? 'bg-emerald-50 border border-emerald-200' :
            'bg-stone-50 border border-stone-200'
          }`}>
            <p className="text-sm font-medium text-stone-700 mb-1">Rekommendation</p>
            <p className="text-lg font-bold text-stone-800">
              {result.rekommendation === 'amortera' && 'Amortera – låneräntan är högre'}
              {result.rekommendation === 'spara' && 'Spara – sparkontoräntan efter skatt är högre'}
              {result.rekommendation === 'lika' && 'Nästan lika – små skillnader spelar mindre roll'}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-500 mb-1">Break-even vid sparkontoränta</p>
            <p className="text-base font-semibold text-stone-700 tabular-nums">
              {formatProcent(result.breakEvenSparkontoRanta)} %
            </p>
            <p className="text-xs text-stone-500 mt-2">
              Vid denna ränta före skatt är det lika. Lägg till buffert och risk i ditt beslut.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.bolanekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Bolånekalkylator</Link>
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">Ränta på ränta</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="rantabilitet" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="purple" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ lanRanta, sparkontoRanta })}
        title="Dela räntabilitetsberäkningen"
      />
    </div>
  )
}
