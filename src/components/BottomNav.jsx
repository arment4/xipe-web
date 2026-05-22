import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { IcHome, IcSwap, IcBox, IcUser, IcWallet, IcSend, IcDown, IcArrowRight } from './Icons'

const items = [
  { to: '/home', label: 'Inicio', Icon: IcHome },
  { to: '/transactions', label: 'Movimientos', Icon: IcSwap },
  { to: 'FAB' },
  { to: '/xipebox', label: 'XipeBox', Icon: IcBox },
  { to: '/profile', label: 'Perfil', Icon: IcUser },
]

export function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const quick = [
    { label: 'Agregar dinero', to: '/add-money', Icon: IcWallet },
    { label: 'Enviar dinero', to: '/send', Icon: IcSend },
    { label: 'Retirar dinero', to: '/withdraw', Icon: IcDown },
    { label: 'Solicitar dinero', to: '/request', Icon: IcArrowRight },
    { label: 'Metas (XipeBox)', to: '/xipebox', Icon: IcBox },
  ]

  return (
    <>
      {open && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end"
          onClick={() => setOpen(false)}>
          <div className="w-full bg-ink-900 border-t border-ink-800 rounded-t-3xl p-5 pb-8 mb-20"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ink-700 rounded-full mx-auto mb-4" />
            <p className="text-sm font-semibold mb-3 text-neutral-300">Acciones rápidas</p>
            <div className="grid grid-cols-2 gap-3">
              {quick.map(({ label, to, Icon }) => (
                <button key={to}
                  onClick={() => { setOpen(false); nav(to) }}
                  className="quick-action !py-5">
                  <Icon />
                  <span className="text-xs font-medium text-fg">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="absolute bottom-0 left-0 right-0 z-30 bg-ink-900/95 backdrop-blur border-t border-ink-800 px-3 pt-2 pb-4">
        <div className="flex items-end justify-between">
          {items.map((it, i) => {
            if (it.to === 'FAB') {
              return (
                <button key="fab" onClick={() => setOpen((o) => !o)}
                  className="w-14 h-14 -mt-7 rounded-full bg-brand text-brandink grid place-items-center shadow-glow font-black text-2xl active:scale-95 transition">
                  ✕
                </button>
              )
            }
            const active = pathname === it.to
            const { Icon } = it
            return (
              <button key={it.to} onClick={() => nav(it.to)}
                className={`flex flex-col items-center gap-1 flex-1 ${active ? 'text-accent' : 'text-neutral-500'}`}>
                <Icon width={22} height={22} />
                <span className="text-[10px] font-medium">{it.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
