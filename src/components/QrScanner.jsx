import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export function QrScanner({ onResult, onClose }) {
  const ref = useRef(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    const id = 'qr-reader-region'
    const scanner = new Html5Qrcode(id)
    ref.current = scanner
    let stopped = false

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (text) => {
          if (stopped) return
          stopped = true
          scanner.stop().catch(() => {}).finally(() => onResult(text))
        },
        () => {},
      )
      .catch((e) =>
        setErr(
          e?.toString().includes('NotAllowed')
            ? 'Permiso de cámara denegado. Actívalo para escanear.'
            : 'No se pudo abrir la cámara en este dispositivo.',
        ),
      )

    return () => {
      try {
        if (scanner.isScanning) scanner.stop().catch(() => {})
      } catch { /* noop */ }
    }
  }, [onResult])

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-semibold">Escanear QR</p>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-ink-800 grid place-items-center">✕</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div id="qr-reader-region"
          className="w-[260px] h-[260px] rounded-3xl overflow-hidden border-2 border-brand bg-ink-900" />
        {err ? (
          <p className="text-red-500 text-sm text-center mt-5">{err}</p>
        ) : (
          <p className="text-neutral-400 text-sm text-center mt-5">
            Apunta la cámara al código QR del otro usuario
          </p>
        )}
        <button onClick={onClose} className="btn-ghost mt-8 max-w-[200px]">
          Cancelar
        </button>
      </div>
    </div>
  )
}
