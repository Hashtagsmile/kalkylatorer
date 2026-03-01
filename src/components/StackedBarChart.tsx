import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'

export interface StackedSegment {
  name: string
  value: number
  color: string
}

interface StackedBarChartProps {
  segments: StackedSegment[]
  title: string
  valueFormatter?: (v: number) => string
  /** Lighter styling when embedded inside another card */
  embedded?: boolean
}

export function StackedBarChart({
  segments,
  title,
  valueFormatter = (v) => `${v.toLocaleString('sv-SE')} kr`,
  embedded = false,
}: StackedBarChartProps) {
  const filtered = segments.filter((s) => s.value > 0)
  if (filtered.length === 0) return null

  const total = filtered.reduce((s, d) => s + d.value, 0)
  const chartData = [Object.fromEntries([['label', ''], ...filtered.map((s) => [s.name, s.value])])]

  return (
    <figure
      className={
        embedded
          ? 'p-4 sm:p-5 rounded-lg bg-stone-50/60 border border-stone-100'
          : 'mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border'
      }
      role="img"
      aria-label={`${title}: ${valueFormatter(total)}`}
    >
      <figcaption className="text-sm font-medium text-stone-600 mb-3">{title}</figcaption>
      <div className={embedded ? 'h-32 sm:h-36' : 'h-40 sm:h-48 print:h-[180px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="label" hide />
            <Tooltip
              formatter={(value: number, name: string) => [valueFormatter(value), name]}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Legend />
            {filtered.map((seg, i) => (
              <Bar key={seg.name} dataKey={seg.name} stackId="a" fill={seg.color} radius={i === filtered.length - 1 ? [0, 4, 4, 0] : 0}>
                <Cell fill={seg.color} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
