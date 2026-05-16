import { MobileLayout } from '../components/MobileLayout'
import { useMock, money } from '../data/MockProvider'

const plans = [
  { name: 'HC Conservador', rate: '6% anual', risk: 'Bajo', min: 5000 },
  { name: 'HC Balanceado', rate: '11% anual', risk: 'Medio', min: 10000 },
  { name: 'HC Agresivo', rate: '18% anual', risk: 'Alto', min: 25000 },
]

export default function HCBox() {
  const { balance } = useMock()
  return (
    <MobileLayout>
      <div className="pt-4">
        <div className="rounded-3xl bg-gradient-to-b from-cyan-500/15 to-ink-900 border border-cyan-500/20 p-5 mb-5">
          <div className="text-cyan-300 font-extrabold text-xl">HCBOX</div>
          <p className="text-sm text-neutral-400">Planes de inversión estructurados</p>
          <div className="text-4xl text-center my-3">📦</div>
          <p className="text-xs text-neutral-500">Total invertido</p>
          <p className="text-2xl font-bold">{money(balance.hcboxTotal)}</p>
        </div>
        <h3 className="font-bold mb-3">Planes disponibles</h3>
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.name} className="rounded-3xl bg-ink-900 border border-ink-800 p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-neutral-500">Riesgo {p.risk} · desde {money(p.min)}</p>
              </div>
              <span className="text-cyan-300 font-bold text-sm">{p.rate}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-600 mt-6">Prototipo — sección demostrativa</p>
      </div>
    </MobileLayout>
  )
}
