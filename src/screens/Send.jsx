import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, SuccessScreen } from '../components/ui'
import { QrScanner } from '../components/QrScanner'
import { useMock, money } from '../data/MockProvider'

function parseScan(text) {
  try {
    const u = new URL(text)
    return {
      to: u.searchParams.get('to') || '',
      name: u.searchParams.get('name') || '',
      amount: u.searchParams.get('amount') || '',
      concept: u.searchParams.get('concept') || '',
    }
  } catch {
    return { to: text.trim(), name: '', amount: '', concept: '' }
  }
}

export default function Send() {
  const nav = useNavigate()
  const { sendMoney, balance } = useMock()
  const [sp] = useSearchParams()

  const [to, setTo] = useState(sp.get('to') || '')
  const [name, setName] = useState(sp.get('name') || '')
  const [amount, setAmount] = useState(sp.get('amount') || '')
  const [concept, setConcept] = useState(sp.get('concept') || '')
  const [scan, setScan] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const n = Number(amount)
  const ok = to && n > 0 && n <= balance.total
  const submit = async () => {
    setErr('')
    try {
      setLoading(true)
      await sendMoney(name || to, n, concept)
      setDone(true)
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  const onScan = (text) => {
    const r = parseScan(text)
    setTo(r.to); setName(r.name)
    if (r.amount) setAmount(r.amount)
    if (r.concept) setConcept(r.concept)
    setScan(false)
  }

  if (done) return (
    <PhoneFrame>
      <SuccessScreen title="¡Dinero enviado!" detail={`${money(n)} a ${name || to}`}
        onClose={() => nav('/home')} />
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      {scan && <QrScanner onResult={onScan} onClose={() => setScan(false)} />}

      <ScreenHeader title="Enviar dinero" subtitle={`Disponible: ${money(balance.total)}`} />

      <button onClick={() => setScan(true)}
        className="w-full rounded-2xl border border-brand/40 bg-brand/10 text-accent font-semibold py-4 mb-5 flex items-center justify-center gap-2">
        <span className="text-lg">⛶</span> Escanear QR para pagar
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-ink-800" />
        <span className="text-xs text-neutral-500">o ingresa los datos</span>
        <div className="flex-1 h-px bg-ink-800" />
      </div>

      {name && (
        <div className="rounded-2xl bg-brand/10 border border-brand/30 p-3 mb-4 text-sm">
          Pagando a <span className="font-semibold text-accent">{name}</span>
        </div>
      )}

      <Field label="Destinatario (correo, celular o usuario Xipe)">
        <TextInput value={to} onChange={(e) => { setTo(e.target.value); setName('') }}
          placeholder="maria@mail.com" />
      </Field>
      <Field label="Monto">
        <TextInput type="number" inputMode="decimal" placeholder="0.00"
          value={amount} onChange={(e) => setAmount(e.target.value)} />
        {n > balance.total && <p className="text-red-500 text-xs mt-1.5">Saldo insuficiente</p>}
      </Field>
      <Field label="Concepto (opcional)">
        <TextInput value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Pago renta" />
      </Field>
      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
      <Button onClick={submit} className={!ok || loading ? 'opacity-40 pointer-events-none' : ''}>
        {loading ? 'Enviando…' : `Enviar ${n > 0 ? money(n) : ''}`}
      </Button>
      <button onClick={() => nav('/receive')} className="btn-ghost mt-3">Recibir dinero</button>
    </PhoneFrame>
  )
}
