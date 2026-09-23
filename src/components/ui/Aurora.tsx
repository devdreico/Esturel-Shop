import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AuroraBackdrop() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120])
  const y2 = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -80])
  const y3 = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 60])

  return (
    <div className="aurora-page" aria-hidden>
      <motion.div
        style={{ y: y1 }}
        className="aurora-blob -top-32 -left-24 h-[420px] w-[420px] bg-urple-500"
      />
      <motion.div
        style={{ y: y2 }}
        className="aurora-blob top-1/3 -right-32 h-[380px] w-[380px] bg-urple-400"
      />
      <motion.div
        style={{ y: y3 }}
        className="aurora-blob bottom-0 left-1/3 h-[320px] w-[320px] bg-urple-600"
      />
      <div className="noise-overlay" />
    </div>
  )
}

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="glass fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full text-ink shadow-glow-sm sm:right-6 sm:bottom-6"
      aria-label="Volver arriba"
    >
      <span aria-hidden className="text-lg leading-none">↑</span>
    </motion.button>
  )
}
