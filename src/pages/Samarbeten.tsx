import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { contact } from '../config'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'

export function Samarbeten() {
  const mailto = contact.partnershipEmail
    ? `mailto:${contact.partnershipEmail}?subject=${encodeURIComponent(`Affiliate-samarbete – ${SITE.name}`)}`
    : null

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="samarbeten" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12" tabIndex={-1}>
        <nav className="mb-6" aria-label="Sidnavigering">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
            Tillbaka till kalkylatorer
          </Link>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2 font-display">
          Samarbeten & affiliate
        </h1>
        <p className="text-stone-600 mb-8">
          {SITE.name} erbjuder gratis ekonomikalkylatorer inom sparande, bolån, pension, lön och skatter. Vi söker partners inom privat ekonomi som vill nå våra användare.
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Vad vi erbjuder</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              Vi har {SITE.name} – en samling kalkylatorer där användare aktivt söker hjälp med sin ekonomi. Det ger kontextuella möjligheter att länka till relevanta tjänster:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-600">
              <li><strong>Bolån</strong> – bolånekalkylator, kontantinsats, amortering</li>
              <li><strong>Sparande & investering</strong> – ränta-på-ränta, ISK, FIRE, pension</li>
              <li><strong>Lön & arbete</strong> – lönekalkylator, egenkostnad, semesterersättning</li>
              <li><strong>CSN, skatter, moms</strong> – studielån, RUT/ROT, procentberäkning</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Vad vi söker</h2>
            <p className="text-stone-600 leading-relaxed">
              Vi är intresserade av affiliate-samarbeten med aktörer inom sparande, bolån, försäkring, pensionssparande och liknande. Länkarna visas i relevant sammanhang – t.ex. när användaren räknat på bolån eller kontantinsats.
            </p>
          </div>

          <div id="kontakt">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Hör av dig</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Representerar du en tjänst eller aktör inom privat ekonomi? Skicka ett mejl till oss – vi återkommer om vi ser ett bra samarbete.
            </p>
            {mailto ? (
              <a
                href={mailto}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
              >
                Kontakta oss för samarbete
              </a>
            ) : (
              <p className="text-stone-500 text-sm">
                Kontakt för samarbeten är inte konfigurerad. Sätt <code className="bg-stone-100 px-1 rounded-lg text-xs">VITE_CONTACT_EMAIL</code> eller <code className="bg-stone-100 px-1 rounded-lg text-xs">VITE_PARTNERSHIP_EMAIL</code> i .env.
              </p>
            )}
          </div>

          <div className="pt-4">
            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
            >
              Till kalkylatorerna
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer accentColor="emerald" showCatalogLink={true} />
    </div>
  )
}

function ChevronLeft({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
