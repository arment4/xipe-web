import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { XipeMark } from '../components/Logo'
import { Field, TextInput, Button } from '../components/ui'
import { useMock } from '../data/MockProvider'

export default function Register() {
  const nav = useNavigate()
  const { register } = useMock()
  const [f, setF] = useState({ name: '', phone: '', address: '', email: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    register({ name: f.name || 'Nuevo Cliente', phone: f.phone, address: f.address, email: f.email })
    nav('/home')
  }

  return (
    <PhoneFrame>
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-1">
          <XipeMark size={40} />
          <h1 className="text-xl font-bold">Crear cuenta</h1>
        </div>
        <p className="text-neutral-400 text-sm mb-6">Regístrate como cliente Xipe</p>

        <form onSubmit={submit}>
          <Field label="Nombre completo">
            <TextInput value={f.name} onChange={set('name')} placeholder="Gerardo Heredia" />
          </Field>
          <Field label="Celular">
            <TextInput value={f.phone} onChange={set('phone')} placeholder="+52 55 0000 0000" />
          </Field>
          <Field label="Dirección — calle y código postal">
            <TextInput value={f.address} onChange={set('address')} placeholder="Calle 123, CP 00000" />
          </Field>
          <Field label="Correo">
            <TextInput type="email" value={f.email} onChange={set('email')} placeholder="tucorreo@mail.com" />
          </Field>
          <Field label="Contraseña">
            <TextInput type="password" placeholder="••••••••" />
          </Field>
          <div className="rounded-2xl bg-ink-850 border border-ink-800 p-4 text-xs text-neutral-400 mb-5">
            Tu cuenta se crea sin depósito inicial. Podrás agregar dinero cuando
            quieras. La verificación de identidad se solicita solo al agregar montos
            altos o al retirar a tu banco.
          </div>
          <Button type="submit" className="mt-1">Crear cuenta</Button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-5 mb-2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-accent font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
