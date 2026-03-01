import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title?: string
}

export function ShareModal({ isOpen, onClose, url, title = 'Dela beräkningen' }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select()
    }
  }, [isOpen, url])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      inputRef.current?.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const duration = reducedMotion ? 0 : 0.25

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-lg shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="share-modal-title" className="text-lg font-semibold text-stone-800">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -m-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Stäng"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Kopiera länken för att dela din beräkning. Mottagaren ser samma siffror.
            </p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                readOnly
                value={url}
                className="flex-1 px-4 py-3 text-sm border border-stone-300 rounded-lg bg-stone-50 text-stone-700 font-mono"
                aria-label="Länk att kopiera"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <CheckIcon className="inline mr-2" />
                    Kopierad!
                  </>
                ) : (
                  'Kopiera'
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-500">
              Tryck Escape eller klicka utanför för att stänga
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
