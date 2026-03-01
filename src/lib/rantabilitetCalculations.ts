/**
 * Räntabilitet – sparkonto vs lån
 * Jämför effektiv avkastning efter skatt med lånekostnad.
 * Källa: Skatteverket (kapitalinkomstskatt ~30 %)
 */

const KAPITALINKOMST_SKATT = 0.30

export interface RantabilitetInput {
  lanRanta: number
  sparkontoRanta: number
  skattRanta?: number
}

export interface RantabilitetResult {
  sparkontoEfterSkatt: number
  rekommendation: 'amortera' | 'spara' | 'lika'
  breakEvenSparkontoRanta: number
}

export function calculateRantabilitet(input: RantabilitetInput): RantabilitetResult {
  const skatt = input.skattRanta ?? KAPITALINKOMST_SKATT
  const sparkontoEfterSkatt = input.sparkontoRanta * (1 - skatt)
  const breakEvenSparkontoRanta = input.lanRanta / (1 - skatt)

  let rekommendation: 'amortera' | 'spara' | 'lika' = 'lika'
  const diff = input.lanRanta - sparkontoEfterSkatt
  if (diff > 0.05) rekommendation = 'amortera'
  else if (diff < -0.05) rekommendation = 'spara'

  return {
    sparkontoEfterSkatt,
    rekommendation,
    breakEvenSparkontoRanta,
  }
}
