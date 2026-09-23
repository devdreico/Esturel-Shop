import { motion } from 'framer-motion'

type Props = {
  count: number
  pulseKey?: string | number
  onClick?: () => void
}

export function CartBadge({ count, pulseKey, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-full p-2 transition hover:bg-urple-500/10"
      aria-label={`Carrito, ${count} artículos`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {count > 0 && (
        <motion.span
          key={pulseKey ?? count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-urple-500 px-1 text-[11px] font-bold text-white shadow-glow-sm"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </button>
  )
}
