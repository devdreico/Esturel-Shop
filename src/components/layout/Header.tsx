import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { CartBadge } from '../cart/CartBadge'
import { ThemeToggle } from './ThemeToggle'

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/noticias', label: 'Noticias' },
  { to: '/asesor', label: 'Asesor' },
]

export function Header() {
  const { count, openCart } = useCart()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12))

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'glass border-b border-line/60 shadow-card dark:shadow-card-dark' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Esturel inicio">
            <img src="/esturel-logo.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-tight">ESTUREL</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-6 md:flex" aria-label="Principal">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-link text-sm font-semibold transition-colors hover:text-urple-500 ${
                    isActive ? 'text-urple-500' : 'text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <span data-active={isActive ? 'true' : 'false'}>{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <form
            className="ml-auto hidden max-w-xs flex-1 sm:block"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo')
            }}
          >
            <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 focus-within:border-urple-500/50 focus-within:shadow-glow-sm">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className="text-muted"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                aria-label="Buscar productos"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1.5 sm:ml-2">
            <ThemeToggle />
            <CartBadge count={count} pulseKey={count} onClick={openCart} />
            <button
              type="button"
              className="glass rounded-full p-2 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong border-b border-line px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Móvil">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-urple-500/15 text-urple-500'
                      : 'hover:bg-urple-500/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <form
            className="mt-3"
            onSubmit={(e) => {
              e.preventDefault()
              const q = query.trim()
              setMobileOpen(false)
              navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo')
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos…"
              className="glass w-full rounded-full px-4 py-2.5 text-sm outline-none focus:border-urple-500/50"
              aria-label="Buscar productos"
            />
          </form>
        </motion.div>
      )}
    </header>
  )
}
