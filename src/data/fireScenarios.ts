/**
 * FIRE-scenarier – typiska mönster för ekonomiskt oberoende
 * Baserat på 4%-regeln: målkapital = årliga utgifter × 25
 */

export interface FireScenario {
  id: string
  title: string
  description: string
  expenses: number
  capital: number
  monthlySaving: number
  return: number
}

export const FIRE_SCENARIOS: FireScenario[] = [
  {
    id: 'minimal',
    title: 'Minimalt',
    description: 'Låga utgifter (200 k/år), spara 5 k/mån. Målkapital 5 M kr.',
    expenses: 200000,
    capital: 100000,
    monthlySaving: 5000,
    return: 6,
  },
  {
    id: 'normal',
    title: 'Normalt',
    description: 'Typiska svenska utgifter (360 k/år), spara 8 k/mån. Målkapital 9 M kr.',
    expenses: 360000,
    capital: 300000,
    monthlySaving: 8000,
    return: 6,
  },
  {
    id: 'aggressivt',
    title: 'Aggressivt',
    description: 'Spara 15 k/mån, 7 % avkastning. Målkapital 7,5 M kr vid 300 k utgifter.',
    expenses: 300000,
    capital: 500000,
    monthlySaving: 15000,
    return: 7,
  },
  {
    id: 'tidig-start',
    title: 'Tidig start',
    description: 'Börja spara tidigt – 10 k/mån från 25 års ålder. Målkapital 6 M kr.',
    expenses: 240000,
    capital: 200000,
    monthlySaving: 10000,
    return: 7,
  },
  {
    id: 'sen-start',
    title: 'Sen start',
    description: 'Redan sparat 1 M, spara 20 k/mån. Målkapital 10 M kr vid 400 k utgifter.',
    expenses: 400000,
    capital: 1000000,
    monthlySaving: 20000,
    return: 6,
  },
]
