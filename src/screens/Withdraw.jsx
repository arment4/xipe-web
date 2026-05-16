import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, SuccessScreen } from '../components/ui'
import { useMock, money } from '../data/MockProvider'

export default function Withdraw() {
  const nav = useNavigate()
  const { requestWithdrawal, balance } = useMock()
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [done, setDone] = useState(false)

  const n = Number(amount)
  const ok = account && n > 0 && n <= balance.total
  const submit = () => { requestWithdrawal(n, account); setDone(true) }

  if (done) return (
    <PhoneFrame>
      <SuccessScreen title="Solicitud de retiro creada"
        detail={`${money(n)} a ${account} — en revisión`}
        onClose={() => nav('/home')} />
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <ScreenHeader title="Retirar dinero" subtitle={`Disponible: ${money(balance.total)}`} />
      <Field label="Cuenta destino (CLABE o banco)">
        <TextInput value={account} onChange={(e) => setAccount(e.target.value)}
          placeholder="BBVA ****4521" />
      </Field>
      <Field label="Monto a retirar">
        <TextInput type="number" inputMode="decimal" placeholder="0.00"
          value={amount} onChange={(e) => setAmount(e.target.value)} />
        {n > balance.total && <p className="text-red-400 text-xs mt-1.5">Saldo insuficiente</p>}
      </Field>
      <div className="bg-ink-850 border border-ink-800 rounded-2xl p-4 text-xs text-neutral-400 mb-6">
        Los retiros se procesan tras aprobación del equipo Xipe (visible en el panel admin).
      </div>
      <Button onClick={submit} className={!ok ? 'opacity-40 pointer-events-none' : ''}>
        Solicitar retiro
      </Button>
    </PhoneFrame>
  )
}
