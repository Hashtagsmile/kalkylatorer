import { PrintResultButton } from './PrintResultButton'
import { ShareIcon } from './ShareIcon'

interface ResultActionsProps {
  onShareClick: () => void
  shareLabel?: string
}

/** Dela + Skriv ut – minimalistisk stil (som ränta-på-ränta) */
export function ResultActions({ onShareClick, shareLabel = 'Dela beräkningen' }: ResultActionsProps) {
  return (
    <div className="flex items-center gap-2 no-print text-stone-500">
      <button
        type="button"
        onClick={onShareClick}
        className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors focus:outline-none focus:underline"
        aria-label={shareLabel}
      >
        <ShareIcon size={16} />
        Dela
      </button>
      <span aria-hidden>·</span>
      <PrintResultButton />
    </div>
  )
}
