import { useNavigate, Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { XipeWordmark } from '../components/Logo'
import { Field, TextInput, Button } from '../components/ui'
import { useMock } from '../data/MockProvider'

export default function Login() {
  const nav = useNavigate()
  const { login } = useMock()
  const submit = (e) => { e.preventDefault(); login(); nav('/home') }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full pt-10">
        <div className="flex justify-center mb-2"><XipeWordmark size={56} /></div>
        <p className="text-center text-neutral-400 text-sm mb-10">se pronuncia "chipe"</p>

        <h1 className="text-2xl font-bold mb-1">Bienvenido</h1>
        <p className="text-neutral-400 text-sm mb-8">Ingresa a tu cuenta de cliente</p>

        <form onSubmit={submit}>
          <Field label="Correo">
            <TextInput type="email" placeholder="tucorreo@mail.com" defaultValue="gerardo@xipe.mx" />
          </Field>
          <Field label="Contraseña">
            <TextInput type="password" placeholder="••••••••" defaultValue="123456" />
          </Field>
          <div className="text-right mb-6">
            <span className="text-xs text-brand">¿Olvidaste tu contraseña?</span>
          </div>
          <Button type="submit">Entrar</Button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-brand font-semibold">Regístrate</Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
