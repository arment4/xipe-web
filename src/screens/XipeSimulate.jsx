import { useState } from 'react'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, ProgressBar } from '../components/ui'
import { money } from '../data/MockProvider'
import { PERIODS, computeContribution, periodMeta, periodsInMonths } from '../data/period'

export default function XipeSimulate() {
  const [target, setTarget] = useState('10000')
  const [termMonths, setTermMonths] = useState('12')
  const [initialPayment, setInitialPayment] = useState('')
  const [period, setPeriod] = useState('mensual')

  const t = Number(target) || 0
  const m = Number(termMonths) || 0
  const i = Number(initialPayment) || 0

  const contribution = computeContribution({ target, termMonths, period, initialPayment })
  const periods = periodsInMonths(period, m || 1)
  const adj = periodMeta(period).adjective
  const totalSaved = i + contribution * periods
  const reach = m > 0 && totalSaved >= t

  return (
    <PhoneFrame>
      <ScreenHeader title="Simular alcancía" subtitle="Calcula tu abono antes de crear" />

      <Field label="Meta a alcanzar">
        <TextInput type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      </Field>

      <Field label="Plazo (meses)">
        <TextInput type="number" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
      </Field>

      <Field label="Periodo de abono">
        <div className="grid grid-cols-3 gap-2">
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`rounded-2xl border py-2.5 text-sm font-medium transition ${
                period === p.key ? 'border-brand bg-brand/15 text-accent' : 'border-ink-800 bg-ink-850 text-neutral-400'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Pago inicial (opcional)">
        <TextInput type="number" value={initialPayment}
          onChange={(e) => setInitialPayment(e.target.value)} placeholder="0" />
      </Field>

      <div className="rounded-2xl bg-brand/10 border border-brand/30 p-4 mb-4">
        <p className="text-[11px] text-neutral-400 uppercase tracking-wide">
          Tu abono {adj}
        </p>
        <p className="text-2xl font-extrabold text-accent">
          {contribution > 0 ? money(contribution) : '—'}
        </p>
        {contribution > 0 && (
          <p className="text-[11px] text-neutral-500 mt-1">
            {periods} {periods === 1 ? 'abono' : 'abonos'} {adj === 'mensual' ? 'mensuales' : `${adj}es`}
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-ink-900 border border-ink-800 p-5">
        <p className="text-sm text-neutral-400 mb-2">Proyección</p>
        <ProgressBar value={totalSaved} max={t || 1} />
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
          <Stat label="Ahorras en el plazo" value={money(totalSaved)} />
          <Stat label="Meta" value={money(t)} />
          <Stat label={`Abono ${adj}`} value={contribution > 0 ? money(contribution) : '—'} />
          <Stat label="Periodos" value={`${periods}`} />
          <Stat label="Estatus"
            value={reach ? '✅ Alcanzas la meta' : '⚠️ Ajusta plazo/meta'}
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
