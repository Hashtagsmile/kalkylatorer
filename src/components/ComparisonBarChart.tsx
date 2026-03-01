import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ComparisonBarChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  valueSuffix?: string
}

export function ComparisonBarChart({ data, title, valueSuffix = '%' }: ComparisonBarChartProps) {
  const chartSummary = data.map((d) => `${d.name}: ${d.value}${valueSuffix}`).join(', ')

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label={chartSummary}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">{title}</figcaption>
      <div className="h-48 sm:h-56 print:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} />
            <YAxis type="category" dataKey="name" stroke="#64748b" width={120} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}${valueSuffix}`, '']}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
