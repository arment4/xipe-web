import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button } from '../components/ui'
import { useMock } from '../data/MockProvider'

const emojis = ['🎯', '🏝️', '🚗', '🏠', '💍', '🎓', '✈️', '💻']

export default function XipeNew() {
  const nav = useNavigate()
  const { createGoal } = useMock()
  const [f, setF] = useState({
    photo: '🎯', title: '', contribution: '', target: '', termMonths: '', initialPayment: '',
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const ok = f.title && f.target && f.contribution && f.termMonths
  const submit = () => {
    const g = createGoal(f)
    nav(`/xipebox/${g.id}`)
  }

  return (
    <PhoneFrame>
      <ScreenHeader title="Crear alcancía" subtitle="Define tu nueva meta de ahorro" />

      <Field label="Foto / ícono">
        <div className="flex flex-wrap gap-2">
          {emojis.map((e) => (
            <button key={e} onClick={() => setF({ ...f, photo: e })}
              className={`w-11 h-11 rounded-2xl text-xl grid place-items-center border transition ${
                f.photo === e ? 'border-brand bg-brand/15' : 'border-ink-800 bg-ink-850'}`}>
              {e}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Título">
        <TextInput value={f.title} onChange={set('title')} placeholder="Viaje a Cancún" />
      </Field>
      <Field label="Aportación (por periodo)">
        <TextInput type="number" value={f.contribution} onChange={set('contribution')} placeholder="1500" />
      </Field>
      <Field label="Meta">
        <TextInput type="number" value={f.target} onChange={set('target')} placeholder="10000" />
      </Field>
      <Field label="Plazo (meses)">
        <TextInput type="number" value={f.termMonths} onChange={set('termMonths')} placeholder="6" />
      </Field>
      <Field label="Pago inicial (opcional)">
        <TextInput type="number" value={f.initialPayment} onChange={set('initialPayment')} placeholder="1000" />
      </Field>

      <Button onClick={submit} className={!ok ? 'opacity-40 pointer-events-none' : ''}>
        Crear alcancía
      </Button>
    </PhoneFrame>
  )
}
