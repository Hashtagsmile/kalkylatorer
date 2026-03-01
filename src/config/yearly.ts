/**
 * ÅRLIG KONFIGURATION – uppdatera varje år
 *
 * UPPDATERING: Kontrollera och uppdatera dessa värden årligen (typiskt jan–feb).
 * Källor: Skatteverket, CSN, Pensionsmyndigheten, SCB, Finansinspektionen, Riksbanken.
 *
 * Vid årsskifte:
 * 1. Uppdatera YEAR och LAST_UPDATED
 * 2. SKATTEATERBARING: hämta utbetalningsdatum från skatteverket.se
 * 3. ROT-avdrag: kontrollera procentsats (50 % 2025, 30 % 2026)
 * 4. Sök efter gamla årtal i projektet
 * 5. data/municipalities.ts – kommunalskatter uppdateras separat
 */

export const YEAR = 2025
export const LAST_UPDATED = 'februari 2025'

// ─── Skatt (Lönekalkylator) – Källa: Skatteverket ─────────────────────────
export const TAX = {
  /** Brytpunkt statlig skatt, under 66 år (kr/år) */
  brytpunktStatligUnder66: 643_100,
  /** Brytpunkt statlig skatt, 66 år och äldre (kr/år) */
  brytpunktStatligOver66: 733_200,
  /** Prisbasbelopp för grundavdrag (kr) */
  prisbasbelopp: 58_800,
  /** Max jobbskatteavdrag (kr/år). Månadsvis ≈ 3 917 kr. */
  jobbskatteavdragMaxAr: 47_000,
  /** Inkomst där fullt jobbskatteavdrag ges (kr/år) */
  jobbskatteavdragFullAt: 475_000,
} as const

// ─── CSN – Källa: CSN.se, ränta och avgifter ───────────────────────────────
export const CSN = {
  /** Ränta 2025 (decimal, t.ex. 0.01981) */
  ranta2025: 1.981 / 100,
  /** Ränta 2026 (decimal) */
  ranta2026: 2.135 / 100,
  /** Minimiårsbelopp (kr) */
  minArsbelopp: 8_820,
  /** Expeditionsavgift (kr/år) */
  expeditionsavgift: 150,
} as const

// ─── Pension – Källa: Pensionsmyndigheten ──────────────────────────────────
export const PENSION = {
  /** Inkomstbasbelopp (kr) */
  inkomstbasbelopp: 80_600,
  /** Max pensionsgrundande inkomst (kr/år) */
  maxPensionsgrundande: 625_500,
  /** Garantipension ogift (kr/mån) */
  garantipensionOgift: 11_907,
  /** Delningstal per ålder (Pensionsmyndigheten) */
  delningstal: {
    61: 17.8,
    62: 17.3,
    63: 16.9,
    64: 16.5,
    65: 16.5,
    66: 15.8,
    67: 15.2,
    68: 14.6,
    69: 14.0,
    70: 13.5,
  } as Record<number, number>,
} as const

// ─── Egenkostnad – Källa: Skatteverket ───────────────────────────────────────
export const EGENKOSTNAD = {
  /** Arbetsgivaravgift (decimal) */
  arbetsgivaravgift: 31.42 / 100,
  /** Tjänstepension, typiskt (decimal) – ITP 1 ca 4,5 % */
  tjanstepension: 4.5 / 100,
  /** Semesterersättning (decimal) */
  semester: 12 / 100,
} as const

// ─── ISK – Källa: Skatteverket ──────────────────────────────────────────────
export const ISK = {
  /** Schablonintäkt (decimal), 2025: statslåneräntan 1,96 % + 1 % */
  schablonintakt: 2.96 / 100,
  /** Skattesats på schablonintäkten (decimal) */
  skattesats: 30 / 100,
  /** Skattefri grundnivå (kr), 2025 */
  skattefriGräns: 150_000,
} as const

// ─── Skatteåterbäring – Källa: Skatteverket ──────────────────────────────────
// UPPDATERING: När YEAR ändras, uppdatera datum från Skatteverket (skatteverket.se)
export const SKATTEATERBARING = {
  /** Första utbetalning för de som deklarerat i tid */
  forstaUtbetalning: '11 april',
  /** Andra utbetalning */
  andraUtbetalning: '5 juni',
} as const

// ─── Referensvärden för UI (informativt, inte beräkningar) ─────────────────
export const UI_REFERENCE = {
  /** Bolån: typisk rörlig ränta (SCB) – intervall för visning */
  bolanRantaMin: 2.7,
  bolanRantaMax: 2.9,
  /** Inflation: förväntad nivå (Riksbanken) – intervall för visning */
  inflationForvantadMin: 2.1,
  inflationForvantadMax: 2.3,
  /** Jobbskatteavdrag max i kr/mån (för text) */
  jobbskatteavdragMaxManad: Math.round(TAX.jobbskatteavdragMaxAr / 12),
} as const
