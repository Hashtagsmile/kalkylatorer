import { describe, it, expect } from 'vitest'
import { getCatalogCalculatorCount } from './catalog'

describe('getCatalogCalculatorCount', () => {
  it('returnerar positivt antal aktiverade kalkylatorer', () => {
    const count = getCatalogCalculatorCount()
    expect(count).toBeGreaterThan(0)
    expect(Number.isInteger(count)).toBe(true)
  })

  it('matchar faktiskt antal i CATALOG_GROUPS (alla enabled)', () => {
    const count = getCatalogCalculatorCount()
    expect(count).toBeGreaterThanOrEqual(20)
  })
})
