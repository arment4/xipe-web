import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button } from '../components/ui'
import { useMock, money } from '../data/MockProvider'
import { IcCard, IcCoin, IcCheck } from '../components/Icons'

const MIN = 100, MAX = 130000

export default function AddMoney() {
  const nav = useNavigate()
  const { addMoney } = useMock()
  const [method, setMethod] = useState('Stripe')
  const [amount, setAmount] = useState('')
  const [done, setDone] = useState(false)

  const n = Number(amount)
  const err = amount && (n < MIN ? `Mínimo ${money(MIN)}` : n > MAX ? `Máximo ${money(MAX)}` : '')
  const ok = n >= MIN && n <= MAX

  const submit = () => { addMoney(n, method); setDone(true) }

  if (done) return (
    <PhoneFrame>
      <Success amount={n} method={method} onClose={() => nav('/home')} />
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <ScreenHeader title="Agregar dinero" subtitle="Recarga tu balance" />

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { k: 'Stripe', Icon: IcCard, d: 'Tarjeta de crédito/débito' },
          { k: 'Crypto', Icon: IcCoin, d: 'USDT · BTC · ETH' },
        ].map(({ k, Icon, d }) => (
          <button key={k} onClick={() => setMethod(k)}
            className={`rounded-2xl border p-4 text-left transition ${
              method === k ? 'border-brand bg-brand/10' : 'border-ink-800 bg-ink-850'}`}>
            <Icon width={22} height={22} className="text-accent" />
            <div className="font-semibold mt-2">{k}</div>
            <div className="text-[11px] text-neutral-500">{d}</div>
          </button>
        ))}
      </div>

      <Field label="Monto a depositar" hint={`Mín ${money(MIN)} · Máx ${money(MAX)}`}>
        <TextInput type="number" inputMode="decimal" placeholder="0.00"
          value={amount} onChange={(e) => setAmount(e.target.value)} />
        {err && <p className="text-red-500 text-xs mt-1.5">{err}</p>}
      </Field>

      <div className="flex gap-2 mb-6">
        {[500, 1000, 5000, 10000].map((q) => (
          <button key={q} onClick={() => setAmount(String(q))}
            className="flex-1 rounded-xl bg-ink-800 border border-ink-700 py-2 text-xs font-medium">
            ${q.toLocaleString()}
          </button>
        ))}
      </div>

      {n >= 50000 && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-xs text-neutral-300 mb-6">
          🛡️ Para montos altos necesitamos verificar tu identidad.
          <button onClick={() => nav('/profile/verification')}
            className="text-accent font-semibold ml-1">Subir documentos →</button>
        </div>
      )}

      <Button onClick={submit} className={!ok ? 'opacity-40 pointer-events-none' : ''}>
        Continuar con {method}
      </Button>
    </PhoneFrame>
  )
}

function Success({ amount, method, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center pt-20">
      <div className="w-20 h-20 rounded-full bg-brand grid place-items-center text-brandink mb-6 shadow-glow">
        <IcCheck width={40} height={40} />
      </div>
      <h2 className="text-2xl font-bold mb-1">¡Depósito exitoso!</h2>
      <p className="text-neutral-400 text-sm mb-1">{money(amount)} vía {method}</p>
      <p className="text-neutral-500 text-xs mb-10">Prototipo — no se procesó ningún cobro real</p>
      <Button onClick={onClose}>Volver al inicio</Button>
    </div>
  )
}
