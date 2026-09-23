import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-urple-500 via-urple-400 to-urple-600"
      aria-hidden
    />
  )
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10%' }}
      transition={{
        duration: reduce ? 0.15 : 0.5,
        delay: reduce ? 0 : delay,
        ease: [0, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  index = 0,
  className,
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration: reduce ? 0.15 : 0.45,
        delay: reduce ? 0 : Math.min(index * 0.05, 0.4),
        ease: [0, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadePage({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: reduce ? 0.12 : 0.3, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
