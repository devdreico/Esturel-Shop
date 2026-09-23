import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../../hooks/useCart'
import { formatCOP } from '../../lib/format'

export function AddToast() {
  const { lastAddedId, items } = useCart()
  const line = items.find((i) => i.product.id === lastAddedId)

  return (
    <AnimatePresence>
      {line && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="glass-strong fixed bottom-6 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2.5 shadow-glow-sm"
          role="status"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-urple-500 text-xs font-bold text-white">
            ✓
          </span>
          <div className="text-sm">
            <p className="font-bold">Añadido al carrito</p>
            <p className="text-xs text-muted">
              {line.product.name} · {formatCOP(line.product.priceCOP)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
