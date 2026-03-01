import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'

export interface BreakdownItem {
  name: string
  value: number
  color: string
}

interface BreakdownBarChartProps {
  data: BreakdownItem[]
  title: string
  valueFormatter?: (v: number) => string
}

export function BreakdownBarChart({
  data,
  title,
  valueFormatter = (v) => `${v.toLocaleString('sv-SE')} kr`,
}: BreakdownBarChartProps) {
  const filtered = data.filter((d) => d.value > 0)
  if (filtered.length === 0) return null

  const chartSummary = filtered.map((d) => `${d.name}: ${valueFormatter(d.value)}`).join(', ')

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label={chartSummary}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">{title}</figcaption>
      <div className="h-48 sm:h-64 print:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtered} layout="vertical" margin={{ left: 20, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" stroke="#64748b" width={120} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [valueFormatter(value), '']} contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {filtered.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
