/**
 * Stapeldiagram: Ränta vs amortering per år – visar hur fördelningen skiftar över tid
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { BolanMonth } from '../lib/bolanCalculations'

function buildYearlyBreakdown(schedule: BolanMonth[]): { år: number; Ränta: number; Amortering: number }[] {
  const result: { år: number; Ränta: number; Amortering: number }[] = []
  let yearInterest = 0
  let yearAmort = 0

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i]
    yearInterest += row.interest
    yearAmort += row.amortization

    if ((i + 1) % 12 === 0) {
      result.push({
        år: (i + 1) / 12,
        Ränta: Math.round(yearInterest),
        Amortering: Math.round(yearAmort),
      })
      yearInterest = 0
      yearAmort = 0
    }
  }
  return result
}

/** Välj max 12 år för att hålla grafen läsbar */
function sampleYears(data: { år: number; Ränta: number; Amortering: number }[], maxBars = 10) {
  if (data.length <= maxBars) return data
  const step = (data.length - 1) / (maxBars - 1)
  const result: typeof data = []
  for (let i = 0; i < maxBars; i++) {
    const idx = i === maxBars - 1 ? data.length - 1 : Math.round(i * step)
    result.push(data[idx])
  }
  return result
}

interface BolanRantaAmortChartProps {
  schedule: BolanMonth[]
}

export function BolanRantaAmortChart({ schedule }: BolanRantaAmortChartProps) {
  const fullData = buildYearlyBreakdown(schedule)
  const sampled = sampleYears(fullData)
  const data = sampled.map((d) => ({
    år: `År ${d.år}`,
    Ränta: d.Ränta,
    Amortering: d.Amortering,
  }))

  if (data.length === 0) return null

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label="Ränta och amortering per år"
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">Ränta vs amortering per år</figcaption>
      <p className="text-sm text-stone-600 mb-4">
        I början betalar du mest ränta. Ju längre tid som går, desto mer av varje betalning går till amortering.
      </p>
      <div className="h-64 sm:h-80 print:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="år" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number, name: string) => [`${value.toLocaleString('sv-SE')} kr`, name]}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="Ränta" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Amortering" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
