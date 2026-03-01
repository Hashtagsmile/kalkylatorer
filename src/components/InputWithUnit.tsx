/**
 * Input med enhet inuti – modern design med grå suffix
 * Enheten visas i en grå ruta som en förlängning av inputfältet.
 * formatThousands: visar tal med tusentalsavgränsare (t.ex. 500 000) för bättre läsbarhet.
 */

function formatWithSpaces(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '')) : value
  if (isNaN(num)) return typeof value === 'string' ? value : ''
  return num.toLocaleString('sv-SE', { maximumFractionDigits: 0 })
}

function parseFormattedNumber(str: string): number {
  const cleaned = str.replace(/\s/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

interface InputWithUnitProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Enhet (t.ex. kr, %, år). Om tom visas ingen suffix. */
  unit?: string
  /** Max bredd för input */
  maxWidth?: 'sm' | 'md' | 'lg'
  focusRingColor?: 'emerald' | 'amber' | 'purple' | 'teal' | 'indigo' | 'blue'
  /** Formatera tal med tusentalsavgränsare (500 000) för bättre läsbarhet */
  formatThousands?: boolean
  className?: string
}

const MAX_WIDTH = {
  sm: 'max-w-[8rem]',
  md: 'max-w-[12rem] sm:max-w-[14rem]',
  lg: 'max-w-full',
} as const

const FOCUS_RING = {
  emerald: 'focus-within:ring-emerald-500 focus-within:border-emerald-500',
  amber: 'focus-within:ring-amber-500 focus-within:border-amber-500',
  purple: 'focus-within:ring-purple-500 focus-within:border-purple-500',
  teal: 'focus-within:ring-teal-500 focus-within:border-teal-500',
  indigo: 'focus-within:ring-indigo-500 focus-within:border-indigo-500',
  blue: 'focus-within:ring-blue-500 focus-within:border-blue-500',
} as const

export function InputWithUnit({
  unit = '',
  maxWidth = 'md',
  focusRingColor = 'emerald',
  formatThousands = false,
  value,
  onChange,
  className,
  ...props
}: InputWithUnitProps) {
  const displayValue = formatThousands && value !== undefined && value !== '' && typeof value !== 'object'
    ? formatWithSpaces(value as string | number)
    : value

  const inputValue = displayValue === undefined || displayValue === null ? '' : String(displayValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formatThousands && onChange) {
      const parsed = parseFormattedNumber(e.target.value)
      onChange({ ...e, target: { ...e.target, value: String(parsed) } })
    } else {
      onChange?.(e)
    }
  }

  const { type: propsType, ...restProps } = props
  const inputType = formatThousands ? 'text' : (propsType ?? 'text')
  const inputMode = formatThousands ? 'decimal' : undefined

  return (
    <div
      className={`flex w-full ${MAX_WIDTH[maxWidth]} border border-stone-300 rounded-lg overflow-hidden focus-within:ring-2 ${FOCUS_RING[focusRingColor]} focus-within:ring-offset-0 ${className ?? ''}`}
    >
      <input
        {...restProps}
        type={inputType}
        inputMode={inputMode}
        value={inputValue}
        onChange={formatThousands ? handleChange : onChange}
        className="flex-1 min-w-0 px-4 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none"
      />
      {unit ? (
        <span className="bg-stone-100 px-3 py-3 text-sm font-medium text-stone-600 shrink-0 border-l border-stone-200">
          {unit}
        </span>
      ) : null}
    </div>
  )
}
