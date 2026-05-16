import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, ProgressBar, Button, Field, TextInput } from '../components/ui'
import { useMock, money } from '../data/MockProvider'

export default function XipeDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { goals, contributeGoal } = useMock()
  const goal = goals.find((g) => g.id === id)
  const [extra, setExtra] = useState('')

  if (!goal) return (
    <PhoneFrame>
      <ScreenHeader title="Alcancía" />
      <p className="text-neutral-400 text-sm">No encontramos esta alcancía.</p>
    </PhoneFrame>
  )

  const pct = Math.round((goal.saved / goal.target) * 100)
  const remaining = Math.max(0, goal.target - goal.saved)

  return (
    <PhoneFrame>
      <ScreenHeader title={goal.title} subtitle="Detalle de tu alcancía" />

      <div className="rounded-3xl bg-gradient-to-b from-brand/15 to-ink-900 border border-brand/20 p-6 text-center mb-5">
        <div className="text-6xl mb-3">{goal.photo}</div>
        <div className="text-3xl font-extrabold">{money(goal.saved)}</div>
        <p className="text-neutral-400 text-sm mb-4">de {money(goal.target)}</p>
        <ProgressBar value={goal.saved} max={goal.target} />
        {goal.status === 'vencida' && (
          <p className="text-red-400 text-xs mt-3">⚠️ Alcancía vencida — ponte al corriente</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
        {[
          ['Progreso', `${pct}%`],
          ['Falta', money(remaining)],
          ['Aportación', money(goal.contribution)],
          ['Plazo', `${goal.termMonths} meses`],
          ['Pago inicial', money(goal.initialPayment)],
          ['Estatus', goal.status === 'vencida' ? 'Vencida' : 'Al corriente'],
        ].map(([k, v]) => (
          <div key={k} className="bg-ink-850 rounded-2xl p-3">
            <p className="text-[11px] text-neutral-500">{k}</p>
            <p className="font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <Field label="Aportar ahora">
        <TextInput type="number" value={extra} onChange={(e) => setExtra(e.target.value)}
          placeholder={String(goal.contribution)} />
      </Field>
      <Button onClick={() => { contributeGoal(goal.id, Number(extra) || goal.contribution); setExtra('') }}>
        Hacer aportación
      </Button>
      <button onClick={() => nav('/xipebox')} className="btn-ghost mt-3">
        Volver a XipeBox
      </button>
    </PhoneFrame>
  )
}
