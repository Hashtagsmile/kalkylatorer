import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface PieSlice {
  name: string
  value: number
  color: string
}

interface PieChartBreakdownProps {
  data: PieSlice[]
  title: string
  valueFormatter?: (v: number) => string
}

export function PieChartBreakdown({
  data,
  title,
  valueFormatter = (v) => `${v.toLocaleString('sv-SE')} kr`,
}: PieChartBreakdownProps) {
  const filtered = data.filter((d) => d.value > 0)
  if (filtered.length === 0) return null

  const total = filtered.reduce((s, d) => s + d.value, 0)
  const chartSummary = filtered.map((d) => `${d.name}: ${valueFormatter(d.value)}`).join(', ')

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label={chartSummary}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">{title}</figcaption>
      <div className="h-56 sm:h-64 print:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {filtered.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [valueFormatter(value), name]}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-stone-500 text-center">
        Totalt: {valueFormatter(total)}
      </p>
    </figure>
  )
}
