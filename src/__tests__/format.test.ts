import { describe, expect, it } from 'vitest'
import { formatCOP, relativeTime } from '../lib/format'

describe('formatCOP', () => {
  it('formatea pesos colombianos sin decimales', () => {
    const out = formatCOP(349900)
    expect(out).toMatch(/349\.900|349,900|349900/)
    expect(out).not.toMatch(/,00$/)
  })

  it('maneja NaN', () => {
    expect(formatCOP(Number.NaN)).toBe('$ 0')
  })
})

describe('relativeTime', () => {
  it('fecha inválida no produce NaN', () => {
    const out = relativeTime('not-a-date')
    expect(out).not.toMatch(/NaN/)
  })

  it('fecha reciente', () => {
    const out = relativeTime(new Date(Date.now() - 5 * 60000).toISOString())
    expect(out).toContain('hace')
  })
})
