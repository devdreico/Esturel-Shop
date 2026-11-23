/** Validación y formato de teléfonos colombianos (móviles y fijos). */

export function normalizePhoneCO(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('57')) return digits.slice(2)
  return digits
}

export function isValidPhoneCO(raw: string): boolean {
  const digits = normalizePhoneCO(raw)
  if (digits.length !== 10) return false
  return digits.startsWith('3') || digits.startsWith('60') || digits.startsWith('6')
}

export function formatPhoneCO(raw: string): string {
  const digits = normalizePhoneCO(raw)
  if (digits.length !== 10) return raw.trim()
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
