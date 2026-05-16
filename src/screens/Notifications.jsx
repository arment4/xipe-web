import { MobileLayout } from '../components/MobileLayout'
import { ScreenHeader } from '../components/ui'
import { useMock } from '../data/MockProvider'

const tone = {
  info: 'border-brand/30 bg-brand/5',
  warn: 'border-amber-500/30 bg-amber-500/5',
  danger: 'border-red-500/30 bg-red-500/5',
}
const dot = { info: 'bg-brand', warn: 'bg-amber-400', danger: 'bg-red-400' }

export default function Notifications() {
  const { notifications } = useMock()
  return (
    <MobileLayout>
      <ScreenHeader title="Notificaciones XipeBox" subtitle="Recordatorios de tu alcancía" back={false} />
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-2xl border p-4 ${tone[n.tone]}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${dot[n.tone]}`} />
              <p className="font-semibold text-sm">{n.title}</p>
            </div>
            <p className="text-sm text-neutral-300">{n.body}</p>
            <p className="text-[11px] text-neutral-500 mt-2">Alcancía: {n.goal}</p>
          </div>
        ))}
      </div>
    </MobileLayout>
  )
}
