import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Logo } from '../components/Logo'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-4 shrink-0 group">
            <Logo size="md" />
            <div>
              <span className="font-bold text-stone-800 text-xl tracking-tight font-display">
                {SITE.name}<span className="text-stone-600">.</span>
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16 sm:py-24 text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-slate-200 font-display">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-stone-800 mt-4">
          Sidan hittades inte
        </h2>
        <p className="text-stone-600 mt-2 max-w-md mx-auto">
          Den sidan du söker finns inte. Kontrollera adressen eller gå tillbaka till startsidan.
        </p>
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Till startsidan
          <span aria-hidden>→</span>
        </Link>
      </main>

      <Footer showCatalogLink={false} />
    </div>
  )
}
