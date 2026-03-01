import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'

const QUICK_LINKS = [
  { label: 'Lön', href: ROUTES.lonekalkylator },
  { label: 'Bolån', href: ROUTES.bolanekalkylator },
  { label: 'Pension', href: ROUTES.pensionskalkylator },
  { label: 'Sparande', href: ROUTES.rantapaRanta },
] as const

export function GlobalNav() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Till startsidan">
          <Logo size="sm" />
          <span className="font-semibold text-stone-900 text-sm group-hover:text-[#1a4d2e] transition-colors">
            {SITE.name}
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Snabbnavigering">
          {QUICK_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === href
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-[#1a4d2e]'
              }`}
            >
              {label}
            </Link>
          ))}
          {!isHome && (
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-[#1a4d2e] transition-colors"
            >
              Översikt
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
