import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { XipeWordmark } from '../components/Logo'
import { Field, TextInput, Button } from '../components/ui'
import { useMock } from '../data/MockProvider'

export default function Login() {
  const nav = useNavigate()
  const { login } = useMock()
  const [email, setEmail] = useState('gerardo@xipe.mx')
  const [password, setPassword] = useState('demo1234')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      setLoading(true)
      const u = await login(email, password)
      nav(u?.role === 'ADMIN' ? '/admin' : '/home')
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full pt-10">
        <div className="flex justify-center mb-2"><XipeWordmark size={56} /></div>
        <p className="text-center text-neutral-400 text-sm mb-10">hazlo a tu manera</p>

        <h1 className="text-2xl font-bold mb-1">Bienvenido</h1>
        <p className="text-neutral-400 text-sm mb-8">Ingresa a tu cuenta de cliente</p>

        <form onSubmit={submit}>
          <Field label="Correo">
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@mail.com" />
          </Field>
          <Field label="Contraseña">
            <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" />
          </Field>
          <div className="text-right mb-6">
            <span className="text-xs text-accent">¿Olvidaste tu contraseña?</span>
          </div>
          {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
          <Button type="submit" className={loading ? 'opacity-60' : ''}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-accent font-semibold">Regístrate</Link>
        </p>
      </div>
    </PhoneFrame>
  )
}
