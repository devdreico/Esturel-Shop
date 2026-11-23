import { describe, expect, it } from 'vitest'
import { validateOrder } from '../lib/orders'
import { products } from '../data/products'

describe('validateOrder', () => {
  const base = {
    customer: {
      nombre: 'Ana Pérez',
      celular: '3001234567',
      correo: 'ana@test.com',
      departamento: 'Cundinamarca',
      ciudad: 'Bogotá',
      direccion: 'Calle 1 # 2 - 3',
      notas: '',
    },
    items: [{ productId: products[0]!.id, qty: 1 }],
    consent: true,
  }

  it('acepta un pedido válido', () => {
    expect(validateOrder(base)).toEqual({})
  })

  it('requiere nombre', () => {
    expect(validateOrder({ ...base, customer: { ...base.customer, nombre: '' } })).toHaveProperty('nombre')
  })

  it('requiere celular válido', () => {
    expect(validateOrder({ ...base, customer: { ...base.customer, celular: '123' } })).toHaveProperty('celular')
  })

  it('requiere consentimiento', () => {
    expect(validateOrder({ ...base, consent: false })).toHaveProperty('consent')
  })

  it('rechaza carrito vacío', () => {
    expect(validateOrder({ ...base, items: [] })).toHaveProperty('items')
  })
})
