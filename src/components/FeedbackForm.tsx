/**
 * Feedback-formulär via FormSubmit.co – kräver ingen backend.
 * Sätt VITE_CONTACT_EMAIL i .env för att aktivera.
 */

import { useState } from 'react'
import { SITE } from '../config/site'

interface FeedbackFormProps {
  email: string
}

const FEEDBACK_TYPES = [
  { value: 'bugg', label: 'Buggrapport' },
  { value: 'förbättring', label: 'Förbättringsförslag' },
  { value: 'övrigt', label: 'Övrigt' },
] as const

export function FeedbackForm({ email }: FeedbackFormProps) {
  const [typ, setTyp] = useState<string>('bugg')
  const [meddelande, setMeddelande] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meddelande.trim()) return

    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[${SITE.name}] ${FEEDBACK_TYPES.find((t) => t.value === typ)?.label ?? typ}: ${meddelande.slice(0, 50)}${meddelande.length > 50 ? '…' : ''}`,
          typ: FEEDBACK_TYPES.find((t) => t.value === typ)?.label ?? typ,
          meddelande: meddelande.trim(),
        }),
      })

      if (res.ok) {
        setStatus('success')
        setMeddelande('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="feedback-typ" className="block text-sm font-medium text-stone-700 mb-1">
          Typ av feedback
        </label>
        <select
          id="feedback-typ"
          value={typ}
          onChange={(e) => setTyp(e.target.value)}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-stone-800"
        >
          {FEEDBACK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="feedback-meddelande" className="block text-sm font-medium text-stone-700 mb-1">
          Meddelande <span className="text-slate-400">*</span>
        </label>
        <textarea
          id="feedback-meddelande"
          value={meddelande}
          onChange={(e) => setMeddelande(e.target.value)}
          placeholder="Beskriv felet eller ditt förslag..."
          rows={4}
          required
          disabled={status === 'sending'}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 disabled:opacity-60 text-stone-800"
        />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="submit"
          disabled={status === 'sending' || !meddelande.trim()}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
        >
          {status === 'sending' ? 'Skickar...' : 'Skicka feedback'}
        </button>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Feedback - ${SITE.name}`)}`}
          className="text-sm text-stone-500 hover:text-emerald-600 transition-colors"
        >
          Eller skicka e-post direkt
        </a>
      </div>
      {status === 'success' && (
        <p className="text-sm text-emerald-600 font-medium">
          Tack! Din feedback har skickats. Vi återkommer om vi har frågor.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-amber-600">
          Något gick fel. Prova att skicka via{' '}
          <a href={`mailto:${email}?subject=${encodeURIComponent(`Feedback - ${SITE.name}`)}`} className="underline">
            e-post
          </a>{' '}
          istället.
        </p>
      )}
    </form>
  )
}
