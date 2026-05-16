import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Card, Button, Field, TextInput } from '../components/ui'
import { useMock, money } from '../data/MockProvider'

export default function Receive() {
  const { user } = useMock()
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)

  const handle = (user.email || 'cliente').split('@')[0]
  const params = new URLSearchParams({ to: user.email, name: user.name })
  if (Number(amount) > 0) params.set('amount', String(Number(amount)))
  const payUrl = `${window.location.origin}/send?${params.toString()}`

  const share = () => {
    if (navigator.share) navigator.share({ title: 'Págame con Xipe', url: payUrl }).catch(() => {})
    else { navigator.clipboard?.writeText(payUrl); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  return (
    <PhoneFrame>
      <ScreenHeader title="Recibir dinero" subtitle="Que escaneen tu QR para pagarte" />

      <Card className="text-center">
        <div className="mx-auto w-fit rounded-2xl bg-white p-4 mb-4">
          <QRCodeSVG value={payUrl} size={180} level="M"
            fgColor="#0A0A0A" bgColor="#ffffff" />
        </div>
        <p className="text-sm text-neutral-400">Tu usuario Xipe</p>
        <p className="text-lg font-bold mb-1">@{handle}</p>
        {Number(amount) > 0 && (
          <p className="text-brand font-semibold mb-2">Solicitando {money(Number(amount))}</p>
        )}
        <p className="text-[11px] text-neutral-500 mb-4">
          Al escanearlo se abre la app de la otra persona lista para enviarte dinero.
        </p>

        <div className="text-left">
          <Field label="Solicitar un monto (opcional)">
            <TextInput type="number" inputMode="decimal" placeholder="0.00"
              value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
        </div>

        <div className="text-left bg-ink-850 rounded-2xl p-4 text-sm space-y-1 mb-5">
          <p><span className="text-neutral-500">Nombre:</span> {user.name}</p>
          <p><span className="text-neutral-500">Correo:</span> {user.email}</p>
          <p><span className="text-neutral-500">Celular:</span> {user.phone}</p>
        </div>

        <Button onClick={share}>{copied ? '¡Enlace copiado!' : 'Compartir enlace de cobro'}</Button>
      </Card>
    </PhoneFrame>
  )
}
