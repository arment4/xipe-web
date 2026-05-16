import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, SuccessScreen } from '../components/ui'
import { useMock, money } from '../data/MockProvider'

export default function Request() {
  const nav = useNavigate()
  const { user } = useMock()
  const [from, setFrom] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const n = Number(amount)
  const ok = n > 0

  const params = new URLSearchParams({ to: user.email, name: user.name })
  if (n > 0) params.set('amount', String(n))
  if (msg) params.set('concept', msg)
  const payUrl = `${window.location.origin}/send?${params.toString()}`

  const share = () => {
    if (navigator.share) navigator.share({ title: 'Solicitud de pago Xipe', url: payUrl }).catch(() => {})
    else { navigator.clipboard?.writeText(payUrl); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  if (done) return (
    <PhoneFrame>
      <SuccessScreen title="¡Solicitud enviada!"
        detail={from ? `Le pediste ${money(n)} a ${from}` : `Solicitud de ${money(n)} generada`}
        onClose={() => nav('/home')} />
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <ScreenHeader title="Solicitar dinero" subtitle="Genera un QR de cobro o pide a un usuario" />

      <Field label="Monto a solicitar">
        <TextInput type="number" inputMode="decimal" placeholder="0.00"
          value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Mensaje (opcional)">
        <TextInput value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Te paso la cuenta de la cena" />
      </Field>

      <div className="rounded-3xl bg-ink-900 border border-ink-800 p-5 text-center mb-5">
        <p className="text-sm text-neutral-400 mb-3">
          {ok ? 'Que escaneen este QR para pagarte' : 'Ingresa un monto para generar el QR'}
        </p>
        <div className={`mx-auto w-fit rounded-2xl bg-white p-4 mb-3 transition ${ok ? '' : 'opacity-30 blur-[1px]'}`}>
          <QRCodeSVG value={payUrl} size={170} level="M" fgColor="#0A0A0A" bgColor="#ffffff" />
        </div>
        {ok && <p className="text-accent font-semibold">Solicitando {money(n)}</p>}
        <p className="text-[11px] text-neutral-500 mt-1">
          Al escanearlo se abre la app del otro usuario lista para pagarte.
        </p>
        <button onClick={share}
          className={`btn-ghost mt-4 ${!ok ? 'opacity-40 pointer-events-none' : ''}`}>
          {copied ? '¡Enlace copiado!' : 'Compartir enlace de cobro'}
        </button>
      </div>

      <Field label="O envía la solicitud a un usuario (opcional)">
        <TextInput value={from} onChange={(e) => setFrom(e.target.value)} placeholder="juan@mail.com" />
      </Field>

      <Button onClick={() => setDone(true)} className={!ok ? 'opacity-40 pointer-events-none' : ''}>
        Enviar solicitud
      </Button>
    </PhoneFrame>
  )
}
