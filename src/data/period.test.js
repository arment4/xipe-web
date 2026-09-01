import { describe, it, expect } from 'vitest'
import { PERIODS, periodMeta, periodsInMonths, computeContribution } from './period'

describe('period helpers', () => {
  it('exposes the three frequencies', () => {
    expect(PERIODS.map((p) => p.key)).toEqual(['semanal', 'quincenal', 'mensual'])
  })

  it('defaults to mensual for an unknown period', () => {
    expect(periodMeta('nope').key).toBe('mensual')
  })

  it('computes the number of periods per term', () => {
    expect(periodsInMonths('mensual', 12)).toBe(12)
    expect(periodsInMonths('quincenal', 12)).toBe(24)
    expect(periodsInMonths('semanal', 6)).toBe(26) // round(6 * 4.345)
  })

  it('computes the local contribution (remaining / periods)', () => {
    // (10000 - 1000) / 6 = 1500
    expect(
      computeContribution({ target: 10000, initialPayment: 1000, termMonths: 6, period: 'mensual' }),
    ).toBe(1500)
  })

  it('returns 0 when the target is already covered', () => {
    expect(
      computeContribution({ target: 1000, initialPayment: 1000, termMonths: 6, period: 'mensual' }),
    ).toBe(0)
  })
})
