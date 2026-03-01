import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import type { YearData } from '../types'

export type ChartType = 'enkel' | 'detaljerad' | 'arsandel' | 'ackumulerad' | 'slumpad'

interface ChartProps {
  data: YearData[]
  chartType?: ChartType
  monteCarlo?: { median: number; p10: number; p90: number }
}

export function Chart({ data, chartType = 'detaljerad', monteCarlo }: ChartProps) {
  const chartData = data.map((d) => ({
    år: d.year,
    Total: d.total,
    Insättningar: d.contributions,
    Ränta: d.total - d.contributions,
  }))

  const first = data[0]
  const last = data[data.length - 1]
  const chartSummary = first && last
    ? `Kapitalutveckling från ${first.total.toLocaleString('sv-SE')} kr till ${last.total.toLocaleString('sv-SE')} kr över ${last.year} år.`
    : 'Graf som visar tillväxt över tid.'

  if (chartType === 'arsandel' && data.length > 1) {
    const barData = data.slice(1).map((d, i) => {
      const prev = data[i]
      return {
        år: d.year,
        Insättningar: d.contributions - (prev?.contributions ?? 0),
        Ränta: d.interest - (prev?.interest ?? 0),
      }
    })
    return (
      <figure className="mt-8 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border" role="img" aria-label={chartSummary}>
        <figcaption className="text-lg font-semibold text-stone-800 mb-4">Årsandel – insättningar vs ränta per år</figcaption>
        <div className="h-64 sm:h-80 print:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="år" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('sv-SE')} kr`, '']} labelFormatter={(l) => `År ${l}`} />
              <Legend />
              <Bar dataKey="Insättningar" stackId="a" fill="#94a3b8" />
              <Bar dataKey="Ränta" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    )
  }

  if (chartType === 'slumpad' && monteCarlo) {
    return (
      <figure className="mt-8 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border" role="img" aria-label={chartSummary}>
        <figcaption className="text-lg font-semibold text-stone-800 mb-4">Slumpad som börsen (Monte Carlo)</figcaption>
        <p className="text-sm text-stone-600 mb-4">
          Stockholmsbörsen (SIXRX) 1870–2024: 8,4 % årsmedel ±21,4 %. 500 simuleringar. Med 90 % sannolikhet hamnar du mellan 10 och 90 percentilen.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-500">Median</p>
            <p className="text-lg font-bold text-emerald-600 tabular-nums">{Math.round(monteCarlo.median).toLocaleString('sv-SE')} kr</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-500">10 % (sämre)</p>
            <p className="text-base font-semibold text-stone-700 tabular-nums">{Math.round(monteCarlo.p10).toLocaleString('sv-SE')} kr</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-500">90 % (bättre)</p>
            <p className="text-base font-semibold text-stone-700 tabular-nums">{Math.round(monteCarlo.p90).toLocaleString('sv-SE')} kr</p>
          </div>
        </div>
        <div className="h-48 sm:h-64 print:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="år" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString('sv-SE')} kr`, 'Total']} labelFormatter={(l) => `År ${l}`} />
              <Line type="monotone" dataKey="Total" stroke="#10b981" strokeWidth={2} dot={false} name="Deterministisk" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-stone-500">Grön linje = fast ränta. Monte Carlo-resultat ovan.</p>
      </figure>
    )
  }

  const showContributions = chartType === 'detaljerad' || chartType === 'ackumulerad'

  return (
    <figure className="mt-8 p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border" role="img" aria-label={chartSummary}>
      <figcaption className="text-lg font-semibold text-stone-800 mb-4">
        {chartType === 'ackumulerad' ? 'Ackumulerad tillväxt' : 'Tillväxt över tid'}
      </figcaption>
      <div className="h-64 sm:h-80 print:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'ackumulerad' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="år" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString('sv-SE')} kr`, n]} labelFormatter={(l) => `År ${l}`} />
              <Legend />
              <Area type="monotone" dataKey="Insättningar" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Ränta" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="år" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString('sv-SE')} kr`, n]} labelFormatter={(l) => `År ${l}`} />
              <Legend />
              <Line type="monotone" dataKey="Total" stroke="#10b981" strokeWidth={2} dot={false} />
              {showContributions && (
                <Line type="monotone" dataKey="Insättningar" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
