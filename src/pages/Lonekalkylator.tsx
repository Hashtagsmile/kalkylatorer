import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateLon } from '../lib/lonCalculations'
import { ShareModal } from '../components/ShareModal'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { InfoTooltip } from '../components/InfoTooltip'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { KommunPicker } from '../components/KommunPicker'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { BriefcaseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { StackedBarChart } from '../components/StackedBarChart'
import { Footer } from '../components/Footer'
import { MUNICIPALITIES_SORTED, GENOMSNITT_SKATT } from '../data/municipalities'
import { YEAR } from '../config/yearly'
import { ROUTES } from '../config/links'
import { PageMeta } from '../components/PageMeta'

const DEFAULT_SALARY = 450000

const SALARY_PRESETS = [360000, 420000, 480000, 540000, 600000] as const

const SCENARIOS = [
  { id: 'lag', title: 'Låg inkomst', salary: 360000, kommun: 'Genomsnitt', desc: 'Typisk ingångslön' },
  { id: 'medel', title: 'Medel', salary: 450000, kommun: 'Genomsnitt', desc: 'Svenskt genomsnitt' },
  { id: 'hog', title: 'Hög inkomst', salary: 600000, kommun: 'Genomsnitt', desc: 'Över genomsnittet' },
  { id: 'stockholm', title: 'Stockholm', salary: 480000, kommun: 'Stockholm', desc: 'Typisk Stockholm-lön' },
  { id: 'malmo', title: 'Malmö', salary: 420000, kommun: 'Malmö', desc: 'Typisk Malmö-lön' },
] as const

function buildShareUrl(params: { salary: number; skatt: number; over66: boolean; kommun?: string | null }): string {
  const search = new URLSearchParams({
    sal: String(params.salary),
    skatt: String(params.skatt),
    age: params.over66 ? '66' : '65',
  })
  if (params.kommun) search.set('kommun', params.kommun)
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<{ salary: number; skatt: number; over66: boolean; kommun: string | null }> = {}
  const sal = params.get('sal')
  if (sal != null) {
    const v = parseInt(sal, 10)
    if (!isNaN(v) && v > 0) result.salary = Math.min(v, 10000000)
  }
  const skatt = params.get('skatt')
  if (skatt != null) {
    const v = parseFloat(skatt)
    if (!isNaN(v) && v >= 28 && v <= 36) result.skatt = v
  }
  const age = params.get('age')
  if (age === '66') result.over66 = true
  const kommun = params.get('kommun')
  if (kommun != null) {
    const exists = MUNICIPALITIES_SORTED.some((m) => m.name === kommun)
    if (exists) result.kommun = kommun
  }
  return result
}

function getInitialState() {
  const url = getParamsFromUrl()
  const skatt = url.skatt ?? GENOMSNITT_SKATT
  const selectedKommun =
    url.kommun ??
    (skatt === GENOMSNITT_SKATT ? 'Genomsnitt' : MUNICIPALITIES_SORTED.find((m) => Math.abs(m.skatt - skatt) < 0.01)?.name ?? null)
  return {
    salary: url.salary ?? DEFAULT_SALARY,
    skatt,
    over66: url.over66 ?? false,
    selectedKommun,
  }
}

export function Lonekalkylator() {
  const init = getInitialState()
  const [salary, setSalary] = useState(init.salary)
  const [kommunalSkatt, setKommunalSkatt] = useState(init.skatt)
  const [selectedKommun, setSelectedKommun] = useState<string | null>(init.selectedKommun)
  const [over66, setOver66] = useState(init.over66)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const handleKommunChange = (skatt: number, kommun: string | null) => {
    setKommunalSkatt(skatt)
    setSelectedKommun(kommun)
  }

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ salary, skatt: kommunalSkatt, over66, kommun: selectedKommun }))
  }, [salary, kommunalSkatt, over66, selectedKommun])

  const result = calculateLon({
    annualBrutto: salary,
    kommunalSkatt,
    over66,
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="lonekalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Lönekalkylator"
          subtitle="Förenklad beräkning av skatt – brutto till netto. För exakt resultat, använd Skatteverkets e-tjänst."
          accentColor="teal"
          icon={<BriefcaseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Inkluderar kommunal och statlig skatt, grundavdrag och jobbskatteavdrag. Skattesatsen varierar mellan kommuner (28–35 %).
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <Accordion summary="Välj ett scenario (snabbval)" className="mb-5">
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SCENARIOS.map((s) => {
                const m = MUNICIPALITIES_SORTED.find((x) => x.name === s.kommun)
                const isActive = salary === s.salary && selectedKommun === s.kommun
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setSalary(DEFAULT_SALARY)
                        handleKommunChange(GENOMSNITT_SKATT, 'Genomsnitt')
                      } else {
                        setSalary(s.salary)
                        handleKommunChange(m?.skatt ?? GENOMSNITT_SKATT, s.kommun)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    aria-label={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
          </Accordion>

          <div className="space-y-5">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-stone-700 mb-1">
                Årslön brutto (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din årslön före skatt – samma siffra som på lönespecen eller anställningsavtalet.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SALARY_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSalary(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      salary === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                  >
                    {(p / 1000).toFixed(0)} k kr/år
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="salary"
                type="number"
                min={0}
                max={10000000}
                value={salary || ''}
                onChange={(e) => setSalary(Math.min(10000000, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-1">
                Kommunalskatt (%)
                <InfoTooltip content="Skattesatsen varierar mellan kommuner (ca 28–35 %). Påverkar både kommunal skatt och grundavdrag. Källa: SCB." />
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Välj din kommun – skattesatsen stämmer för den valda kommunen. Källa: SCB {YEAR}.
              </p>
              <Accordion
                variant="select"
                summary={
                  <span className="inline-flex items-center justify-between w-full">
                    <span>
                      {selectedKommun ?? 'Anpassad'} – {kommunalSkatt} %
                    </span>
                    <span className="text-stone-400 text-xs">Ändra</span>
                  </span>
                }
                className="rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-2"
              >
                <div className="pt-2 pb-1">
                  <KommunPicker
                    value={kommunalSkatt}
                    selectedKommun={selectedKommun}
                    onChange={handleKommunChange}
                  />
                </div>
              </Accordion>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="over66"
                type="checkbox"
                checked={over66}
                onChange={(e) => setOver66(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded-lg border-stone-300 text-teal-600 focus:ring-teal-500 shrink-0"
              />
              <div>
                <label htmlFor="over66" className="text-sm font-medium text-stone-700">
                  Jag fyller 66 eller äldre
                </label>
                <p className="text-xs text-stone-500 mt-1">
                  Högre brytpunkt för statlig skatt – du betalar statlig skatt på mindre av inkomsten.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Lönekalkylator – Resultat</h1>
            <p className="text-sm text-slate-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Brutto: {salary.toLocaleString('sv-SE')} kr · Kommunalskatt: {kommunalSkatt} %{over66 ? ' · 66+' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50 border-l-4 border-l-[#1a4d2e]">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Nettolön</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {Math.round(result.nettoManad).toLocaleString('sv-SE')} kr
              </p>
              <p className="text-xs text-stone-500 mt-1">per månad</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Nettolön/år</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(result.nettoAr).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Total skatt/år</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(result.totalSkatt).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>

          <div className="mt-6 no-print">
            <StackedBarChart
              segments={[
                { name: 'Netto', value: result.nettoAr, color: '#10b981' },
                { name: 'Skatt', value: result.totalSkatt, color: '#64748b' },
              ]}
              title="Brutto → Skatt → Netto (år)"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
              embedded
            />
          </div>

          <Accordion summary="Visa skatteuppdelning" className="mt-6 pt-4 border-t border-stone-100">
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { label: 'Kommunal skatt', value: result.kommunalSkatt, color: '#64748b' },
                { label: 'Statlig skatt', value: result.statligSkatt, color: '#475569' },
                { label: 'Jobbskatteavdrag', value: -result.jobbskatteavdrag, color: '#10b981', prefix: '−' },
              ].map(({ label, value, color, prefix }) => (
                <li key={label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
                    {label}
                  </span>
                  <span className="tabular-nums font-medium text-stone-800">
                    {prefix ?? ''}{Math.round(Math.abs(value)).toLocaleString('sv-SE')} kr
                  </span>
                </li>
              ))}
            </ul>
          </Accordion>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.pensionskalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Pensionskalkylator</Link>
            <Link to={ROUTES.csnKalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">CSN-kalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="salary" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="lon" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ salary, skatt: kommunalSkatt, over66, kommun: selectedKommun })}
        title="Dela löneberäkningen"
      />
    </div>
  )
}
