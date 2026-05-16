import { useState } from 'react'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, ProgressBar } from '../components/ui'
import { money } from '../data/MockProvider'

export default function XipeSimulate() {
  const [target, setTarget] = useState('10000')
  const [contribution, setContribution] = useState('1000')
  const [term, setTerm] = useState('12')

  const t = Number(target), c = Number(contribution), m = Number(term)
  const totalSaved = c * m
  const monthsToGoal = c > 0 ? Math.ceil(t / c) : 0
  const reach = totalSaved >= t

  return (
    <PhoneFrame>
      <ScreenHeader title="Simular alcancía" subtitle="Calcula antes de crear" />

      <Field label="Meta a alcanzar">
        <TextInput type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      </Field>
      <Field label="Aportación mensual">
        <TextInput type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} />
      </Field>
      <Field label="Plazo (meses)">
        <TextInput type="number" value={term} onChange={(e) => setTerm(e.target.value)} />
      </Field>

      <div className="rounded-3xl bg-ink-900 border border-ink-800 p-5 mt-2">
        <p className="text-sm text-neutral-400 mb-2">Proyección</p>
        <ProgressBar value={totalSaved} max={t} />
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
          <Stat label="Ahorras en el plazo" value={money(totalSaved)} />
          <Stat label="Meta" value={money(t)} />
          <Stat label="Meses para la meta" value={`${monthsToGoal} meses`} />
          <Stat label="Estatus"
            value={reach ? '✅ Alcanzas la meta' : '⚠️ No alcanzas'}
            highlight={reach} />
        </div>
      </div>
    </PhoneFrame>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div className="bg-ink-850 rounded-2xl p-3">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-accent' : 'text-fg'}`}>{value}</p>
    </div>
  )
}
