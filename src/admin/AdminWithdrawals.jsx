import { AdminLayout, StatusBadge } from './AdminLayout'
import { useMock, money } from '../data/MockProvider'

export default function AdminWithdrawals() {
  const { withdrawals, setWithdrawalStatus } = useMock()

  return (
    <AdminLayout title="Solicitudes de retiro">
      <div className="rounded-2xl border border-ink-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-neutral-400 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Cuenta</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Monto</th>
              <th className="px-5 py-3 font-medium">Estatus</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-t border-ink-800">
                <td className="px-5 py-3 font-medium">{w.client}</td>
                <td className="px-5 py-3 text-neutral-400">{w.account}</td>
                <td className="px-5 py-3 text-neutral-400">{w.date}</td>
                <td className="px-5 py-3 font-semibold">{money(w.amount)}</td>
                <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
                <td className="px-5 py-3 text-right">
                  {w.status === 'pendiente' ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setWithdrawalStatus(w.id, 'aprobada')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand text-brandink">
                        Aprobar
                      </button>
                      <button onClick={() => setWithdrawalStatus(w.id, 'rechazada')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/40 text-red-500">
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-600">Procesada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
