/**
 * Catalog-konfiguration – kalkylatorer som visas på startsidan
 * Datadriven: används för Catalog, sitemap och SEO-antal
 */

import { ROUTES } from './links'
import { isCalculatorEnabled } from './calculators'

export interface CatalogTool {
  slug: string
  title: string
  description: string
  href: string
}

export interface CatalogGroup {
  title: string
  tools: CatalogTool[]
}

export const CATALOG_GROUPS: CatalogGroup[] = [
  {
    title: 'Sparande & investering',
    tools: [
      { slug: 'rantapa-ranta', title: 'Ränta på ränta', description: 'Se hur dina pengar växer med sammansatt ränta. Ange startkapital, månadligt sparande och avkastning.', href: ROUTES.rantapaRanta },
      { slug: 'cagr', title: 'CAGR – genomsnittlig avkastning', description: 'Vad var den genomsnittliga årliga avkastningen? Beräkna från start- och slutvärde.', href: ROUTES.cagr },
      { slug: 'fire-kalkylator', title: 'FIRE-kalkylator', description: '4%-regeln, målkapital och år till ekonomiskt oberoende.', href: ROUTES.fireKalkylator },
      { slug: 'isk-skatt', title: 'ISK-skatt', description: 'Räkna ut schablonskatten på ditt investeringssparkonto. Skattefri grundnivå 150 000 kr.', href: ROUTES.iskSkatt },
      { slug: 'pensionskalkylator', title: 'Pensionskalkylator', description: 'Uppskatta din framtida pension – allmän pension, tjänstepension och privat sparande.', href: ROUTES.pensionskalkylator },
    ],
  },
  {
    title: 'Bostad & lån',
    tools: [
      { slug: 'bolanekalkylator', title: 'Bolånekalkylator', description: 'Räkna månadskostnad, räntekostnad och total kostnad. Amorteringskrav enligt FI.', href: ROUTES.bolanekalkylator },
      { slug: 'rantabilitet', title: 'Räntabilitet', description: 'Sparkonto vs lån – när lönar det sig att amortera? Jämför ränta efter skatt.', href: ROUTES.rantabilitet },
      { slug: 'effektiv-ranta', title: 'Effektiv ränta', description: 'Jämför nominell ränta med verklig kostnad. Se hur avgifter höjer den effektiva räntan.', href: ROUTES.effektivRanta },
      { slug: 'aterbetalningstid', title: 'Återbetalningstid', description: 'Hur lång tid tar det att betala tillbaka ett lån? Ange belopp, månadsbetalning och ränta.', href: ROUTES.aterbetalningstid },
      { slug: 'kontantinsats', title: 'Kontantinsatskalkylator', description: 'Hur mycket behöver du spara? Minst 15 % av bostadspriset.', href: ROUTES.kontantinsats },
      { slug: 'kalp-kalkylator', title: 'KALP-kalkylator', description: 'Kvar att leva på – för bolånebeslut. Levnadskostnader enligt Konsumentverket.', href: ROUTES.kalpKalkylator },
      { slug: 'csn-kalkylator', title: 'CSN-kalkylator', description: 'Återbetalning av studielån. Månadskostnad och total räntekostnad.', href: ROUTES.csnKalkylator },
    ],
  },
  {
    title: 'Lön & arbete',
    tools: [
      { slug: 'lonekalkylator', title: 'Lönekalkylator', description: 'Räkna ut nettolön från brutto. Kommunalskatt, statlig skatt, jobbskatteavdrag.', href: ROUTES.lonekalkylator },
      { slug: 'brutto-fran-netto', title: 'Bruttolön från nettolön', description: 'Omvänd lönekalkylator – vilken bruttolön ger din önskade nettolön?', href: ROUTES.bruttoFranNetto },
      { slug: 'loneutveckling', title: 'Löneutveckling', description: 'Vad blir din lön om X år vid Y % årlig ökning? Enkel prognos.', href: ROUTES.loneutveckling },
      { slug: 'egenkostnad', title: 'Egenkostnadskalkylator', description: 'Vad kostar du som anställd? Bruttolön + arbetsgivaravgifter + pension + semester.', href: ROUTES.egenkostnad },
      { slug: 'timlon', title: 'Timlön och månadslön', description: 'Räkna ut timlön från månadslön eller tvärtom. 173 timmar/månad.', href: ROUTES.timlon },
      { slug: 'semesterersattning', title: 'Semesterersättning', description: '12% av timlönen – lagstadgat minimum. Räkna ut din semesterersättning.', href: ROUTES.semesterersattning },
    ],
  },
  {
    title: 'Enkla verktyg',
    tools: [
      { slug: 'inflationskalkylator', title: 'Inflationskalkylator', description: 'Se köpkraft över tid. Vad blir X kr om Y år? Riksbankens mål 2%.', href: ROUTES.inflationskalkylator },
      { slug: 'procentraknare', title: 'Procenträknare', description: 'X% av Y eller Y är X% av vad? Enkel procentberäkning.', href: ROUTES.procentraknare },
      { slug: 'momsraknare', title: 'Momsräknare', description: 'Räkna moms inklusive eller exklusive. 25%, 12% och 6% momssatser.', href: ROUTES.momsraknare },
      { slug: 'skatteaterbaring', title: 'Skatteåterbäring', description: 'När betalas skatteåterbäringen ut? Räkna RUT-avdrag – 30% skattereduktion.', href: ROUTES.skatteaterbaring },
    ],
  },
]

/** Antal aktiverade kalkylatorer – används för Catalog och SEO (build-time) */
export function getCatalogCalculatorCount(): number {
  return CATALOG_GROUPS.reduce(
    (sum, group) => sum + group.tools.filter((t) => isCalculatorEnabled(t.href)).length,
    0
  )
}
