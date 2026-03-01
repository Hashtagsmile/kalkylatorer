import { describe, it, expect } from 'vitest'
import { calculateCompoundInterest } from './compoundInterest'

describe('calculateCompoundInterest', () => {
  it('returnerar startvardet ar 0', () => {
    const data = calculateCompoundInterest({
      initial: 10000,
      monthly: 0,
      rate: 5,
      years: 5,
    })
    expect(data[0].year).toBe(0)
    expect(data[0].total).toBe(10000)
  })

  it('okar kapital vid positiv avkastning', () => {
    const data = calculateCompoundInterest({
      initial: 10000,
      monthly: 0,
      rate: 10,
      years: 2,
    })
    expect(data[data.length - 1].total).toBeGreaterThan(10000)
  })
})
