/**
 * Central länk- och ruttkonfiguration
 *
 * Alla externa URLs och interna routes definieras här – single source of truth.
 * Vid trasiga länkar: uppdatera endast denna fil.
 *
 * UPPDATERING: Verifiera länkar årligen (jan–feb) tillsammans med config/yearly.ts
 * Se RESEARCH_SOURCES_VERIFICATION.md
 */

/** Externa URLs – myndigheter, tjänster, källor */
export const LINKS = {
  // Myndigheter
  SCB: 'https://www.scb.se/',
  Skatteverket: 'https://www.skatteverket.se/',
  SkatteverketSkatter: 'https://www.skatteverket.se/privat/skatter',
  SkatteverketISK:
    'https://www.skatteverket.se/privat/skatter/vardepapper/investeringssparkontoisk.4.5fc8c94513259a4ba1d800037851.html',
  Finansinspektionen: 'https://www.fi.se/',
  FIAmorteringskrav:
    'https://www.fi.se/sv/for-konsumenter/hushallens-lan/foreskrifter-om-amorteringskrav/',
  Riksbanken: 'https://www.riksbank.se/',
  RiksbankenInflation: 'https://www.riksbank.se/sv/penningpolitik/inflation/',
  CSN: 'https://www.csn.se/',
  CSNRanta:
    'https://www.csn.se/betala-tillbaka/betala-tillbaka-studielan/ranta-och-avgifter.html',
  CSNBetala:
    'https://www.csn.se/betala-tillbaka/betala-tillbaka-studielan.html',
  CSNLan:
    'https://www.csn.se/betala-tillbaka/betala-tillbaka-studielan/vara-olika-lan-for-studier.html',
  Pensionsmyndigheten: 'https://www.pensionsmyndigheten.se/',
  PensionsmyndighetenBeraknas:
    'https://www.pensionsmyndigheten.se/forsta-din-pension/om-pensionssystemet/sa-beraknas-din-pension-basbelopp-berakningsfaktorer-och-varderegler',
  PensionsmyndighetenRiktalder:
    'https://www.pensionsmyndigheten.se/ga-i-pension/planera-din-pension/pensionsaldrar-och-riktalder',

  // Övriga källor
  Ekonomifakta: 'https://www.ekonomifakta.se/',
  SparrantaNu: 'https://www.sparranta.nu/',
  RikaTillsammans: 'https://rikatillsammans.se/',
  UBSYearbook:
    'https://www.ubs.com/global/en/wealthmanagement/insights/2025/global-investment-returns-yearbook.html',
  Konsumentverket: 'https://www.konsumentverket.se/',
  KonsumentverketHushallskostnader:
    'https://publikationer.konsumentverket.se/privatekonomi/beraknade-hushallskostnader',
} as const

export type LinkId = keyof typeof LINKS

/** Interna routes – kalkylatorer och startsida */
export const ROUTES = {
  home: '/',
  om: '/om',
  samarbeten: '/samarbeten',
  rantapaRanta: '/rantapa-ranta',
  pensionskalkylator: '/pensionskalkylator',
  bolanekalkylator: '/bolanekalkylator',
  inflationskalkylator: '/inflationskalkylator',
  lonekalkylator: '/lonekalkylator',
  csnKalkylator: '/csn-kalkylator',
  procentraknare: '/procentraknare',
  momsraknare: '/momsraknare',
  semesterersattning: '/semesterersattning',
  fireKalkylator: '/fire-kalkylator',
  kalpKalkylator: '/kalp-kalkylator',
  egenkostnad: '/egenkostnad',
  timlon: '/timlon',
  iskSkatt: '/isk-skatt',
  skatteaterbaring: '/skatteaterbaring',
  kontantinsats: '/kontantinsats',
  loneutveckling: '/loneutveckling',
  rantabilitet: '/rantabilitet',
  aterbetalningstid: '/aterbetalningstid',
  bruttoFranNetto: '/brutto-fran-netto',
  effektivRanta: '/effektiv-ranta',
  cagr: '/cagr',
} as const

export type RouteId = keyof typeof ROUTES

/** Resolve URL – antingen extern länk eller intern route */
export function resolveUrl(
  target: { type: 'link'; id: LinkId } | { type: 'route'; id: RouteId }
): string {
  if (target.type === 'link') return LINKS[target.id]
  return ROUTES[target.id]
}
