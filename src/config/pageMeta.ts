/**
 * Sid-specifika titlar och meta-beskrivningar för SEO
 * Används med react-helmet-async via PageMeta-komponenten
 */

import type { RouteId } from './links'
import { SITE } from './site'

export interface PageMetaConfig {
  title: string
  description: string
}

/** Fallback för sidor utan specifik config */
const DEFAULT_META: PageMetaConfig = {
  title: `${SITE.name} – Bolån, Pension, FIRE, Lön, CSN, Moms | Gratis verktyg`,
  description: 'Gratis kalkylatorer för sparande, pension, bolån och mer. Räkna direkt i webbläsaren – ingen registrering krävs.',
}

/** Meta per route – titel och beskrivning */
export const PAGE_META: Record<RouteId, PageMetaConfig> = {
  home: {
    title: `${SITE.name} – Bolån, Pension, FIRE, Lön, CSN, Moms | Gratis verktyg`,
    description: 'Gratis kalkylatorer för sparande, pension, bolån och mer. Räkna direkt i webbläsaren – ingen registrering krävs.',
  },
  om: {
    title: `Om ${SITE.name} – Gratis ekonomikalkylatorer`,
    description: `Läs mer om ${SITE.name}. Varför tjänsten är gratis, hur vi finansierar oss och vår integritetspolicy.`,
  },
  samarbeten: {
    title: `Samarbeten & affiliate – ${SITE.name}`,
    description: `Intresserad av affiliate-samarbete? ${SITE.name} söker partners inom sparande, bolån och privat ekonomi. Hör av dig.`,
  },
  rantapaRanta: {
    title: 'Ränta på ränta – Kalkylator | Kalkylatorer',
    description: 'Räkna hur dina pengar växer med sammansatt ränta. Ange startkapital, månadligt sparande och avkastning.',
  },
  pensionskalkylator: {
    title: 'Pensionskalkylator – Uppskatta din pension | Kalkylatorer',
    description: 'Beräkna din framtida pension – allmän pension, tjänstepension och privat sparande. Anpassat för Sverige.',
  },
  bolanekalkylator: {
    title: 'Bolånekalkylator – Månadskostnad och amortering | Kalkylatorer',
    description: 'Räkna månadskostnad, räntekostnad och total kostnad. Amorteringskrav enligt Finansinspektionen.',
  },
  inflationskalkylator: {
    title: 'Inflationskalkylator – Köpkraft över tid | Kalkylatorer',
    description: 'Se köpkraft över tid. Vad blir X kr om Y år? Riksbankens inflationsmål 2 %.',
  },
  lonekalkylator: {
    title: 'Lönekalkylator – Nettolön från brutto | Kalkylatorer',
    description: 'Räkna ut nettolön från brutto. Kommunalskatt, statlig skatt och jobbskatteavdrag.',
  },
  csnKalkylator: {
    title: 'CSN-kalkylator – Återbetalning studielån | Kalkylatorer',
    description: 'Beräkna månadskostnad och total räntekostnad för CSN-studielån.',
  },
  procentraknare: {
    title: 'Procenträknare – X% av Y | Kalkylatorer',
    description: 'X% av Y eller Y är X% av vad? Enkel procentberäkning.',
  },
  momsraknare: {
    title: 'Momsräknare – 25%, 12%, 6% | Kalkylatorer',
    description: 'Räkna moms inklusive eller exklusive. 25%, 12% och 6% momssatser.',
  },
  semesterersattning: {
    title: 'Semesterersättning – 12% av timlönen | Kalkylatorer',
    description: 'Räkna ut din semesterersättning. Lagstadgat minimum 12% av timlönen.',
  },
  fireKalkylator: {
    title: 'FIRE-kalkylator – 4%-regeln | Kalkylatorer',
    description: '4%-regeln, målkapital och år till ekonomiskt oberoende. FIRE-kalkylator för Sverige.',
  },
  kalpKalkylator: {
    title: 'KALP-kalkylator – Kvar att leva på | Kalkylatorer',
    description: 'Kvar att leva på – för bolånebeslut. Levnadskostnader enligt Konsumentverket.',
  },
  egenkostnad: {
    title: 'Egenkostnadskalkylator – Vad kostar du som anställd? | Kalkylatorer',
    description: 'Bruttolön, arbetsgivaravgifter, pension och semester. Vad kostar du som anställd?',
  },
  timlon: {
    title: 'Timlön och månadslön – Omvandla | Kalkylatorer',
    description: 'Räkna ut timlön från månadslön eller tvärtom. 173 timmar per månad.',
  },
  iskSkatt: {
    title: 'ISK-skatt – Schablonskatt kalkylator | Kalkylatorer',
    description: 'Räkna ut schablonskatten på investeringssparkonto. Skattefri grundnivå 150 000 kr.',
  },
  skatteaterbaring: {
    title: 'Skatteåterbäring – RUT-avdrag och utbetalning | Kalkylatorer',
    description: 'När betalas skatteåterbäringen? Räkna RUT-avdrag – 30% skattereduktion.',
  },
  kontantinsats: {
    title: 'Kontantinsatskalkylator – Hur mycket behöver du spara? | Kalkylatorer',
    description: 'Minst 15% av bostadspriset. Räkna hur mycket du behöver spara till kontantinsats.',
  },
  loneutveckling: {
    title: 'Löneutveckling – Lön om X år | Kalkylatorer',
    description: 'Vad blir din lön om X år vid Y% årlig ökning? Enkel löneförändringsprognos.',
  },
  rantabilitet: {
    title: 'Räntabilitet – Sparkonto vs amortering | Kalkylatorer',
    description: 'Sparkonto vs lån – när lönar det sig att amortera? Jämför ränta efter skatt.',
  },
  aterbetalningstid: {
    title: 'Återbetalningstid – Hur länge tar lånet? | Kalkylatorer',
    description: 'Hur lång tid tar det att betala tillbaka ett lån? Ange belopp, månadsbetalning och ränta.',
  },
  bruttoFranNetto: {
    title: 'Bruttolön från nettolön – Omvänd lönekalkylator | Kalkylatorer',
    description: 'Vilken bruttolön ger din önskade nettolön? Omvänd lönekalkylator.',
  },
  effektivRanta: {
    title: 'Effektiv ränta – Nominell vs verklig kostnad | Kalkylatorer',
    description: 'Jämför nominell ränta med verklig kostnad. Se hur avgifter höjer den effektiva räntan.',
  },
  cagr: {
    title: 'CAGR – Genomsnittlig årlig avkastning | Kalkylatorer',
    description: 'Beräkna den genomsnittliga årliga avkastningen från start- och slutvärde.',
  },
}

export function getPageMeta(routeId: RouteId): PageMetaConfig {
  return PAGE_META[routeId] ?? DEFAULT_META
}
