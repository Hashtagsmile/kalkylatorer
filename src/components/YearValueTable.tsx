interface YearValueTableProps {
  rows: { year: number; value: number }[]
  valueHeader?: string
  valueFormatter?: (v: number) => string
}

export function YearValueTable({
  rows,
  valueHeader = 'Värde',
  valueFormatter = (v) => `${v.toLocaleString('sv-SE')} kr`,
}: YearValueTableProps) {
  if (rows.length === 0) return null

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-sm font-medium text-stone-700 mb-2">År för år</h3>
      <table className="w-full text-sm" role="table" aria-label="Utveckling år för år">
        <thead>
          <tr className="border-b border-stone-200">
            <th scope="col" className="text-left py-2 text-stone-500 font-medium">År</th>
            <th scope="col" className="text-right py-2 text-stone-500 font-medium">{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year} className="border-b border-stone-100">
              <td className="py-2 text-stone-700">{row.year}</td>
              <td className="py-2 text-right font-medium tabular-nums">{valueFormatter(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
