import { site } from '../config/site'

export type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] }

export type LegalPage = {
  slug: string
  title: string
  intro: string
  sections: LegalSection[]
}

const businessLine = `${site.brand.legalName}${site.business.nit ? ` (NIT ${site.business.nit})` : ''}`
const contactLine = `${site.contact.email} · WhatsApp ${site.contact.whatsappDisplay} · ${site.contact.hours}`

export const legalPages: LegalPage[] = [
  {
    slug: 'privacidad',
    title: 'Política de privacidad y tratamiento de datos',
    intro:
      'En ' + site.brand.name + ' tratamos tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013. Esta política explica qué datos recogemos, para qué los usamos y cómo los protegemos.',
    sections: [
      {
        heading: 'Responsable del tratamiento',
        paragraphs: [
          businessLine + ' es el responsable del tratamiento de tus datos personales.',
          'Contacto para asuntos de datos: ' + contactLine + '.',
        ],
      },
      {
        heading: 'Datos que recogemos',
        paragraphs: [
          'Recogemos los datos que nos entregas al hacer un pedido o contactarnos: nombre, celular, correo, dirección de entrega, ciudad, departamento y notas del pedido.',
          'También recogemos datos técnicos mínimos (dirección IP, navegador, páginas visitadas) para el funcionamiento y la seguridad del sitio.',
        ],
      },
      {
        heading: 'Finalidades',
        paragraphs: [
          'Usamos tus datos para procesar y confirmar tu pedido, coordinar el envío y la entrega contraentrega, brindarte soporte y garantía, y enviarte información sobre tu pedido.',
          'Con tu autorización expresa, podemos enviarte novedades y promociones. Puedes revocar esta autorización en cualquier momento.',
        ],
      },
      {
        heading: 'Autorización',
        paragraphs: [
          'Al marcar la casilla de autorización en el checkout, autorizas el tratamiento de tus datos para las finalidades anteriores. Si no autorizas, no podemos procesar tu pedido.',
        ],
      },
      {
        heading: 'Conservación y seguridad',
        paragraphs: [
          'Conservamos tus datos mientras sean necesarios para la relación comercial y las obligaciones legales. Aplicamos medidas técnicas y organizativas para protegerlos.',
          'No vendemos ni compartimos tus datos con terceros, salvo con los operadores logísticos y proveedores necesarios para entregar tu pedido, o por obligación legal.',
        ],
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          'Puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización, escribiendo a ' + site.contact.email + '.',
          'Atenderemos tu solicitud en los términos de la Ley 1581 de 2012.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Usamos almacenamiento local para recordar tu carrito, tema visual, preferencias de privacidad y, si lo autorizas, métricas de uso. Puedes borrarlas desde tu navegador.',
        ],
      },
    ],
  },
  {
    slug: 'terminos',
    title: 'Términos y condiciones de venta',
    intro:
      'Estos términos regulan la compra de productos en ' + site.brand.url + '. Al realizar un pedido aceptas estos términos.',
    sections: [
      {
        heading: 'Productos y precios',
        paragraphs: [
          'Los productos se ofrecen según disponibilidad. Los precios están en pesos colombianos (COP) e incluyen los impuestos aplicables según el régimen de ' + site.brand.name + '.',
          'Nos reservamos el derecho de actualizar precios y disponibilidad sin previo aviso. El precio vigente es el mostrado al confirmar el pedido.',
        ],
      },
      {
        heading: 'Forma de pago',
        paragraphs: [
          'La única forma de pago es contraentrega en efectivo al recibir el pedido. No pedimos datos de tarjeta ni realizamos cobros anticipados.',
          site.payments.codNote,
        ],
      },
      {
        heading: 'Envíos',
        paragraphs: [
          'Enviamos a todo Colombia con un tiempo estimado de ' + site.shipping.estimate + '. El costo de envío se muestra en el checkout y se confirma por WhatsApp.',
          'El tiempo de entrega puede variar por zona, disponibilidad y temporadas altas.',
        ],
      },
      {
        heading: 'Confirmación del pedido',
        paragraphs: [
          'Todo pedido se confirma por WhatsApp antes de despachar. Si no logramos contactarte en 24 horas, el pedido puede cancelarse y el stock liberarse.',
        ],
      },
      {
        heading: 'Responsabilidad',
        paragraphs: [
          site.brand.name + ' no se hace responsable por daños derivados del uso indebido del producto ni por demoras atribuibles a terceros (transportadoras, fuerza mayor).',
        ],
      },
      {
        heading: 'Ley aplicable',
        paragraphs: [
          'Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se somete a los jueces competentes de Colombia.',
        ],
      },
    ],
  },
  {
    slug: 'envios',
    title: 'Envíos',
    intro: 'Así funciona el envío de tus pedidos en ' + site.brand.name + '.',
    sections: [
      {
        heading: 'Cobertura',
        paragraphs: ['Enviamos a ' + site.shipping.coverage + '.'],
      },
      {
        heading: 'Tiempos',
        paragraphs: ['Tiempo estimado de entrega: ' + site.shipping.estimate + ' desde la confirmación del pedido.'],
      },
      {
        heading: 'Costo',
        paragraphs: [
          'El envío es gratis a nivel nacional. No cobramos por el envío de tu pedido.',
          site.shipping.note,
        ],
      },
      {
        heading: 'Seguimiento',
        paragraphs: ['Te enviamos la guía de la transportadora por WhatsApp cuando se despacha tu pedido.'],
      },
    ],
  },
  {
    slug: 'devoluciones',
    title: 'Devoluciones y retracto',
    intro:
      'Puedes ejercer tu derecho de retracto en los términos del Estatuto del Consumidor (Ley 1480 de 2011).',
    sections: [
      {
        heading: 'Derecho de retracto',
        paragraphs: [
          'Tienes ' + site.legal.returnsDays + ' días hábiles desde la entrega para retractarte, siempre que el producto esté sin uso, en su empaque original y con todos sus accesorios.',
        ],
      },
      {
        heading: 'Productos no retornables',
        paragraphs: [
          'Por higiene y seguridad, no se aceptan devoluciones de productos de uso personal una vez abiertos. Tampoco productos personalizados.',
        ],
      },
      {
        heading: 'Proceso',
        paragraphs: [
          'Escríbenos por WhatsApp con tu código de pedido y el motivo. Coordinamos la recogida y el reembolso del valor del producto. El costo del envío de devolución puede correr por tu cuenta salvo que el motivo sea un defecto de fábrica.',
        ],
      },
      {
        heading: 'Garantía',
        paragraphs: ['Los defectos de fábrica se atienden bajo la garantía del producto. Ver sección Garantía.'],
      },
    ],
  },
  {
    slug: 'garantia',
    title: 'Garantía',
    intro: 'Todos los productos incluyen garantía contra defectos de fábrica.',
    sections: [
      {
        heading: 'Cobertura',
        paragraphs: [
          'La garantía cubre defectos de fabricación y funcionamiento normal durante el periodo indicado en la ficha del producto (por defecto ' + site.legal.warrantyMonthsDefault + ' meses).',
        ],
      },
      {
        heading: 'No cubre',
        paragraphs: [
          'No cubre daños por mal uso, caídas, líquidos, modificaciones ni desgaste normal. Tampoco cubre accesorios consumibles.',
        ],
      },
      {
        heading: 'Cómo hacerla efectiva',
        paragraphs: [
          'Escríbenos por WhatsApp con tu código de pedido, fotos o video del problema y el número de serie si aplica. Te guiamos en el proceso con el proveedor.',
        ],
      },
    ],
  },
  {
    slug: 'contacto',
    title: 'Contacto',
    intro: 'Estamos para ayudarte.',
    sections: [
      {
        heading: 'Canales',
        paragraphs: [
          'WhatsApp: ' + site.contact.whatsappDisplay + ' (' + site.contact.hours + ').',
          'Correo: ' + site.contact.email + '.',
          'Instagram: ' + site.contact.instagramHandle + '.',
          'Respuesta: ' + site.contact.responseTime + '.',
        ],
      },
      {
        heading: 'Ubicación',
        paragraphs: [site.business.city ? site.business.city + ', ' + site.business.country : site.contact.city + '.'],
      },
    ],
  },
]

export const faqItems = [
  {
    q: '¿Cómo pago mi pedido?',
    a: 'Pago contraentrega en efectivo al recibir tu pedido. No pedimos datos de tarjeta ni cobramos anticipos.',
  },
  {
    q: '¿Hacen envíos a todo Colombia?',
    a: `Sí, enviamos a todo Colombia con envío gratis. Tiempo estimado de entrega: ${site.shipping.estimate}. Pagas al recibir (contraentrega).`,
  },
  {
    q: '¿Cuánto tarda en llegar?',
    a: `Entre ${site.shipping.estimate} desde la confirmación del pedido. Te enviamos la guía por WhatsApp.`,
  },
  {
    q: '¿Puedo cancelar o devolver?',
    a: `Tienes ${site.legal.returnsDays} días hábiles para ejercer retracto si el producto está sin uso y en su empaque. Escríbenos por WhatsApp con tu código de pedido.`,
  },
  {
    q: '¿Los productos tienen garantía?',
    a: `Sí, garantía contra defectos de fábrica por el periodo indicado en cada ficha (por defecto ${site.legal.warrantyMonthsDefault} meses).`,
  },
  {
    q: '¿Cómo sé que mi pedido se recibió?',
    a: 'Al confirmar, recibes un código de pedido. Te contactamos por WhatsApp para validar stock, dirección y costo de envío antes de despachar.',
  },
  {
    q: '¿Qué pasa si un producto está "a pedido"?',
    a: 'Lo importamos o lo conseguimos con el proveedor. Entrega en 7–15 días hábiles. Te confirmamos fecha antes de despachar.',
  },
  {
    q: '¿Atienden por WhatsApp?',
    a: `Sí, ${site.contact.whatsappDisplay}, ${site.contact.hours}. También por correo a ${site.contact.email}.`,
  },
]
