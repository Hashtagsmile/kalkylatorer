import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { CalculatorIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { SKATTEATERBARING, YEAR } from '../config/yearly'

/** RUT: 30 % skattereduktion. Max 50 000 kr per person. */
const RUT_AVDRAG_PERCENT = 30
const RUT_MAX_PER_PERSON = 50_000

/** ROT: 30 % (2026) eller 50 % (12 maj–31 dec 2025). Max 50 000 kr per person. ROT+RUT tillsammans max 75 000 kr. Uppdatera i config/yearly.ts vid årsskifte. */
const ROT_AVDRAG_PERCENT = YEAR <= 2025 ? 50 : 30
const ROT_MAX_PER_PERSON = 50_000
const ROT_RUT_KOMBINERAT_MAX = 75_000

type Mode = 'datum' | 'rut' | 'rot' | 'bada'

function buildShareUrl(mode: Mode, rutKostnad: number, rutPersoner: number, rotKostnad: number, rotPersoner: number): string {
  const q = new URLSearchParams({ mode: mode === 'bada' ? 'bada' : mode, rutK: String(rutKostnad), rutP: String(rutPersoner), rotK: String(rotKostnad), rotP: String(rotPersoner) })
  return `${window.location.origin}${window.location.pathname}?${q}`
}

function getParamsFromUrl(): Partial<{ mode: Mode; rutKostnad: number; rutPersoner: number; rotKostnad: number; rotPersoner: number }> {
  const q = new URLSearchParams(window.location.search)
  const result: Partial<{ mode: Mode; rutKostnad: number; rutPersoner: number; rotKostnad: number; rotPersoner: number }> = {}
  const m = q.get('mode')
  if (m === 'datum' || m === 'rut' || m === 'rot' || m === 'bada') result.mode = m
  const rk = q.get('rutK')
  if (rk != null) result.rutKostnad = Math.max(0, parseInt(rk, 10) || 10000)
  const rp = q.get('rutP')
  if (rp != null) result.rutPersoner = Math.min(4, Math.max(1, parseInt(rp, 10) || 1))
  const ok = q.get('rotK')
  if (ok != null) result.rotKostnad = Math.max(0, parseInt(ok, 10) || 50000)
  const op = q.get('rotP')
  if (op != null) result.rotPersoner = Math.min(2, Math.max(1, parseInt(op, 10) || 1))
  return result
}

export function Skatteaterbaring() {
  const url = getParamsFromUrl()
  const [mode, setMode] = useState<Mode>(url.mode ?? 'datum')
  const [rutKostnad, setRutKostnad] = useState(url.rutKostnad ?? 10000)
  const [rutPersoner, setRutPersoner] = useState(url.rutPersoner ?? 1)
  const [rotKostnad, setRotKostnad] = useState(url.rotKostnad ?? 50000)
  const [rotPersoner, setRotPersoner] = useState(url.rotPersoner ?? 1)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(mode, rutKostnad, rutPersoner, rotKostnad, rotPersoner))
  }, [mode, rutKostnad, rutPersoner, rotKostnad, rotPersoner])

  const rutAvdrag = Math.min(
    rutKostnad * (RUT_AVDRAG_PERCENT / 100),
    rutPersoner * RUT_MAX_PER_PERSON
  )
  const rotAvdragRaw = Math.min(
    rotKostnad * (ROT_AVDRAG_PERCENT / 100),
    rotPersoner * ROT_MAX_PER_PERSON
  )
  const rotAvdrag =
    rutAvdrag > 0
      ? Math.min(rotAvdragRaw, Math.max(0, ROT_RUT_KOMBINERAT_MAX - rutAvdrag))
      : rotAvdragRaw

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="skatteaterbaring" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Skatteåterbäring"
          subtitle="När betalas skatteåterbäringen ut? Räkna RUT- och ROT-avdrag – skattereduktion på städning, renovering m.m."
          accentColor="blue"
          icon={<CalculatorIcon />}
        >
          <Accordion summary="Läs mer om skatteåterbäring" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Skatteåterbäringen för {YEAR} betalas ut i april och juni. RUT-avdraget ger 30 % skattereduktion på arbetskostnad (max 50 000 kr per person).
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vad vill du räkna på?</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode('datum')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'datum' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Utbetalningsdatum
                </button>
                <button
                  type="button"
                  onClick={() => setMode('rut')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'rut' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  RUT-avdrag
                </button>
                <button
                  type="button"
                  onClick={() => setMode('rot')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'rot' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ROT-avdrag
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bada')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    mode === 'bada' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ROT + RUT
                </button>
              </div>
            </div>

            {(mode === 'rut' || mode === 'bada') && (
              <>
                <div>
                  <label htmlFor="rutKostnad" className="block text-sm font-medium text-slate-700 mb-1">
                    Arbetskostnad RUT (kr)
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    Kostnad för städning, trädgård, snöskottning m.m. som kvalificerar för RUT.
                  </p>
                  <InputWithUnit
                    id="rutKostnad"
                    type="number"
                    min={0}
                    value={rutKostnad || ''}
                    onChange={(e) => setRutKostnad(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    unit="kr"
                    formatThousands
                    maxWidth="md"
                    focusRingColor="blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Antal personer i hushållet</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRutPersoner(n)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          rutPersoner === n ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-2">Max 50 000 kr skattereduktion per person.</p>
                </div>
              </>
            )}

            {(mode === 'rot' || mode === 'bada') && (
              <>
                <div>
                  <label htmlFor="rotKostnad" className="block text-sm font-medium text-slate-700 mb-1">
                    Arbetskostnad ROT (kr)
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    Kostnad för renovering, tillbyggnad m.m. från certifierad hantverkare. Endast arbetskostnad, inte material.
                  </p>
                  <InputWithUnit
                    id="rotKostnad"
                    type="number"
                    min={0}
                    value={rotKostnad || ''}
                    onChange={(e) => setRotKostnad(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    unit="kr"
                    formatThousands
                    maxWidth="md"
                    focusRingColor="blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Antal ägare</label>
                  <div className="flex gap-2">
                    {[1, 2].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRotPersoner(n)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          rotPersoner === n ? 'bg-blue-600 text-white' : 'bg-stone-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-2">{ROT_AVDRAG_PERCENT} % avdrag {YEAR}. Max 50 000 kr per ägare. ROT+RUT tillsammans max 75 000 kr.</p>
                </div>
              </>
            )}
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Skatteåterbäring – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {mode === 'datum' ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-stone-600 mb-1">Skatteåterbäring {YEAR} – utbetalningsdatum</p>
                <ul className="mt-2 space-y-1 text-slate-700">
                  <li><strong>{SKATTEATERBARING.forstaUtbetalning}</strong> – Första utbetalningen (om du deklarerat i tid)</li>
                  <li><strong>{SKATTEATERBARING.andraUtbetalning}</strong> – Andra utbetalningen</li>
                </ul>
              </div>
              <p className="text-sm text-stone-600">
                För att få pengarna i april: deklarera digitalt utan ändringar och anmäl bankkonto i god tid. Deklarationen ska lämnas innan 3 maj.
              </p>
            </div>
          ) : mode === 'rut' ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-stone-600 mb-1">RUT-avdrag (30 % skattereduktion)</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums">
                  {Math.round(rutAvdrag).toLocaleString('sv-SE')} kr
                </p>
              </div>
              <p className="text-sm text-stone-600">
                Du får {RUT_AVDRAG_PERCENT} % av arbetskostnaden som skattereduktion. Max {RUT_MAX_PER_PERSON.toLocaleString('sv-SE')} kr per person i hushållet.
              </p>
            </div>
          ) : mode === 'bada' ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-stone-600 mb-1">Totalt ROT + RUT</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums">
                  {Math.round(rutAvdrag + rotAvdrag).toLocaleString('sv-SE')} kr
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <p className="text-xs text-stone-500">RUT</p>
                  <p className="font-semibold tabular-nums">{Math.round(rutAvdrag).toLocaleString('sv-SE')} kr</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <p className="text-xs text-stone-500">ROT</p>
                  <p className="font-semibold tabular-nums">{Math.round(rotAvdrag).toLocaleString('sv-SE')} kr</p>
                </div>
              </div>
              <p className="text-sm text-stone-600">
                ROT+RUT tillsammans max {ROT_RUT_KOMBINERAT_MAX.toLocaleString('sv-SE')} kr. Du kan använda båda under samma år.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-stone-600 mb-1">ROT-avdrag ({ROT_AVDRAG_PERCENT} % skattereduktion {YEAR})</p>
                <p className="text-2xl font-bold text-blue-700 tabular-nums">
                  {Math.round(rotAvdrag).toLocaleString('sv-SE')} kr
                </p>
              </div>
              <p className="text-sm text-stone-600">
                Du får {ROT_AVDRAG_PERCENT} % av arbetskostnaden som skattereduktion. Max {ROT_MAX_PER_PERSON.toLocaleString('sv-SE')} kr per ägare. ROT+RUT tillsammans max {ROT_RUT_KOMBINERAT_MAX.toLocaleString('sv-SE')} kr.
              </p>
            </div>
          )}
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="skatteaterbaring" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="blue" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(mode, rutKostnad, rutPersoner, rotKostnad, rotPersoner)}
        title="Dela skatteåterbäringsberäkningen"
      />
    </div>
  )
}
