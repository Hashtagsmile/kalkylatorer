/**
 * Återbetalningstid – hur lång tid att betala tillbaka ett lån
 * Annuitetslån: löser n ur M = P × [r(1+r)^n] / [(1+r)^n − 1]
 * n = ln(M/(M-P*r)) / ln(1+r) där M > P*r
 */

export interface AterbetalningstidInput {
  /** Lånebelopp (kr) */
  loanAmount: number
  /** Månadsbetalning (kr) */
  monthlyPayment: number
  /** Ränta (% per år) */
  interestRate: number
}

export interface AterbetalningstidResult {
  /** Antal månader till återbetalning */
  months: number
  /** Antal år (kan vara decimal) */
  years: number
  /** Total räntekostnad (kr) */
  totalInterest: number
  /** Total kostnad (lån + ränta) */
  totalCost: number
  /** Om betalningen är för låg (ränta > amortering) – lån betalas aldrig av */
  impossible: boolean
}

export function calculateAterbetalningstid(input: AterbetalningstidInput): AterbetalningstidResult {
  const { loanAmount, monthlyPayment, interestRate } = input
  const r = interestRate / 100 / 12

  if (loanAmount <= 0 || monthlyPayment <= 0) {
    return { months: 0, years: 0, totalInterest: 0, totalCost: loanAmount, impossible: true }
  }

  const monthlyInterest = loanAmount * r
  if (monthlyPayment <= monthlyInterest) {
    return {
      months: Infinity,
      years: Infinity,
      totalInterest: Infinity,
      totalCost: Infinity,
      impossible: true,
    }
  }

  let months: number
  if (r === 0) {
    months = Math.ceil(loanAmount / monthlyPayment)
  } else {
    const n = Math.log(monthlyPayment / (monthlyPayment - loanAmount * r)) / Math.log(1 + r)
    months = Math.ceil(n)
  }

  let balance = loanAmount
  let totalInterest = 0
  for (let m = 0; m < months; m++) {
    const interest = balance * r
    const amortization = Math.min(monthlyPayment - interest, balance)
    totalInterest += interest
    balance -= amortization
    if (balance <= 0) break
  }

  return {
    months,
    years: months / 12,
    totalInterest,
    totalCost: loanAmount + totalInterest,
    impossible: false,
  }
}

/** Årlig skuldutveckling för graf – returnerar [] om impossible */
export function getAterbetalningstidYearlySchedule(input: AterbetalningstidInput): { year: number; balance: number }[] {
  const calc = calculateAterbetalningstid(input)
  if (calc.impossible) return []

  const { loanAmount, monthlyPayment, interestRate } = input
  const r = interestRate / 100 / 12
  const result: { year: number; balance: number }[] = [{ year: 0, balance: loanAmount }]
  let balance = loanAmount
  const totalMonths = calc.months

  for (let month = 0; month < totalMonths && balance > 0; month++) {
    const interest = balance * r
    const amortization = Math.min(monthlyPayment - interest, balance)
    balance -= amortization
    if ((month + 1) % 12 === 0 || balance <= 0) {
      result.push({ year: Math.ceil((month + 1) / 12), balance: Math.max(0, balance) })
    }
  }
  return result
}
