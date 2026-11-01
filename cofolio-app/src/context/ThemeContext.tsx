import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const THEME_KEY = 'cofolio.theme.v2'
const DEFAULT_THEME = 'light'

function loadTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {}
  return DEFAULT_THEME
}

interface ThemeContextValue {
  theme: 'dark' | 'light'
  toggle: () => void
  set: (t: 'dark' | 'light') => void
}

const ThemeCtx = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  toggle: () => {},
  set: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(loadTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const value = useMemo(() => ({ theme, toggle, set: setTheme }), [theme, toggle])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
