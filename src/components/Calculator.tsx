import { Accordion } from './Accordion'
import { InfoTooltip } from './InfoTooltip'
import { InputWithUnit } from './InputWithUnit'
import { SCENARIOS } from './ScenarioPresets'
import type { Scenario } from './ScenarioPresets'

export type TaxMode = 'ingen' | 'isk2025' | 'isk2026'
export type ChartType = 'enkel' | 'detaljerad' | 'arsandel' | 'ackumulerad' | 'slumpad'

const DEFAULT_SCENARIO = { initial: 10000, monthly: 2000, rate: 7, years: 10 }

interface CalculatorProps {
  initial: number
  monthly: number
  rate: number
  years: number
  taxMode?: TaxMode
  monthlyIncreasePercent?: number
  chartType?: ChartType
  onInitialChange: (v: number) => void
  onMonthlyChange: (v: number) => void
  onRateChange: (v: number) => void
  onYearsChange: (v: number) => void
  onTaxModeChange?: (v: TaxMode) => void
  onMonthlyIncreaseChange?: (v: number) => void
  onChartTypeChange?: (v: ChartType) => void
}

const MONTHLY_PRESETS = [1000, 2000, 3000, 5000, 10000]
const RATE_PRESETS = [3, 5, 7, 10]

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
  return value.toString()
}

function applyScenario(
  s: Scenario,
  onInitial: (v: number) => void,
  onMonthly: (v: number) => void,
  onRate: (v: number) => void,
  onYears: (v: number) => void
) {
  onInitial(s.initial)
  onMonthly(s.monthly)
  onRate(s.rate)
  onYears(s.years)
}

export function Calculator({
  initial,
  monthly,
  rate,
  years,
  taxMode = 'ingen',
  monthlyIncreasePercent = 0,
  chartType = 'detaljerad',
  onInitialChange,
  onMonthlyChange,
  onRateChange,
  onYearsChange,
  onTaxModeChange,
  onMonthlyIncreaseChange,
  onChartTypeChange,
}: CalculatorProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6">
      {/* Scenario-presets */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-stone-600 mb-2">Välj ett scenario</h3>
        <p className="text-xs text-stone-500 mb-1">
          Baserat på typiska svenska sparandemönster.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => {
            const isActive = initial === s.initial && monthly === s.monthly && rate === s.rate && years === s.years
            const handleClick = () => {
              if (isActive) {
                onInitialChange(DEFAULT_SCENARIO.initial)
                onMonthlyChange(DEFAULT_SCENARIO.monthly)
                onRateChange(DEFAULT_SCENARIO.rate)
                onYearsChange(DEFAULT_SCENARIO.years)
              } else {
                applyScenario(s, onInitialChange, onMonthlyChange, onRateChange, onYearsChange)
              }
            }
            return (
              <button
                key={s.id}
                type="button"
                onClick={handleClick}
                className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-stone-400 ${
                  isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                }`}
                title={s.description}
                aria-label={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.description}`}
              >
                {s.title}
              </button>
            )
          })}
        </div>
        <Accordion variant="compact" summary="Visa förklaring av scenarierna" className="mt-2">
          <ul className="mt-2 space-y-1.5 text-xs text-stone-600">
            {SCENARIOS.map((s) => (
              <li key={s.id}>
                <strong>{s.title}:</strong> {s.description}
              </li>
            ))}
          </ul>
        </Accordion>
      </div>

      <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina siffror</h2>

      <div className="space-y-5">
        {/* Startkapital */}
        <div>
          <label htmlFor="startkapital-slider" className="block text-sm font-medium text-stone-700 mb-2">
            Startkapital
          </label>
          <p className="text-xs text-stone-500 mb-1">
            Pengar du redan har sparat. Sätt 0 om du börjar från början.
          </p>
          <div className="flex gap-3 items-center">
            <input
              id="startkapital-slider"
              type="range"
              min={0}
              max={1000000}
              step={5000}
              value={Math.min(initial, 1000000)}
              onChange={(e) => onInitialChange(Number(e.target.value))}
              className="flex-1 min-h-[44px] touch-manipulation"
              aria-valuemin={0}
              aria-valuemax={1000000}
              aria-valuenow={initial}
              aria-valuetext={`${initial.toLocaleString('sv-SE')} kronor`}
            />
            <InputWithUnit
              id="startkapital-input"
              type="number"
              min={0}
              max={10000000}
              aria-label="Startkapital i kronor"
              value={initial || ''}
              onChange={(e) => onInitialChange(Math.min(10000000, Math.max(0, Number(e.target.value) || 0)))}
              unit="kr"
              formatThousands
              maxWidth="md"
              focusRingColor="emerald"
              className="min-h-[44px] shrink-0"
            />
          </div>
        </div>

        {/* Månadligt sparande */}
        <div>
          <label htmlFor="monthly-input" className="block text-sm font-medium text-stone-700 mb-2">
            Månadligt sparande
          </label>
          <p className="text-xs text-stone-500 mb-1">
            Hur mycket du planerar att sätta in varje månad på sparkontot eller fonden.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {MONTHLY_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onMonthlyChange(p)}
                className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                  monthly === p
                    ? 'border-stone-400 bg-stone-100 text-stone-900'
                    : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                }`}
              >
                {formatNumber(p)} kr
              </button>
            ))}
          </div>
          <InputWithUnit
            id="monthly-input"
            type="number"
            min={0}
            max={500000}
            value={monthly || ''}
            onChange={(e) => onMonthlyChange(Math.min(500000, Math.max(0, Number(e.target.value) || 0)))}
            unit="kr"
            formatThousands
            maxWidth="lg"
            focusRingColor="emerald"
            placeholder="Ange belopp"
            aria-label="Månadligt sparande i kronor"
            className="min-h-[48px] touch-manipulation"
          />
        </div>

        {/* Avkastning */}
        <div>
          <label htmlFor="avkastning-slider" className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-1">
            Förväntad avkastning (årlig)
            <InfoTooltip content="7 % är en ofta använd skattning av nominell avkastning (före inflation) för globala indexfonder. Sparräntor ligger oftast 2–4 %. Real avkastning (efter inflation) är lägre. Inga garantier för framtiden." />
          </label>
          <p className="text-xs text-stone-500 mb-2">
            Vilken årlig avkastning du räknar med (nominell). Indexfonder har historiskt gett cirka 7 % per år.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {RATE_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onRateChange(p)}
                className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                  rate === p
                    ? 'border-stone-400 bg-stone-100 text-stone-900'
                    : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                }`}
              >
                {p} %
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <input
              id="avkastning-slider"
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={rate}
              onChange={(e) => onRateChange(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
              className="flex-1 min-h-[44px] touch-manipulation"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={rate}
              aria-valuetext={`${rate} procent`}
            />
            <InputWithUnit
              id="avkastning-input"
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={rate}
              onChange={(e) => onRateChange(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
              unit="%"
              maxWidth="sm"
              focusRingColor="emerald"
              aria-label="Förväntad avkastning i procent"
              className="shrink-0"
            />
          </div>
        </div>

        {/* Antal år */}
        <div>
          <label htmlFor="sparhorisont-slider" className="block text-sm font-medium text-stone-700 mb-2">
            Sparhorisont
          </label>
          <p className="text-xs text-stone-500 mb-1">
            Hur många år du planerar att spara. Ju längre tid, desto större effekt av ränta-på-ränta.
          </p>
          <div className="flex gap-3 items-center">
            <input
              id="sparhorisont-slider"
              type="range"
              min={1}
              max={50}
              value={years}
              onChange={(e) => onYearsChange(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
              className="flex-1 min-h-[44px] touch-manipulation"
              aria-valuemin={1}
              aria-valuemax={50}
              aria-valuenow={years}
              aria-valuetext={`${years} år`}
            />
            <InputWithUnit
              id="sparhorisont-input"
              type="number"
              min={1}
              max={50}
              value={years}
              onChange={(e) => onYearsChange(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
              unit="år"
              maxWidth="sm"
              focusRingColor="emerald"
              aria-label="Sparhorisont i år"
              className="shrink-0"
            />
          </div>
        </div>

        {/* Överkurs – Skatt, ökning, diagram, börssimulering */}
        <Accordion
          summary={<span className="text-sm font-medium text-stone-700 hover:text-stone-900">Överkurs – skatt, ökande sparande, diagram</span>}
          className="mt-6 pt-6 border-t border-stone-200"
        >
          <div className="mt-4 space-y-5">
            {onTaxModeChange && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Skatt</label>
                <p className="text-xs text-stone-500 mb-2">
                  ISK-skatt beräknas årligen på genomsnittligt kapital. Gäller för investeringssparkonto (ISK) och kapitalförsäkring.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(['ingen', 'isk2025', 'isk2026'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onTaxModeChange(t)}
                      className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                        taxMode === t ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                      }`}
                    >
                      {t === 'ingen' || t === 'isk2025' ? (t === 'ingen' ? 'Ingen skatt' : 'ISK 2025') : 'ISK 2026'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {onMonthlyIncreaseChange && (
              <div>
                <label htmlFor="monthly-increase" className="block text-sm font-medium text-stone-700 mb-1">
                  Procentuell ökning av månadssparandet
                </label>
                <p className="text-xs text-stone-500 mb-2">
                  T.ex. 10 % på 1 000 kr/mån ger år 1: 1 000 kr, år 2: 1 100 kr, år 3: 1 210 kr.
                </p>
                <InputWithUnit
                  id="monthly-increase"
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  value={monthlyIncreasePercent}
                  onChange={(e) => onMonthlyIncreaseChange(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                  unit="%"
                  maxWidth="sm"
                  focusRingColor="emerald"
                />
              </div>
            )}
            {onChartTypeChange && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Välj diagram</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['enkel', 'detaljerad', 'arsandel', 'ackumulerad', 'slumpad'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChartTypeChange(c)}
                      className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                        chartType === c ? 'border-stone-400 bg-stone-100 text-stone-900' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
                      }`}
                    >
                      {c === 'enkel' ? 'Enkel' : c === 'detaljerad' ? 'Detaljerad' : c === 'arsandel' ? 'Årsandel' : c === 'ackumulerad' ? 'Ackumulerad' : 'Slumpad'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Accordion>
      </div>
    </div>
  )
}
