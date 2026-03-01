import { describe, it, expect } from 'vitest'
import {
  calculateAterbetalningstid,
  getAterbetalningstidYearlySchedule,
} from './aterbetalningstidCalculations'

describe('calculateAterbetalningstid', () => {
  it('returnerar impossible nar betalning lower than eller lika med ranta', () => {
    const result = calculateAterbetalningstid({
      loanAmount: 1000000,
      monthlyPayment: 3000,
      interestRate: 5,
    })
    expect(result.impossible).toBe(true)
  })

  it('beraknar atterbetalningstid for giltig input', () => {
    const result = calculateAterbetalningstid({
      loanAmount: 120000,
      monthlyPayment: 1000,
      interestRate: 0,
    })
    expect(result.impossible).toBe(false)
    expect(result.months).toBe(120)
  })
})

describe('getAterbetalningstidYearlySchedule', () => {
  it('returnerar tom array vid impossible', () => {
    const schedule = getAterbetalningstidYearlySchedule({
      loanAmount: 1000000,
      monthlyPayment: 100,
      interestRate: 5,
    })
    expect(schedule).toEqual([])
  })
})
