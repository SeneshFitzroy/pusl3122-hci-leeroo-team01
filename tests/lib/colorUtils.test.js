import { describe, it, expect } from 'vitest'
import { hexToHSL, getHueRotateFilter } from '../../src/lib/colorUtils'

describe('hexToHSL', () => {
  it('returns { h, s, l } for valid hex', () => {
    const result = hexToHSL('#ff0000')
    expect(result).toHaveProperty('h')
    expect(result).toHaveProperty('s')
    expect(result).toHaveProperty('l')
    expect(result.h).toBeGreaterThanOrEqual(0)
    expect(result.h).toBeLessThanOrEqual(360)
    expect(result.s).toBeGreaterThanOrEqual(0)
    expect(result.s).toBeLessThanOrEqual(1)
    expect(result.l).toBeGreaterThanOrEqual(0)
    expect(result.l).toBeLessThanOrEqual(1)
  })

  it('handles hex without hash', () => {
    const result = hexToHSL('ff0000')
    expect(result.h).toBe(0)
    expect(result.s).toBe(1)
    expect(result.l).toBeCloseTo(0.5)
  })

  it('returns default for invalid hex', () => {
    const result = hexToHSL('invalid')
    expect(result).toEqual({ h: 0, s: 0, l: 0.5 })
  })
})

describe('getHueRotateFilter', () => {
  it('returns a string with sepia and hue-rotate', () => {
    const filter = getHueRotateFilter('#8B6F47')
    expect(filter).toContain('sepia')
    expect(filter).toContain('hue-rotate')
    expect(filter).toContain('saturate')
  })

  it('returns valid CSS filter syntax', () => {
    const filter = getHueRotateFilter('#3F5E45')
    expect(() => {
      const el = document.createElement('div')
      el.style.filter = filter
    }).not.toThrow()
  })
})
