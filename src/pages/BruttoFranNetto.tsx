import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bruttoFromNetto, calculateLon } from '../lib/lonCalculations'
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
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { MUNICIPALITIES_SORTED, GENOMSNITT_SKATT } from '../data/municipalities'
import { YEAR } from '../config/yearly'
import { ROUTES } from '../config/links'

const DEFAULT_NETTO = 30000

const NETTO_PRESETS = [25000, 30000, 35000, 40000, 45000] as const

function buildShareUrl(params: { netto: number; skatt: number; over66: boolean; kommun?: string | null }): string {
  const search = new URLSearchParams({
    netto: String(params.netto),
    skatt: String(params.skatt),
    age: params.over66 ? '66' : '65',
  })
  if (params.kommun) search.set('kommun', params.kommun)
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<{ netto: number; skatt: number; over66: boolean; kommun: string | null }> = {}
  const netto = params.get('netto')
  if (netto != null) {
    const v = parseInt(netto, 10)
    if (!isNaN(v) && v > 0) result.netto = Math.min(v, 1000000)
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
    netto: url.netto ?? DEFAULT_NETTO,
    skatt,
    over66: url.over66 ?? false,
    selectedKommun,
  }
}

export function BruttoFranNetto() {
  const init = getInitialState()
  const [nettoManad, setNettoManad] = useState(init.netto)
  const [kommunalSkatt, setKommunalSkatt] = useState(init.skatt)
  const [selectedKommun, setSelectedKommun] = useState<string | null>(init.selectedKommun)
  const [over66, setOver66] = useState(init.over66)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const handleKommunChange = (skatt: number, kommun: string | null) => {
    setKommunalSkatt(skatt)
    setSelectedKommun(kommun)
  }

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ netto: nettoManad, skatt: kommunalSkatt, over66, kommun: selectedKommun }))
  }, [nettoManad, kommunalSkatt, over66, selectedKommun])

  const nettoAr = nettoManad * 12
  const bruttoAr = bruttoFromNetto(nettoAr, kommunalSkatt, over66)
  const verify = calculateLon({ annualBrutto: bruttoAr, kommunalSkatt, over66 })
  const nettoDiff = Math.abs(verify.nettoAr - nettoAr)
  const showValidationNote = nettoDiff > 100

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="bruttoFranNetto" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Bruttolön från nettolön"
          subtitle="Omvänd lönekalkylator – räkna ut vilken bruttolön som ger din önskade nettolön."
          accentColor="teal"
          icon={<BriefcaseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Samma modell som lönekalkylatorn – kommunal och statlig skatt, grundavdrag, jobbskatteavdrag. Skattesatsen varierar mellan kommuner.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="netto" className="block text-sm font-medium text-stone-700 mb-1">
                Nettolön per månad (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Den lön du vill ha ut efter skatt – samma siffra som på din lönespec.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {NETTO_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNettoManad(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      nettoManad === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                  >
                    {(p / 1000).toFixed(0)} k kr/mån
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="netto"
                type="number"
                min={0}
                max={1000000}
                value={nettoManad || ''}
                onChange={(e) => setNettoManad(Math.min(1000000, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-1">
                Kommunalskatt (%)
                <InfoTooltip content="Skattesatsen varierar mellan kommuner (ca 28–35 %). Källa: SCB." />
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Välj din kommun – skattesatsen stämmer för den valda kommunen. Källa: SCB {YEAR}.
              </p>
              <KommunPicker
                value={kommunalSkatt}
                selectedKommun={selectedKommun}
                onChange={handleKommunChange}
              />
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
                  Högre brytpunkt för statlig skatt.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Bruttolön från nettolön – Resultat</h1>
            <p className="text-sm text-slate-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Bruttolön</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {bruttoAr.toLocaleString('sv-SE')} kr
              </p>
              <p className="text-xs text-stone-500 mt-1">per år</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Bruttolön/månad</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(bruttoAr / 12).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Total skatt/år</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(verify.totalSkatt).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            För att få {nettoManad.toLocaleString('sv-SE')} kr netto per månad behöver du begära cirka {Math.round(bruttoAr / 12).toLocaleString('sv-SE')} kr brutto i månaden.
          </p>
          {showValidationNote && (
            <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3" role="status">
              OBS: Denna bruttolön ger cirka {Math.round(verify.nettoManad).toLocaleString('sv-SE')} kr netto/månad (skillnad {Math.round(nettoDiff).toLocaleString('sv-SE')} kr/år). Skattemodellen är förenklad – för exakt resultat, använd Skatteverkets e-tjänst.
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator (brutto → netto)</Link>
            <Link to={ROUTES.egenkostnad} className="text-stone-600 hover:text-stone-900 hover:underline">Egenkostnadskalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="salary" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="bruttoFranNetto" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ netto: nettoManad, skatt: kommunalSkatt, over66, kommun: selectedKommun })}
        title="Dela bruttolöneberäkningen"
      />
    </div>
  )
}
