import { LINKS } from '../config/links'
import { LAST_UPDATED } from '../config/yearly'

const SOURCES = [
  { name: 'SCB – Statistiska centralbyrån', linkId: 'SCB' as const, description: 'Primärkälla för löner, arbetsmarknad och ekonomisk statistik' },
  { name: 'CSN – Studiemedel', linkId: 'CSN' as const, description: 'Myndighet. Belopp och villkor för studiebidrag' },
  { name: 'Ekonomifakta', linkId: 'Ekonomifakta' as const, description: 'Löner, ingångslöner (baserat på SCB, OECD)' },
  { name: 'Sparränta.nu', linkId: 'SparrantaNu' as const, description: 'Jämförelsesida för sparräntor' },
  { name: 'UBS Global Investment Returns Yearbook', linkId: 'UBSYearbook' as const, description: 'Historisk avkastning globala marknader (akademisk forskning)' },
  { name: 'Rika Tillsammans', linkId: 'RikaTillsammans' as const, description: 'Community och guider för indexfonder' },
]

export function SourcesSection() {
  return (
    <div id="kallor" className="mt-10 p-6 bg-stone-50 rounded-lg border border-stone-200 scroll-mt-24">
      <h2 className="text-lg font-semibold text-stone-800 mb-2">Källor</h2>
      <p className="text-sm text-stone-600 mb-4">
        Siffror och rekommendationer i denna kalkylator bygger på följande källor. Uppdaterad {LAST_UPDATED}.
      </p>
      <ul className="space-y-3">
        {SOURCES.map((source) => (
          <li key={source.name}>
            <a
              href={LINKS[source.linkId]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              {source.name}
            </a>
            <span className="text-stone-500 text-sm"> – {source.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
