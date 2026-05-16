import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeSwitcher } from './theme/ThemeSwitcher'

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
import ChangePassword from './screens/ChangePassword'
import Pin from './screens/Pin'

import AdminClients from './admin/AdminClients'
import AdminClientDetail from './admin/AdminClientDetail'
import AdminWithdrawals from './admin/AdminWithdrawals'
import AdminSupport from './admin/AdminSupport'

export default function App() {
  return (
    <>
    <ThemeSwitcher />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home" element={<Home />} />
      <Route path="/add-money" element={<AddMoney />} />
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/request" element={<Request />} />
      <Route path="/withdraw" element={<Withdraw />} />

      <Route path="/xipebox" element={<XipeBox />} />
      <Route path="/xipebox/simulate" element={<XipeSimulate />} />
      <Route path="/xipebox/new" element={<XipeNew />} />
      <Route path="/xipebox/:id" element={<XipeDetail />} />
      <Route path="/hcbox" element={<HCBox />} />
      <Route path="/more" element={<More />} />

      <Route path="/transactions" element={<Transactions />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="/profile/password" element={<ChangePassword />} />
      <Route path="/profile/pin" element={<Pin />} />

      <Route path="/admin" element={<AdminClients />} />
      <Route path="/admin/clients/:id" element={<AdminClientDetail />} />
      <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
      <Route path="/admin/support" element={<AdminSupport />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  )
}
