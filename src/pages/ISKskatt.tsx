import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { ChartIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PieChartBreakdown } from '../components/PieChartBreakdown'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { ISK, YEAR } from '../config/yearly'
import { ROUTES } from '../config/links'

const DEFAULT_KAPITAL = 500000

const SCENARIOS = [
  { id: 'sparare', title: 'Sparare', kapital: 200000, desc: 'Under skattefri gräns' },
  { id: 'typisk', title: 'Typisk ISK', kapital: 500000, desc: 'Vanligt sparande' },
  { id: 'stor', title: 'Stor portfölj', kapital: 2000000, desc: 'Högre kapitalnivå' },
  { id: 'mycket', title: 'Mycket kapital', kapital: 5000000, desc: 'Stor investering' },
] as const

function buildShareUrl(kapital: number): string {
  return `${window.location.origin}${window.location.pathname}?kapital=${kapital}`
}

function getKapitalFromUrl(): number | undefined {
  const k = new URLSearchParams(window.location.search).get('kapital')
  if (!k) return undefined
  const v = parseInt(k, 10)
  return !isNaN(v) && v >= 0 ? Math.min(v, 1000000000) : undefined
}

export function ISKskatt() {
  const urlKapital = getKapitalFromUrl()
  const [kapital, setKapital] = useState(urlKapital ?? 500000)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl(kapital))
  }, [kapital])

  const beskattningsbart = Math.max(0, kapital - ISK.skattefriGräns)
  const schablonintakt = beskattningsbart * ISK.schablonintakt
  const skatt = schablonintakt * ISK.skattesats

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="iskSkatt" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="ISK-skatt"
          subtitle="Räkna ut schablonskatten på ditt investeringssparkonto. Skattefri grundnivå 150 000 kr."
          accentColor="purple"
          icon={<ChartIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Schablonintäkt {YEAR}: {(ISK.schablonintakt * 100).toFixed(2)} % av kapitalunderlaget. Skatt: 30 % av schablonintäkten. Kapital under {ISK.skattefriGräns.toLocaleString('sv-SE')} kr är skattefritt.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = kapital === s.kapital
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setKapital(DEFAULT_KAPITAL)
                      } else {
                        setKapital(s.kapital)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 ${
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
          </div>

          <div>
            <label htmlFor="kapital" className="block text-sm font-medium text-stone-700 mb-1">
              Kapitalunderlag (kr)
            </label>
            <p className="text-xs text-stone-500 mb-2">
              Genomsnitt av värdet vid kvartalsbörjan + insättningar under året, delat med 4. Ange ett ungefärligt belopp.
            </p>
            <InputWithUnit
              id="kapital"
              type="number"
              min={0}
              value={kapital || ''}
              onChange={(e) => setKapital(Math.max(0, parseInt(e.target.value, 10) || 0))}
              unit="kr"
              formatThousands
              maxWidth="md"
              focusRingColor="purple"
            />
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">ISK-skatt – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Kapital: {kapital.toLocaleString('sv-SE')} kr
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metric */}
          <div className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">ISK-skatt {YEAR}</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-800 tabular-nums">
              {Math.round(skatt).toLocaleString('sv-SE')} kr
            </p>
          </div>

          {kapital > 0 && (
            <div className="mt-6 no-print">
              <PieChartBreakdown
                data={[
                  { name: 'Skattefri grundnivå', value: Math.min(kapital, ISK.skattefriGräns), color: '#10b981' },
                  { name: 'Beskattningsbart', value: beskattningsbart, color: '#7c3aed' },
                ]}
                title="Kapitalunderlag – skattefri vs beskattningsbart"
                valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
              />
            </div>
          )}

          {kapital > ISK.skattefriGräns && (
            <div className="mt-6 pt-4 border-t border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3">Uppdelning</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Kapital', value: kapital, color: '#7c3aed' },
                  { label: '− Skattefri grundnivå', value: -ISK.skattefriGräns, color: '#10b981', prefix: '−' },
                  { label: 'Beskattningsbart', value: beskattningsbart, color: '#7c3aed' },
                  { label: `Schablonintäkt (${(ISK.schablonintakt * 100).toFixed(2)} %)`, value: schablonintakt, color: '#a78bfa' },
                  { label: 'Skatt (30 %)', value: skatt, color: '#6d28d9' },
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
            </div>
          )}
          {kapital <= ISK.skattefriGräns && (
            <p className="mt-6 text-sm text-slate-600">
              Ditt kapital ligger under den skattefria grundnivån på {ISK.skattefriGräns.toLocaleString('sv-SE')} kr. Du betalar ingen ISK-skatt.
            </p>
          )}
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="isk" />

        <div className="mt-8">
          <Link to={ROUTES.home} className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="purple" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl(kapital)}
        title="Dela ISK-skattberäkningen"
      />
    </div>
  )
}
