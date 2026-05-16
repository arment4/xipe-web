import { useState } from 'react'
import { AdminLayout, StatusBadge } from './AdminLayout'
import { useMock } from '../data/MockProvider'

export default function AdminSupport() {
  const { support, setSupportStatus } = useMock()
  const [active, setActive] = useState(support[0]?.id)
  const [reply, setReply] = useState('')
  const [sent, setSent] = useState(false)
  const msg = support.find((s) => s.id === active)

  return (
    <AdminLayout title="Mensajes a soporte">
      <div className="grid grid-cols-3 gap-5">
        <div className="space-y-2">
          {support.map((s) => (
            <button key={s.id} onClick={() => { setActive(s.id); setSent(false); setReply('') }}
              className={`w-full text-left rounded-2xl border p-4 transition ${
                active === s.id ? 'border-brand bg-brand/5' : 'border-ink-800 bg-ink-900'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{s.client}</span>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-sm truncate">{s.subject}</p>
              <p className="text-[11px] text-neutral-500 mt-1">{s.date}</p>
            </button>
          ))}
        </div>

        <div className="col-span-2 rounded-2xl border border-ink-800 bg-ink-900 p-6">
          {msg ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">{msg.subject}</p>
                  <p className="text-sm text-neutral-400">{msg.client} · {msg.date}</p>
                </div>
                <StatusBadge status={msg.status} />
              </div>
              <p className="text-sm bg-ink-850 rounded-2xl p-4 mb-5">{msg.body}</p>

              <textarea value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder="Escribe una respuesta…" rows={4}
                className="app-input mb-3" />
              <div className="flex gap-3">
                <button onClick={() => { setSent(true); setSupportStatus(msg.id, 'cerrado') }}
                  className="px-5 py-2.5 rounded-xl bg-brand text-brandink font-semibold text-sm">
                  Enviar y cerrar
                </button>
                {sent && <span className="text-accent text-sm self-center">✓ Respuesta enviada (prototipo)</span>}
              </div>
            </>
          ) : (
            <p className="text-neutral-500 text-sm">Selecciona un mensaje.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
