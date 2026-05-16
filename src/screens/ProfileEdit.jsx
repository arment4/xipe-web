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
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const save = () => {
    updateProfile({ ...f, firstName: f.name.split(' ')[0] })
    setSaved(true)
    setTimeout(() => nav('/profile'), 900)
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
      <Button onClick={save}>Guardar cambios</Button>
      <Toast show={saved} text="Perfil actualizado" />
    </PhoneFrame>
  )
}
