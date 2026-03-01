import { useState } from 'react'
import { InputWithUnit } from './InputWithUnit'
import { monthlyNeededForTarget } from '../lib/calculations'

interface TargetCalculatorProps {
  initial: number
  rate: number
  years: number
  onApplyMonthly: (m: number) => void
}

export function TargetCalculator({ initial, rate, years, onApplyMonthly }: TargetCalculatorProps) {
  const [target, setTarget] = useState(500000)
  const [expanded, setExpanded] = useState(false)

  const monthly = monthlyNeededForTarget(target, initial, rate, years)
  const isValid = monthly > 0 && monthly < 200000
  const targetReached = monthly <= 0

  return (
    <div className="mt-6 p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 rounded"
        aria-expanded={expanded}
        aria-controls="target-calculator-content"
      >
        <span className="font-semibold text-stone-800">
          Vill du nå ett specifikt mål?
        </span>
        <span className="text-stone-500 text-sm">
          {expanded ? 'Stäng' : 'Beräkna'}
        </span>
      </button>
      {expanded && (
        <div id="target-calculator-content" className="mt-5 space-y-5" role="region" aria-label="Beräkna månadligt sparande för målsättning">
          <p className="text-sm text-stone-600">
            Ange hur mycket du vill ha sparat efter {years} år. Vi räknar ut hur mycket du behöver sätta in varje månad med din nuvarande avkastning ({rate} %) och startkapital ({initial.toLocaleString('sv-SE')} kr).
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[12rem]">
              <label htmlFor="target-amount" className="block text-sm font-medium text-stone-700 mb-1">
                Målsättning efter {years} år
              </label>
              <InputWithUnit
                id="target-amount"
                type="number"
                min={0}
                max={100000000}
                value={target || ''}
                onChange={(e) => setTarget(Math.min(100000000, Math.max(0, Number(e.target.value) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="emerald"
                placeholder="t.ex. 500 000"
                aria-label="Målsättning i kronor"
                className="tabular-nums"
              />
            </div>
            {isValid && (
              <button
                type="button"
                onClick={() => onApplyMonthly(Math.round(monthly))}
                className="px-4 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 whitespace-nowrap"
                aria-label={`Använd ${Math.round(monthly).toLocaleString('sv-SE')} kronor som månadligt sparande i kalkylatorn`}
              >
                Använd {Math.round(monthly).toLocaleString('sv-SE')} kr/mån
              </button>
            )}
          </div>

          {targetReached && (
            <p className="text-sm text-stone-600 p-3 rounded-lg bg-stone-50 border border-stone-100">
              Med ditt startkapital och avkastning når du redan målet utan månadliga insättningar. Öka målet för att se hur mycket du behöver spara.
            </p>
          )}
          {!isValid && !targetReached && monthly >= 200000 && (
            <p className="text-sm text-stone-600 p-3 rounded-lg bg-stone-50 border border-stone-100">
              Målet kräver {Math.round(monthly).toLocaleString('sv-SE')} kr/mån – överväg att öka sparhorisonten eller sänka målet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
