import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

export interface TimeSeriesPoint {
  year: number
  value: number
}

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[]
  title: string
  valueLabel?: string
  referenceLine?: number
  referenceLabel?: string
  accentColor?: 'purple' | 'teal' | 'amber' | 'blue' | 'emerald' | 'indigo'
}

const COLORS = {
  purple: '#7c3aed',
  teal: '#0d9488',
  amber: '#d97706',
  blue: '#2563eb',
  emerald: '#10b981',
  indigo: '#4f46e5',
}

export function TimeSeriesChart({
  data,
  title,
  valueLabel = 'Värde',
  referenceLine,
  referenceLabel,
  accentColor = 'emerald',
}: TimeSeriesChartProps) {
  const chartData = data.map((d) => ({
    år: d.year,
    [valueLabel]: d.value,
  }))

  const first = data[0]
  const last = data[data.length - 1]
  const chartSummary = first && last
    ? `Utveckling från ${first.value.toLocaleString('sv-SE')} kr till ${last.value.toLocaleString('sv-SE')} kr över ${last.year} år.`
    : title

  const stroke = COLORS[accentColor]

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border"
      role="img"
      aria-label={chartSummary}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">{title}</figcaption>
      <div className="h-64 sm:h-80 print:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="år" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString('sv-SE')} kr`, valueLabel]}
              labelFormatter={(label) => `År ${label}`}
            />
            {referenceLine != null && (
              <ReferenceLine
                y={referenceLine}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}
            <Line
              type="monotone"
              dataKey={valueLabel}
              stroke={stroke}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {referenceLine != null && referenceLabel && (
        <p className="mt-3 text-xs text-stone-500">
          Streckad linje = {referenceLabel} ({referenceLine.toLocaleString('sv-SE')} kr).
        </p>
      )}
    </figure>
  )
}
