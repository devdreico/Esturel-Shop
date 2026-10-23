import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroSlides } from '../../data/heroSlides'

const INTERVAL_MS = 5000

/**
 * Carrusel del hero: rotación automática con crossfade + Ken Burns,
 * barra de progreso y dots. Pausa con hover/focus y se detiene con
 * prefers-reduced-motion (muestra el primer slide estático).
 */
export function HeroCarousel() {
  const reduce = useReducedMotion()
  const [[index, direction], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  const total = heroSlides.length
  const goTo = useCallback(
    (next: number, dir: number) => {
      setState([((next % total) + total) % total, dir])
    },
    [total],
  )

  useEffect(() => {
    if (reduce || paused) return
    timerRef.current = window.setTimeout(() => {
      goTo(index + 1, 1)
    }, INTERVAL_MS)
    return () => window.clearTimeout(timerRef.current)
  }, [index, paused, reduce, goTo])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const slide = heroSlides[index]!
  const nextIndex = (index + 1) % total

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="glass-strong relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-video">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12, x: direction * 48 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, x: 0, transition: { duration: 0.9, ease: [0, 0, 0.2, 1] } }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    opacity: 0,
                    scale: 1.06,
                    transition: { duration: 0.7, ease: [0.4, 0, 1, 1] },
                  }
            }
          >
            <motion.img
              src={slide.src}
              alt={slide.alt}
              width={1400}
              height={788}
              className="h-full w-full object-cover"
              initial={reduce ? undefined : { scale: 1 }}
              animate={reduce ? undefined : { scale: 1.07 }}
              transition={{ duration: INTERVAL_MS / 1000 + 1, ease: 'linear' }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Capas decorativas */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-urple-600/20 via-transparent to-transparent mix-blend-screen" />
        <div className="noise-overlay pointer-events-none absolute inset-0" />

        {/* Caption flotante */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            className="absolute bottom-12 right-4 left-4 flex flex-wrap items-end justify-between gap-3 sm:bottom-14 sm:right-6 sm:left-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-urple-400" />
                {slide.label}
              </span>
              <p className="mt-2 text-lg font-bold text-white drop-shadow sm:text-2xl">
                {slide.caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1.5 sm:right-6 sm:bottom-5">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Ver ${s.label}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Barra de progreso */}
        {!reduce && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <motion.div
              key={`${slide.id}-${paused}`}
              className="h-full bg-gradient-to-r from-urple-400 to-urple-500"
              initial={{ width: '0%' }}
              animate={{ width: paused ? undefined : '100%' }}
              transition={{
                duration: paused ? 0 : INTERVAL_MS / 1000,
                ease: 'linear',
              }}
              style={paused ? { width: '0%' } : undefined}
            />
          </div>
        )}

        {/* Hint de swipe visual (dots ya permiten tap) */}
        {!reduce && (
          <div className="absolute top-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/80 backdrop-blur-md">
            {index + 1} / {total}
          </div>
        )}

        {/* Precarga del siguiente */}
        <link rel="prefetch" as="image" href={heroSlides[nextIndex]!.src} />
      </div>

      {/* Sombra / glow bajo el carrusel */}
      <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-3xl bg-urple-500/20 blur-2xl" />
    </div>
  )
}
