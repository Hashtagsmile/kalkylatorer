/**
 * Scenario-presets baserade på typiska svenska sparande-mönster.
 * Siffror från ungefärliga genomsnitt (SCB, Pensionsmyndigheten, studiemedel).
 */

export interface Scenario {
  id: string
  title: string
  description: string
  initial: number
  monthly: number
  rate: number
  years: number
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'studerande',
    title: 'Studerande',
    description: 'Spara en del av studiebidraget – ca 1 000 kr/mån från bidragsdel av CSN. Börja tidigt trots låg inkomst.',
    initial: 0,
    monthly: 1000,
    rate: 6,
    years: 5,
  },
  {
    id: 'forsta-jobbet',
    title: 'Första jobbet',
    description: 'Efter examen – sparande motsvarande ~10% av typisk ingångslön (ca 3 500 kr/mån).',
    initial: 0,
    monthly: 3500,
    rate: 7,
    years: 10,
  },
  {
    id: 'bostad',
    title: 'Bostadssparande',
    description: 'Spara till kontantinsats. Lägre avkastning (5%) – mer konservativt för kortare horisont.',
    initial: 50000,
    monthly: 5000,
    rate: 5,
    years: 8,
  },
  {
    id: 'pension',
    title: 'Pensionssparande',
    description: 'Lång horisont – historisk avkastning för indexfonder ca 7%. Startkapital från tidigare sparande.',
    initial: 100000,
    monthly: 4000,
    rate: 7,
    years: 25,
  },
  {
    id: 'maksimalt',
    title: 'Maksimalt sparande',
    description: 'Spara 15–20% av inkomst. För dig som prioriterar tidig ekonomisk frihet.',
    initial: 200000,
    monthly: 10000,
    rate: 7,
    years: 15,
  },
]
