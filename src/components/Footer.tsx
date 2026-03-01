import { Link } from 'react-router-dom'
import { contact } from '../config'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'

const ACCENT = {
  emerald: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
  amber: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
  purple: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
  teal: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
  indigo: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
  blue: 'text-stone-600 hover:text-[#1a4d2e] hover:underline',
} as const

type AccentColor = keyof typeof ACCENT

interface FooterProps {
  /** Färg för länkar – matcha kalkylatorns tema */
  accentColor?: AccentColor
  /** Visa länk till katalog (Fler kalkylatorer). Sätt false på startsidan */
  showCatalogLink?: boolean
  /** Kortare text (t.ex. "Gratis verktyg.") eller längre */
  shortText?: boolean
}

export function Footer({
  accentColor = 'emerald',
  showCatalogLink = true,
  shortText = false,
}: FooterProps) {
  const linkClass = ACCENT[accentColor]
  const mailto = contact.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(`Feedback - ${SITE.name}`)}`
    : null

  return (
    <footer className="mt-auto border-t border-stone-200 bg-white no-print">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <p className="text-center text-sm text-stone-500">
          {shortText
            ? SITE.sloganShort
            : `${SITE.slogan}. Ingen registrering krävs.`}
        </p>
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm" aria-label="Sidfot">
          <a href="/privacy.html" className={linkClass}>
            Integritetspolicy
          </a>
          <Link to={ROUTES.om} className={linkClass}>
            Om tjänsten
          </Link>
          <Link to={ROUTES.samarbeten} className={linkClass}>
            Samarbeten
          </Link>
          {showCatalogLink && (
            <Link to="/" className={linkClass}>
              Fler kalkylatorer
            </Link>
          )}
          {mailto ? (
            <a href={mailto} className={linkClass}>
              Feedback & rapportera bugg
            </a>
          ) : (
            <Link to={`${ROUTES.om}#kontakt`} className={linkClass}>
              Feedback & rapportera bugg
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
