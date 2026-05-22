import { MobileLayout } from '../components/MobileLayout'
import { useMock, money } from '../data/MockProvider'

export default function HCBox() {
  const { balance } = useMock()
  return (
    <MobileLayout>
      <div className="pt-4">
        <div className="rounded-3xl bg-gradient-to-b from-cyan-500/15 to-ink-900 border border-cyan-500/20 p-5 mb-5">
          <div className="text-cyan-600 font-extrabold text-xl">HCBOX</div>
          <p className="text-sm text-neutral-400">Planes de inversión estructurados</p>
          <div className="text-4xl text-center my-3">📦</div>
          <p className="text-xs text-neutral-500">Total invertido</p>
          <p className="text-2xl font-bold">{money(balance.hcboxTotal)}</p>
        </div>

        <button className="btn-primary">Notifícame cuando esté listo</button>
      </div>
    </MobileLayout>
  )
}
