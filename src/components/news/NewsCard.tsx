import { motion, useReducedMotion } from 'framer-motion'
import { relativeTime } from '../../lib/format'
import type { NewsItem } from '../../data/types'

export function NewsCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration: reduce ? 0.15 : 0.45,
        delay: reduce ? 0 : Math.min(index * 0.05, 0.35),
        ease: [0, 0, 0.2, 1],
      }}
      className="glass-card group flex h-full flex-col gap-2 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide">
        <span className="rounded-full bg-urple-500/15 px-2 py-0.5 text-urple-500">
          {item.source}
        </span>
        <span className="text-muted">{relativeTime(item.date)}</span>
      </div>
      <h3 className="text-base leading-snug font-bold transition-colors group-hover:text-urple-500">
        {item.title}
      </h3>
      {item.summary && (
        <p className="line-clamp-3 text-sm text-muted">{item.summary}</p>
      )}
      <span className="mt-auto pt-2 text-xs font-bold text-urple-500 opacity-0 transition group-hover:opacity-100">
        Leer en fuente →
      </span>
    </motion.a>
  )
}

export function NewsSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-5 w-full rounded-lg" />
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
    </div>
  )
}
