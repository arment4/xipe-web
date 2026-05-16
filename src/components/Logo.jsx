export function XipeMark({ size = 36 }) {
  return (
    <div
      className="rounded-2xl bg-brand flex items-center justify-center font-black text-ink-950 shadow-glow"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M5 5l14 14M19 5 5 19" />
      </svg>
    </div>
  )
}

export function XipeWordmark({ size = 36 }) {
  return (
    <div className="flex items-center gap-2.5">
      <XipeMark size={size} />
      <span className="text-2xl font-extrabold tracking-tight">Xipe</span>
    </div>
  )
}
