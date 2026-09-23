/**
 * true si el link de pago de MP no parece un link real de producción
 * (placeholders de demo en products.ts).
 */
export function isDemoPaymentLink(url: string): boolean {
  if (!url) return true
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') return true
    // Paths demo: /pay/slug-sin-numero o dominios no de MP
    const mpHosts = /mercadopago\.(com\.\w{2,3}|com)$|mercadopago\.com/i
    if (!mpHosts.test(u.hostname)) return true
    if (u.pathname.startsWith('/pay/') && !/\d{5,}/.test(u.pathname)) return true
    return false
  } catch {
    return true
  }
}
