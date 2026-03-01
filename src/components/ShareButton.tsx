import { useState } from 'react'
import { buildShareUrl } from '../lib/urlParams'
import { ShareModal } from './ShareModal'
import { ShareIcon } from './ShareIcon'

interface ShareButtonProps {
  initial: number
  monthly: number
  rate: number
  years: number
  tax?: 'ingen' | 'isk2025' | 'isk2026'
  inc?: number
  chart?: string
}

const shareTitle = 'Min ränta-på-ränta-beräkning'
const shareText = 'Se hur mina pengar växer med ränta-på-ränta-effekten'

export function ShareButton({ initial, monthly, rate, years, tax, inc, chart }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const url = buildShareUrl({ initial, monthly, rate, years, tax, inc, chart: chart as 'enkel' | 'detaljerad' | 'arsandel' | 'ackumulerad' | 'slumpad' | undefined })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      }
    }

    setModalOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors focus:outline-none focus:underline"
        aria-label={copied ? 'Länk kopierad till urklipp' : 'Dela beräkningen'}
      >
        {copied ? (
          <>
            <CheckIcon />
            Länk kopierad!
          </>
        ) : (
          <>
            <ShareIcon size={16} />
            Dela
          </>
        )}
      </button>
      <ShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        url={url}
        title="Dela beräkningen"
      />
    </>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
