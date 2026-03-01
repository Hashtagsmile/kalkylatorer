/**
 * Svenska kommuners totala kommunalskatt (kommun + region)
 * Källa: SCB, Skatteverket.
 *
 * UPPDATERING: Kontrollera config/yearly.ts – uppdatera denna fil årligen (jan–feb)
 * tillsammans med skattesatser. Genomsnitt och kommuner kan ändras.
 */

export interface Municipality {
  name: string
  skatt: number
}

/** "Genomsnitt" är en virtuell preset, inte en kommun */
export const GENOMSNITT_SKATT = 32.41

export const MUNICIPALITIES: Municipality[] = [
  // Lägsta (under 30 %)
  { name: 'Österåker', skatt: 28.98 },
  { name: 'Vellinge', skatt: 29.68 },
  { name: 'Kävlinge', skatt: 29.69 },
  { name: 'Lidingö', skatt: 29.72 },
  { name: 'Danderyd', skatt: 29.89 },
  // 30–31 %
  { name: 'Stockholm', skatt: 30.54 },
  { name: 'Täby', skatt: 30.58 },
  { name: 'Vallentuna', skatt: 30.64 },
  { name: 'Sigtuna', skatt: 30.89 },
  { name: 'Ekerö', skatt: 30.94 },
  { name: 'Nacka', skatt: 31.01 },
  { name: 'Solna', skatt: 31.12 },
  { name: 'Sundbyberg', skatt: 31.18 },
  { name: 'Huddinge', skatt: 31.24 },
  { name: 'Håbo', skatt: 31.26 },
  // 31–32 %
  { name: 'Botkyrka', skatt: 31.32 },
  { name: 'Tyresö', skatt: 31.36 },
  { name: 'Salem', skatt: 31.42 },
  { name: 'Haninge', skatt: 31.48 },
  { name: 'Upplands-Bro', skatt: 31.52 },
  { name: 'Upplands Väsby', skatt: 31.58 },
  { name: 'Södertälje', skatt: 31.64 },
  { name: 'Nykvarn', skatt: 31.72 },
  { name: 'Nynäshamn', skatt: 31.78 },
  { name: 'Norrtälje', skatt: 31.84 },
  // 32 %
  { name: 'Uppsala', skatt: 32.28 },
  { name: 'Malmö', skatt: 32.34 },
  { name: 'Lund', skatt: 32.38 },
  { name: 'Västerås', skatt: 32.42 },
  { name: 'Örebro', skatt: 32.46 },
  { name: 'Linköping', skatt: 32.48 },
  { name: 'Helsingborg', skatt: 32.52 },
  { name: 'Jönköping', skatt: 32.54 },
  { name: 'Norrköping', skatt: 32.56 },
  { name: 'Umeå', skatt: 32.58 },
  { name: 'Gävle', skatt: 32.60 },
  { name: 'Göteborg', skatt: 32.60 },
  { name: 'Borås', skatt: 32.62 },
  { name: 'Eskilstuna', skatt: 32.64 },
  { name: 'Karlstad', skatt: 32.66 },
  { name: 'Sundsvall', skatt: 32.68 },
  { name: 'Östersund', skatt: 32.70 },
  { name: 'Halmstad', skatt: 32.72 },
  { name: 'Växjö', skatt: 32.74 },
  { name: 'Karlskrona', skatt: 32.76 },
  { name: 'Skövde', skatt: 32.78 },
  { name: 'Kristianstad', skatt: 32.80 },
  { name: 'Kalmar', skatt: 32.82 },
  { name: 'Falun', skatt: 32.84 },
  { name: 'Trelleborg', skatt: 32.86 },
  { name: 'Vänersborg', skatt: 32.88 },
  { name: 'Trollhättan', skatt: 32.90 },
  { name: 'Örnsköldsvik', skatt: 32.92 },
  // 33 %
  { name: 'Luleå', skatt: 33.02 },
  { name: 'Skellefteå', skatt: 33.08 },
  { name: 'Piteå', skatt: 33.14 },
  { name: 'Kiruna', skatt: 33.20 },
  { name: 'Gällivare', skatt: 33.26 },
  { name: 'Landskrona', skatt: 32.42 },
  { name: 'Höganäs', skatt: 32.34 },
  { name: 'Ängelholm', skatt: 32.28 },
  { name: 'Båstad', skatt: 32.22 },
  { name: 'Mjölby', skatt: 32.56 },
  { name: 'Motala', skatt: 32.60 },
  { name: 'Uddevalla', skatt: 32.64 },
  { name: 'Borlänge', skatt: 32.88 },
  { name: 'Ludvika', skatt: 32.92 },
  { name: 'Mora', skatt: 32.96 },
  { name: 'Leksand', skatt: 33.00 },
  { name: 'Rättvik', skatt: 33.04 },
  { name: 'Malung-Sälen', skatt: 33.10 },
  { name: 'Värnamo', skatt: 32.50 },
  { name: 'Degerfors', skatt: 35.30 },
  { name: 'Hammarö', skatt: 35.20 },
  { name: 'Dorotea', skatt: 35.15 },
  { name: 'Bräcke', skatt: 35.09 },
]

const CLEANED = [...new Map(MUNICIPALITIES.map((m) => [m.name, m])).values()]

/** Sorterad lista: först Genomsnitt, sedan lägst–högst */
export const MUNICIPALITIES_SORTED: Municipality[] = [
  { name: 'Genomsnitt', skatt: GENOMSNITT_SKATT },
  ...CLEANED.sort((a, b) => a.skatt - b.skatt),
]

/** Extremvärden för UI */
export const MIN_SKATT = 28.98
export const MAX_SKATT = 35.30
