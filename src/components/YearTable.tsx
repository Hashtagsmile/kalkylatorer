import type { YearData } from '../types'

interface YearTableProps {
  data: YearData[]
  years: number
  showTax?: boolean
}

export function YearTable({ data, years, showTax }: YearTableProps) {
  const displayData = data.filter((d) => d.year >= 0 && d.year <= years)

  if (displayData.length === 0) return null

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-sm font-medium text-stone-700 mb-2">År för år</h3>
      <table className="w-full text-sm" role="table" aria-label="Sparande år för år">
        <thead>
          <tr className="border-b border-stone-200">
            <th scope="col" className="text-left py-2 text-stone-500 font-medium">År</th>
            <th scope="col" className="text-right py-2 text-stone-500 font-medium">Total</th>
            <th scope="col" className="text-right py-2 text-stone-500 font-medium">Insättningar</th>
            <th scope="col" className="text-right py-2 text-stone-500 font-medium">Ränta</th>
            {showTax && <th scope="col" className="text-right py-2 text-stone-500 font-medium">Skatt</th>}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row) => (
            <tr key={row.year} className="border-b border-stone-100">
              <td className="py-2 text-stone-700">{row.year}</td>
              <td className="py-2 text-right font-medium tabular-nums">
                {row.total.toLocaleString('sv-SE')} kr
              </td>
              <td className="py-2 text-right text-stone-600 tabular-nums">
                {row.contributions.toLocaleString('sv-SE')} kr
              </td>
              <td className="py-2 text-right text-emerald-600 tabular-nums">
                +{row.interest.toLocaleString('sv-SE')} kr
              </td>
              {showTax && (
                <td className="py-2 text-right text-amber-600 tabular-nums">
                  {row.tax ? `−${row.tax.toLocaleString('sv-SE')} kr` : '–'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
