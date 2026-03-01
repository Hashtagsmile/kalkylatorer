import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { PercentIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'

type Mode = 'x-of-y' | 'y-is-x-of-what' | 'change' | 'add' | 'subtract' | 'a-of-b' | 'procentenheter'

const UNITS = ['kr', 'st', 'enheter'] as const
type Unit = (typeof UNITS)[number]

const PERCENT_PRESETS = [5, 10, 12, 25, 50, 75] as const
const AMOUNT_PRESETS = [100, 500, 1000, 5000, 10000] as const

const SCENARIOS = [
  { id: 'rea', title: 'Rea 30%', mode: 'subtract' as Mode, percent: 30, value: 500, value2: 0, unit: 'kr' as Unit },
  { id: 'moms', title: 'Lägg på moms 25%', mode: 'add' as Mode, percent: 25, value: 100, value2: 0, unit: 'kr' as Unit },
  { id: 'lon', title: 'Löneökning 5%', mode: 'change' as Mode, percent: 0, value: 35000, value2: 36750, unit: 'kr' as Unit },
  { id: 'ranta', title: 'Ränta 3%→4%', mode: 'procentenheter' as Mode, percent: 0, value: 3, value2: 4, unit: 'kr' as Unit },
  { id: 'andel', title: 'Andel av budget', mode: 'a-of-b' as Mode, percent: 0, value: 15000, value2: 50000, unit: 'kr' as Unit },
] as const

function buildShareUrl(mode: Mode, percent: number, value: number, value2: number, unit: Unit): string {
  const q = new URLSearchParams({ mode, p: String(percent), v: String(value), u: unit })
  if (value2 !== 0 || mode === 'change' || mode === 'a-of-b' || mode === 'procentenheter') q.set('v2', String(value2))
  return `${window.location.origin}${window.location.pathname}?${q}`
}

function getParamsFromUrl(): Partial<{ mode: Mode; percent: number; value: number; value2: number; unit: Unit }> {
  const q = new URLSearchParams(window.location.search)
  const result: Partial<{ mode: Mode; percent: number; value: number; value2: number; unit: Unit }> = {}
  const m = q.get('mode')
  if (['x-of-y', 'y-is-x-of-what', 'change', 'add', 'subtract', 'a-of-b', 'procentenheter'].includes(m || '')) result.mode = m as Mode
  const p = q.get('p')
  if (p != null) result.percent = Math.min(200, Math.max(-100, parseFloat(p) || 25))
  const v = q.get('v')
  if (v != null) result.value = Math.max(0, parseFloat(v) || 1000)
  const v2 = q.get('v2')
  if (v2 != null) result.value2 = Math.max(0, parseFloat(v2) || 0)
  const u = q.get('u')
  if (u != null && UNITS.includes(u as Unit)) result.unit = u as Unit
  return result
}

export function Procentraknare() {
  const url = getParamsFromUrl()
  const [mode, setMode] = useState<Mode>(url.mode ?? 'x-of-y')
  const [percent, setPercent] = useState(url.percent ?? 25)
  const [value, setValue] = useState(url.value ?? 1000)
  const [value2, setValue2] = useState(url.value2 ?? 1200)
  const [unit, setUnit] = useState<Unit>(url.unit ?? 'kr')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(mode, percent, value, value2, unit))
  }, [mode, percent, value, value2, unit])

  const result = (() => {
    if (mode === 'x-of-y') return (value * percent) / 100
    if (mode === 'y-is-x-of-what') return percent > 0 ? value / (percent / 100) : null
    if (mode === 'change') return value !== 0 ? ((value2 - value) / value) * 100 : null
    if (mode === 'add') return value * (1 + percent / 100)
    if (mode === 'subtract') return value * (1 - percent / 100)
    if (mode === 'a-of-b') return value2 > 0 ? (value / value2) * 100 : null
    if (mode === 'procentenheter') return value2 - value
    return null
  })()

  const relativForandring = mode === 'procentenheter' && value !== 0 ? ((value2 - value) / value) * 100 : null
  const hasValidResult = result !== null && Number.isFinite(result)

  const resultText = hasValidResult
    ? mode === 'change' || mode === 'a-of-b'
      ? `${typeof result === 'number' ? result.toFixed(1) : result}%`
      : mode === 'procentenheter'
        ? `${result} ${Math.abs(result) === 1 ? 'procentenhet' : 'procentenheter'}`
        : `${Math.round(result).toLocaleString('sv-SE')} ${unit}`
    : null

  const handleCopy = useCallback(async () => {
    if (!resultText) return
    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [resultText])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="procentraknare" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Procenträknare"
          subtitle="X% av Y, procentuell förändring, lägg till eller dra ifrån procent – flera beräkningslägen."
          accentColor="indigo"
          icon={<PercentIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <div className="mt-2 space-y-2 text-sm text-stone-600">
              <p><strong>X% av Y:</strong> Y × X/100. <strong>Y är X% av vad:</strong> Y ÷ (X/100).</p>
              <p><strong>Procentuell förändring:</strong> (Nytt − Gammalt) ÷ Gammalt × 100. Positivt = ökning, negativt = minskning.</p>
              <p><strong>Y + X%:</strong> Y × (1 + X/100). <strong>Y − X%:</strong> Y × (1 − X/100). T.ex. rabatt, prishöjning.</p>
              <p><strong>A är hur många % av B:</strong> A ÷ B × 100.</p>
              <p><strong>Procentenheter:</strong> Absolut skillnad (3%→4% = 1 p.p.). Relativ ökning = (4−3)/3×100 ≈ 33%.</p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Snabbval</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setMode(s.mode); setPercent(s.percent); setValue(s.value); setValue2(s.value2); setUnit(s.unit) }}
                  className="px-2 py-1 rounded-lg text-xs border border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600 transition-colors touch-manipulation"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Typ av beräkning</label>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => setMode('x-of-y')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'x-of-y' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>X% av Y</button>
                <button type="button" onClick={() => setMode('y-is-x-of-what')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'y-is-x-of-what' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>Y är X% av vad?</button>
                <button type="button" onClick={() => setMode('change')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'change' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>Procentuell förändring</button>
                <button type="button" onClick={() => setMode('add')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'add' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>Y + X%</button>
                <button type="button" onClick={() => setMode('subtract')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'subtract' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>Y − X%</button>
                <button type="button" onClick={() => setMode('a-of-b')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'a-of-b' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>A är % av B</button>
                <button type="button" onClick={() => setMode('procentenheter')} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${mode === 'procentenheter' ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>Procentenheter</button>
              </div>
            </div>

            {(mode === 'x-of-y' || mode === 'y-is-x-of-what' || mode === 'add' || mode === 'subtract') && (
            <div>
              <label htmlFor="percent" className="block text-sm font-medium text-slate-700 mb-1">Procent (%)</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PERCENT_PRESETS.map((p) => (
                  <button key={p} type="button" onClick={() => setPercent(p)} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${percent === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>{p}%</button>
                ))}
              </div>
              <InputWithUnit
                id="percent"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={percent}
                onChange={(e) => setPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
            )}

            {(mode === 'x-of-y' || mode === 'y-is-x-of-what' || mode === 'add' || mode === 'subtract') && (
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-slate-700 mb-1">Värde (Y)</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {AMOUNT_PRESETS.map((a) => (
                  <button key={a} type="button" onClick={() => setValue(a)} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${value === a ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>{a >= 1000 ? `${a / 1000}k` : a}</button>
                ))}
              </div>
              <p className="text-xs text-stone-500 mb-2">
                Välj enhet – Y kan vara kr, antal eller annat.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${unit === u ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="value"
                type="number"
                min={0}
                value={value || ''}
                onChange={(e) => setValue(Math.max(0, parseFloat(e.target.value) || 0))}
                unit={unit}
                formatThousands={unit === 'kr'}
                maxWidth="md"
                focusRingColor="indigo"
              />
            </div>
            )}

            {(mode === 'change' || mode === 'a-of-b' || mode === 'procentenheter') && (
            <>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-slate-700 mb-1">{mode === 'change' ? 'Ursprungligt värde (A)' : mode === 'procentenheter' ? 'Från (%)' : 'Värde A'}</label>
                {mode !== 'procentenheter' && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {UNITS.map((u) => (
                      <button key={u} type="button" onClick={() => setUnit(u)} className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${unit === u ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'}`}>{u}</button>
                    ))}
                  </div>
                )}
                <InputWithUnit id="value" type="number" min={0} value={value || ''} onChange={(e) => setValue(parseFloat(e.target.value) || 0)} unit={mode === 'procentenheter' ? '%' : unit} formatThousands={unit === 'kr' && mode !== 'procentenheter'} maxWidth="md" focusRingColor="indigo" />
              </div>
              <div>
                <label htmlFor="value2" className="block text-sm font-medium text-slate-700 mb-1">{mode === 'change' ? 'Nytt värde (B)' : mode === 'procentenheter' ? 'Till (%)' : 'Värde B'}</label>
                <InputWithUnit id="value2" type="number" min={0} value={value2 || ''} onChange={(e) => setValue2(parseFloat(e.target.value) || 0)} unit={mode === 'procentenheter' ? '%' : unit} formatThousands={unit === 'kr' && mode !== 'procentenheter'} maxWidth="md" focusRingColor="indigo" />
              </div>
            </>
            )}
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Procenträknare – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <div className="flex flex-wrap gap-2 no-print">
              {hasValidResult && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 hover:bg-slate-200 text-slate-700'}`}
                  aria-label="Kopiera resultat"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Kopierat!' : 'Kopiera'}
                </button>
              )}
              <ResultActions onShareClick={() => setShareModalOpen(true)} />
            </div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-stone-600 mb-1">
              {mode === 'x-of-y' && `${percent}% av ${value.toLocaleString('sv-SE')} ${unit} =`}
              {mode === 'y-is-x-of-what' && `${value.toLocaleString('sv-SE')} ${unit} är ${percent}% av`}
              {mode === 'change' && `${value.toLocaleString('sv-SE')} → ${value2.toLocaleString('sv-SE')} ${unit} =`}
              {mode === 'add' && `${value.toLocaleString('sv-SE')} ${unit} + ${percent}% =`}
              {mode === 'subtract' && `${value.toLocaleString('sv-SE')} ${unit} − ${percent}% =`}
              {mode === 'a-of-b' && `${value.toLocaleString('sv-SE')} är hur många % av ${value2.toLocaleString('sv-SE')} ${unit}?`}
              {mode === 'procentenheter' && `${value}% → ${value2}% =`}
            </p>
            {hasValidResult ? (
              <>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-700 tabular-nums">
                  {resultText}
                </p>
                {mode === 'x-of-y' && hasValidResult && typeof result === 'number' && result > 0 && (
                  <p className="text-sm text-stone-600 mt-2">
                    Omvänt: {Math.round(result).toLocaleString('sv-SE')} {unit} är {percent}% av {Math.round(value).toLocaleString('sv-SE')} {unit}.
                  </p>
                )}
                {mode === 'y-is-x-of-what' && hasValidResult && typeof result === 'number' && (
                  <p className="text-sm text-stone-600 mt-2">
                    {Math.round(value).toLocaleString('sv-SE')} {unit} är {percent}% av {Math.round(result).toLocaleString('sv-SE')} {unit}.
                  </p>
                )}
                {mode === 'change' && typeof result === 'number' && (
                  <p className="text-sm text-stone-600 mt-2">
                    {result >= 0 ? 'Ökning' : 'Minskning'} med {Math.abs(result).toFixed(1)}%.
                  </p>
                )}
                {mode === 'procentenheter' && relativForandring != null && (
                  <p className="text-sm text-stone-600 mt-2">
                    Relativ förändring: {relativForandring >= 0 ? '+' : ''}{relativForandring.toFixed(1)}%.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-amber-700">
                {mode === 'change' && value === 0 ? 'Ursprungligt värde kan inte vara 0.' : mode === 'a-of-b' && value2 === 0 ? 'Värde B kan inte vara 0.' : mode === 'y-is-x-of-what' ? 'Ange procent över 0.' : 'Fyll i värdena.'}
              </p>
            )}
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="procent" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="indigo" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(mode, percent, value, value2, mode === 'procentenheter' ? 'kr' : unit)}
        title="Dela procentberäkningen"
      />
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
