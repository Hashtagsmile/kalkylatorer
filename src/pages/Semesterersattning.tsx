import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/links'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { SunIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'

/** Lagstadgat minimum: 12% av timlön */
const SEMESTER_PERCENT = 12
const TIMMAR_160 = 160
const TIMMAR_173 = 173

function buildShareUrl(timlon: number, timmar: number): string {
  return `${window.location.origin}${window.location.pathname}?timlon=${timlon}&timmar=${timmar}`
}

function getParamsFromUrl(): { timlon: number; timmar: number } {
  const q = new URLSearchParams(window.location.search)
  const t = q.get('timlon')
  const timlon = t != null && !isNaN(parseFloat(t)) ? Math.max(0, parseFloat(t)) : 200
  const tm = q.get('timmar')
  const timmar = tm != null && [160, 173].includes(parseInt(tm, 10)) ? parseInt(tm, 10) : TIMMAR_160
  return { timlon, timmar }
}

export function Semesterersattning() {
  const url = getParamsFromUrl()
  const [timlon, setTimlon] = useState(url.timlon)
  const [timmarPerManad, setTimmarPerManad] = useState(url.timmar)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(timlon, timmarPerManad))
  }, [timlon, timmarPerManad])

  const manadlig = timlon * timmarPerManad * (SEMESTER_PERCENT / 100)
  const arlig = manadlig * 12

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="semesterersattning" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Semesterersättning"
          subtitle="Räkna ut semesterersättning – lagstadgat minimum 12% av timlönen."
          accentColor="amber"
          icon={<SunIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Semesterlagen kräver minst 12% semesterersättning av timlönen. 160 tim = ca 40h/vecka × 4 veckor. 173 tim = samma som Timlön-kalkylatorn (52 veckor/12).
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div>
            <label htmlFor="timlon" className="block text-sm font-medium text-slate-700 mb-1">
              Timlön (kr)
            </label>
            <p className="text-xs text-stone-500 mb-2">
              Din timlön före skatt. Semesterersättningen beräknas som {SEMESTER_PERCENT}% av timlönen.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => setTimmarPerManad(TIMMAR_160)}
                className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${timmarPerManad === TIMMAR_160 ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}
              >
                160 tim/mån
              </button>
              <button
                type="button"
                onClick={() => setTimmarPerManad(TIMMAR_173)}
                className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${timmarPerManad === TIMMAR_173 ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}
              >
                173 tim/mån (som Timlön)
              </button>
            </div>
            <InputWithUnit
              id="timlon"
              type="number"
              min={0}
              value={timlon || ''}
              onChange={(e) => setTimlon(Math.max(0, parseFloat(e.target.value) || 0))}
              unit="kr"
              formatThousands
              maxWidth="md"
              focusRingColor="amber"
            />
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Semesterersättning – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Timlön: {timlon?.toLocaleString('sv-SE')} kr · {timmarPerManad} tim/mån
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Månadlig</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-800 tabular-nums">
                {Math.round(manadlig).toLocaleString('sv-SE')} kr
              </p>
              <p className="text-xs text-stone-500 mt-1">12% av {timmarPerManad} tim × timlön</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Årlig</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-800 tabular-nums">
                {Math.round(arlig).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
            <Link to={ROUTES.timlon} className="text-stone-600 hover:text-stone-900 hover:underline">Timlön och månadslön</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="semester" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="amber" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(timlon, timmarPerManad)}
        title="Dela semesterersättningsberäkningen"
      />
    </div>
  )
}
