import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { BriefcaseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'

const DEFAULT_TIMMAR = 173

type Mode = 'tim-till-manad' | 'manad-till-tim'

function buildShareUrl(mode: Mode, timlon: number, manadslon: number, timmar: number): string {
  return `${window.location.origin}${window.location.pathname}?mode=${mode}&tim=${timlon}&man=${manadslon}&timmar=${timmar}`
}

function getParamsFromUrl(): Partial<{ mode: Mode; timlon: number; manadslon: number; timmarPerManad: number }> {
  const q = new URLSearchParams(window.location.search)
  const result: Partial<{ mode: Mode; timlon: number; manadslon: number; timmarPerManad: number }> = {}
  const m = q.get('mode')
  if (m === 'tim-till-manad' || m === 'manad-till-tim') result.mode = m
  const t = q.get('tim')
  if (t != null) result.timlon = Math.max(0, parseFloat(t) || 250)
  const ma = q.get('man')
  if (ma != null) result.manadslon = Math.max(0, parseInt(ma, 10) || 43250)
  const tm = q.get('timmar')
  if (tm != null) result.timmarPerManad = Math.min(250, Math.max(80, parseInt(tm, 10) || DEFAULT_TIMMAR))
  return result
}

export function Timlon() {
  const url = getParamsFromUrl()
  const [mode, setMode] = useState<Mode>(url.mode ?? 'tim-till-manad')
  const [timlon, setTimlon] = useState(url.timlon ?? 250)
  const [manadslon, setManadslon] = useState(url.manadslon ?? 43250)
  const [timmarPerManad, setTimmarPerManad] = useState(url.timmarPerManad ?? DEFAULT_TIMMAR)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(mode, timlon, manadslon, timmarPerManad))
  }, [mode, timlon, manadslon, timmarPerManad])

  const result =
    mode === 'tim-till-manad'
      ? timlon * timmarPerManad
      : manadslon / timmarPerManad

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="timlon" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Timlön och månadslön"
          subtitle="Räkna ut timlön från månadslön eller tvärtom. Justera timmar/månad efter ditt avtal."
          accentColor="teal"
          icon={<BriefcaseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              173 timmar/månad = 40 timmar/vecka × 52 veckor ÷ 12 månader. Anpassa om du jobbar annat antal timmar.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Riktning</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode('tim-till-manad')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'tim-till-manad' ? 'bg-teal-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Timlön → Månadslön
                </button>
                <button
                  type="button"
                  onClick={() => setMode('manad-till-tim')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'manad-till-tim' ? 'bg-teal-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Månadslön → Timlön
                </button>
              </div>
            </div>

            {mode === 'tim-till-manad' ? (
              <>
                <div>
                  <label htmlFor="timlon" className="block text-sm font-medium text-slate-700 mb-1">
                    Timlön (kr)
                  </label>
                  <InputWithUnit
                  id="timlon"
                  type="number"
                  min={0}
                  value={timlon || ''}
                  onChange={(e) => setTimlon(Math.max(0, parseFloat(e.target.value) || 0))}
                  unit="kr"
                  formatThousands
                  maxWidth="md"
                  focusRingColor="teal"
                />
                </div>
                <div>
                  <label htmlFor="timmar" className="block text-sm font-medium text-slate-700 mb-1">
                    Timmar per månad
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    173 = 40h/vecka × 52 veckor ÷ 12. 160 = 40h × 4 veckor (som Semesterersättning).
                  </p>
                  <InputWithUnit
                    id="timmar"
                    type="number"
                    min={80}
                    max={250}
                    value={timmarPerManad}
                    onChange={(e) => setTimmarPerManad(Math.min(250, Math.max(80, parseInt(e.target.value, 10) || DEFAULT_TIMMAR)))}
                    unit="tim"
                    maxWidth="sm"
                    focusRingColor="teal"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="manadslon" className="block text-sm font-medium text-slate-700 mb-1">
                    Månadslön brutto (kr)
                  </label>
                  <InputWithUnit
                  id="manadslon"
                  type="number"
                  min={0}
                  value={manadslon || ''}
                  onChange={(e) => setManadslon(Math.max(0, parseFloat(e.target.value) || 0))}
                  unit="kr"
                  formatThousands
                  maxWidth="md"
                  focusRingColor="teal"
                />
                </div>
                <div>
                  <label htmlFor="timmar" className="block text-sm font-medium text-slate-700 mb-1">
                    Timmar per månad
                  </label>
                  <InputWithUnit
                    id="timmar"
                    type="number"
                    min={80}
                    max={250}
                    value={timmarPerManad}
                    onChange={(e) => setTimmarPerManad(Math.min(250, Math.max(80, parseInt(e.target.value, 10) || DEFAULT_TIMMAR)))}
                    unit="tim"
                    maxWidth="sm"
                    focusRingColor="teal"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Timlön och månadslön – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metric */}
          <div className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              {mode === 'tim-till-manad' ? 'Månadslön' : 'Timlön'}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              {Math.round(result).toLocaleString('sv-SE')} kr{mode === 'tim-till-manad' ? '/månad' : '/tim'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {mode === 'tim-till-manad'
                ? `${timlon.toLocaleString('sv-SE')} kr/tim × ${timmarPerManad} tim`
                : `${manadslon.toLocaleString('sv-SE')} kr/mån ÷ ${timmarPerManad} tim`}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to="/lonekalkylator" className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
            <Link to="/semesterersattning" className="text-stone-600 hover:text-stone-900 hover:underline">Semesterersättning</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="timlon" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(mode, timlon, manadslon, timmarPerManad)}
        title="Dela timlönsberäkningen"
      />
    </div>
  )
}
