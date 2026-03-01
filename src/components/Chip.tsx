/**
 * Återanvändbar chip-knapp – diskret, för scenarion och presets.
 * variant="scenario": aktiv = mörk bakgrund + vit text (för "Välj ett scenario").
 * variant="default": aktiv = ljus grå bakgrund (för presets som 1k, 2k, 5k).
 */

export type ChipAccent = 'amber' | 'teal' | 'indigo' | 'purple' | 'blue' | 'emerald'

const ACCENT_STYLES: Record<ChipAccent, { active: string; focus: string }> = {
  amber: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
  teal: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
  indigo: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
  purple: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
  blue: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
  emerald: { active: 'border-stone-400 bg-stone-100 text-stone-900', focus: 'focus:ring-stone-400' },
}

/** Scenario-chips: aktiv = mörk bakgrund, vit text */
const SCENARIO_ACTIVE = 'border-stone-800 bg-stone-800 text-white'

const INACTIVE_STYLE = 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700'

export interface ChipProps {
  children: React.ReactNode
  isActive?: boolean
  onClick: () => void
  title?: string
  ariaLabel?: string
  accentColor?: ChipAccent
  /** scenario = mörk bakgrund + vit text när aktiv (endast för scenario-chips) */
  variant?: 'default' | 'scenario'
  className?: string
}

export function Chip({
  children,
  isActive = false,
  onClick,
  title,
  ariaLabel,
  accentColor = 'amber',
  variant = 'default',
  className = '',
}: ChipProps) {
  const styles = ACCENT_STYLES[accentColor]
  const activeStyle = variant === 'scenario' ? SCENARIO_ACTIVE : styles.active

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-offset-1 ${
        isActive ? activeStyle : INACTIVE_STYLE
      } ${styles.focus} ${className}`}
    >
      {children}
    </button>
  )
}
