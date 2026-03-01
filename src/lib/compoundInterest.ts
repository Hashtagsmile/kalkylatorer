/**
 * Ränta-på-ränta med skatt, ökande sparande m.m.
 * Inspirerad av RikaTillsammans verktyg.
 */

export type TaxMode = 'ingen' | 'isk2025' | 'isk2026'

const ISK_2025 = { grans: 150_000, rate: 0.888 / 100 }
const ISK_2026 = { grans: 300_000, rate: 1 / 100 }

export interface CompoundInput {
  initial: number
  monthly: number
  rate: number
  years: number
  taxMode?: TaxMode
  monthlyIncreasePercent?: number
}

export interface YearData {
  year: number
  total: number
  contributions: number
  interest: number
  tax?: number
}

function iskTax(avgCapital: number, mode: 'isk2025' | 'isk2026'): number {
  const cfg = mode === 'isk2025' ? ISK_2025 : ISK_2026
  const taxable = Math.max(0, avgCapital - cfg.grans)
  return taxable * cfg.rate
}

export function calculateCompoundInterest(input: CompoundInput): YearData[] {
  const {
    initial,
    monthly,
    rate,
    years,
    taxMode = 'ingen',
    monthlyIncreasePercent = 0,
  } = input

  const data: YearData[] = [{ year: 0, total: initial, contributions: initial, interest: 0 }]
  let total = initial
  let totalContributions = initial
  const monthlyRate = rate / 100 / 12

  for (let y = 0; y < years; y++) {
    const monthlyThisYear = monthly * Math.pow(1 + monthlyIncreasePercent / 100, y)
    const yearStart = total

    for (let m = 0; m < 12; m++) {
      total = total * (1 + monthlyRate) + monthlyThisYear
      totalContributions += monthlyThisYear
    }

    let totalTax = 0
    if (taxMode === 'isk2025' || taxMode === 'isk2026') {
      const avgCapital = (yearStart + total) / 2
      totalTax = iskTax(avgCapital, taxMode)
      total -= totalTax
    }

    const interestSoFar = total - totalContributions
    data.push({
      year: y + 1,
      total: Math.round(total),
      contributions: Math.round(totalContributions),
      interest: Math.round(interestSoFar),
      ...(totalTax > 0 && { tax: Math.round(totalTax) }),
    })
  }

  return data
}

/** Slumpad avkastning – Monte Carlo. Stockholmsbörsen: 8.4% mean, 21.4% std */
export function runMonteCarlo(
  input: Omit<CompoundInput, 'rate'>,
  simulations = 500,
  mean = 8.4,
  std = 21.4
): { median: number; p10: number; p90: number; results: number[] } {
  const results: number[] = []
  for (let s = 0; s < simulations; s++) {
    let total = input.initial
    let totalContributions = input.initial
    const monthlyIncrease = input.monthlyIncreasePercent ?? 0

    for (let y = 0; y < input.years; y++) {
      const yearlyReturn = mean / 100 + (std / 100) * gaussianRandom()
      const monthlyRate = Math.pow(1 + yearlyReturn, 1 / 12) - 1
      const monthlyThisYear = input.monthly * Math.pow(1 + monthlyIncrease / 100, y)

      for (let m = 0; m < 12; m++) {
        total = total * (1 + monthlyRate) + monthlyThisYear
        totalContributions += monthlyThisYear
      }
    }
    results.push(total)
  }
  results.sort((a, b) => a - b)
  return {
    median: results[Math.floor(simulations * 0.5)] ?? 0,
    p10: results[Math.floor(simulations * 0.1)] ?? 0,
    p90: results[Math.floor(simulations * 0.9)] ?? 0,
    results,
  }
}

function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
