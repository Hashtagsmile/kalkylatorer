import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { BriefcaseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { YearValueTable } from '../components/YearValueTable'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { getNum, getFloat, buildQueryString, replaceUrl } from '../lib/urlParams'

/** Riksbankens inflationsmål – för köpkraftsberäkning */
const INFLATION_FOR_KOPPKRAFT = 2

const DEFAULT_LON = 40000
const DEFAULT_OKNING = 2.5
const DEFAULT_AR = 5

const LONE_SCENARIOS = [
  { id: 'ingang', title: 'Ingångslön', lon: 35000, okning: 3, ar: 5, desc: 'Typisk utveckling första 5 åren' },
  { id: 'kollektiv', title: 'Kollektivavtal', lon: 40000, okning: 2.5, ar: 5, desc: '2,5 % – vanligt i många avtal' },
  { id: 'karriar', title: 'Karriär', lon: 45000, okning: 4, ar: 10, desc: 'Stadig utveckling över 10 år' },
  { id: 'it', title: 'IT-branschen', lon: 50000, okning: 5, ar: 5, desc: 'Högre ökningstakt' },
] as const

function buildShareUrl(lon: number, okning: number, ar: number): string {
  const q = buildQueryString({ lon, okning, ar })
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function getParamsFromUrl(): Partial<{ lon: number; okning: number; ar: number }> {
  const params = new URLSearchParams(window.location.search)
  const lon = getNum(params, 'lon', { min: 0 })
  const okning = getFloat(params, 'okning', { min: 0, max: 20 })
  const ar = getNum(params, 'ar', { min: 1, max: 40 })
  return { lon, okning, ar }
}

export function Loneutveckling() {
  const url = getParamsFromUrl()
  const [lon, setLon] = useState(url.lon ?? 40000)
  const [okning, setOkning] = useState(url.okning ?? 2.5)
  const [ar, setAr] = useState(url.ar ?? 5)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    replaceUrl(window.location.pathname, { lon, okning, ar })
  }, [lon, okning, ar])

  const slutlon = lon * Math.pow(1 + okning / 100, ar)
  const kopkraft = slutlon / Math.pow(1 + INFLATION_FOR_KOPPKRAFT / 100, ar)
  const lonPath = Array.from({ length: ar + 1 }, (_, t) => ({
    year: t,
    value: Math.round(lon * Math.pow(1 + okning / 100, t)),
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="loneutveckling" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Löneutveckling"
          subtitle="Vad blir din lön om X år vid Y % årlig ökning? Enkel prognos för löneutveckling."
          accentColor="teal"
          icon={<BriefcaseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <div className="mt-2 space-y-2 text-sm text-slate-600">
              <p>
                Beräkningen ger <strong>nominell</strong> lön – vad du får ut i framtida kronor. "Köpkraft" visar motsvarande värde i dagens penningvärde (vid 2 % inflation).
              </p>
              <p>
                En konstant procentuell ökning varje år sällan stämmer över längre perioder – recessionsår, karriärplatåer och branschskillnader gör att löneutvecklingen varierar.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {LONE_SCENARIOS.map((s) => {
                const isActive = lon === s.lon && Math.abs(okning - s.okning) < 0.05 && ar === s.ar
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setLon(DEFAULT_LON)
                        setOkning(DEFAULT_OKNING)
                        setAr(DEFAULT_AR)
                      } else {
                        setLon(s.lon)
                        setOkning(s.okning)
                        setAr(s.ar)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="lon" className="block text-sm font-medium text-stone-700 mb-1">
                Nuvarande månadslön brutto (kr)
              </label>
              <InputWithUnit
                id="lon"
                type="number"
                min={0}
                value={lon || ''}
                onChange={(e) => setLon(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>
            <div>
              <label htmlFor="okning" className="block text-sm font-medium text-stone-700 mb-1">
                Förväntad årlig löneökning (%)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Typiskt 2–4 % per år. Kollektivavtal ligger ofta runt 2–3 %.
              </p>
              <InputWithUnit
                id="okning"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={okning}
                onChange={(e) => setOkning(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="teal"
              />
            </div>
            <div>
              <label htmlFor="ar" className="block text-sm font-medium text-stone-700 mb-1">
                Antal år
              </label>
              <InputWithUnit
                id="ar"
                type="number"
                min={1}
                max={40}
                value={ar}
                onChange={(e) => setAr(Math.min(40, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="teal"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Löneutveckling – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Lön: {lon.toLocaleString('sv-SE')} kr · Ökning: {okning} % · År: {ar}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {ar >= 20 && (
            <motion.div
              initial={{ opacity: 0, ...(reducedMotion ? {} : { y: -4 }) }}
              animate={{ opacity: 1, ...(reducedMotion ? {} : { y: 0 }) }}
              transition={{ duration: 0.25 }}
              className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900"
            >
              <p className="text-sm font-medium">Lång horisont ({ar} år)</p>
              <p className="text-sm mt-1">
                En konstant {okning} % ökning varje år i {ar} år är optimistiskt. Löneutvecklingen varierar – recessionsår, karriärbyten och platåer gör att få får samma procent varje år så länge. Resultatet är en teoretisk prognos.
              </p>
            </motion.div>
          )}

          {/* Hero metric */}
          <motion.div
            initial={{ opacity: 0, ...(reducedMotion ? {} : { y: 8 }) }}
            animate={{ opacity: 1, ...(reducedMotion ? {} : { y: 0 }) }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Månadslön om {ar} år (nominell)</p>
            <p className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              {Math.round(slutlon).toLocaleString('sv-SE')} kr/månad
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Vid {okning} % årlig ökning · Årslön: {Math.round(slutlon * 12).toLocaleString('sv-SE')} kr
            </p>
            <p className="mt-3 pt-3 border-t border-stone-200 text-sm text-stone-600">
              Motsvarar ca <strong className="text-stone-800">{Math.round(kopkraft).toLocaleString('sv-SE')} kr/månad</strong> i dagens köpkraft (vid {INFLATION_FOR_KOPPKRAFT} % inflation).
            </p>
          </motion.div>

          <div className="mt-6 no-print">
            <TimeSeriesChart
              data={lonPath}
              title="Löneutveckling över tid"
              valueLabel="Månadslön"
              accentColor="teal"
            />
          </div>

          <Accordion
            id="year-table-details"
            summary="Visa tabell år för år"
            className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
          >
            <YearValueTable
              rows={lonPath}
              valueHeader="Månadslön"
              valueFormatter={(v) => `${v.toLocaleString('sv-SE')} kr`}
            />
          </Accordion>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to="/lonekalkylator" className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
            <Link to="/inflationskalkylator" className="text-stone-600 hover:text-stone-900 hover:underline">Inflationskalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="loneutveckling" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(lon, okning, ar)}
        title="Dela löneutvecklingsberäkningen"
      />
    </div>
  )
}
