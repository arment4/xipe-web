import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeCtx = createContext(null)
const KEY = 'xipe-theme'         // 'system' | 'light' | 'dark'

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

function apply(mode) {
  const effective = mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode
  document.documentElement.dataset.theme = effective
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(KEY) || 'dark')

  useEffect(() => {
    apply(mode)
    localStorage.setItem(KEY, mode)
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  const value = { mode, setMode: useCallback((m) => setMode(m), []) }
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => {
  const c = useContext(ThemeCtx)
  if (!c) throw new Error('useTheme fuera de ThemeProvider')
  return c
}
