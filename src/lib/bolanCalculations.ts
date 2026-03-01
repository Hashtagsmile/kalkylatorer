/**
 * Bolåneberäkning – amortering, ränta, total kostnad
 * Källor: Finansinspektionen, SCB, RESEARCH_BOLAN_INFLATION_LON_CSN.md
 */

export interface BolanInput {
  loanAmount: number
  interestRate: number
  years: number
  belaningsgrad: number // 0-100, t.ex. 85
}

export interface BolanMonth {
  month: number
  payment: number
  interest: number
  amortization: number
  balance: number
}

export interface BolanResult {
  monthlyPayment: number
  totalInterest: number
  totalCost: number
  amortizationPercent: number
  schedule: BolanMonth[]
}

/** Annuitetsformel: M = P × [r(1+r)^n] / [(1+r)^n − 1] */
function annuityPayment(principal: number, annualRate: number, years: number): number {
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

/** Amorteringskrav enligt FI: under 50% ingen, 50-70% 1%, över 70% 2% */
export function getAmorteringskrav(belaningsgrad: number): number {
  if (belaningsgrad < 50) return 0
  if (belaningsgrad <= 70) return 1
  return 2
}

export function calculateBolan(input: BolanInput): BolanResult {
  const monthlyPayment = annuityPayment(input.loanAmount, input.interestRate, input.years)
  const schedule: BolanMonth[] = []
  let balance = input.loanAmount
  let totalInterest = 0
  const monthlyRate = input.interestRate / 100 / 12

  for (let m = 1; m <= input.years * 12; m++) {
    const interest = balance * monthlyRate
    const amortization = Math.min(monthlyPayment - interest, balance)
    totalInterest += interest
    balance -= amortization
    if (balance < 0) balance = 0

    schedule.push({
      month: m,
      payment: monthlyPayment,
      interest,
      amortization,
      balance,
    })

    if (balance <= 0) break
  }

  const amortizationKrav = getAmorteringskrav(input.belaningsgrad)

  return {
    monthlyPayment,
    totalInterest,
    totalCost: input.loanAmount + totalInterest,
    amortizationPercent: amortizationKrav,
    schedule,
  }
}

/** Jämförelse: amorteringsfritt vs med amortering över samma antal år */
export interface AmorteringsfrittComparison {
  /** Antal år för jämförelse */
  years: number
  /** Månadskostnad med amortering */
  withAmortMonthly: number
  /** Månadskostnad amorteringsfritt (endast ränta) */
  amortFreeMonthly: number
  /** Total betalt med amortering över perioden */
  withAmortTotalPaid: number
  /** Total betalt amorteringsfritt över perioden */
  amortFreeTotalPaid: number
  /** Kvarvarande skuld med amortering efter perioden */
  withAmortRemaining: number
  /** Kvarvarande skuld amorteringsfritt (= hela lånet) */
  amortFreeRemaining: number
  /** Total räntekostnad med amortering över perioden */
  withAmortInterest: number
  /** Total räntekostnad amorteringsfritt över perioden */
  amortFreeInterest: number
}

export function getAmorteringsfrittComparison(
  input: BolanInput,
  compareYears: number
): AmorteringsfrittComparison {
  const result = calculateBolan(input)
  const months = Math.min(compareYears * 12, result.schedule.length)

  let withAmortTotalPaid = 0
  let withAmortInterest = 0
  let withAmortRemaining = input.loanAmount

  for (let m = 0; m < months && m < result.schedule.length; m++) {
    const row = result.schedule[m]
    withAmortTotalPaid += row.payment
    withAmortInterest += row.interest
    withAmortRemaining = row.balance
  }

  const amortFreeMonthly = input.loanAmount * (input.interestRate / 100 / 12)
  const amortFreeTotalPaid = amortFreeMonthly * months
  const amortFreeInterest = amortFreeTotalPaid
  const amortFreeRemaining = input.loanAmount

  return {
    years: compareYears,
    withAmortMonthly: result.monthlyPayment,
    amortFreeMonthly,
    withAmortTotalPaid,
    amortFreeTotalPaid,
    withAmortRemaining,
    amortFreeRemaining,
    withAmortInterest,
    amortFreeInterest,
  }
}
