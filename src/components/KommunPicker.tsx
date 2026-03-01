import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { InputWithUnit } from './InputWithUnit'
import { MUNICIPALITIES_SORTED, type Municipality } from '../data/municipalities'

interface KommunPickerProps {
  value: number
  selectedKommun: string | null
  onChange: (skatt: number, kommun: string | null) => void
  className?: string
}

const PRESET_CHIPS: (string | { name: string; label: string })[] = [
  'Genomsnitt',
  'Stockholm',
  'Göteborg',
  'Malmö',
  'Uppsala',
  { name: 'Österåker', label: 'Österåker (lägst)' },
  { name: 'Degerfors', label: 'Degerfors (högst)' },
]

export function KommunPicker({ value, selectedKommun, onChange, className = '' }: KommunPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const filtered = search.trim()
    ? MUNICIPALITIES_SORTED.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    : MUNICIPALITIES_SORTED

  const handleSelect = (m: Municipality) => {
    onChange(m.skatt, m.name)
    setSearch('')
    setOpen(false)
  }

  const handleChipClick = (name: string) => {
    const m = MUNICIPALITIES_SORTED.find((x) => x.name === name)
    if (m) {
      onChange(m.skatt, name)
    }
  }

  const handleManualChange = (v: number) => {
    onChange(v, null)
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className={className} ref={containerRef}>
      {/* Preset-chips – endast en markeras (den valda kommunen) */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {PRESET_CHIPS.map((item) => {
          const name = typeof item === 'string' ? item : item.name
          const label = typeof item === 'string' ? item : item.label
          const m = MUNICIPALITIES_SORTED.find((x) => x.name === name)
          if (!m) return null
          const isSelected = selectedKommun === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => handleChipClick(name)}
              className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
                isSelected
                  ? 'border-stone-400 bg-stone-100 text-stone-900'
                  : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-600'
              }`}
            >
              {label} {m.skatt}%
            </button>
          )
        })}
      </div>

      {/* Sök och välj kommun */}
      <div className="relative">
        <label htmlFor="kommun-search" className="sr-only">
          Sök kommun
        </label>
        <input
          id="kommun-search"
          type="text"
          placeholder="Sök kommun (t.ex. Lund, Växjö)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <AnimatePresence>
          {open && filtered.length > 0 && (
            <motion.ul
              className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-stone-200 rounded-lg shadow-lg"
              role="listbox"
              initial={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {filtered.slice(0, 50).map((m) => (
                <li key={m.name}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => handleSelect(m)}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-teal-50 ${
                      selectedKommun === m.name ? 'bg-teal-50 font-medium' : ''
                    }`}
                  >
                    {m.name} – {m.skatt}%
                  </button>
                </li>
              ))}
              {filtered.length > 50 && (
                <li className="px-4 py-2 text-xs text-stone-500">
                  Skriv mer för att filtrera ({filtered.length} kommuner)
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Manuell override */}
      <div className="mt-2 flex items-center gap-2">
        <label htmlFor="skatt-manual" className="text-sm text-stone-600 shrink-0">
          Eller ange skattesats:
        </label>
        <InputWithUnit
          id="skatt-manual"
          type="number"
          min={28}
          max={36}
          step={0.1}
          value={value}
          onChange={(e) => handleManualChange(Math.min(36, Math.max(28, parseFloat(e.target.value) || 32)))}
          unit="%"
          maxWidth="sm"
          focusRingColor="teal"
        />
      </div>
    </div>
  )
}
