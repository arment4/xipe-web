import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { XipeMark } from '../components/Logo'
import { Field, TextInput, FileInput, Button } from '../components/ui'
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
          <Field label="Identificación oficial (INE o pasaporte)">
            <FileInput label="Anexar identificación" />
          </Field>
          <Field label="Dirección — calle y código postal">
            <TextInput value={f.address} onChange={set('address')} placeholder="Calle 123, CP 00000" />
          </Field>
          <Field label="Comprobante de domicilio">
            <FileInput label="Anexar comprobante" />
          </Field>
          <Field label="Correo">
            <TextInput type="email" value={f.email} onChange={set('email')} placeholder="tucorreo@mail.com" />
          </Field>
          <Field label="Depósito inicial (por default)" hint="Se asigna automáticamente al abrir la cuenta">
            <TextInput value="$7,000.00 USD" disabled className="opacity-60" />
          </Field>
          <Field label="Contraseña">
            <TextInput type="password" placeholder="••••••••" />
          </Field>
          <Button type="submit" className="mt-2">Registrarme</Button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-5 mb-2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
