import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeSwitcher } from './theme/ThemeSwitcher'
import { useMock } from './data/MockProvider'

import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import AddMoney from './screens/AddMoney'
import Send from './screens/Send'
import Receive from './screens/Receive'
import Request from './screens/Request'
import Withdraw from './screens/Withdraw'
import XipeBox from './screens/XipeBox'
import XipeSimulate from './screens/XipeSimulate'
import XipeNew from './screens/XipeNew'
import XipeDetail from './screens/XipeDetail'
import HCBox from './screens/HCBox'
import More from './screens/More'
import Transactions from './screens/Transactions'
import Notifications from './screens/Notifications'
import Profile from './screens/Profile'
import ProfileEdit from './screens/ProfileEdit'
import ProfileVerification from './screens/ProfileVerification'
import ChangePassword from './screens/ChangePassword'
import Pin from './screens/Pin'

import AdminClients from './admin/AdminClients'
import AdminClientDetail from './admin/AdminClientDetail'
import AdminWithdrawals from './admin/AdminWithdrawals'
import AdminSupport from './admin/AdminSupport'

function RequireAuth({ children }) {
  const { ready, authed } = useMock()
  const loc = useLocation()
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-neutral-500 text-sm">
        Cargando…
      </div>
    )
  }
  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />
  return children
}

export default function App() {
  return (
    <>
      <ThemeSwitcher />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {[
          ['/home', <Home />],
          ['/add-money', <AddMoney />],
          ['/send', <Send />],
          ['/receive', <Receive />],
          ['/request', <Request />],
          ['/withdraw', <Withdraw />],
          ['/xipebox', <XipeBox />],
          ['/xipebox/simulate', <XipeSimulate />],
          ['/xipebox/new', <XipeNew />],
          ['/xipebox/:id', <XipeDetail />],
          ['/hcbox', <HCBox />],
          ['/more', <More />],
          ['/transactions', <Transactions />],
          ['/notifications', <Notifications />],
          ['/profile', <Profile />],
          ['/profile/edit', <ProfileEdit />],
          ['/profile/verification', <ProfileVerification />],
          ['/profile/password', <ChangePassword />],
          ['/profile/pin', <Pin />],
          ['/admin', <AdminClients />],
          ['/admin/clients/:id', <AdminClientDetail />],
          ['/admin/withdrawals', <AdminWithdrawals />],
          ['/admin/support', <AdminSupport />],
        ].map(([p, el]) => (
          <Route key={p} path={p} element={<RequireAuth>{el}</RequireAuth>} />
        ))}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
