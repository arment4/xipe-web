import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button, Toast } from '../components/ui'
import { useMock } from '../data/MockProvider'

export default function ProfileEdit() {
  const nav = useNavigate()
  const { user, updateProfile } = useMock()
  const [f, setF] = useState({ name: user.name, phone: user.phone, email: user.email, address: user.address })
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const save = async () => {
    setErr('')
    try {
      setLoading(true)
      await updateProfile({ name: f.name, phone: f.phone, email: f.email, address: f.address })
      setSaved(true)
      setTimeout(() => nav('/profile'), 900)
    } catch (e) { setErr(e.message); setLoading(false) }
  }

  return (
    <PhoneFrame>
      <ScreenHeader title="Editar perfil" />
      <Field label="Nombre completo">
        <TextInput value={f.name} onChange={set('name')} />
      </Field>
      <Field label="Celular">
        <TextInput value={f.phone} onChange={set('phone')} />
      </Field>
      <Field label="Correo">
        <TextInput value={f.email} onChange={set('email')} />
      </Field>
      <Field label="Dirección">
        <TextInput value={f.address} onChange={set('address')} />
      </Field>
      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
      <Button onClick={save} className={loading ? 'opacity-40 pointer-events-none' : ''}>
        {loading ? 'Guardando…' : 'Guardar cambios'}
      </Button>
      <Toast show={saved} text="Perfil actualizado" />
    </PhoneFrame>
  )
}
