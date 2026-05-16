import { PhoneFrame } from './PhoneFrame'
import { BottomNav } from './BottomNav'

export function MobileLayout({ children }) {
  return <PhoneFrame nav={<BottomNav />}>{children}</PhoneFrame>
}
