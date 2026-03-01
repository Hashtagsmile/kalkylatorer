import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { FeedbackForm } from '../components/FeedbackForm'
import { Footer } from '../components/Footer'
import { contact } from '../config'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'

export function OmSidan() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="om" />
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
          Om denna tjänst
        </h1>
        <p className="text-stone-600 mb-8">
          {SITE.name} erbjuder gratis kalkylatorer för sparande, pension, bolån, lön, CSN och inflation. Ingen registrering krävs – alla beräkningar sker lokalt i din webbläsare.
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Varför är tjänsten gratis?</h2>
            <p className="text-stone-600 leading-relaxed">
              Vi vill att alla ska kunna planera sin ekonomi utan hinder. Därför är alla kalkylatorer helt gratis att använda. Ingen registrering, ingen betalvägg – bara verktyg som fungerar.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Hur håller vi sidan vid liv?</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              För att kunna erbjuda denna tjänst gratis använder vi:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-600">
              <li><strong>Annonser (Google AdSense)</strong> – på kalkylatorsidorna visas annonser. De påverkar inte beräkningarna eller vad vi rekommenderar.</li>
              <li><strong>Affiliate-länkar</strong> – i vissa fall länkar vi till tjänster (t.ex. ISK, sparkonto). Om du klickar och tecknar kan vi få en liten ersättning. Priset för dig är detsamma.</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-3">
              Varje besök och klick hjälper oss att hålla sidan gratis. Du behöver inte köpa något.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Integritet</h2>
            <p className="text-stone-600 leading-relaxed">
              Vi sparar inga uppgifter. Alla siffror du anger stannar i din webbläsare. Läs mer i vår{' '}
              <a href="/privacy.html" className="text-stone-600 hover:text-stone-900 hover:underline font-medium">
                integritetspolicy
              </a>.
            </p>
          </div>

          <div id="kontakt">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Feedback & buggrapporter</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Hittar du ett fel eller har du förbättringsförslag? Vi uppskattar din feedback.
            </p>
            {contact.email ? (
              <FeedbackForm email={contact.email} />
            ) : contact.githubRepo ? (
              <a
                href={`https://github.com/${contact.githubRepo}/issues/new?title=${encodeURIComponent(`Feedback - ${SITE.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
              >
                Rapportera på GitHub
              </a>
            ) : (
              <p className="text-stone-500 text-sm">
                Feedbackfunktionen är inte aktiverad ännu. Sätt <code className="bg-stone-100 px-1 rounded-lg text-xs">VITE_CONTACT_EMAIL</code> eller <code className="bg-stone-100 px-1 rounded-lg text-xs">VITE_GITHUB_REPO</code> i .env för att aktivera – se .env.example.
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
