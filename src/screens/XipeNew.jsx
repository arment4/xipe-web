import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, TextInput, Button } from '../components/ui'
import { useMock, money } from '../data/MockProvider'
import { api } from '../data/api'
import { PERIODS, periodMeta } from '../data/period'

const emojis = ['🎯', '🏝️', '🚗', '🏠', '💍', '🎓', '✈️', '💻']

export default function XipeNew() {
  const nav = useNavigate()
  const { createGoal } = useMock()
  const [f, setF] = useState({
    photo: '🎯', title: '', target: '', termMonths: '',
    period: 'mensual', initialPayment: '',
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const adj = periodMeta(f.period).adjective
  const [sim, setSim] = useState(null)

  // La aportación la calcula el backend (aplica tasa/promoción configurable).
  useEffect(() => {
    const t = Number(f.target) || 0, m = Number(f.termMonths) || 0
    if (!(t > 0 && m > 0)) { setSim(null); return }
    const id = setTimeout(async () => {
      try {
        const res = await api.post('/xipebox/simulate', {
          target: t,
          initialPayment: Number(f.initialPayment) || 0,
          termMonths: m,
          period: f.period.toUpperCase(),
        })
        setSim(res)
      } catch { setSim(null) }
    }, 400)
    return () => clearTimeout(id)
  }, [f.target, f.termMonths, f.initialPayment, f.period])

  const contribution = sim?.contribution ?? 0
  const periods = sim?.periods ?? 0

  const ok = f.title && Number(f.target) > 0 && Number(f.termMonths) > 0 && contribution > 0
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    setErr('')
    try {
      setLoading(true)
      const g = await createGoal({ ...f, contribution })
      nav(`/xipebox/${g.id}`)
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
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

      <Field label="Meta">
        <TextInput type="number" value={f.target} onChange={set('target')} placeholder="10000" />
      </Field>

      <Field label="Plazo (meses)">
        <TextInput type="number" value={f.termMonths} onChange={set('termMonths')} placeholder="6" />
      </Field>

      <Field label="Periodo de abono">
        <div className="grid grid-cols-3 gap-2">
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setF({ ...f, period: p.key })}
              className={`rounded-2xl border py-2.5 text-sm font-medium transition ${
                f.period === p.key ? 'border-brand bg-brand/15 text-accent' : 'border-ink-800 bg-ink-850 text-neutral-400'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Pago inicial (opcional)">
        <TextInput type="number" value={f.initialPayment} onChange={set('initialPayment')}
          placeholder="1000" />
      </Field>

      <div className="rounded-2xl bg-brand/10 border border-brand/30 p-4 mb-5">
        <p className="text-[11px] text-neutral-400 uppercase tracking-wide">
          Aportación {adj} calculada
        </p>
        <p className="text-2xl font-extrabold text-accent">
          {contribution > 0 ? money(contribution) : '—'}
        </p>
        {sim && (
          <p className="text-[11px] text-neutral-500 mt-1">
            En {periods} {periods === 1 ? 'abono' : 'abonos'} · rendimiento {(sim.annualRate * 100).toFixed(2)}% anual.
          </p>
        )}
      </div>

      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
      <Button onClick={submit} className={!ok || loading ? 'opacity-40 pointer-events-none' : ''}>
        {loading ? 'Creando…' : 'Crear alcancía'}
      </Button>
    </PhoneFrame>
  )
}
