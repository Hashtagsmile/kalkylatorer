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

interface FireChartProps {
  path: { year: number; capital: number }[]
  targetCapital: number
}

export function FireChart({ path, targetCapital }: FireChartProps) {
  const chartData = path.map((p) => ({
    år: p.year,
    Kapital: p.capital,
  }))

  const last = path[path.length - 1]
  const chartSummary = last
    ? `Kapitalutveckling från ${path[0]?.capital.toLocaleString('sv-SE')} kr till ${last.capital.toLocaleString('sv-SE')} kr över ${last.year} år. Målkapital ${targetCapital.toLocaleString('sv-SE')} kr.`
    : 'Graf som visar kapitalutveckling mot FIRE-mål.'

  return (
    <figure
      className="mt-6 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border no-print"
      role="img"
      aria-label={chartSummary}
    >
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">
        Kapitalutveckling mot mål
      </figcaption>
      <div className="h-64 sm:h-80 print:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="år" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString('sv-SE')} kr`, 'Kapital']}
              labelFormatter={(label) => `År ${label}`}
            />
            <ReferenceLine
              y={targetCapital}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="Kapital"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Grön linje = kapital. Streckad gul linje = målkapital ({targetCapital.toLocaleString('sv-SE')} kr).
      </p>
    </figure>
  )
}
