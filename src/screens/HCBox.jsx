import { useEffect, useState } from 'react'
import { MobileLayout } from '../components/MobileLayout'
import { useMock, money } from '../data/MockProvider'
import { api } from '../data/api'
import { Field, TextInput } from '../components/ui'

export default function HCBox() {
  const { balance } = useMock()
  const [plans, setPlans] = useState([])
  const [plan, setPlan] = useState('balanceado')
  const [capital, setCapital] = useState('50000')
  const [termMonths, setTermMonths] = useState('36')
  const [sim, setSim] = useState(null)

  // Planes + tasas configurados en el backend.
  useEffect(() => {
    api.get('/config').then((c) => setPlans(c?.hcbox?.plans || [])).catch(() => {})
  }, [])

  // Proyección de valor futuro (VF = C·(1+r)^N) con la tasa del plan.
  useEffect(() => {
    const c = Number(capital) || 0, m = Number(termMonths) || 0
    if (!(c > 0 && m > 0)) { setSim(null); return }
    const id = setTimeout(async () => {
      try {
        setSim(await api.post('/hcbox/simulate', { capital: c, termMonths: m, plan }))
      } catch { setSim(null) }
    }, 400)
    return () => clearTimeout(id)
  }, [capital, termMonths, plan])

  return (
    <MobileLayout>
      <div className="pt-4">
        <div className="rounded-3xl bg-gradient-to-b from-cyan-500/15 to-ink-900 border border-cyan-500/20 p-5 mb-5">
          <div className="text-cyan-600 font-extrabold text-xl">HCBOX</div>
          <p className="text-sm text-neutral-400">Planes de inversión estructurados</p>
          <div className="text-4xl text-center my-3">📦</div>
          <p className="text-xs text-neutral-500">Total invertido</p>
          <p className="text-2xl font-bold">{money(balance.hcboxTotal)}</p>
        </div>

        <h3 className="font-bold mb-3">Simula tu inversión</h3>

        <Field label="Plan">
          <div className="grid grid-cols-3 gap-2">
            {plans.map((p) => (
              <button key={p.key} onClick={() => setPlan(p.key)}
                className={`rounded-2xl border py-2.5 text-xs font-medium transition ${
                  plan === p.key ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300' : 'border-ink-800 bg-ink-850 text-neutral-400'}`}>
                <div className="capitalize">{p.key}</div>
                <div className="text-[11px] opacity-80">{(p.tea * 100).toFixed(0)}% anual</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Capital inicial">
          <TextInput type="number" value={capital} onChange={(e) => setCapital(e.target.value)} />
        </Field>
        <Field label="Plazo (meses)">
          <TextInput type="number" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} />
        </Field>

        <div className="rounded-3xl bg-gradient-to-b from-cyan-500/10 to-ink-900 border border-cyan-500/20 p-5 mt-2">
          <p className="text-[11px] text-neutral-400 uppercase tracking-wide">Valor futuro estimado</p>
          <p className="text-3xl font-extrabold text-cyan-300">
            {sim ? money(sim.futureValue) : '—'}
          </p>
          {sim && (
            <p className="text-sm text-neutral-400 mt-1">
              Ganancia estimada: <span className="text-cyan-300 font-semibold">{money(sim.gain)}</span>
              {' '}· {(sim.annualRate * 100).toFixed(0)}% anual
            </p>
          )}
        </div>

        <button className="btn-primary mt-5">Notifícame cuando esté listo</button>
      </div>
    </MobileLayout>
  )
}
