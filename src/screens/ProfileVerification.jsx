import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, FileInput, Button, Toast } from '../components/ui'

export default function ProfileVerification() {
  const nav = useNavigate()
  const [saved, setSaved] = useState(false)

  const send = () => { setSaved(true); setTimeout(() => nav('/profile'), 1000) }

  return (
    <PhoneFrame>
      <ScreenHeader title="Verificación de identidad" subtitle="Opcional — agiliza tus operaciones" />

      <div className="rounded-2xl bg-ink-850 border border-ink-800 p-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
            Pendiente
          </span>
        </div>
        <p className="text-sm text-neutral-400 mt-2">
          No es obligatoria para usar Xipe. Te la pediremos solo cuando agregues
          montos altos o realices un retiro a tu banco. Puedes adelantarla aquí
          para no tener fricción después.
        </p>
      </div>

      <Field label="Identificación oficial (INE o pasaporte)">
        <FileInput label="Anexar identificación" />
      </Field>
      <Field label="Comprobante de domicilio">
        <FileInput label="Anexar comprobante" />
      </Field>

      <Button onClick={send}>Enviar documentos</Button>
      <button onClick={() => nav('/profile')} className="btn-ghost mt-3">
        Ahora no
      </button>

      <Toast show={saved} text="Documentos enviados a revisión" />
    </PhoneFrame>
  )
}
