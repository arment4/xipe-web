import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, ProgressBar, Button, Field, TextInput } from '../components/ui'
import { useMock, money } from '../data/MockProvider'

export default function XipeDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { goals, contributeGoal, breakGoal } = useMock()
  const goal = goals.find((g) => g.id === id)
  const [extra, setExtra] = useState('')
  const [confirmBreak, setConfirmBreak] = useState(false)

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
          <p className="text-red-500 text-xs mt-3">⚠️ Alcancía vencida — ponte al corriente</p>
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

      <button onClick={() => setConfirmBreak(true)}
        className="w-full rounded-2xl border border-red-500/40 text-red-500 font-semibold py-3.5 mt-3 transition active:scale-[0.98] hover:bg-red-500/10">
        💥 Romper la alcancía
      </button>
      <button onClick={() => nav('/xipebox')} className="btn-ghost mt-3">
        Volver a XipeBox
      </button>

      {confirmBreak && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setConfirmBreak(false)}>
          <div className="w-full rounded-3xl bg-ink-900 border border-ink-800 p-6 text-center"
            onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-3">💥</div>
            <h3 className="text-lg font-bold mb-1">¿Romper la alcancía?</h3>
            <p className="text-sm text-neutral-400 mb-5">
              Se cancelará "{goal.title}" y los {money(goal.saved)} ahorrados
              regresarán a tu balance. Esta acción no se puede deshacer.
            </p>
            <button
              onClick={() => { breakGoal(goal.id); nav('/xipebox') }}
              className="w-full rounded-2xl bg-red-500 text-white font-semibold py-3.5 mb-2">
              Sí, romper y recuperar {money(goal.saved)}
            </button>
            <button onClick={() => setConfirmBreak(false)} className="btn-ghost">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  )
}
