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

const MOMSSATSER = [25, 12, 6, 0] as const

type Direction = 'inkl' | 'exkl'

function buildShareUrl(direction: Direction, rate: number, amount: number): string {
  return `${window.location.origin}${window.location.pathname}?dir=${direction}&rate=${rate}&amount=${amount}`
}

function getParamsFromUrl(): Partial<{ direction: Direction; rate: number; amount: number }> {
  const q = new URLSearchParams(window.location.search)
  const result: Partial<{ direction: Direction; rate: number; amount: number }> = {}
  const d = q.get('dir')
  if (d === 'inkl' || d === 'exkl') result.direction = d
  const r = q.get('rate')
  if (r != null) result.rate = [25, 12, 6, 0].includes(parseInt(r, 10)) ? parseInt(r, 10) : 25
  const a = q.get('amount')
  if (a != null) result.amount = Math.max(0, parseFloat(a) || 1000)
  return result
}

export function Momsraknare() {
  const url = getParamsFromUrl()
  const [direction, setDirection] = useState<Direction>(url.direction ?? 'inkl')
  const [rate, setRate] = useState(url.rate ?? 25)
  const [amount, setAmount] = useState(url.amount ?? 1000)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(direction, rate, amount))
  }, [direction, rate, amount])

  const factor = 1 + rate / 100
  const momsBelopp =
    direction === 'inkl'
      ? amount - amount / factor
      : amount * (rate / 100)
  const nettoBelopp =
    direction === 'inkl'
      ? amount / factor
      : amount
  const bruttoBelopp =
    direction === 'inkl'
      ? amount
      : amount + momsBelopp

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="momsraknare" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Momsräknare"
          subtitle="Räkna ut moms inklusive eller exklusive. 25%, 12%, 6% och 0% (export) momssatser."
          accentColor="blue"
          icon={<CalculatorIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Inkl. moms: dividera med (1 + momssats/100) för att få exkl. moms. Exkl. moms: multiplicera med momssats/100 för momsen.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Belopp är</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('inkl')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    direction === 'inkl' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                  }`}
                >
                  Inklusive moms
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('exkl')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    direction === 'exkl' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                  }`}
                >
                  Exklusive moms
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Momssats</label>
              <div className="flex flex-wrap gap-2">
                {MOMSSATSER.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rate === r ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                    }`}
                  >
                    {r} %
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-stone-700 mb-1">
                Belopp (kr)
              </label>
              <InputWithUnit
                id="amount"
                type="number"
                min={0}
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Momsräknare – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Momsbelopp ({rate}%{rate === 0 ? ' – t.ex. export' : ''})</p>
              <p className="text-2xl font-bold text-blue-700 tabular-nums">
                {Math.round(momsBelopp).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 bg-stone-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Exklusive moms</p>
                <p className="text-xl font-semibold text-stone-800 tabular-nums">
                  {Math.round(nettoBelopp).toLocaleString('sv-SE')} kr
                </p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Inklusive moms</p>
                <p className="text-xl font-semibold text-stone-800 tabular-nums">
                  {Math.round(bruttoBelopp).toLocaleString('sv-SE')} kr
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="moms" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="blue" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(direction, rate, amount)}
        title="Dela momsberäkningen"
      />
    </div>
  )
}
