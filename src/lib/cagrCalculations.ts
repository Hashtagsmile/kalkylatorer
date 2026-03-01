/**
 * CAGR – Compound Annual Growth Rate (genomsnittlig årlig avkastning)
 * Beräknar vilken konstant årlig tillväxt som ger samma slutresultat.
 * Källa: Standard finansformel
 */

export interface CagrInput {
  /** Startvärde (kr) */
  startValue: number
  /** Slutvärde (kr) */
  endValue: number
  /** Antal år */
  years: number
}

export interface CagrResult {
  /** CAGR (% per år) */
  cagrPercent: number
  /** Total avkastning i procent (slut/start - 1) */
  totalReturnPercent: number
}

/**
 * CAGR = (Slutvärde / Startvärde)^(1 / år) - 1
 */
export function calculateCagr(input: CagrInput): CagrResult | null {
  if (input.startValue <= 0 || input.years <= 0) return null
  if (input.endValue < 0) return null

  const totalReturn = input.endValue / input.startValue
  const totalReturnPercent = (totalReturn - 1) * 100

  const cagr = Math.pow(totalReturn, 1 / input.years) - 1
  const cagrPercent = cagr * 100

  return {
    cagrPercent,
    totalReturnPercent,
  }
}
