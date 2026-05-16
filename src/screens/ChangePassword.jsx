import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, Toast } from '../components/ui'

export default function ChangePassword() {
  const nav = useNavigate()
  const [f, setF] = useState({ cur: '', next: '', conf: '' })
  const [saved, setSaved] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const match = f.next && f.next === f.conf
  const ok = f.cur && match

  const save = () => { setSaved(true); setTimeout(() => nav('/profile'), 900) }

  return (
    <PhoneFrame>
      <ScreenHeader title="Cambiar contraseña" />
      <Field label="Contraseña actual">
        <TextInput type="password" value={f.cur} onChange={set('cur')} placeholder="••••••••" />
      </Field>
      <Field label="Nueva contraseña">
        <TextInput type="password" value={f.next} onChange={set('next')} placeholder="••••••••" />
      </Field>
      <Field label="Confirmar nueva contraseña">
        <TextInput type="password" value={f.conf} onChange={set('conf')} placeholder="••••••••" />
        {f.conf && !match && <p className="text-red-400 text-xs mt-1.5">No coinciden</p>}
      </Field>
      <Button onClick={save} className={!ok ? 'opacity-40 pointer-events-none' : ''}>
        Actualizar contraseña
      </Button>
      <Toast show={saved} text="Contraseña actualizada" />
    </PhoneFrame>
  )
}
