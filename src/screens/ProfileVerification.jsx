import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../components/PhoneFrame'
import { ScreenHeader, Field, FileInput, Button, Toast } from '../components/ui'
import { useMock } from '../data/MockProvider'

// Overall verification state derived from the uploaded documents.
// Priority: a rejected document must win over an approved one so the client can
// always re-submit what was rejected (e.g. INE approved but proof of address
// rejected still needs a re-upload). Pending wins first: a fresh submission is
// under review and there is nothing to re-do yet.
function deriveState(docs) {
  if (!docs.length) return 'none'
  if (docs.some((d) => d.status === 'PENDIENTE')) return 'pending'
  if (docs.some((d) => d.status === 'RECHAZADO')) return 'rejected'
  if (docs.some((d) => d.status === 'APROBADO')) return 'approved'
  return 'none'
}

const DOC_BADGE = {
  PENDIENTE: { text: 'En revisión', cls: 'bg-amber-500/15 text-amber-600' },
  APROBADO: { text: 'Aprobado', cls: 'bg-emerald-500/15 text-emerald-600' },
  RECHAZADO: { text: 'Rechazado', cls: 'bg-red-500/15 text-red-500' },
}

function DocRow({ doc }) {
  const badge = DOC_BADGE[doc.status] || DOC_BADGE.PENDIENTE
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{doc.typeLabel}</p>
        <p className="text-[11px] text-neutral-500 truncate">{doc.originalName}</p>
      </div>
      <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
        {badge.text}
      </span>
    </div>
  )
}

export default function ProfileVerification() {
  const nav = useNavigate()
  const { verifyIdentity, getDocuments } = useMock()

  const [docs, setDocs] = useState([])
  const [ready, setReady] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [idDoc, setIdDoc] = useState(null)
  const [addressDoc, setAddressDoc] = useState(null)

  const refresh = async () => {
    try { setDocs(await getDocuments()) }
    catch { /* offline: deja el formulario disponible */ }
    finally { setReady(true) }
  }

  useEffect(() => { refresh() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const state = deriveState(docs)
  // El formulario solo aparece cuando no hay nada enviado o fue rechazado.
  const canUpload = state === 'none' || state === 'rejected'

  const send = async () => {
    setError('')
    if (!idDoc) {
      setError('Anexa tu identificación oficial para continuar.')
      return
    }
    try {
      setLoading(true)
      const form = new FormData()
      form.append('identityDoc', idDoc)
      if (addressDoc) form.append('addressDoc', addressDoc)
      await verifyIdentity(form)
      setIdDoc(null)
      setAddressDoc(null)
      setSaved(true)
      await refresh()
    } catch (e) {
      setError(e?.message || 'No se pudieron enviar los documentos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PhoneFrame>
      <ScreenHeader title="Verificación de identidad" subtitle="Agiliza tus operaciones y retiros" />

      {!ready ? (
        <p className="text-sm text-neutral-500 py-8 text-center">Cargando…</p>
      ) : (
        <>
          {/* Banner de estado */}
          {state === 'approved' && (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-5">
              <p className="text-sm font-semibold text-emerald-600">✓ Identidad verificada</p>
              <p className="text-sm text-neutral-400 mt-1">
                Tus documentos fueron aprobados. No necesitas hacer nada más.
              </p>
            </div>
          )}
          {state === 'pending' && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 mb-5">
              <p className="text-sm font-semibold text-amber-600">Documentos en revisión</p>
              <p className="text-sm text-neutral-400 mt-1">
                Recibimos tus documentos. El equipo de Xipe los está revisando; te
                avisaremos cuando estén aprobados.
              </p>
            </div>
          )}
          {state === 'rejected' && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5">
              <p className="text-sm font-semibold text-red-500">Documentos rechazados</p>
              <p className="text-sm text-neutral-400 mt-1">
                No pudimos validar tus documentos. Revisa que sean legibles y vigentes,
                y vuelve a subirlos.
              </p>
            </div>
          )}
          {state === 'none' && (
            <div className="rounded-2xl bg-ink-850 border border-ink-800 p-4 mb-5">
              <p className="text-sm text-neutral-400">
                No es obligatoria para usar Xipe. Te la pediremos solo cuando agregues
                montos altos o realices un retiro a tu banco. Puedes adelantarla aquí
                para no tener fricción después.
              </p>
            </div>
          )}

          {/* Documentos ya enviados */}
          {docs.length > 0 && (
            <div className="rounded-2xl bg-ink-850 border border-ink-800 px-4 py-2 mb-5 divide-y divide-ink-800">
              {docs.map((d) => <DocRow key={d.id} doc={d} />)}
            </div>
          )}

          {/* Formulario de subida (solo si aplica) */}
          {canUpload && (
            <>
              <Field label="Identificación oficial (INE o pasaporte)">
                <FileInput label="Anexar identificación" file={idDoc} onChange={setIdDoc} />
              </Field>
              <Field label="Comprobante de domicilio (opcional)">
                <FileInput label="Anexar comprobante" file={addressDoc} onChange={setAddressDoc} />
              </Field>

              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

              <Button onClick={send} className={loading ? 'opacity-40 pointer-events-none' : ''}>
                {loading ? 'Enviando…' : state === 'rejected' ? 'Volver a enviar' : 'Enviar documentos'}
              </Button>
            </>
          )}

          <button onClick={() => nav('/profile')} className="btn-ghost mt-3">
            {canUpload ? 'Ahora no' : 'Volver a mi perfil'}
          </button>
        </>
      )}

      <Toast show={saved} text="Documentos enviados a revisión" />
    </PhoneFrame>
  )
}
