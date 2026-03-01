/**
 * Fakta, ordlista, FAQ, källor och läs mer per kalkylator
 * [1], [2] i facts = fotnoter som länkar till källor
 * Årliga siffror: config/yearly.ts
 * Länkar och routes: config/links.ts (single source of truth)
 */

import { CSN, TAX, UI_REFERENCE, YEAR } from '../config/yearly'
import type { LinkId, RouteId } from '../config/links'

export type CalculatorId = 'rantapa-ranta' | 'bolan' | 'inflation' | 'lon' | 'csn' | 'pension' | 'procent' | 'moms' | 'semester' | 'fire' | 'kalp' | 'egenkostnad' | 'timlon' | 'isk' | 'skatteaterbaring' | 'kontantinsats' | 'loneutveckling' | 'rantabilitet' | 'aterbetalningstid' | 'bruttoFranNetto' | 'effektivRanta' | 'cagr'

export interface FactBlock {
  title: string
  content: string
}

export interface GlossaryItem {
  term: string
  definition: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface SourceItem {
  name: string
  linkId: LinkId
  description: string
}

export interface ReadMoreItem {
  label: string
  /** Extern länk – använd linkId */
  linkId?: LinkId
  /** Intern route – använd routeId */
  routeId?: RouteId
}

export interface CalculatorInfo {
  facts?: FactBlock[]
  glossary?: GlossaryItem[]
  faqs: FaqItem[]
  sources: SourceItem[]
  readMore: ReadMoreItem[]
}

export const calculatorInfo: Record<CalculatorId, CalculatorInfo> = {
  'rantapa-ranta': {
    facts: [
      {
        title: 'Vad är ränta på ränta?',
        content:
          'Ränta på ränta (sammansatt ränta eller compound interest) innebär att du får avkastning inte bara på ditt ursprungliga kapital, utan även på den ränta som ackumulerats tidigare. Effekten blir exponentiell – ju längre tid du sparar, desto kraftigare växer dina pengar.',
      },
      {
        title: 'Så fungerar effekten',
        content:
          'Om du sätter in 10 000 kr med 7 % årlig avkastning har du efter ett år 10 700 kr. Året därpå får du ränta på hela 10 700 kr, inte bara de ursprungliga 10 000 kr. Efter 10 år med månatliga insättningar kan skillnaden mellan "vanlig" ränta och ränta-på-ränta bli enorm.',
      },
      {
        title: 'Varför tid är viktigare än belopp',
        content:
          'Den största faktorn för att bygga kapital är inte hur mycket du sparar varje månad – det är hur länge du sparar. En person som börjar spara vid 25 års ålder har ofta betydligt mer vid pension än någon som börjar vid 45, även om den senare sparar mer per månad.',
      },
      {
        title: 'Tips för bättre sparande',
        content:
          'Börja med det du kan – även 500 kr i månaden gör skillnad över tid. Förvänta dig 5–7 % nominell årlig avkastning på breda indexfonder (historisk genomsnitt, inga garantier) [1]. Undvik att sälja vid nedgångar – tiden i marknaden slår timing. Använd ISK eller kapitalförsäkring för skatteeffektivt sparande i Sverige [2].',
      },
    ],
    glossary: [
      { term: 'Sammansatt ränta', definition: 'Samma som ränta på ränta – avkastning på både kapital och tidigare ränta.' },
      { term: 'Nominell avkastning', definition: 'Avkastning före inflation. 7 % nominell minus 2 % inflation ≈ 5 % real avkastning.' },
      { term: 'ISK', definition: 'Investeringssparkonto – skatt på schablonintäkt istället för vinstskatt.' },
      { term: 'Indexfond', definition: 'Fond som följer ett index (t.ex. OMX Stockholm) – ofta låg avgift.' },
    ],
    faqs: [
      {
        question: 'Vilken avkastning kan jag förvänta mig?',
        answer:
          'Historisk genomsnittlig avkastning på breda indexfonder ligger runt 5–7 % per år (nominell). Det finns inga garantier – avkastning varierar mellan år. Källa: UBS Global Investment Returns Yearbook [1].',
      },
      {
        question: 'Varför är tid viktigare än belopp?',
        answer:
          'Den största faktorn för att bygga kapital är hur länge du sparar, inte hur mycket per månad. Att börja vid 25 ger ofta mer vid pension än att börja vid 45 med högre månadssparande.',
      },
      {
        question: 'Hur använder jag kalkylatorn?',
        answer:
          'Ange startkapital, månadligt sparande, förväntad avkastning och sparhorisont. Kalkylatorn visar hur dina pengar kan växa. Testa olika scenarier: studerande, första jobbet, bostadssparande eller pension.',
      },
    ],
    sources: [
      { name: 'UBS Global Investment Returns Yearbook', linkId: 'UBSYearbook', description: 'Historisk avkastning globala marknader' },
      { name: 'Skatteverket – ISK', linkId: 'SkatteverketISK', description: 'Skatteeffektivt sparande' },
      { name: 'SCB', linkId: 'SCB', description: 'Statistik och ekonomisk data' },
      { name: 'Sparränta.nu', linkId: 'SparrantaNu', description: 'Jämförelse sparräntor' },
      { name: 'Rika Tillsammans', linkId: 'RikaTillsammans', description: 'Guider för indexfonder' },
    ],
    readMore: [
      { label: 'Pensionskalkylator', routeId: 'pensionskalkylator' },
      { label: 'Inflationskalkylator', routeId: 'inflationskalkylator' },
    ],
  },
  bolan: {
    facts: [
      {
        title: 'Hur fungerar ett bolån?',
        content:
          'Månadskostnaden består av ränta och amortering. Räntan betalas på hela lånebeloppet varje månad. Amorteringen minskar skulden över tid. Totalkostnaden blir ränta + amortering över hela lånetiden.',
      },
      {
        title: 'Amorteringskrav',
        content:
          'Finansinspektionen kräver amortering beroende på belåningsgrad: under 50 % ingen, 50–70 % minst 1 % per år, över 70 % minst 2 % per år [1]. Bolånet räknas som annuitetslån – samma månadskostnad varje månad (vid oförändrad ränta).',
      },
    ],
    glossary: [
      { term: 'Annuitetslån', definition: 'Lån med lika stora månadsbetalningar. Andelen ränta minskar över tid, amorteringen ökar.' },
      { term: 'Belåningsgrad', definition: 'Lånebelopp i procent av bostadens värde. 85 % = 15 % kontantinsats.' },
      { term: 'Amortering', definition: 'Avbetalning av själva lånet (skulden), inte räntan.' },
    ],
    faqs: [
      {
        question: 'Vad är amorteringskravet?',
        answer:
          'Finansinspektionen kräver amortering beroende på belåningsgrad: under 50 % ingen, 50–70 % minst 1 % per år, över 70 % minst 2 % per år. Källa: Finansinspektionen.',
      },
      {
        question: 'Vad kostar ett bolån i praktiken?',
        answer:
          'Månadskostnaden består av ränta och amortering. Räntan betalas på hela lånebeloppet varje månad. Amorteringen minskar skulden över tid. Totalkostnaden blir ränta + amortering över hela lånetiden.',
      },
      {
        question: `Vilken ränta gäller ${YEAR}?`,
        answer:
          `Rörlig bolåneränta ligger typiskt runt ${UI_REFERENCE.bolanRantaMin}–${UI_REFERENCE.bolanRantaMax} % (SCB, Finansinspektionen). Räntan varierar mellan banker och beroende på belåningsgrad.`,
      },
    ],
    sources: [
      { name: 'Finansinspektionen', linkId: 'Finansinspektionen', description: 'Amorteringskrav och bolåneregler' },
      { name: 'SCB', linkId: 'SCB', description: 'Bolåneräntor och statistik' },
    ],
    readMore: [
      { label: 'FI – Amorteringskrav', linkId: 'FIAmorteringskrav' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  inflation: {
    facts: [
      {
        title: 'Vad är inflation?',
        content:
          'Inflation är den allmänna prisökningen över tid. När inflationen är 2 % per år minskar köpkraften – 100 kr idag motsvarar ungefär 98 kr nästa år i köpkraft. Riksbankens mål är 2 % (KPIF) [1].',
      },
      {
        title: 'Varför räkna på köpkraft?',
        content:
          'Framåt: vad blir X kr om Y år? Bakåt: vad motsvarar ett belopp från förr i dagens penningvärde? Användbart för att jämföra löner, priser och sparande över tid.',
      },
    ],
    glossary: [
      { term: 'KPIF', definition: 'Konsumentprisindex med fast ränta – Riksbankens inflationsmål (2 %).' },
      { term: 'Köpkraft', definition: 'Vad pengar kan köpa. Vid inflation minskar köpkraften över tid.' },
      { term: 'Nominellt vs real', definition: 'Nominellt = i kronor. Real = justerat för inflation (köpkraft).' },
    ],
    faqs: [
      {
        question: 'Vad är inflation?',
        answer:
          'Inflation är den allmänna prisökningen över tid. När inflationen är 2 % per år minskar köpkraften – 100 kr idag motsvarar ungefär 98 kr nästa år i köpkraft.',
      },
      {
        question: 'Vilken inflationsnivå används?',
        answer:
          `Riksbankens inflationsmål är 2 % (KPIF). ${YEAR} förväntas inflationen ligga runt ${UI_REFERENCE.inflationForvantadMin}–${UI_REFERENCE.inflationForvantadMax} %. Du kan ändra procentsatsen i kalkylatorn för att testa olika scenarier.`,
      },
      {
        question: 'Varför räkna bakåt i tid?',
        answer:
          'För att se vad ett belopp från förr motsvarar idag. T.ex. "100 000 kr 1990 – vad är det i dagens penningvärde?" hjälper dig jämföra löner, priser och sparande över tid.',
      },
    ],
    sources: [
      { name: 'Riksbanken', linkId: 'Riksbanken', description: 'Inflationsmål och KPIF' },
      { name: 'SCB', linkId: 'SCB', description: 'Konsumentprisindex' },
    ],
    readMore: [
      { label: 'Riksbanken – Inflation', linkId: 'RiksbankenInflation' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  lon: {
    facts: [
      {
        title: 'Hur räknas nettolön ut?',
        content:
          'Bruttolön minus skatt plus avdrag. Skatten består av kommunal skatt (varierar 28–35 %), statlig skatt (20 % över brytpunkten) och jobbskatteavdrag. Grundavdrag minskar den skattbara inkomsten [1].',
      },
      {
        title: 'Varför skiljer skatten?',
        content:
          'Kommunalskatten varierar mellan kommuner. Stockholm har lägre skatt (ca 30,5 %) än många andra. Österåker har lägst, Degerfors högst. Från 66 års ålder höjs brytpunkten för statlig skatt.',
      },
    ],
    glossary: [
      { term: 'Brutto', definition: 'Lön före skatt. Nettolön = brutto minus skatt plus avdrag.' },
      { term: 'Kommunalskatt', definition: 'Skatt till kommun och region. Varierar mellan 28–35 % beroende på var du bor.' },
      { term: 'Jobbskatteavdrag', definition: `Avdrag som minskar skatten. Max ca ${UI_REFERENCE.jobbskatteavdragMaxManad} kr/mån ${YEAR}, avtrappas vid högre inkomster.` },
    ],
    faqs: [
      {
        question: 'Varför skiljer skatten mellan kommuner?',
        answer:
          'Kommunalskatten varierar mellan 29–35 % beroende på kommun. Stockholm har lägre skatt (ca 30,5 %) än många andra. Österåker har lägst, Degerfors högst.',
      },
      {
        question: 'När betalar jag statlig skatt?',
        answer:
          `Statlig skatt (20 %) betalas på inkomst över ${TAX.brytpunktStatligUnder66.toLocaleString('sv-SE')} kr/år (${YEAR}) om du är under 66. Från 66 års ålder höjs brytpunkten till ${TAX.brytpunktStatligOver66.toLocaleString('sv-SE')} kr.`,
      },
      {
        question: 'Vad är jobbskatteavdrag?',
        answer:
          `Jobbskatteavdraget minskar den skatt du betalar. ${YEAR} kan du få upp till ca ${UI_REFERENCE.jobbskatteavdragMaxManad} kr/månad i avdrag. Avdraget avtrappas vid högre inkomster.`,
      },
    ],
    sources: [
      { name: 'Skatteverket', linkId: 'Skatteverket', description: 'Officiella skattesatser och beräkningar' },
      { name: 'SCB', linkId: 'SCB', description: 'Löner och arbetsmarknad' },
      { name: 'Ekonomifakta', linkId: 'Ekonomifakta', description: 'Löner och ingångslöner' },
    ],
    readMore: [
      { label: 'Skatteverket – Beräkna skatt', linkId: 'SkatteverketSkatter' },
      { label: 'Pensionskalkylator', routeId: 'pensionskalkylator' },
      { label: 'CSN-kalkylator', routeId: 'csnKalkylator' },
    ],
  },
  csn: {
    facts: [
      {
        title: 'Samma ränta för alla',
        content:
          `Räntan är samma på alla studielån utbetalda från 1989. ${YEAR}: ${(CSN.ranta2025 * 100).toFixed(2)} %, ${YEAR + 1}: ${(CSN.ranta2026 * 100).toFixed(2)} %. Det finns ingen skillnad mellan nyare och äldre lån [1].`,
      },
      {
        title: 'Vilka lån gäller kalkylatorn?',
        content:
          'Kalkylatorn gäller annuitetslån (utbetalda från 2001). Lån från 1989–2001 betalar 4 % av inkomst istället. Lån före 1989 använder regleringstal [2].',
      },
    ],
    glossary: [
      { term: 'Annuitetslån', definition: 'Lån med lika stora årliga belopp (årsbelopp). Månadskostnaden ≈ årsbelopp / 12.' },
      { term: 'Expeditionsavgift', definition: `${CSN.expeditionsavgift} kr per år som CSN tar ut. Betalas vid första inbetalningen för året.` },
      { term: 'Minimiårsbelopp', definition: `Lägsta belopp du måste betala per år. ${YEAR}: ${CSN.minArsbelopp.toLocaleString('sv-SE')} kr + ${CSN.expeditionsavgift} kr expeditionsavgift.` },
    ],
    faqs: [
      {
        question: 'Har nyare och äldre lån olika ränta?',
        answer:
          `Nej. Räntan är samma på alla studielån utbetalda från 1989. ${YEAR}: ${(CSN.ranta2025 * 100).toFixed(2)} %, ${YEAR + 1}: ${(CSN.ranta2026 * 100).toFixed(2)} %. CSN fastställer en ränta per år som gäller alla låntagare.`,
      },
      {
        question: 'Vilka lån gäller kalkylatorn?',
        answer:
          'Kalkylatorn gäller annuitetslån (utbetalda från 2001). Lån från 1989–2001 betalar 4 % av inkomst istället. Lån före 1989 använder regleringstal.',
      },
      {
        question: 'Hur länge kan jag återbetala?',
        answer:
          `Max 25 år. Slutdatum är året du fyller 64. Minimibelopp ${YEAR}: ${CSN.minArsbelopp.toLocaleString('sv-SE')} kr + ${CSN.expeditionsavgift} kr expeditionsavgift per år.`,
      },
    ],
    sources: [
      { name: 'CSN – Ränta och avgifter', linkId: 'CSNRanta', description: 'Räntesatser, expeditionsavgift' },
      { name: 'CSN – Betala tillbaka', linkId: 'CSNBetala', description: 'Återbetalningsvillkor' },
      { name: 'CSN – Våra olika lån', linkId: 'CSNLan', description: 'Lånetyper och utbetalningsperioder' },
    ],
    readMore: [
      { label: 'CSN – Ränta och avgifter', linkId: 'CSNRanta' },
      { label: 'CSN – Våra olika lån', linkId: 'CSNLan' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
    ],
  },
  pension: {
    facts: [
      {
        title: 'Sveriges tre pensionspelare',
        content:
          'Allmän pension (inkomst- + premiepension), tjänstepension (om du har kollektivavtal) och privat sparande. Beräkningen bygger på Pensionsmyndighetens system [1].',
      },
      {
        title: 'När kan jag ta ut pension?',
        content:
          'Tidigast 3 år före riktålder (t.ex. 62 om riktålder är 65). Riktålder är 65–67 beroende på födelseår. Du kan vänta till 70 för högre årligt uttag.',
      },
    ],
    glossary: [
      { term: 'Delningstal', definition: 'Tal som bestämmer årligt uttag. Ju senare du går i pension, desto högre delningstal och uttag per år.' },
      { term: 'Riktålder', definition: 'Ålder då du kan ta ut full pension. 65–67 beroende på födelseår.' },
      { term: 'Garantipension', definition: 'Utfyllnad om allmän pension + tjänstepension är låg. Kräver 40 års bosättning i Sverige.' },
    ],
    faqs: [
      {
        question: 'Vad ingår i min pension?',
        answer:
          'Sveriges pension bygger på tre pelare: allmän pension (inkomst- + premiepension), tjänstepension (om du har kollektivavtal) och privat sparande.',
      },
      {
        question: 'När kan jag ta ut pension?',
        answer:
          'Du kan ta ut pension tidigast 3 år före riktålder (t.ex. 62 år om riktålder är 65). Riktålder är 65–67 beroende på födelseår. Du kan också vänta till 70 för högre uttag.',
      },
      {
        question: 'Vad är delningstal?',
        answer:
          'Delningstal bestämmer hur mycket du får per år. Det speglar förväntad återstående livslängd. Ju senare du går i pension, desto högre blir uttaget per år.',
      },
    ],
    sources: [
      { name: 'Pensionsmyndigheten', linkId: 'Pensionsmyndigheten', description: 'Officiella pensionsberäkningar och prognoser' },
      { name: 'Pensionsmyndigheten – Så beräknas pension', linkId: 'PensionsmyndighetenBeraknas', description: 'Basbelopp och delningstal' },
      { name: 'Pensionsmyndigheten – Riktålder', linkId: 'PensionsmyndighetenRiktalder', description: 'Riktålder per årskull' },
    ],
    readMore: [
      { label: 'Så beräknas din pension', linkId: 'PensionsmyndighetenBeraknas' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  procent: {
    faqs: [
      { question: 'Vad räknar kalkylatorn ut?', answer: 'X% av Y: hur mycket X procent av ett belopp är. Y är X% av vad: vilket heltal Y motsvarar X procent av.' },
      { question: 'Kan jag använda decimaler?', answer: 'Ja, du kan ange decimaler för både procent och belopp.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Moms och procentberäkningar' }],
    readMore: [
      { label: 'Momsräknare', routeId: 'momsraknare' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  moms: {
    faqs: [
      { question: 'Vilka momssatser finns i Sverige?', answer: '25 % (standard), 12 % (t.ex. livsmedel, hotell) och 6 % (t.ex. tidningar, kollektivtrafik).' },
      { question: 'Hur räknar jag moms från pris inkl. moms?', answer: 'Dividera priset med (1 + momssats/100). Ex: 1250 kr inkl. 25 % moms = 1000 kr exkl. moms.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Momssatser och regler' }],
    readMore: [
      { label: 'Procenträknare', routeId: 'procentraknare' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  semester: {
    faqs: [
      { question: 'Vad är semesterersättning?', answer: 'Lagstadgat minimum 12 % av timlönen. Betalas ut vid semester eller vid avslut av anställning.' },
      { question: 'Varför 160 timmar per månad?', answer: 'Beräkningen utgår från ca 40 timmar/vecka × 4 veckor = 160 timmar som genomsnittlig arbetstid per månad.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Semesterersättning och skatt' }],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  egenkostnad: {
    faqs: [
      { question: 'Vad är egenkostnad?', answer: 'Egenkostnaden är den totala kostnaden för arbetsgivaren: bruttolön plus arbetsgivaravgift, tjänstepension och semesterersättning.' },
      { question: 'Varför skiljer sig min lön från egenkostnaden?', answer: 'Arbetsgivaren betalar mer än din bruttolön – arbetsgivaravgift (ca 31 %), tjänstepension och semesterersättning läggs till. Det är den totala kostnaden för att ha dig anställd.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Arbetsgivaravgifter och sociala avgifter' }],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
      { label: 'Semesterersättning', routeId: 'semesterersattning' },
    ],
  },
  fire: {
    facts: [
      {
        title: 'Vad är FIRE?',
        content:
          'Financial Independence, Retire Early – ekonomiskt oberoende så att du kan sluta arbeta när du vill. 4%-regeln: om du kan leva på 4 % av ditt kapital per år, räcker pengarna i princip för evigt (vid historisk avkastning).',
      },
      {
        title: '4%-regeln',
        content:
          'Målkapital = årliga utgifter × 25. Om du behöver 300 000 kr/år för att leva, behöver du 7,5 miljoner kr. Avkastningen ska täcka både uttag och inflation.',
      },
    ],
    glossary: [
      { term: '4%-regeln', definition: 'Uttag på max 4 % av kapitalet per år – historiskt har det räckt för evigt vid bred diversifiering.' },
      { term: 'Målkapital', definition: 'Årliga utgifter × 25. Det kapital du behöver för att vara ekonomiskt oberoende.' },
    ],
    faqs: [
      { question: 'Vad är 4%-regeln?', answer: 'Uttag på max 4 % av kapitalet per år. Vid historisk avkastning (ca 5–7 % nominell) räcker pengarna för evigt – avkastningen täcker både uttag och inflation.' },
      { question: 'Hur räknar jag år till FIRE?', answer: 'Kalkylatorn simulerar sparande med avkastning år för år tills du når målkapitalet.' },
    ],
    sources: [
      { name: 'UBS Global Investment Returns Yearbook', linkId: 'UBSYearbook', description: 'Historisk avkastning' },
      { name: 'Rika Tillsammans', linkId: 'RikaTillsammans', description: 'FIRE och passiv inkomst' },
    ],
    readMore: [
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
      { label: 'Pensionskalkylator', routeId: 'pensionskalkylator' },
    ],
  },
  kalp: {
    facts: [
      {
        title: 'Vad är KALP?',
        content:
          'Kvar Att Leva På – en kalkyl som banker använder för bolånebeslut. KALP = inkomst minus boendekostnader minus levnadskostnader. Levnadskostnaderna baseras på Konsumentverkets schabloner [1].',
      },
      {
        title: 'Minimikrav',
        content:
          'Banker vill ofta se minst 3 000–4 000 kr/månad (1 vuxen), 5 000–6 000 kr (2 vuxna) eller 10 000–12 000 kr (2 vuxna + 2 barn) kvar att leva på.',
      },
    ],
    glossary: [
      { term: 'KALP', definition: 'Kvar Att Leva På – inkomst minus boende minus levnadskostnader enligt Konsumentverket.' },
      { term: 'Levnadskostnader', definition: 'Schablonbelopp för mat, kläder, försäkring m.m. – beräknat av Konsumentverket.' },
    ],
    faqs: [
      { question: 'Vad är KALP?', answer: 'Kvar Att Leva På – vad som blir kvar efter boende och levnadskostnader. Banker använder det för att bedöma betalningsförmåga vid bolån.' },
      { question: 'Varifrån kommer levnadskostnaderna?', answer: 'Konsumentverket beräknar årligen schablonbelopp för olika hushåll. Banker och Finansinspektionen använder dessa vid bolånebeslut.' },
    ],
    sources: [
      { name: 'Konsumentverket – Hushållskostnader', linkId: 'KonsumentverketHushallskostnader', description: 'Beräknade levnadskostnader' },
      { name: 'Finansinspektionen', linkId: 'Finansinspektionen', description: 'Bolånebedömning' },
    ],
    readMore: [
      { label: 'Bolånekalkylator', routeId: 'bolanekalkylator' },
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  timlon: {
    faqs: [
      { question: 'Varför 173 timmar per månad?', answer: '173 = 40 timmar/vecka × 52 veckor ÷ 12 månader. Det är ett vanligt genomsnitt för heltidsanställda.' },
      { question: 'Gäller det för deltid?', answer: 'Nej, 173 timmar gäller heltid (40h/vecka). För deltid: räkna med dina faktiska timmar per månad.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Lön och arbetstid' }],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
      { label: 'Semesterersättning', routeId: 'semesterersattning' },
    ],
  },
  isk: {
    faqs: [
      { question: 'Vad är schablonintäkt?', answer: 'En beräknad intäkt baserad på kapitalunderlaget – inte din faktiska avkastning. Skatteverket sätter procentsatsen årligen (statslåneräntan + 1 %).' },
      { question: 'Vad är den skattefria grundnivån?', answer: 'Från 2025 är 150 000 kr skattefritt. Kapital under det beloppet beskattas inte. Gränsen höjs till 300 000 kr från 2026.' },
    ],
    sources: [
      { name: 'Skatteverket – ISK', linkId: 'SkatteverketISK', description: 'ISK-skatt och schablonintäkt' },
    ],
    readMore: [
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
      { label: 'FIRE-kalkylator', routeId: 'fireKalkylator' },
    ],
  },
  skatteaterbaring: {
    faqs: [
      { question: 'När får jag min skatteåterbäring?', answer: 'Skatteverket betalar ut i april och juni. För april: deklarera digitalt utan ändringar och anmäl bankkonto i god tid.' },
      { question: 'Vad är RUT-avdrag?', answer: '30 % skattereduktion på arbetskostnad för städning, trädgård, snöskottning m.m. Max 50 000 kr per person i hushållet.' },
      { question: 'Vad är ROT-avdrag?', answer: 'Skattereduktion på renovering och tillbyggnad. 50 % 2025 (12 maj–31 dec), annars 30 %. Max 50 000 kr per ägare. ROT+RUT tillsammans max 75 000 kr.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Skatteåterbäring, RUT och ROT' }],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
    ],
  },
  kontantinsats: {
    faqs: [
      { question: 'Varför 15 %?', answer: 'Banker kräver minst 15 % kontantinsats. Det är ett krav från Finansinspektionen för att minska kreditrisken.' },
      { question: 'Vad behöver jag utöver kontantinsatsen?', answer: 'Pantbrev, lagfart och eventuella flyttkostnader. Räkna med ca 1–2 % av köpeskillingen till pantbrev och lagfart.' },
    ],
    sources: [
      { name: 'Finansinspektionen', linkId: 'Finansinspektionen', description: 'Bolåneregler' },
    ],
    readMore: [
      { label: 'Bolånekalkylator', routeId: 'bolanekalkylator' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
    ],
  },
  rantabilitet: {
    faqs: [
      { question: 'Varför beskattas ränta på sparkonto?', answer: 'Ränta på sparkonto räknas som kapitalinkomst och beskattas med ca 30 %. Bolåneränta ger ingen skattereduktion för privatpersoner.' },
      { question: 'Vad är break-even?', answer: 'Break-even är den sparkontoränta (före skatt) där det är lika bra att amortera som att spara. Över den nivån lönar det sig att spara, under den att amortera.' },
    ],
    sources: [{ name: 'Skatteverket', linkId: 'Skatteverket', description: 'Kapitalinkomstskatt' }],
    readMore: [
      { label: 'Bolånekalkylator', routeId: 'bolanekalkylator' },
      { label: 'Ränta-på-ränta-kalkylator', routeId: 'rantapaRanta' },
    ],
  },
  aterbetalningstid: {
    faqs: [
      { question: 'Vad händer om betalningen är för låg?', answer: 'Om månadsbetalningen inte överstiger räntekostnaden kan lånet aldrig betalas av – skulden växer istället.' },
      { question: 'Gäller det alla lån?', answer: 'Beräkningen gäller annuitetslån med fast ränta. CSN och många bolån använder denna modell.' },
    ],
    sources: [{ name: 'Finansinspektionen', linkId: 'Finansinspektionen', description: 'Låne- och amorteringsregler' }],
    readMore: [
      { label: 'Bolånekalkylator', routeId: 'bolanekalkylator' },
      { label: 'CSN-kalkylator', routeId: 'csnKalkylator' },
    ],
  },
  bruttoFranNetto: {
    faqs: [
      { question: 'Hur exakt är beräkningen?', answer: 'Samma modell som lönekalkylatorn – kommunal och statlig skatt, grundavdrag, jobbskatteavdrag. För exakt resultat, använd Skatteverkets e-tjänst.' },
      { question: 'Varför skiljer kommunalskatten?', answer: 'Skattesatsen varierar mellan 28–35 % beroende på kommun. Välj din kommun för att få rätt beräkning.' },
    ],
    sources: [
      { name: 'Skatteverket', linkId: 'Skatteverket', description: 'Skattesatser och beräkningar' },
      { name: 'SCB', linkId: 'SCB', description: 'Kommunalskatter' },
    ],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
      { label: 'Egenkostnadskalkylator', routeId: 'egenkostnad' },
    ],
  },
  loneutveckling: {
    faqs: [
      { question: 'Vilken löneökning ska jag räkna med?', answer: 'Kollektivavtal ligger oftast runt 2–3 % per år. Individuella förhandlingar kan ge högre. Historiskt har löner ökat med ca 2–4 % årligen.' },
      { question: 'Är beräkningen exakt?', answer: 'Nej, det är en förenklad prognos. Löneutvecklingen varierar beroende på bransch, erfarenhet och förhandlingar.' },
    ],
    sources: [{ name: 'Ekonomifakta', linkId: 'Ekonomifakta', description: 'Löner och löneutveckling' }],
    readMore: [
      { label: 'Lönekalkylator', routeId: 'lonekalkylator' },
      { label: 'Inflationskalkylator', routeId: 'inflationskalkylator' },
    ],
  },
  effektivRanta: {
    faqs: [
      { question: 'Varför skiljer effektiv från nominell ränta?', answer: 'Nominell ränta är bara räntesatsen. Effektiv ränta inkluderar alla avgifter – uppläggningsavgift, aviavgift m.m. – vilket höjer den verkliga kostnaden.' },
      { question: 'Varför måste banken visa effektiv ränta?', answer: 'Finansinspektionen kräver det så konsumenter kan jämföra låneerbjudanden rättvist. Alltid jämför effektiv ränta, inte nominell.' },
    ],
    sources: [{ name: 'Finansinspektionen', linkId: 'Finansinspektionen', description: 'Krav på effektiv ränta för konsumentlån' }],
    readMore: [
      { label: 'Återbetalningstid', routeId: 'aterbetalningstid' },
      { label: 'Ränta på ränta', routeId: 'rantapaRanta' },
    ],
  },
  cagr: {
    faqs: [
      { question: 'Vad är CAGR?', answer: 'CAGR (Compound Annual Growth Rate) är den genomsnittliga årliga avkastningen som ger samma slutresultat. Tar hänsyn till ränta-på-ränta.' },
      { question: 'Varför inte bara total avkastning?', answer: 'Total avkastning (50 % på 5 år) säger inte hur mycket per år. CAGR gör det – t.ex. 8,45 % per år ger 50 % totalt över 5 år.' },
    ],
    sources: [{ name: 'RikaTillsammans', linkId: 'RikaTillsammans', description: 'Investeringsbegrepp och förklaringar' }],
    readMore: [
      { label: 'Ränta på ränta', routeId: 'rantapaRanta' },
      { label: 'Inflationskalkylator', routeId: 'inflationskalkylator' },
    ],
  },
}
