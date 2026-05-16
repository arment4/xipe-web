export function PhoneFrame({ children, nav }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-page py-0 sm:py-8">
      <div className="relative w-full sm:w-[400px] bg-ink-950 sm:rounded-[44px] sm:border-[10px] sm:border-ink-800 sm:shadow-2xl overflow-hidden flex flex-col"
        style={{ minHeight: '100vh', maxHeight: '100vh' }}>
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-ink-800 rounded-b-2xl z-30" />
        <div className="flex items-center justify-between px-7 pt-3 pb-1 text-xs font-medium text-fg/90 shrink-0">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span>📶</span><span>🔋</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-28">{children}</div>
        {nav}
      </div>
    </div>
  )
}
