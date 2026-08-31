import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, Toast } from '../components/ui'
import { useMock } from '../data/MockProvider'

export default function ChangePassword() {
  const nav = useNavigate()
  const { changePassword } = useMock()
  const [f, setF] = useState({ cur: '', next: '', conf: '' })
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const match = f.next && f.next === f.conf
  const ok = f.cur && match && f.next.length >= 6

  const save = async () => {
    setErr('')
    if (f.next.length < 6) { setErr('La nueva contraseña debe tener al menos 6 caracteres'); return }
    try {
      setLoading(true)
      await changePassword(f.cur, f.next)
      setSaved(true)
      setTimeout(() => nav('/profile'), 900)
    } catch (e) { setErr(e.message); setLoading(false) }
  }

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
        {f.conf && !match && <p className="text-red-500 text-xs mt-1.5">No coinciden</p>}
      </Field>
      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
      <Button onClick={save} className={!ok || loading ? 'opacity-40 pointer-events-none' : ''}>
        {loading ? 'Actualizando…' : 'Actualizar contraseña'}
      </Button>
      <Toast show={saved} text="Contraseña actualizada" />
    </PhoneFrame>
  )
}
