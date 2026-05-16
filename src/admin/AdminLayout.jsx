import { NavLink, useNavigate } from 'react-router-dom'
import { XipeMark } from '../components/Logo'

const nav = [
  { to: '/admin', label: 'Clientes', end: true },
  { to: '/admin/withdrawals', label: 'Solicitudes de retiro' },
  { to: '/admin/support', label: 'Mensajes a soporte' },
]

export function AdminLayout({ title, children }) {
  const go = useNavigate()
  return (
    <div className="min-h-screen flex bg-[#060606] text-white">
      <aside className="w-64 shrink-0 border-r border-ink-800 bg-ink-950 p-5 hidden md:flex flex-col">
        <div className="flex items-center gap-2.5 mb-8">
          <XipeMark size={36} />
          <div>
            <p className="font-extrabold leading-none">Xipe</p>
            <p className="text-[11px] text-neutral-500">Panel administrativo</p>
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-brand text-ink-950' : 'text-neutral-400 hover:bg-ink-850'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => go('/home')}
          className="text-xs text-neutral-500 hover:text-brand text-left">← Ir a la app móvil</button>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <header className="border-b border-ink-800 px-8 py-5">
          <h1 className="text-xl font-bold">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    activo: 'bg-brand/15 text-brand',
    'al-corriente': 'bg-brand/15 text-brand',
    verificación: 'bg-amber-500/15 text-amber-400',
    pendiente: 'bg-amber-500/15 text-amber-400',
    abierto: 'bg-amber-500/15 text-amber-400',
    suspendido: 'bg-red-500/15 text-red-400',
    rechazada: 'bg-red-500/15 text-red-400',
    aprobada: 'bg-brand/15 text-brand',
    cerrado: 'bg-ink-700 text-neutral-400',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status] || 'bg-ink-700 text-neutral-400'}`}>
      {status}
    </span>
  )
}
