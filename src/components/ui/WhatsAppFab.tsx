import { waUrl } from '../../lib/whatsapp'

/**
 * Botón flotante de WhatsApp (click-to-chat) hacia +57 314 457 2008.
 * Posicionado encima de BackToTop (bottom-4) para no solaparse.
 */
export function WhatsAppFab() {
  return (
    <a
      href={waUrl('Hola Esturel, quiero información sobre sus productos.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:right-6"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16.01 3C9.39 3 4 8.28 4 14.77c0 2.07.56 4.08 1.63 5.86L4 29l8.6-2.24a12.3 12.3 0 0 0 3.41.48c6.62 0 12.01-5.28 12.01-11.77C28.02 8.28 22.63 3 16.01 3Zm0 21.5c-1.13 0-2.24-.29-3.22-.85l-.23-.13-5.1 1.33 1.36-4.9-.15-.24a9.2 9.2 0 0 1-1.42-4.94c0-5.14 4.28-9.32 9.55-9.32 5.27 0 9.55 4.18 9.55 9.32 0 5.14-4.28 9.73-9.34 9.73Zm5.24-6.98c-.29-.14-1.7-.83-1.96-.93-.26-.1-.45-.14-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.21-.62.07-.29-.14-1.21-.44-2.3-1.4-.85-.74-1.42-1.66-1.59-1.94-.17-.29-.02-.44.12-.58.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.53-.88-2.1-.23-.55-.46-.48-.64-.48h-.54c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.82 1.17 3.01c.14.19 2.02 3.06 4.89 4.29.68.29 1.21.47 1.63.6.68.21 1.3.18 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
      </svg>
    </a>
  )
}
