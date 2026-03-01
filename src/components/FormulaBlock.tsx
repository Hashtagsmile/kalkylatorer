import type { ReactNode } from 'react'

interface FormulaBlockProps {
  /** Formelns matematiska uttryck */
  children: ReactNode
  /** Variabel/förkortning och förklaring (valfritt) */
  legend?: Array<{ symbol: string; meaning: string }>
  /** Ytterligare text under formeln (valfritt) */
  note?: ReactNode
  /** Ytterligare klasser */
  className?: string
}

/**
 * Visar matematiska formler i ett snyggt block.
 * Använder HTML/CSS för exponent, division och tydlig typografi.
 */
export function FormulaBlock({ children, legend, note, className = '' }: FormulaBlockProps) {
  return (
    <div
      className={`rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 ${className}`}
      role="group"
      aria-label="Formel"
    >
      <div className="font-[Georgia,'Times New Roman',serif] text-base text-stone-800 text-center tracking-wide">
        {children}
      </div>
      {legend && legend.length > 0 && (
        <p className="mt-3 text-xs text-stone-500 text-center">
          {legend.map(({ symbol, meaning }, i) => (
            <span key={symbol}>
              {i > 0 && ' · '}
              <em>{symbol}</em> = {meaning}
            </span>
          ))}
        </p>
      )}
      {note && (
        <p className="mt-2 text-xs text-stone-600">{note}</p>
      )}
    </div>
  )
}
