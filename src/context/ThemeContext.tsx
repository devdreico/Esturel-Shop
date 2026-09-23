import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '../lib/storage'

export type ThemePref = 'system' | 'light' | 'dark'

export type ThemeContextValue = {
  pref: ThemePref
  isDark: boolean
  setPref: (p: ThemePref) => void
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveDark(pref: ThemePref): boolean {
  if (pref === 'dark') return true
  if (pref === 'light') return false
  return systemDark()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.theme)
      if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
    } catch {
      /* ignore */
    }
    return 'system'
  })
  const [isDark, setIsDark] = useState(() => resolveDark(pref))

  useEffect(() => {
    const apply = () => {
      const dark = resolveDark(pref)
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    try {
      localStorage.setItem(STORAGE_KEYS.theme, pref)
    } catch {
      /* ignore */
    }
    if (pref !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [pref])

  const setPref = useCallback((p: ThemePref) => setPrefState(p), [])
  const toggle = useCallback(() => {
    setPrefState((p) => (resolveDark(p) ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ pref, isDark, setPref, toggle }),
    [pref, isDark, setPref, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
