import { describe, expect, it } from 'vitest'
import { isValidPhoneCO, normalizePhoneCO, formatPhoneCO } from '../lib/phone'

describe('phone', () => {
  it('acepta celulares colombianos', () => {
    expect(isValidPhoneCO('3001234567')).toBe(true)
    expect(isValidPhoneCO('+57 300 123 4567')).toBe(true)
    expect(isValidPhoneCO('300 123 4567')).toBe(true)
  })

  it('rechaza formatos inválidos', () => {
    expect(isValidPhoneCO('123')).toBe(false)
    expect(isValidPhoneCO('4001234567')).toBe(false)
  })

  it('normaliza y formatea', () => {
    expect(normalizePhoneCO('+57 300 123 4567')).toBe('3001234567')
    expect(formatPhoneCO('3001234567')).toBe('300 123 4567')
  })
})
