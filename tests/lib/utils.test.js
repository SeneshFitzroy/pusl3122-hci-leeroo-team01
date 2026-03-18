import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cn, generateId, formatDate, formatPrice, debounce } from '../../src/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    const cond = true
    expect(cn('base', !cond && 'hidden', cond && 'visible')).toContain('visible')
  })

  it('merges tailwind classes correctly', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId()
    expect(id).toBeTruthy()
    expect(typeof id).toBe('string')
  })

  it('returns unique ids', () => {
    const ids = new Set([...Array(100)].map(() => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('formatDate', () => {
  it('formats valid date', () => {
    const d = new Date('2025-03-19')
    expect(formatDate(d)).toMatch(/\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/)
  })
})

describe('formatPrice', () => {
  it('formats GBP by default', () => {
    expect(formatPrice(99.99)).toContain('99.99')
  })

  it('formats with custom currency', () => {
    expect(formatPrice(100, 'USD')).toContain('100')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays execution', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancels previous call on rapid invocations', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
