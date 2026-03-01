import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculatePension, getRiktalder, getTidigastUttag, type PensionInput } from '../lib/pensionCalculations'
import { LINKS } from '../config/links'
import { YEAR, PENSION } from '../config/yearly'
import { ShareModal } from '../components/ShareModal'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { InfoTooltip } from '../components/InfoTooltip'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { PageMeta } from '../components/PageMeta'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { PensionIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { BreakdownBarChart } from '../components/BreakdownBarChart'
import { Footer } from '../components/Footer'

const CURRENT_YEAR = new Date().getFullYear()

function buildPensionShareUrl(params: PensionInput): string {
  const search = new URLSearchParams({
    b: String(params.birthYear),
    p: String(params.pensionAge),
    s: String(params.annualSalary),
    y: String(params.yearsToWork),
    t: params.hasTjanstepension ? '1' : '0',
    m: String(params.privateMonthly),
    i: String(params.privateInitial),
    r: String(params.privateRate),
  })
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getPensionParamsFromUrl(): Partial<PensionInput> {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<PensionInput> = {}

  const b = params.get('b')
  if (b != null) {
    const v = parseInt(b, 10)
    if (!isNaN(v) && v >= 1940 && v <= CURRENT_YEAR - 18) result.birthYear = v
  }
  const p = params.get('p')
  if (p != null) {
    const v = parseInt(p, 10)
    if (!isNaN(v) && v >= 61 && v <= 70) result.pensionAge = v
  }
  const s = params.get('s')
  if (s != null) {
    const v = parseInt(s, 10)
    if (!isNaN(v) && v >= 0) result.annualSalary = Math.min(v, 2000000)
  }
  const y = params.get('y')
  if (y != null) {
    const v = parseInt(y, 10)
    if (!isNaN(v) && v >= 1 && v <= 50) result.yearsToWork = v
  }
  const t = params.get('t')
  if (t != null) result.hasTjanstepension = t === '1'
  const m = params.get('m')
  if (m != null) {
    const v = parseInt(m, 10)
    if (!isNaN(v) && v >= 0) result.privateMonthly = Math.min(v, 100000)
  }
  const i = params.get('i')
  if (i != null) {
    const v = parseInt(i, 10)
    if (!isNaN(v) && v >= 0) result.privateInitial = Math.min(v, 10000000)
  }
  const r = params.get('r')
  if (r != null) {
    const v = parseFloat(r)
    if (!isNaN(v) && v >= 0 && v <= 20) result.privateRate = v
  }

  return result
}

const SALARY_PRESETS = [300000, 400000, 500000, 600000, 700000] as const
const YEARS_PRESETS = [10, 20, 30, 40] as const

const DEFAULT: PensionInput = {
  birthYear: 1990,
  pensionAge: 67,
  annualSalary: 450000,
  yearsToWork: 30,
  hasTjanstepension: true,
  privateMonthly: 2000,
  privateInitial: 50000,
  privateRate: 5,
}

function getInitialState(): PensionInput {
  const url = getPensionParamsFromUrl()
  const birthYear = url.birthYear ?? DEFAULT.birthYear
  const riktalder = getRiktalder(birthYear)

  return {
    birthYear,
    pensionAge: url.pensionAge ?? riktalder,
    annualSalary: url.annualSalary ?? DEFAULT.annualSalary,
    yearsToWork: url.yearsToWork ?? DEFAULT.yearsToWork,
    hasTjanstepension: url.hasTjanstepension ?? DEFAULT.hasTjanstepension,
    privateMonthly: url.privateMonthly ?? DEFAULT.privateMonthly,
    privateInitial: url.privateInitial ?? DEFAULT.privateInitial,
    privateRate: url.privateRate ?? DEFAULT.privateRate,
  }
}

export function Pensionkalkylator() {
  const [input, setInput] = useState<PensionInput>(getInitialState)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    const url = buildPensionShareUrl(input)
    window.history.replaceState({}, '', url)
  }, [input])

  const result = calculatePension(input)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="pensionskalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="Pensionskalkylator"
          subtitle="Beräkningen bygger på Pensionsmyndighetens system – allmän pension, tjänstepension och privat sparande. Resultatet är en uppskattning, inte en officiell prognos."
          accentColor="blue"
          icon={<PensionIcon />}
        >
          <Accordion summary="Läs mer om pensionssystemet" className="mt-3">
            <p className="mt-2 text-sm text-stone-600">
              Tre pelare: inkomst- och premiepension (allmän), tjänstepension (kollektivavtal), privat sparande. Kontrollera mot ditt pensionsbesked.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          {/* Din situation – allmän pension & tjänstepension */}
          <div className="mb-6 p-4 rounded-lg bg-stone-50/80 border border-stone-100">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Din situation</h3>
            <div className="space-y-5">
            <div>
              <label htmlFor="birth-year" className="block text-sm font-medium text-stone-700 mb-1">
                Födelseår
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Används för riktålder, garantipension och tidigast uttag. Åldern beräknas automatiskt.
              </p>
              <InputWithUnit
                id="birth-year"
                type="number"
                min={1940}
                max={CURRENT_YEAR - 18}
                value={input.birthYear}
                onChange={(e) => {
                  const v = Math.min(CURRENT_YEAR - 18, Math.max(1940, parseInt(e.target.value, 10) || 1990))
                  setInput((prev) => {
                    const wasRiktalder = prev.pensionAge === getRiktalder(prev.birthYear)
                    const wasTidigast = prev.pensionAge === getTidigastUttag(prev.birthYear)
                    let newAge = prev.pensionAge
                    if (wasRiktalder) newAge = getRiktalder(v)
                    else if (wasTidigast) newAge = getTidigastUttag(v)
                    return { ...prev, birthYear: v, pensionAge: newAge }
                  })
                }}
                maxWidth="sm"
                focusRingColor="blue"
              />
              <p className="text-xs text-stone-500 mt-1">
                Riktålder för {input.birthYear} är {getRiktalder(input.birthYear)} år
              </p>
            </div>

            <div>
              <label htmlFor="pension-age" className="block text-sm font-medium text-stone-700 mb-1">
                Planerad pensionsålder
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Du kan ta ut pension tidigast 3 år före riktålder (t.ex. 62–64 år för de flesta).
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <button
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, pensionAge: getTidigastUttag(prev.birthYear) }))}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                    input.pensionAge === getTidigastUttag(input.birthYear)
                      ? 'border-stone-400 bg-stone-100 text-stone-900'
                      : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                  }`}
                >
                  Tidigast ({getTidigastUttag(input.birthYear)} år)
                </button>
                <button
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, pensionAge: 65 }))}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                    input.pensionAge === 65 ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                  }`}
                >
                  65 år
                </button>
                <button
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, pensionAge: getRiktalder(prev.birthYear) }))}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                    input.pensionAge === getRiktalder(input.birthYear)
                      ? 'border-stone-400 bg-stone-100 text-stone-900'
                      : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                  }`}
                >
                  Riktålder ({getRiktalder(input.birthYear)} år)
                </button>
                <button
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, pensionAge: 70 }))}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                    input.pensionAge === 70 ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                  }`}
                >
                  70 år
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="pension-age" className="text-sm text-stone-600 shrink-0">Eller ange:</label>
                <InputWithUnit
                  id="pension-age"
                  type="number"
                  min={61}
                  max={70}
                  value={input.pensionAge}
                  onChange={(e) => setInput((prev) => ({
                    ...prev,
                    pensionAge: Math.min(70, Math.max(61, parseInt(e.target.value, 10) || 67)),
                  }))}
                  unit="år"
                  maxWidth="sm"
                  focusRingColor="blue"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-stone-700 mb-1">
                Årslön (brutto, kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din pensionsgrundande lön – samma som på lönespecen. Beräkningen använder maxgränsen för allmän pension.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SALARY_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, annualSalary: p }))}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      input.annualSalary === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    {(p / 1000).toFixed(0)} k kr
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="salary"
                type="number"
                min={0}
                max={2000000}
                value={input.annualSalary || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, annualSalary: Math.min(2000000, Math.max(0, parseInt(e.target.value, 10) || 0)) }))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
              <p className="text-xs text-stone-500 mt-1">
                Pensionsgrundande inkomst max {PENSION.maxPensionsgrundande.toLocaleString('sv-SE')} kr/år ({YEAR})
              </p>
            </div>

            <div>
              <label htmlFor="years" className="block text-sm font-medium text-stone-700 mb-1">
                År kvar till pension
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hur många år du har kvar att arbeta. Påverkar hur mycket du hinner bygga upp i allmän pension och tjänstepension.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {YEARS_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, yearsToWork: p }))}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                      input.yearsToWork === p ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    {p} år
                  </button>
                ))}
              </div>
              <InputWithUnit
                id="years"
                type="number"
                min={1}
                max={50}
                value={input.yearsToWork || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, yearsToWork: Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)) }))}
                unit="år"
                maxWidth="sm"
                focusRingColor="blue"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="tjanste"
                type="checkbox"
                checked={input.hasTjanstepension}
                onChange={(e) => setInput((prev) => ({ ...prev, hasTjanstepension: e.target.checked }))}
                className="mt-0.5 w-5 h-5 rounded-lg border-stone-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <div>
                <label htmlFor="tjanste" className="text-sm font-medium text-stone-700">
                  Jag har tjänstepension (ITP/KPA/PA03)
                </label>
                <p className="text-xs text-stone-500 mt-1">
                  Finns i kollektivavtal – kolla din arbetsgivare eller Min pension.
                </p>
              </div>
            </div>
            </div>
          </div>

          {/* Privat sparande */}
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Privat sparande</h3>
            <div className="space-y-5">
            <div>
              <label htmlFor="private-monthly" className="block text-sm font-medium text-stone-700 mb-1">
                Privat månadssparande (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hur mycket du sparar till pension varje månad – t.ex. i ISK, kapitalförsäkring eller tjänstepensionssparande.
              </p>
              <InputWithUnit
                id="private-monthly"
                type="number"
                min={0}
                max={100000}
                value={input.privateMonthly || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, privateMonthly: Math.min(100000, Math.max(0, parseInt(e.target.value, 10) || 0)) }))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
            </div>

            <div>
              <label htmlFor="private-initial" className="block text-sm font-medium text-stone-700 mb-1">
                Redan sparat privat (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Pengar du redan har i ISK, kapitalförsäkring, privatpension eller liknande. Sätt 0 om du börjar från början.
              </p>
              <InputWithUnit
                id="private-initial"
                type="number"
                min={0}
                max={10000000}
                value={input.privateInitial || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, privateInitial: Math.min(10000000, Math.max(0, parseInt(e.target.value, 10) || 0)) }))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="blue"
              />
            </div>

            <div>
              <label htmlFor="private-rate" className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                Förväntad avkastning privat sparande (%)
                <InfoTooltip content="Indexfonder har historiskt gett cirka 5–7 % per år. Sparräntor ligger oftast 2–4 %. Inga garantier för framtiden." />
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Årlig avkastning (nominell). Typiskt 5–7 % för blandad fondportfölj.
              </p>
              <InputWithUnit
                id="private-rate"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={input.privateRate}
                onChange={(e) => setInput((prev) => ({ ...prev, privateRate: Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)) }))}
                unit="%"
                maxWidth="sm"
                focusRingColor="blue"
              />
            </div>
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">Pensionskalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Födelseår: {input.birthYear} · Pensionsålder: {input.pensionAge} år · Lön: {input.annualSalary?.toLocaleString('sv-SE')} kr
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Uppskattad månadspension</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Hero metric */}
          <div className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Uppskattad månadspension</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-800 tabular-nums">
              {result.total.toLocaleString('sv-SE')} kr/mån
            </p>
            <p className="text-xs text-stone-500 mt-1">Före skatt, vid {input.pensionAge} år</p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3">Uppdelning</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Inkomstpension', value: result.inkomstpension, color: '#2563eb' },
                { label: 'Premiepension', value: result.premiepension, color: '#0d9488' },
                ...(input.hasTjanstepension ? [{ label: 'Tjänstepension', value: result.tjanstepension, color: '#7c3aed' }] : []),
                { label: 'Privat sparande', value: result.privatSparande, color: '#10b981' },
                ...(result.garantipension > 0 ? [{ label: 'Garantipension', value: result.garantipension, color: '#f59e0b' }] : []),
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

          <div className="mt-6 no-print">
            <BreakdownBarChart
              data={[
                { name: 'Inkomstpension', value: result.inkomstpension, color: '#2563eb' },
                { name: 'Premiepension', value: result.premiepension, color: '#0d9488' },
                ...(input.hasTjanstepension ? [{ name: 'Tjänstepension', value: result.tjanstepension, color: '#7c3aed' } as const] : []),
                { name: 'Privat sparande', value: result.privatSparande, color: '#10b981' },
                ...(result.garantipension > 0 ? [{ name: 'Garantipension', value: result.garantipension, color: '#f59e0b' } as const] : []),
              ]}
              title="Uppdelning av pension (kr/mån)"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
            />
          </div>

          <p className="mt-4 text-xs text-stone-500">
            Beräkningen är förenklad. Officiell prognos finns på{' '}
            <a href={LINKS.Pensionsmyndigheten} target="_blank" rel="noopener" className="text-stone-600 hover:text-stone-900 hover:underline">
              Pensionsmyndigheten
            </a>.
          </p>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to="/rantapa-ranta" className="text-stone-600 hover:text-stone-900 hover:underline">Ränta-på-ränta</Link>
            <Link to="/lonekalkylator" className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="default" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="pension" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="blue" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildPensionShareUrl(input)}
        title="Dela pensionsberäkningen"
      />
    </div>
  )
}
