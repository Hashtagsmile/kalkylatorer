/**
 * Site metadata – namn, slogan, logotyp
 */

export const SITE = {
  name: 'Kalkylatorer',
  slogan: 'Gratis kalkylatorer för sparande, pension, bolån och mer',
  sloganShort: 'Gratis verktyg. Ingen registrering krävs.',
  /** Introtext för startsidan – antalet kommer från de faktiskt renderade kalkylatorerna */
  getCatalogIntro: (count: number) =>
    `${count} gratis kalkylatorer för sparande, pension, bolån och mer. Räkna på ränta-på-ränta, FIRE, ISK-skatt, nettolön, egenkostnad, kontantinsats, löneutveckling, RUT/ROT och mer – direkt i webbläsaren. Ingen registrering krävs.`,
} as const
