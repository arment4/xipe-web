export function BalanceChart({ height = 90 }) {
  const pts = [10, 22, 16, 30, 26, 44, 38, 60, 70, 64, 82]
  const w = 320, h = height, max = 90
  const step = w / (pts.length - 1)
  const line = pts.map((p, i) => `${i * step},${h - (p / max) * h}`).join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none"
      style={{ height }}>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6F24E" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C6F24E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#g)" />
      <polyline points={line} fill="none" stroke="#C6F24E" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - (pts[pts.length - 1] / max) * h} r="5" fill="#C6F24E" />
    </svg>
  )
}
