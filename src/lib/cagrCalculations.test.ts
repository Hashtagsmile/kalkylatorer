import { describe, it, expect } from 'vitest'
import { calculateCagr } from './cagrCalculations'

describe('calculateCagr', () => {
  it('returnerar null vid ogiltig input', () => {
    expect(calculateCagr({ startValue: 0, endValue: 100, years: 5 })).toBeNull()
    expect(calculateCagr({ startValue: 100, endValue: 100, years: 0 })).toBeNull()
    expect(calculateCagr({ startValue: 100, endValue: -10, years: 5 })).toBeNull()
  })

  it('beräknar CAGR korrekt för enkel tillväxt', () => {
    // 100 → 200 på 1 år = 100% CAGR
    const result = calculateCagr({ startValue: 100, endValue: 200, years: 1 })
    expect(result).not.toBeNull()
    expect(result!.cagrPercent).toBeCloseTo(100, 0)
    expect(result!.totalReturnPercent).toBeCloseTo(100, 0)
  })

  it('beräknar CAGR för 10 år dubblerat', () => {
    // Rule of 72: 72/10 ≈ 7.2% för att dubbla på 10 år
    const result = calculateCagr({ startValue: 1000, endValue: 2000, years: 10 })
    expect(result).not.toBeNull()
    expect(result!.cagrPercent).toBeCloseTo(7.18, 1)
  })

  it('returnerar 0 totalReturnPercent vid oförändrat värde', () => {
    const result = calculateCagr({ startValue: 100, endValue: 100, years: 5 })
    expect(result).not.toBeNull()
    expect(result!.totalReturnPercent).toBe(0)
  })
})
