import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const paths = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />,
}

export function ThemeToggle() {
  const { isDark, toggle, pref, setPref } = useTheme()

  return (
    <button
      type="button"
      onClick={() => {
        if (pref === 'system') setPref(isDark ? 'light' : 'dark')
        else toggle()
      }}
      className="glass relative rounded-full p-2 hover:border-urple-500/40"
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={pref === 'system' ? 'Tema del sistema' : pref}
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        className="block"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {isDark ? paths.moon : paths.sun}
        </svg>
      </motion.span>
    </button>
  )
}
