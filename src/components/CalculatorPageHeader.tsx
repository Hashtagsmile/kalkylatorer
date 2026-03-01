interface CalculatorPageHeaderProps {
  title: string
  subtitle: string
  accentColor: 'emerald' | 'amber' | 'purple' | 'teal' | 'indigo' | 'blue'
  icon: React.ReactNode
  /** Valfri expander (t.ex. details/summary) under subtiteln */
  children?: React.ReactNode
}

const ACCENT = {
  emerald: { dot: 'text-stone-500', icon: 'bg-stone-700' },
  amber: { dot: 'text-stone-500', icon: 'bg-stone-700' },
  purple: { dot: 'text-stone-500', icon: 'bg-stone-700' },
  teal: { dot: 'text-stone-500', icon: 'bg-stone-700' },
  indigo: { dot: 'text-stone-500', icon: 'bg-stone-700' },
  blue: { dot: 'text-stone-500', icon: 'bg-stone-700' },
} as const

/**
 * Lätt, luftig header + hero. Ingen box, tydlig typografihierarki.
 */
export function CalculatorPageHeader({
  title,
  subtitle,
  accentColor,
  icon,
  children,
}: CalculatorPageHeaderProps) {
  const a = ACCENT[accentColor]

  return (
    <header className="no-print mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.icon} text-white [&>svg]:w-5 [&>svg]:h-5`}
          >
            {icon}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
            {title}
            <span className={a.dot}>.</span>
          </h1>
        </div>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl">
          {subtitle}
        </p>
        {children && <div className="pt-1">{children}</div>}
      </div>
    </header>
  )
}
