import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout, StatusBadge } from './AdminLayout'
import { useMock, money } from '../data/MockProvider'

export default function AdminClientDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { clients, transactions } = useMock()
  const client = clients.find((c) => c.id === id)

  if (!client) return (
    <AdminLayout title="Cliente">
      <p className="text-neutral-400">Cliente no encontrado.</p>
    </AdminLayout>
  )

  return (
    <AdminLayout title={`Cliente · ${client.name}`}>
      <button onClick={() => nav('/admin')} className="text-accent text-sm mb-5">← Volver a clientes</button>

      <div className="grid grid-cols-3 gap-4 mb-7">
        <div className="rounded-2xl bg-ink-900 border border-ink-800 p-5 col-span-2">
          <p className="text-lg font-bold">{client.name}</p>
          <p className="text-sm text-neutral-400">{client.email}</p>
          <div className="mt-3"><StatusBadge status={client.status} /></div>
        </div>
        <div className="rounded-2xl bg-ink-900 border border-ink-800 p-5">
          <p className="text-xs text-neutral-500">Balance</p>
          <p className="text-2xl font-bold mt-1">{money(client.balance)}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Transacciones</h2>
      <div className="rounded-2xl border border-ink-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-neutral-400 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Concepto</th>
              <th className="px-5 py-3 font-medium">Método</th>
              <th className="px-5 py-3 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-ink-800">
                <td className="px-5 py-3 text-neutral-400">{t.date}</td>
                <td className="px-5 py-3">{t.concept}</td>
                <td className="px-5 py-3 text-neutral-400">{t.method}</td>
                <td className={`px-5 py-3 text-right font-semibold ${
                  t.type === 'in' ? 'text-accent' : 'text-fg'}`}>
                  {t.type === 'in' ? '+' : '−'}{money(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
