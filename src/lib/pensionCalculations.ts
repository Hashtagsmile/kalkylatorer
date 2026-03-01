/**
 * Förenklad pensionsberäkning – uppskattning, inte officiell prognos.
 * Källor: Pensionsmyndigheten, RESEARCH_PENSION.md
 * Årliga värden: config/yearly.ts
 */

import { PENSION } from '../config/yearly'

const TJANSTEPENSION_GRANS = (7.5 * PENSION.inkomstbasbelopp) / 12

export interface PensionInput {
  birthYear: number
  pensionAge: number
  annualSalary: number
  yearsToWork: number
  hasTjanstepension: boolean
  privateMonthly: number
  privateInitial: number
  privateRate: number
}

export interface PensionResult {
  inkomstpension: number
  premiepension: number
  tjanstepension: number
  privatSparande: number
  garantipension: number
  total: number
}

function getDelningstal(age: number): number {
  const dt = PENSION.delningstal
  if (age <= 61) return dt[61]
  if (age >= 70) return dt[70]
  return dt[age] ?? 15.2
}

/** Inkomstpension: 16% av pensionsgrundande inkomst, indexeras, delas med delningstal */
function calcInkomstpension(
  annualSalary: number,
  yearsToWork: number,
  pensionAge: number,
  indexGrowth = 0.016
): number {
  const pensionIncome = Math.min(annualSalary * 0.93, PENSION.maxPensionsgrundande) // 7% avgift
  const yearlyContribution = pensionIncome * 0.16

  let behallning = 0
  for (let y = 0; y < yearsToWork; y++) {
    behallning = behallning * (1 + indexGrowth) + yearlyContribution
  }

  return behallning / getDelningstal(pensionAge) / 12
}

/** Premiepension: 2.5% av lön, ackumuleras med avkastning */
function calcPremiepension(
  annualSalary: number,
  yearsToWork: number,
  pensionAge: number,
  rate = 0.04
): number {
  const pensionIncome = Math.min(annualSalary * 0.93, PENSION.maxPensionsgrundande)
  const yearlyContribution = pensionIncome * 0.025

  let capital = 0
  for (let y = 0; y < yearsToWork; y++) {
    capital = capital * (1 + rate) + yearlyContribution
  }

  return capital / getDelningstal(pensionAge) / 12
}

/** Tjänstepension ITP1: 4.5% upp till 7.5 IB, 30% över */
function calcTjanstepension(
  annualSalary: number,
  yearsToWork: number,
  rate = 0.03
): number {
  const monthlySalary = annualSalary / 12
  const grans = TJANSTEPENSION_GRANS

  let yearlyContribution: number
  if (monthlySalary <= grans) {
    yearlyContribution = annualSalary * 0.045
  } else {
    const below = grans * 12 * 0.045
    const above = (annualSalary - grans * 12) * 0.30
    yearlyContribution = below + above
  }

  let capital = 0
  for (let y = 0; y < yearsToWork; y++) {
    capital = capital * (1 + rate) + yearlyContribution
  }

  // Tjänstepension delas ungefär liknande – anta 15 års utbetalning
  return capital / 15 / 12
}

/** Privat sparande med ränta-på-ränta */
function calcPrivatSparande(
  initial: number,
  monthly: number,
  yearsToWork: number,
  rate: number
): number {
  let total = initial
  const monthlyRate = rate / 100 / 12

  for (let y = 0; y < yearsToWork; y++) {
    for (let m = 0; m < 12; m++) {
      total = total * (1 + monthlyRate) + monthly
    }
  }

  // Anta 20 års utbetalning (67–87)
  return total / 20 / 12
}

/** Garantipension fyller ut om total pension under gränsen */
function calcGarantipension(totalWithout: number): number {
  return Math.max(0, PENSION.garantipensionOgift - totalWithout)
}

export function calculatePension(input: PensionInput): PensionResult {
  const inkomst = calcInkomstpension(
    input.annualSalary,
    input.yearsToWork,
    input.pensionAge
  )
  const premie = calcPremiepension(
    input.annualSalary,
    input.yearsToWork,
    input.pensionAge
  )
  const tjanste = input.hasTjanstepension
    ? calcTjanstepension(input.annualSalary, input.yearsToWork)
    : 0
  const privat = calcPrivatSparande(
    input.privateInitial,
    input.privateMonthly,
    input.yearsToWork,
    input.privateRate
  )

  const totalWithoutGaranti = inkomst + premie + tjanste + privat
  const garanti = calcGarantipension(totalWithoutGaranti)

  return {
    inkomstpension: Math.round(inkomst),
    premiepension: Math.round(premie),
    tjanstepension: Math.round(tjanste),
    privatSparande: Math.round(privat),
    garantipension: Math.round(garanti),
    total: Math.round(totalWithoutGaranti + garanti),
  }
}

export function getRiktalder(birthYear: number): number {
  if (birthYear <= 1957) return 65
  if (birthYear <= 1959) return 66
  return 67
}

/** Tidigast möjliga uttag (3 år före riktålder) */
export function getTidigastUttag(birthYear: number): number {
  const rikt = getRiktalder(birthYear)
  return Math.max(61, rikt - 3)
}
