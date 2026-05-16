import { useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcCheck } from './Icons'

export function SuccessScreen({ title, detail, onClose, closeLabel = 'Volver al inicio' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center pt-20">
      <div className="w-20 h-20 rounded-full bg-brand grid place-items-center text-brandink mb-6 shadow-glow">
        <IcCheck width={40} height={40} />
      </div>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-neutral-400 text-sm mb-1">{detail}</p>
      <p className="text-neutral-500 text-xs mb-10">Prototipo — sin movimiento de dinero real</p>
      <Button onClick={onClose}>{closeLabel}</Button>
    </div>
  )
}

export function ScreenHeader({ title, subtitle, back = true, right = null }) {
  const nav = useNavigate()
  return (
    <div className="flex items-center gap-3 pt-2 pb-4">
      {back && (
        <button onClick={() => nav(-1)}
          className="w-9 h-9 rounded-full bg-ink-850 border border-ink-800 grid place-items-center text-fg shrink-0">
          <IcArrowLeft width={18} height={18} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl bg-ink-900 border border-ink-800 p-5 ${className}`}>
      {children}
    </div>
  )
}

export function Field({ label, hint, children }) {
  return (
    <div className="mb-4">
      {label && <label className="app-label">{label}</label>}
      {children}
      {hint && <p className="text-[11px] text-neutral-500 mt-1">{hint}</p>}
    </div>
  )
}

export function TextInput(props) {
  return <input {...props} className={`app-input ${props.className || ''}`} />
}

export function FileInput({ label }) {
  return (
    <label className="block w-full rounded-2xl border border-dashed border-ink-600 bg-ink-850 px-4 py-5 text-center text-sm text-neutral-400 cursor-pointer hover:border-brand/50 transition">
      <span className="text-accent font-medium">📎 {label}</span>
      <span className="block text-[11px] mt-1">JPG, PNG o PDF (prototipo — no se sube)</span>
      <input type="file" className="hidden" />
    </label>
  )
}

export function ProgressBar({ value, max, showPct = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full bg-ink-800 overflow-hidden">
        <div className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${pct}%` }} />
      </div>
      {showPct && <span className="text-accent text-sm font-semibold w-10 text-right">{pct}%</span>}
    </div>
  )
}

export function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`}>
      {children}
    </button>
  )
}

export function Toast({ show, text }) {
  if (!show) return null
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50 bg-brand text-brandink font-semibold text-sm px-5 py-3 rounded-2xl shadow-glow animate-pulse">
      {text}
    </div>
  )
}
