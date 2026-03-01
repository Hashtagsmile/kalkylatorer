/**
 * Bolånekalkylator – grafer med skuld, ackumulerad ränta och ränta vs amortering
 */

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { BolanMonth } from '../lib/bolanCalculations'

export interface BolanChartData {
  year: number
  balance: number
  cumulativeInterest: number
  yearlyInterest: number
  yearlyAmortization: number
}

function buildYearlyData(schedule: BolanMonth[], initialLoan: number): BolanChartData[] {
  const result: BolanChartData[] = [{ year: 0, balance: initialLoan, cumulativeInterest: 0, yearlyInterest: 0, yearlyAmortization: 0 }]
  let cumInterest = 0
  let yearInterest = 0
  let yearAmort = 0

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i]
    yearInterest += row.interest
    yearAmort += row.amortization
    cumInterest += row.interest

    if ((i + 1) % 12 === 0) {
      const year = (i + 1) / 12
      result.push({
        year,
        balance: row.balance,
        cumulativeInterest: cumInterest,
        yearlyInterest: yearInterest,
        yearlyAmortization: yearAmort,
      })
      yearInterest = 0
      yearAmort = 0
    }
  }
  return result
}

interface BolanChartProps {
  schedule: BolanMonth[]
  initialLoan: number
  years: number
}

export function BolanChart({ schedule, initialLoan, years }: BolanChartProps) {
  const data = buildYearlyData(schedule, initialLoan)
  const chartData = data.map((d) => ({
    år: d.year,
    Skuld: d.balance,
    'Betald ränta': d.cumulativeInterest,
    Ränta: d.yearlyInterest,
    Amortering: d.yearlyAmortization,
  }))

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label={`Skuld och betald ränta över ${years} år`}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">Skuld och betald ränta över tid</figcaption>
      <div className="h-64 sm:h-80 print:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="år" stroke="#64748b" />
            <YAxis yAxisId="left" stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number, name: string) => [`${Math.round(value).toLocaleString('sv-SE')} kr`, name]}
              labelFormatter={(label) => `År ${label}`}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            <ReferenceLine yAxisId="left" y={0} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Skuld"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={false}
              name="Kvarvarande skuld"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Betald ränta"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Ackumulerad ränta"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Orange linje = kvarvarande skuld (vänster skala). Grå streckad = totalt betald ränta (höger skala).
      </p>
    </figure>
  )
}
