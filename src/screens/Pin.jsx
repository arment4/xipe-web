import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Button, Toast } from '../components/ui'

export default function Pin() {
  const nav = useNavigate()
  const [step, setStep] = useState('set') // set | confirm
  const [pin, setPin] = useState('')
  const [first, setFirst] = useState('')
  const [saved, setSaved] = useState(false)

  const press = (d) => {
    if (pin.length >= 4) return
    const v = pin + d
    setPin(v)
    if (v.length === 4) {
      if (step === 'set') { setFirst(v); setPin(''); setStep('confirm') }
      else if (v === first) { setSaved(true); setTimeout(() => nav('/profile'), 900) }
      else { setPin(''); setStep('set'); setFirst('') }
    }
  }
  const del = () => setPin((p) => p.slice(0, -1))

  return (
    <PhoneFrame>
      <ScreenHeader title="Generar / cambiar PIN" />
      <div className="flex flex-col items-center pt-8">
        <p className="text-neutral-400 text-sm mb-6">
          {step === 'set' ? 'Ingresa un PIN de 4 dígitos' : 'Confirma tu PIN'}
        </p>
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 ${
              i < pin.length ? 'bg-brand border-brand' : 'border-ink-600'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button key={d} onClick={() => press(String(d))}
              className="w-16 h-16 rounded-full bg-ink-850 border border-ink-800 text-xl font-semibold active:bg-ink-700">
              {d}
            </button>
          ))}
          <div />
          <button onClick={() => press('0')}
            className="w-16 h-16 rounded-full bg-ink-850 border border-ink-800 text-xl font-semibold active:bg-ink-700">
            0
          </button>
          <button onClick={del}
            className="w-16 h-16 rounded-full grid place-items-center text-neutral-400">⌫</button>
        </div>
      </div>
      <Toast show={saved} text="PIN guardado" />
    </PhoneFrame>
  )
}
