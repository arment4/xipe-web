import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/MobileLayout'
import { ScreenHeader } from '../components/ui'
import { useMock } from '../data/MockProvider'
import { IcEdit, IcLock, IcKey, IcArrowRight } from '../components/Icons'

export default function Profile() {
  const nav = useNavigate()
  const { user, logout } = useMock()

  const items = [
    { label: 'Editar perfil', to: '/profile/edit', Icon: IcEdit },
    { label: 'Cambiar contraseña', to: '/profile/password', Icon: IcLock },
    { label: 'Generar / cambiar PIN', to: '/profile/pin', Icon: IcKey },
  ]

  return (
    <MobileLayout>
      <ScreenHeader title="Perfil" back={false} />
      <div className="flex flex-col items-center mb-7">
        <div className="w-20 h-20 rounded-full bg-brand text-ink-950 grid place-items-center text-2xl font-bold mb-3">
          {user.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
        </div>
        <p className="text-lg font-bold">{user.name}</p>
        <p className="text-sm text-neutral-400">{user.email}</p>
      </div>

      <div className="space-y-2">
        {items.map(({ label, to, Icon }) => (
          <button key={to} onClick={() => nav(to)}
            className="w-full flex items-center gap-4 rounded-2xl bg-ink-900 border border-ink-800 p-4 text-left">
            <span className="text-brand"><Icon width={20} height={20} /></span>
            <span className="flex-1 font-medium text-sm">{label}</span>
            <IcArrowRight width={16} height={16} className="text-neutral-600" />
          </button>
        ))}
      </div>

      <button onClick={() => { logout(); nav('/login') }}
        className="btn-ghost mt-6 text-red-400 border-red-500/30">
        Cerrar sesión
      </button>
      <p className="text-center text-xs text-neutral-600 mt-4">
        Panel admin: <button onClick={() => nav('/admin')} className="text-brand">/admin</button>
      </p>
    </MobileLayout>
  )
}
