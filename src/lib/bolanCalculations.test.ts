import { describe, it, expect } from 'vitest'
import {
  calculateBolan,
  getAmorteringskrav,
  getAmorteringsfrittComparison,
} from './bolanCalculations'

describe('getAmorteringskrav', () => {
  it('returnerar 0 under 50% belåning', () => {
    expect(getAmorteringskrav(0)).toBe(0)
    expect(getAmorteringskrav(49)).toBe(0)
  })
  it('returnerar 1 vid 50–70% belåning', () => {
    expect(getAmorteringskrav(50)).toBe(1)
    expect(getAmorteringskrav(70)).toBe(1)
  })
  it('returnerar 2 över 70% belåning', () => {
    expect(getAmorteringskrav(71)).toBe(2)
    expect(getAmorteringskrav(85)).toBe(2)
    expect(getAmorteringskrav(100)).toBe(2)
  })
})

describe('calculateBolan', () => {
  it('beräknar korrekt månadskostnad för 2M kr, 5%, 30 år', () => {
    const result = calculateBolan({
      loanAmount: 2_000_000,
      interestRate: 5,
      years: 30,
      belaningsgrad: 85,
    })
    expect(result.monthlyPayment).toBeCloseTo(10736, 0)
    expect(result.schedule.length).toBe(360)
    expect(result.schedule[0].balance).toBeGreaterThan(1_900_000)
    expect(result.schedule[359].balance).toBeLessThan(100)
  })

  it('hanterar ränta 0 (likadana avbetalningar)', () => {
    const result = calculateBolan({
      loanAmount: 120_000,
      interestRate: 0,
      years: 10,
      belaningsgrad: 50,
    })
    expect(result.monthlyPayment).toBe(1000)
    expect(result.totalInterest).toBe(0)
    expect(result.totalCost).toBe(120_000)
  })

  it('returnerar korrekt totalCost', () => {
    const input = { loanAmount: 1_000_000, interestRate: 3, years: 20, belaningsgrad: 75 }
    const result = calculateBolan(input)
    expect(result.totalCost).toBe(input.loanAmount + result.totalInterest)
  })
})

describe('getAmorteringsfrittComparison', () => {
  it('amorteringsfritt har samma kvarvarande skuld som ursprungligt lån', () => {
    const input = {
      loanAmount: 2_000_000,
      interestRate: 4,
      years: 30,
      belaningsgrad: 70,
    }
    const cmp = getAmorteringsfrittComparison(input, 10)
    expect(cmp.amortFreeRemaining).toBe(2_000_000)
    expect(cmp.amortFreeMonthly).toBeCloseTo(6667, 0)
  })
})
