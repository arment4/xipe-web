import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/MobileLayout'
import { ProgressBar, Button } from '../components/ui'
import { useMock, money } from '../data/MockProvider'
import { IcArrowRight } from '../components/Icons'

export default function XipeBox() {
  const nav = useNavigate()
  const { goals, balance } = useMock()

  return (
    <MobileLayout>
      <div className="pt-4 pb-2">
        <div className="rounded-3xl bg-gradient-to-b from-brand/15 to-ink-900 border border-brand/20 p-5 mb-5">
          <div className="text-accent font-extrabold text-xl">XIPEBOX</div>
          <p className="text-sm text-neutral-400">Tu alcancía virtual — ahorra y alcanza tus metas</p>
          <div className="text-4xl text-center my-3">🐷</div>
          <p className="text-xs text-neutral-500">Total ahorrado</p>
          <p className="text-2xl font-bold text-accent">{money(balance.xipeboxTotal)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button onClick={() => nav('/xipebox/simulate')} variant="ghost">Simular alcancía</Button>
          <Button onClick={() => nav('/xipebox/new')}>Crear alcancía</Button>
        </div>

        <h3 className="font-bold mb-3">Mis alcancías</h3>
        <div className="space-y-3">
          {goals.map((g) => (
            <button key={g.id} onClick={() => nav(`/xipebox/${g.id}`)}
              className="w-full flex items-center gap-3 text-left rounded-3xl bg-ink-900 border border-ink-800 p-4">
              <div className="w-12 h-12 rounded-2xl bg-ink-800 grid place-items-center text-2xl shrink-0">
                {g.photo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold truncate">{g.title}</span>
                  {g.status === 'vencida' && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">Vencida</span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mb-2">
                  {money(g.saved)} de {money(g.target)}
                </p>
                <ProgressBar value={g.saved} max={g.target} />
              </div>
              <IcArrowRight width={16} height={16} className="text-neutral-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}
