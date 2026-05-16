import { useTheme } from './Theme'

const opts = [
  { k: 'light', label: 'Claro', icon: '☀' },
  { k: 'dark', label: 'Oscuro', icon: '☾' },
  { k: 'system', label: 'OS', icon: '🖥' },
]

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme()
  return (
    <div className="fixed top-3 right-3 z-[60] flex items-center gap-1 rounded-full
                    bg-ink-900/90 backdrop-blur border border-ink-700 p-1 shadow-lg">
      {opts.map((o) => (
        <button key={o.k} onClick={() => setMode(o.k)} title={`Tema: ${o.label}`}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
            mode === o.k ? 'bg-brand text-brandink' : 'text-neutral-400 hover:text-fg'}`}>
          <span aria-hidden>{o.icon}</span>
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
