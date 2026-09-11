import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/MobileLayout'
import { ScreenHeader } from '../components/ui'
import { useMock } from '../data/MockProvider'
import { IcEdit, IcLock, IcKey, IcShield, IcArrowRight } from '../components/Icons'

export default function Profile() {
  const nav = useNavigate()
  const { user, logout } = useMock()

  const verified = !!user.identityVerified

  const items = [
    { label: 'Editar perfil', to: '/profile/edit', Icon: IcEdit },
    {
      label: 'Verificación de identidad',
      to: '/profile/verification',
      Icon: IcShield,
      iconClass: verified ? 'text-emerald-500' : 'text-amber-500',
      badge: verified
        ? { text: 'Verificado', cls: 'bg-emerald-500/15 text-emerald-500' }
        : { text: 'Sin verificar', cls: 'bg-amber-500/15 text-amber-500' },
    },
    { label: 'Cambiar contraseña', to: '/profile/password', Icon: IcLock },
    { label: 'Generar / cambiar PIN', to: '/profile/pin', Icon: IcKey },
  ]

  return (
    <MobileLayout>
      <ScreenHeader title="Perfil" back={false} />
      <div className="flex flex-col items-center mb-7">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-brand text-brandink grid place-items-center text-2xl font-bold">
            {user.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
          </div>
          <span
            title={verified ? 'Identidad verificada' : 'Identidad sin verificar'}
            className={`absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full grid place-items-center border-2 border-page ${
              verified ? 'bg-emerald-500 text-white' : 'bg-ink-800 text-amber-500 border-ink-800'
            }`}
          >
            {verified ? '✓' : '!'}
          </span>
        </div>
        <p className="text-lg font-bold">{user.name}</p>
        <p className="text-sm text-neutral-400">{user.email}</p>
      </div>

      <div className="space-y-2">
        {items.map(({ label, to, Icon, iconClass, badge }) => (
          <button key={to} onClick={() => nav(to)}
            className="w-full flex items-center gap-4 rounded-2xl bg-ink-900 border border-ink-800 p-4 text-left">
            <span className={iconClass || 'text-accent'}><Icon width={20} height={20} /></span>
            <span className="flex-1 font-medium text-sm">{label}</span>
            {badge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                {badge.text}
              </span>
            )}
            <IcArrowRight width={16} height={16} className="text-neutral-600" />
          </button>
        ))}
      </div>

      <button onClick={() => { logout(); nav('/login') }}
        className="btn-ghost mt-6 text-red-500 border-red-500/30">
        Cerrar sesión
      </button>
    </MobileLayout>
  )
}
