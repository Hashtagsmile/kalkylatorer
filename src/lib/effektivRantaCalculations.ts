/**
 * Effektiv ränta – jämför nominell ränta med total kostnad inkl. avgifter
 * Finansinspektionen kräver att långivare anger effektiv ränta för jämförelse.
 * Källa: Räntelagen, FI
 */

export interface EffektivRantaInput {
  /** Lånebelopp (kr) */
  loanAmount: number
  /** Nominell ränta (% per år) */
  nominalRate: number
  /** Återbetalningstid (år) */
  years: number
  /** Uppläggningsavgift (kr), engångs */
  setupFee?: number
  /** Månadsavgift (kr), t.ex. aviavgift */
  monthlyFee?: number
}

export interface EffektivRantaResult {
  /** Nominell ränta (% per år) */
  nominalRate: number
  /** Effektiv ränta (% per år) – inkl. avgifter */
  effectiveRate: number
  /** Månadskostnad (annuitet + ev. månadsavgift) */
  monthlyPayment: number
  /** Total räntekostnad */
  totalInterest: number
  /** Totala avgifter (uppläggning + månadsavgifter över hela perioden) */
  totalFees: number
  /** Total kostnad (lån + ränta + avgifter) */
  totalCost: number
}

/** Annuitetsformel: M = P × [r(1+r)^n] / [(1+r)^n − 1] */
function annuityPayment(principal: number, annualRate: number, years: number): number {
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

/** NPV av månadsbetalningar vid given månadsränta r_m (som decimal) */
function npvOfPayments(monthlyPayment: number, months: number, monthlyRateDecimal: number): number {
  const r = monthlyRateDecimal
  if (r === 0) return monthlyPayment * months
  return monthlyPayment * (1 - Math.pow(1 + r, -months)) / r
}

/** Hitta effektiv månadsränta via Newton-Raphson. NPV(betalningar) = netLoan. */
function findEffectiveMonthlyRate(
  netLoan: number,
  monthlyPayment: number,
  months: number
): number {
  if (netLoan <= 0 || monthlyPayment <= 0) return 0
  if (months <= 0) return 0

  let r = 0.01 / 12 // startgissning: 1% årlig ≈ 0.00083 månatlig
  const maxIter = 100

  for (let i = 0; i < maxIter; i++) {
    const npv = npvOfPayments(monthlyPayment, months, r)
    const diff = npv - netLoan

    if (Math.abs(diff) < 1) break // 1 kr precision räcker

    const dr = 0.00001
    const npv2 = npvOfPayments(monthlyPayment, months, r + dr)
    const dNpvDr = (npv2 - npv) / dr
    r = r - diff / dNpvDr
    if (r < 0) r = 0.00001
    if (r > 0.1) r = 0.1
  }

  return r
}

/** Effektiv årsränta från månadsränta: (1 + r_m)^12 - 1 */
function monthlyToAnnualEffective(monthlyRateDecimal: number): number {
  return Math.pow(1 + monthlyRateDecimal, 12) - 1
}

export function calculateEffektivRanta(input: EffektivRantaInput): EffektivRantaResult {
  const setupFee = input.setupFee ?? 0
  const monthlyFee = input.monthlyFee ?? 0
  const months = input.years * 12

  const annuity = annuityPayment(input.loanAmount, input.nominalRate, input.years)
  const monthlyPayment = annuity + monthlyFee

  const netLoan = input.loanAmount - setupFee
  const effectiveMonthlyRate = findEffectiveMonthlyRate(netLoan, monthlyPayment, months)
  const effectiveAnnualDecimal = monthlyToAnnualEffective(effectiveMonthlyRate)
  const effectiveRate = effectiveAnnualDecimal * 100

  const totalInterest = annuity * months - input.loanAmount
  const totalFees = setupFee + monthlyFee * months

  return {
    nominalRate: input.nominalRate,
    effectiveRate,
    monthlyPayment,
    totalInterest,
    totalFees,
    totalCost: input.loanAmount + totalInterest + totalFees,
  }
}
