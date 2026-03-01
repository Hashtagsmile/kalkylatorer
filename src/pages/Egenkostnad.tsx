import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { BriefcaseIcon } from '../components/CalculatorIcons'
import { Chip } from '../components/Chip'
import { InputWithUnit } from '../components/InputWithUnit'
import { StackedBarChart } from '../components/StackedBarChart'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { EGENKOSTNAD } from '../config/yearly'
import { ROUTES } from '../config/links'

const DEFAULT_BRUTTO = 450000
const DEFAULT_PENSION = 4.5

const SCENARIOS = [
  { id: 'itp1', title: 'ITP 1', brutto: 450000, pension: 4.5, desc: 'Typisk tjänstepension för tjänstemän' },
  { id: 'itp2', title: 'ITP 2', brutto: 350000, pension: 4, desc: 'Lägre pension för arbetare' },
  { id: 'konsult', title: 'Konsult', brutto: 600000, pension: 5, desc: 'Högre lön, högre pension' },
  { id: 'nyexad', title: 'Nyexad', brutto: 380000, pension: 4.5, desc: 'Typisk ingångslön' },
] as const

function buildShareUrl(p: { brutto: number; pension: number }) {
  const q = new URLSearchParams({ b: String(p.brutto), p: String(p.pension) })
  return `${window.location.origin}${window.location.pathname}?${q}`
}

export function Egenkostnad() {
  const q = new URLSearchParams(window.location.search)
  const [bruttolon, setBruttolon] = useState(q.get('b') ? Math.max(0, parseInt(q.get('b')!, 10) || 450000) : 450000)
  const [tjanstepension, setTjanstepension] = useState(q.get('p') ? Math.min(100, Math.max(0, parseFloat(q.get('p')!) || 4.5)) : 4.5)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ brutto: bruttolon, pension: tjanstepension }))
  }, [bruttolon, tjanstepension])

  const arbetsgivaravgift = bruttolon * EGENKOSTNAD.arbetsgivaravgift
  const pension = bruttolon * (tjanstepension / 100)
  const semester = bruttolon * EGENKOSTNAD.semester
  const egenkostnad = bruttolon + arbetsgivaravgift + pension + semester
  const manadskostnad = egenkostnad / 12

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="egenkostnad" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Egenkostnadskalkylator"
          subtitle="Vad kostar du som anställd för arbetsgivaren? Bruttolön + arbetsgivaravgifter + pension + semester."
          accentColor="teal"
          icon={<BriefcaseIcon />}
        >
          <Accordion summary="Läs mer om beräkningen" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Egenkostnaden är den totala kostnaden för arbetsgivaren: bruttolön plus arbetsgivaravgift (ca 31 %), tjänstepension (ofta 4–5 %) och semesterersättning (12 %).
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Beräkning</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = bruttolon === s.brutto && Math.abs(tjanstepension - s.pension) < 0.05
                return (
                  <Chip
                    key={s.id}
                    isActive={isActive}
                    onClick={() => {
                      if (isActive) {
                        setBruttolon(DEFAULT_BRUTTO)
                        setTjanstepension(DEFAULT_PENSION)
                      } else {
                        setBruttolon(s.brutto)
                        setTjanstepension(s.pension)
                      }
                    }}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    ariaLabel={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                    accentColor="teal"
                    variant="scenario"
                  >
                    {s.title}
                  </Chip>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="bruttolon" className="block text-sm font-medium text-slate-700 mb-1">
                Årslön brutto (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din årslön före skatt.
              </p>
              <InputWithUnit
                id="bruttolon"
                type="number"
                min={0}
                value={bruttolon || ''}
                onChange={(e) => setBruttolon(Math.max(0, parseFloat(e.target.value) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>
            <div>
              <label htmlFor="tjanstepension" className="block text-sm font-medium text-slate-700 mb-1">
                Tjänstepension (%)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Tjänstepensionsavsättning, typiskt 4–5 % (ITP 1 ca 4,5 %).
              </p>
              <InputWithUnit
                id="tjanstepension"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={tjanstepension || ''}
                onChange={(e) => setTjanstepension(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="md"
                focusRingColor="teal"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Egenkostnadskalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Bruttolön: {bruttolon.toLocaleString('sv-SE')} kr · Tjänstepension: {tjanstepension} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50 border-l-4 border-l-[#1a4d2e]">
              <p className="text-xs text-stone-500 mb-1">Total egenkostnad</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {Math.round(egenkostnad).toLocaleString('sv-SE')} kr
              </p>
              <p className="text-xs text-stone-500 mt-1">per år</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500 mb-1">Månadskostnad</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-800 tabular-nums">
                {Math.round(manadskostnad).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 no-print">
            <StackedBarChart
              segments={[
                { name: 'Bruttolön', value: bruttolon, color: '#0d9488' },
                { name: 'Arbetsgivaravgift', value: arbetsgivaravgift, color: '#64748b' },
                { name: 'Tjänstepension', value: pension, color: '#7c3aed' },
                { name: 'Semesterersättning', value: semester, color: '#f59e0b' },
              ]}
              title="Uppdelning (kr/år)"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
              embedded
            />
          </div>

          {/* Breakdown list with color indicators */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500 mb-3">Detaljerad uppdelning</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Bruttolön', value: bruttolon, color: '#0d9488' },
                { label: `Arbetsgivaravgift (${(EGENKOSTNAD.arbetsgivaravgift * 100).toFixed(1)} %)`, value: arbetsgivaravgift, color: '#64748b' },
                { label: `Tjänstepension (${tjanstepension} %)`, value: pension, color: '#7c3aed' },
                { label: `Semesterersättning (${(EGENKOSTNAD.semester * 100).toFixed(0)} %)`, value: semester, color: '#f59e0b' },
              ].map(({ label, value, color }) => (
                <li key={label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
                    {label}
                  </span>
                  <span className="tabular-nums font-medium text-stone-800">{Math.round(value).toLocaleString('sv-SE')} kr</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">
              Lönekalkylator
            </Link>
            <Link to={ROUTES.semesterersattning} className="text-stone-600 hover:text-stone-900 hover:underline">
              Semesterersättning
            </Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="salary" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="egenkostnad" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="teal" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ brutto: bruttolon, pension: tjanstepension })}
        title="Dela egenkostnadsberäkningen"
      />
    </div>
  )
}
