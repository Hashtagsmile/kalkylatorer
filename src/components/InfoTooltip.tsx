import { useState, useId } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const duration = reducedMotion ? 0 : 0.15

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        id={`tooltip-trigger-${id}`}
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-stone-600 text-xs font-medium"
        aria-label="Mer information"
        aria-expanded={open}
        aria-controls={open ? `tooltip-content-${id}` : undefined}
        aria-describedby={open ? `tooltip-content-${id}` : undefined}
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={`tooltip-content-${id}`}
            role="tooltip"
            className="absolute left-0 top-full mt-1 z-20 w-64 sm:w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg"
            initial={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
