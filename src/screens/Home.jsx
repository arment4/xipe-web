import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/MobileLayout'
import { XipeMark } from '../components/Logo'
import { BalanceChart } from '../components/BalanceChart'
import { ProgressBar } from '../components/ui'
import { useMock, money } from '../data/MockProvider'
import { IcBell, IcUser, IcEye, IcWallet, IcSend, IcPie, IcDots, IcArrowRight } from '../components/Icons'

const actions = [
  { label: 'Agregar dinero', to: '/add-money', Icon: IcWallet },
  { label: 'Enviar', to: '/send', Icon: IcSend },
  { label: 'Resumen', to: '/transactions', Icon: IcPie },
  { label: 'Más', to: '/more', Icon: IcDots },
]

export default function Home() {
  const nav = useNavigate()
  const { user, balance, goals } = useMock()
  const [hide, setHide] = useState(false)

  return (
    <MobileLayout>
      <header className="flex items-center justify-between pt-3 pb-5">
        <XipeMark size={40} />
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/notifications')}
            className="relative w-10 h-10 rounded-full bg-ink-850 border border-ink-800 grid place-items-center">
            <IcBell width={18} height={18} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-brand rounded-full" />
          </button>
          <button onClick={() => nav('/profile')}
            className="w-10 h-10 rounded-full bg-ink-850 border border-ink-800 grid place-items-center">
            <IcUser width={18} height={18} />
          </button>
        </div>
      </header>

      <h2 className="text-2xl font-bold">Hola, {user.firstName || user.name.split(' ')[0]} 👋</h2>
      <p className="text-sm text-neutral-400 mb-5">Este es el resumen de tu patrimonio.</p>

      <div className="rounded-3xl bg-gradient-to-br from-ink-850 to-ink-900 border border-ink-800 p-5 overflow-hidden relative">
        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
          Balance general
          <button onClick={() => setHide((h) => !h)}><IcEye width={16} height={16} /></button>
        </div>
        <div className="text-4xl font-extrabold tracking-tight">
          {hide ? '••••••' : money(balance.total, balance.currency)}
        </div>
        <div className="text-neutral-500 text-sm mt-0.5">{balance.currency}</div>
        <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-brand/15 text-brand text-xs font-medium">
          ↗ +{balance.monthChangePct}% este mes
        </div>
        <div className="-mx-5 -mb-5 mt-2"><BalanceChart height={90} /></div>
      </div>

      <div className="grid grid-cols-4 gap-3 my-5">
        {actions.map(({ label, to, Icon }) => (
          <button key={label} onClick={() => nav(to)} className="quick-action">
            <Icon width={20} height={20} />
            <span className="text-[11px] font-medium text-white leading-tight text-center">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={() => nav('/xipebox')}
          className="text-left rounded-3xl bg-gradient-to-b from-brand/15 to-ink-900 border border-brand/20 p-4">
          <div className="text-brand font-extrabold text-lg">XIPEBOX</div>
          <p className="text-xs text-neutral-400 mb-6">Tu alcancía virtual</p>
          <div className="text-5xl text-center mb-3">🐷</div>
          <p className="text-[11px] text-neutral-500">Total ahorrado</p>
          <div className="flex items-center justify-between">
            <span className="text-brand font-bold">{money(balance.xipeboxTotal)}</span>
            <IcArrowRight width={16} height={16} />
          </div>
        </button>
        <button onClick={() => nav('/hcbox')}
          className="text-left rounded-3xl bg-gradient-to-b from-cyan-500/10 to-ink-900 border border-cyan-500/20 p-4">
          <div className="text-cyan-300 font-extrabold text-lg">HCBOX</div>
          <p className="text-xs text-neutral-400 mb-3">Planes de inversión estructurados</p>
          <div className="text-5xl text-center mb-3">📦</div>
          <p className="text-[11px] text-neutral-500">Total invertido</p>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">{money(balance.hcboxTotal)}</span>
            <IcArrowRight width={16} height={16} />
          </div>
        </button>
      </div>

      <div className="rounded-3xl bg-ink-900 border border-ink-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Tus metas</h3>
          <button onClick={() => nav('/xipebox')} className="text-brand text-sm font-medium">
            Ver todas ›
          </button>
        </div>
        <div className="space-y-4">
          {goals.map((g) => (
            <button key={g.id} onClick={() => nav(`/xipebox/${g.id}`)}
              className="w-full flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-full bg-ink-800 grid place-items-center text-xl shrink-0">
                {g.photo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium truncate">{g.title}</span>
                  <span className="text-neutral-500 text-xs">
                    {money(g.saved)} / {money(g.target)}
                  </span>
                </div>
                <ProgressBar value={g.saved} max={g.target} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}
