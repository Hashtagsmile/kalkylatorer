/**
 * CSN studielån – återbetalning
 * Källor: CSN, RESEARCH_CSN.md
 * Årliga värden: config/yearly.ts
 */

import { CSN } from '../config/yearly'

export const CSN_RANTA_2025 = CSN.ranta2025
export const CSN_RANTA_2026 = CSN.ranta2026

/** Annuitetslån – månadskostnad */
export function csnManadskostnad(
  skuld: number,
  arKvar: number,
  ranta = CSN.ranta2025
): number {
  if (skuld <= 0 || arKvar <= 0) return 0
  const n = arKvar * 12
  const r = ranta / 12
  if (r === 0) return skuld / n
  const manad = skuld * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  return manad
}

/** Årsbelopp inkl. expeditionsavgift */
export function csnArsbelopp(skuld: number, arKvar: number): number {
  const manad = csnManadskostnad(skuld, arKvar)
  const arsBelopp = Math.max(CSN.minArsbelopp, manad * 12)
  return arsBelopp + CSN.expeditionsavgift
}

export interface CSNInput {
  skuld: number
  arKvar: number
  ranta?: number
}

export interface CSNResult {
  manadskostnad: number
  arsbelopp: number
  totalKostnad: number
  totalRanta: number
}

export function calculateCSN(input: CSNInput): CSNResult {
  const ranta = input.ranta ?? CSN.ranta2025
  const manad = csnManadskostnad(input.skuld, input.arKvar, ranta)
  const arsBelopp = Math.max(CSN.minArsbelopp, manad * 12) + CSN.expeditionsavgift
  const totalBetalt = manad * 12 * input.arKvar
  const totalRanta = totalBetalt - input.skuld

  return {
    manadskostnad: manad,
    arsbelopp: arsBelopp,
    totalKostnad: totalBetalt + CSN.expeditionsavgift * input.arKvar,
    totalRanta: Math.max(0, totalRanta),
  }
}

/** Årlig skuldutveckling för graf */
export function getCSNYearlySchedule(skuld: number, arKvar: number, ranta = CSN.ranta2025): { year: number; balance: number }[] {
  const manad = csnManadskostnad(skuld, arKvar, ranta)
  const monthlyRate = ranta / 12
  const result: { year: number; balance: number }[] = [{ year: 0, balance: skuld }]
  let balance = skuld
  for (let y = 1; y <= arKvar; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate
      const amort = Math.min(manad - interest, balance)
      balance -= amort
      if (balance <= 0) break
    }
    result.push({ year: y, balance: Math.max(0, balance) })
    if (balance <= 0) break
  }
  return result
}
