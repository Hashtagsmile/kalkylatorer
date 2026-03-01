import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdSlot } from '../components/AdSlot'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { FlameIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { FireChart } from '../components/FireChart'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { FIRE_SCENARIOS } from '../data/fireScenarios'
import { ROUTES } from '../config/links'

const WITHDRAWAL_RATE = 0.04

function simulateYearsToFire(
  currentCapital: number,
  monthlySaving: number,
  annualExpenses: number,
  annualReturn: number
): { years: number; path: { year: number; capital: number }[] } {
  const targetCapital = annualExpenses / WITHDRAWAL_RATE
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1
  let capital = currentCapital
  const path: { year: number; capital: number }[] = [{ year: 0, capital }]

  for (let year = 1; year <= 100; year++) {
    for (let m = 0; m < 12; m++) {
      capital = capital * (1 + monthlyReturn) + monthlySaving
    }
    path.push({ year, capital: Math.round(capital) })
    if (capital >= targetCapital) {
      return { years: year, path }
    }
  }
  return { years: 100, path }
}

function buildShareUrl(p: { expenses: number; capital: number; saving: number; return: number }) {
  const q = new URLSearchParams({ exp: String(p.expenses), cap: String(p.capital), save: String(p.saving), ret: String(p.return) })
  return `${window.location.origin}${window.location.pathname}?${q}`
}

const DEFAULT_EXPENSES = 300000
const DEFAULT_CAPITAL = 500000
const DEFAULT_SAVING = 10000
const DEFAULT_RETURN = 6

function getInitialFromUrl() {
  const q = new URLSearchParams(window.location.search)
  return {
    expenses: q.get('exp') ? Math.min(10000000, Math.max(0, parseInt(q.get('exp')!, 10) || DEFAULT_EXPENSES)) : DEFAULT_EXPENSES,
    capital: q.get('cap') ? Math.min(100000000, Math.max(0, parseInt(q.get('cap')!, 10) || DEFAULT_CAPITAL)) : DEFAULT_CAPITAL,
    saving: q.get('save') ? Math.min(1000000, Math.max(0, parseInt(q.get('save')!, 10) || DEFAULT_SAVING)) : DEFAULT_SAVING,
    return: q.get('ret') ? Math.min(20, Math.max(0, parseFloat(q.get('ret')!) || DEFAULT_RETURN)) : DEFAULT_RETURN,
  }
}

export function FIREkalkylator() {
  const init = getInitialFromUrl()
  const [annualExpenses, setAnnualExpenses] = useState(init.expenses)
  const [currentCapital, setCurrentCapital] = useState(init.capital)
  const [monthlySaving, setMonthlySaving] = useState(init.saving)
  const [annualReturn, setAnnualReturn] = useState(init.return)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ expenses: annualExpenses, capital: currentCapital, saving: monthlySaving, return: annualReturn }))
  }, [annualExpenses, currentCapital, monthlySaving, annualReturn])

  const targetCapital = Math.round(annualExpenses / WITHDRAWAL_RATE)
  const { years, path } = simulateYearsToFire(
    currentCapital,
    monthlySaving,
    annualExpenses,
    annualReturn
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="fireKalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="FIRE-kalkylator"
          subtitle="Räkna ut målkapital och år till ekonomiskt oberoende. 4%-regeln – leva på avkastningen."
          accentColor="emerald"
          icon={<FlameIcon />}
        >
          <Accordion summary="Så fungerar beräkningen" className="mt-3">
            <div className="mt-2 space-y-3 text-sm text-stone-600">
              <p>
                <strong>4%-regeln:</strong> Målkapital = årliga utgifter × 25. Om du kan leva på 4 % av kapitalet per år, räcker pengarna länge vid historisk avkastning.
              </p>
              <p>
                <strong>Simulering:</strong> Kalkylatorn räknar månad för månad: kapital × avkastning + sparande. När kapitalet når målkapitalet är du ekonomiskt oberoende.
              </p>
              <p>
                <strong>Avkastning:</strong> Historiskt 5–7 % för breda indexfonder. Inga garantier – använd konservativa siffror.
              </p>
            </div>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
            <p className="text-xs text-stone-500 mb-2">
              Typiska mönster för ekonomiskt oberoende.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FIRE_SCENARIOS.map((s) => {
                const isActive = annualExpenses === s.expenses && currentCapital === s.capital && monthlySaving === s.monthlySaving && annualReturn === s.return
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setAnnualExpenses(DEFAULT_EXPENSES)
                        setCurrentCapital(DEFAULT_CAPITAL)
                        setMonthlySaving(DEFAULT_SAVING)
                        setAnnualReturn(DEFAULT_RETURN)
                      } else {
                        setAnnualExpenses(s.expenses)
                        setCurrentCapital(s.capital)
                        setMonthlySaving(s.monthlySaving)
                        setAnnualReturn(s.return)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.description}
                    aria-label={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.description}`}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
            <Accordion variant="compact" summary="Visa förklaring av scenarierna" className="mt-2">
              <ul className="mt-2 space-y-1.5 text-xs text-stone-600">
                {FIRE_SCENARIOS.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title}:</strong> {s.description}
                  </li>
                ))}
              </ul>
            </Accordion>
          </div>

          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="expenses" className="block text-sm font-medium text-slate-700 mb-1">
                Årliga utgifter (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hur mycket du behöver per år för att leva. Målkapital = utgifter × 25.
              </p>
              <InputWithUnit
                id="expenses"
                type="number"
                min={0}
                value={annualExpenses || ''}
                onChange={(e) => setAnnualExpenses(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="emerald"
              />
            </div>

            <div>
              <label htmlFor="capital" className="block text-sm font-medium text-slate-700 mb-1">
                Nuvarande kapital (kr)
              </label>
              <InputWithUnit
                id="capital"
                type="number"
                min={0}
                value={currentCapital || ''}
                onChange={(e) => setCurrentCapital(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="emerald"
              />
            </div>

            <div>
              <label htmlFor="saving" className="block text-sm font-medium text-slate-700 mb-1">
                Månadligt sparande (kr)
              </label>
              <InputWithUnit
                id="saving"
                type="number"
                min={0}
                value={monthlySaving || ''}
                onChange={(e) => setMonthlySaving(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="emerald"
              />
            </div>

            <div>
              <label htmlFor="return" className="block text-sm font-medium text-slate-700 mb-1">
                Förväntad avkastning (% per år)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Historiskt 5–7 % för breda indexfonder. Inga garantier.
              </p>
              <InputWithUnit
                id="return"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                unit="%"
                maxWidth="sm"
                focusRingColor="emerald"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">FIRE-kalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Utgifter: {annualExpenses.toLocaleString('sv-SE')} kr/år · Kapital: {currentCapital.toLocaleString('sv-SE')} kr · Avkastning: {annualReturn} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Målkapital (4%-regeln)</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                {targetCapital.toLocaleString('sv-SE')} kr
              </p>
              <p className="text-xs text-stone-500 mt-1">{annualExpenses.toLocaleString('sv-SE')} kr × 25</p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">År till oberoende</p>
              <p className="text-2xl sm:text-3xl font-bold text-stone-800 tabular-nums">
                {years} år
              </p>
            </div>
          </div>

          {path.length > 1 && (
            <>
              <FireChart path={path} targetCapital={targetCapital} />
              <Accordion
                id="year-table-details"
                summary="Visa tabell år för år"
                className="mt-4 p-4 bg-stone-50 rounded-lg print:block print:mt-4 print:border print:rounded-lg print:border-stone-200"
              >
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {path.map((p) => (
                    <li key={p.year} className="flex justify-between">
                      <span>År {p.year}</span>
                      <span className="font-medium tabular-nums">{p.capital.toLocaleString('sv-SE')} kr</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.rantapaRanta} className="text-stone-600 hover:text-stone-900 hover:underline">Ränta på ränta</Link>
            <Link to={ROUTES.pensionskalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Pensionskalkylator</Link>
            <Link to={ROUTES.rantabilitet} className="text-stone-600 hover:text-stone-900 hover:underline">Räntabilitet</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="default" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="fire" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="emerald" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ expenses: annualExpenses, capital: currentCapital, saving: monthlySaving, return: annualReturn })}
        title="Dela FIRE-beräkningen"
      />
    </div>
  )
}
