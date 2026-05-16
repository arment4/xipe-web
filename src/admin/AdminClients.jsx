import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, StatusBadge } from './AdminLayout'
import { useMock, money } from '../data/MockProvider'

export default function AdminClients() {
  const nav = useNavigate()
  const { clients } = useMock()
  const [q, setQ] = useState('')
  const filtered = clients.filter((c) =>
    (c.name + c.email).toLowerCase().includes(q.toLowerCase()))
  const total = clients.reduce((s, c) => s + c.balance, 0)

  return (
    <AdminLayout title="Clientes">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Kpi label="Clientes" value={clients.length} />
        <Kpi label="Balance total" value={money(total)} />
        <Kpi label="Activos" value={clients.filter((c) => c.status === 'activo').length} />
      </div>

      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cliente por nombre o correo…"
        className="app-input max-w-sm mb-5" />

      <div className="rounded-2xl border border-ink-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-neutral-400 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">Balance</th>
              <th className="px-5 py-3 font-medium">Estatus</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-ink-800 hover:bg-ink-900">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-neutral-400">{c.email}</td>
                <td className="px-5 py-3 font-semibold">{money(c.balance)}</td>
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => nav(`/admin/clients/${c.id}`)}
                    className="text-brand text-xs font-medium">Ver detalle →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl bg-ink-900 border border-ink-800 p-5">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
