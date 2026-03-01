/**
 * Logotyp för Kalkylatorer – K i varm neutral
 */

interface LogoProps {
  /** Storlek: sm (header på kalkylatorsidor), md (Catalog/Om) */
  size?: 'sm' | 'md'
  className?: string
}

const SIZE = {
  sm: 'w-8 h-8 rounded-lg text-sm',
  md: 'w-12 h-12 rounded-lg text-xl',
} as const

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center bg-[#1a4d2e] text-white font-bold shrink-0 ${SIZE[size]} ${className}`}
      aria-hidden
    >
      K
    </div>
  )
}
