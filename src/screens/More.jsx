import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/MobileLayout'
import { ScreenHeader } from '../components/ui'
import { IcWallet, IcSend, IcDown, IcArrowRight, IcBox, IcSwap, IcBell, IcUser } from '../components/Icons'

const links = [
  { label: 'Agregar dinero', to: '/add-money', Icon: IcWallet },
  { label: 'Enviar dinero', to: '/send', Icon: IcSend },
  { label: 'Retirar dinero', to: '/withdraw', Icon: IcDown },
  { label: 'Solicitar dinero', to: '/request', Icon: IcArrowRight },
  { label: 'Metas (XipeBox)', to: '/xipebox', Icon: IcBox },
  { label: 'Historial de transacciones', to: '/transactions', Icon: IcSwap },
  { label: 'Notificaciones', to: '/notifications', Icon: IcBell },
  { label: 'Perfil', to: '/profile', Icon: IcUser },
]

export default function More() {
  const nav = useNavigate()
  return (
    <MobileLayout>
      <ScreenHeader title="Más opciones" back={false} />
      <div className="space-y-2">
        {links.map(({ label, to, Icon }) => (
          <button key={to} onClick={() => nav(to)}
            className="w-full flex items-center gap-4 rounded-2xl bg-ink-900 border border-ink-800 p-4 text-left">
            <span className="text-brand"><Icon width={20} height={20} /></span>
            <span className="flex-1 font-medium text-sm">{label}</span>
            <IcArrowRight width={16} height={16} className="text-neutral-600" />
          </button>
        ))}
      </div>
    </MobileLayout>
  )
}
