import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateCompoundInterest } from '../lib/compoundInterest'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { HouseIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { YearValueTable } from '../components/YearValueTable'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { ROUTES } from '../config/links'

const INSATS_PERCENT = 15

const BOSTADSPRIS_PRESETS = [2000000, 3000000, 4000000, 5000000, 6000000] as const
const SPARAT_PRESETS = [50000, 100000, 200000, 300000, 500000] as const
const MANADLIGT_PRESETS = [3000, 5000, 10000, 15000, 20000] as const

function buildShareUrl(bostadspris: number, sparat: number, manadligt: number, avkastning: number): string {
  return `${window.location.origin}${window.location.pathname}?pris=${bostadspris}&sparat=${sparat}&manad=${manadligt}&avk=${avkastning}`
}

function getParamsFromUrl(): Partial<{ bostadspris: number; sparat: number; manadligt: number; avkastning: number }> {
  const q = new URLSearchParams(window.location.search)
  const result: Partial<{ bostadspris: number; sparat: number; manadligt: number; avkastning: number }> = {}
  const p = q.get('pris')
  if (p != null) result.bostadspris = Math.max(0, parseInt(p, 10) || 3000000)
  const s = q.get('sparat')
  if (s != null) result.sparat = Math.max(0, parseInt(s, 10) || 200000)
  const m = q.get('manad')
  if (m != null) result.manadligt = Math.max(0, parseInt(m, 10) || 10000)
  const a = q.get('avk')
  if (a != null) result.avkastning = Math.min(15, Math.max(0, parseFloat(a) || 3))
  return result
}

export function Kontantinsats() {
  const url = getParamsFromUrl()
  const [bostadspris, setBostadspris] = useState(url.bostadspris ?? 3000000)
  const [sparat, setSparat] = useState(url.sparat ?? 200000)
  const [manadligtSparande, setManadligtSparande] = useState(url.manadligt ?? 10000)
  const [avkastning, setAvkastning] = useState(url.avkastning ?? 3)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(bostadspris, sparat, manadligtSparande, avkastning))
  }, [bostadspris, sparat, manadligtSparande, avkastning])

  const insats = Math.round(bostadspris * (INSATS_PERCENT / 100))
  const saknas = Math.max(0, insats - sparat)

  const compoundData = calculateCompoundInterest({
    initial: sparat,
    monthly: manadligtSparande,
    rate: avkastning,
    years: 50,
  })
  const yearNarKlart = compoundData.findIndex((d) => d.total >= insats)
  const arKvar = yearNarKlart >= 0 ? yearNarKlart : null

  const sparPath: { year: number; value: number }[] = []
  if (manadligtSparande > 0 && saknas > 0) {
    const maxYear = yearNarKlart >= 0 ? yearNarKlart : 50
    sparPath.push(...compoundData.filter((d) => d.year <= maxYear).map((d) => ({ year: d.year, value: d.total })))
  } else if (saknas === 0) {
    sparPath.push({ year: 0, value: sparat }, { year: 1, value: sparat })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="kontantinsats" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Kontantinsatskalkylator"
          subtitle="Hur mycket behöver du spara till kontantinsats? Minst 15 % av bostadspriset."
          accentColor="amber"
          icon={<HouseIcon />}
        >
          <Accordion summary="Så fungerar beräkningen" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-slate-600">
              <p>
                <strong>Kontantinsats:</strong> Banker kräver minst 15 % av bostadspriset (Finansinspektionen). Beräkningen: bostadspris × 15 % = kontantinsats.
              </p>
              <p>
                <strong>Sparhorisont:</strong> Med ränta-på-ränta beräknas när kapitalet når kontantinsatsen. Sätt 0% avkastning för linjärt sparande.
              </p>
              <p>
                <strong>Utöver kontantinsatsen:</strong> Räkna med pantbrev och lagfart (ca 1–2 % av köpeskillingen) plus eventuella flyttkostnader.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="pris" className="block text-sm font-medium text-stone-700 mb-1">
                Bostadspris (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Köpeskillingen för bostaden du tittar på.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {BOSTADSPRIS_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setBostadspris(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      bostadspris === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                  >
                    {(p / 1_000_000).toFixed(1)} M kr
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="pris"
                type="number"
                min={0}
                value={bostadspris || ''}
                onChange={(e) => setBostadspris(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>
            <div>
              <label htmlFor="sparat" className="block text-sm font-medium text-stone-700 mb-1">
                Redan sparat (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Pengar du redan har till kontantinsatsen.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SPARAT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSparat(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      sparat === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                  >
                    {p >= 1000000 ? `${(p / 1_000_000).toFixed(1)} M` : `${p / 1000} k`} kr
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="sparat"
                type="number"
                min={0}
                value={sparat || ''}
                onChange={(e) => setSparat(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>
            <div>
              <label htmlFor="manadligt" className="block text-sm font-medium text-stone-700 mb-1">
                Månadligt sparande (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hur mycket du sparar varje månad. Används för att beräkna sparhorisont.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {MANADLIGT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setManadligtSparande(p)}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      manadligtSparande === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                  >
                    {p >= 1000 ? `${p / 1000} k` : p} kr
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="manadligt"
                type="number"
                min={0}
                value={manadligtSparande || ''}
                onChange={(e) => setManadligtSparande(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>
            <div>
              <label htmlFor="avkastning" className="block text-sm font-medium text-stone-700 mb-1">
                Förväntad avkastning (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Ränta på ränta. Sparkonto ca 3%, indexfonder historiskt ca 7%. Sätt 0 för linjärt sparande.
              </p>
              <InputWithUnit
                id="avkastning"
                type="number"
                min={0}
                max={15}
                step={0.5}
                value={avkastning}
                onChange={(e) => setAvkastning(Math.min(15, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="amber"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Kontantinsats – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Bostadspris: {bostadspris.toLocaleString('sv-SE')} kr · Avkastning: {avkastning} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Kontantinsats (15 %)</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-800 tabular-nums">
                {insats.toLocaleString('sv-SE')} kr
              </p>
              <p className="mt-2 text-xs text-slate-600">
                + pantbrev/lagfart ≈ {Math.round(bostadspris * 0.015).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
                {saknas === 0 ? 'Status' : 'Återstår att spara'}
              </p>
              <p className={`text-xl sm:text-2xl font-bold tabular-nums ${saknas === 0 ? 'text-stone-700' : 'text-stone-800'}`}>
                {saknas === 0 ? '✓ Tillräckligt' : `${saknas.toLocaleString('sv-SE')} kr`}
              </p>
            </div>
            {saknas > 0 && (
              <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Sparhorisont ({avkastning}% avkastning)</p>
                <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                  {arKvar == null ? 'Över 50 år' : arKvar < 1 ? `${Math.round(arKvar * 12)} mån` : `${arKvar} år`}
                </p>
              </div>
            )}
          </div>

          {sparPath.length >= 2 && (
            <>
              <div className="mt-6 no-print">
                <TimeSeriesChart
                  data={sparPath}
                  title="Sparande mot kontantinsats"
                  valueLabel="Kapital"
                  referenceLine={insats}
                  referenceLabel="Kontantinsats"
                  accentColor="amber"
                />
              </div>
              <Accordion
                id="year-table-details"
                summary="Visa tabell år för år"
                className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
              >
                <YearValueTable
                  rows={sparPath}
                  valueHeader="Kapital"
                  valueFormatter={(v) => `${v.toLocaleString('sv-SE')} kr`}
                />
              </Accordion>
            </>
          )}

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

        <CalculatorInfoSection calculatorId="kontantinsats" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="amber" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(bostadspris, sparat, manadligtSparande, avkastning)}
        title="Dela kontantinsatsberäkningen"
      />
    </div>
  )
}
