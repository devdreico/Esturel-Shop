import { site } from '../config/site'

export const FORMSPREE_ENDPOINT = site.integrations.formspreeEndpoint

export type OrderPayload = {
  nombre: string
  celular: string
  correo: string
  direccion: string
  ciudad: string
  departamento: string
  notas: string
  resumen: string
  totalProductos: number
  idempotencyKey?: string
}

export async function submitOrder(payload: OrderPayload): Promise<void> {
  if (!FORMSPREE_ENDPOINT) throw new Error('Formspree no configurado.')
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        nombre: payload.nombre,
        celular: payload.celular,
        correo: payload.correo || '(no informado)',
        direccion: payload.direccion,
        ciudad: payload.ciudad,
        departamento: payload.departamento,
        notas: payload.notas || '(sin notas)',
        pedido: payload.resumen,
        total_productos: payload.totalProductos,
        idempotency_key: payload.idempotencyKey,
        _gotcha: '',
        tipo_pago: 'Contraentrega',
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) {
      let detail = ''
      try {
        const data = (await res.json()) as { errors?: { message?: string }[] }
        detail = data.errors?.map((e) => e.message).filter(Boolean).join('; ') ?? ''
      } catch {
        /* cuerpo no JSON */
      }
      throw new Error(detail || `Formspree respondió ${res.status}.`)
    }
  } finally {
    clearTimeout(t)
  }
}
