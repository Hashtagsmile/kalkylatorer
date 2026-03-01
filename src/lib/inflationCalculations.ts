/**
 * Inflationsberäkning – köpkraft över tid
 * Formel: Framtida_värde = Nuvarande × (1 + inflation/100)^år
 * Källor: Riksbanken KPIF, RESEARCH_BOLAN_INFLATION_LON_CSN.md
 */

export interface InflationInput {
  amount: number
  inflationRate: number
  years: number
  direction: 'forward' | 'backward' // forward = vad X kr blir om Y år, backward = vad X kr motsvarar idag
}

/** Vad amount kr blir värt om years år vid given inflation */
export function futureValue(amount: number, inflationRate: number, years: number): number {
  return amount * Math.pow(1 + inflationRate / 100, years)
}

/** Vad amount kr (om years år) motsvarar idag */
export function presentValue(amount: number, inflationRate: number, years: number): number {
  return amount / Math.pow(1 + inflationRate / 100, years)
}

export function calculateInflation(input: InflationInput): number {
  if (input.direction === 'forward') {
    return futureValue(input.amount, input.inflationRate, input.years)
  }
  return presentValue(input.amount, input.inflationRate, input.years)
}
