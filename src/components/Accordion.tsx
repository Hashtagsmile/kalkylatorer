import { useState, useId } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface AccordionProps {
  /** Text eller innehåll som visas i klickbar rubrik */
  summary: ReactNode
  /** Innehåll som visas vid öppning */
  children: ReactNode
  /** Ytterligare klasser på wrapper-elementet */
  className?: string
  /** ID på wrapper (t.ex. för utskrift) */
  id?: string
  /** Om accordion ska vara öppen från start */
  defaultOpen?: boolean
  /** Variant för olika användningsfall */
  variant?: 'default' | 'compact' | 'faq' | 'select'
}

/**
 * Återanvändbar accordion med Motion-animering.
 * Tillgänglig med role="group" och aria-expanded.
 */
export function Accordion({
  summary,
  children,
  className = '',
  id,
  defaultOpen = false,
  variant = 'default',
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const reducedMotion = useReducedMotion()
  const contentId = useId()
  const triggerId = useId()

  const summaryClass =
    variant === 'faq'
      ? 'cursor-pointer py-3 text-stone-800 hover:text-[#1a4d2e] list-none flex items-start justify-between gap-3 w-full text-left'
      : variant === 'compact'
        ? 'text-xs text-stone-500 cursor-pointer hover:text-slate-700 w-full text-left'
        : variant === 'select'
          ? 'cursor-pointer list-none text-sm text-stone-700 flex items-center w-full text-left'
          : 'cursor-pointer list-none text-sm text-stone-500 hover:text-stone-700 w-full text-left'

  return (
    <div
      id={id}
      className={`group ${className}`}
      role="group"
      data-open={open ? 'true' : 'false'}
    >
      <button
        id={triggerId}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className={summaryClass}
      >
        {summary}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <div className="accordion-content-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
