import { MobileLayout } from '../components/MobileLayout'
import { ScreenHeader } from '../components/ui'
import { useMock, money } from '../data/MockProvider'
import { IcUp, IcDown } from '../components/Icons'

export default function Transactions() {
  const { transactions } = useMock()
  const groups = transactions.reduce((acc, t) => {
    (acc[t.date] = acc[t.date] || []).push(t)
    return acc
  }, {})

  return (
    <MobileLayout>
      <ScreenHeader title="Historial de transacciones" back={false} />
      <div className="space-y-5">
        {Object.entries(groups).map(([date, list]) => (
          <div key={date}>
            <p className="text-xs text-neutral-500 mb-2">{date}</p>
            <div className="space-y-2">
              {list.map((t) => (
                <div key={t.id}
                  className="flex items-center gap-3 rounded-2xl bg-ink-900 border border-ink-800 p-4">
                  <div className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${
                    t.type === 'in' ? 'bg-brand/15 text-brand' : 'bg-ink-800 text-neutral-400'}`}>
                    {t.type === 'in' ? <IcDown width={18} height={18} /> : <IcUp width={18} height={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.concept}</p>
                    <p className="text-[11px] text-neutral-500">{t.method}</p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    t.type === 'in' ? 'text-brand' : 'text-white'}`}>
                    {t.type === 'in' ? '+' : '−'}{money(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  )
}
