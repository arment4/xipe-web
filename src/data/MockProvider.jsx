import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setToken, getToken } from './api'

const Ctx = createContext(null)

// ----- helpers para mapear la forma del API a la forma que esperan las pantallas
const lc = (s) => (typeof s === 'string' ? s.toLowerCase() : s)

const mapUser = (u) => u && {
  id: u.id,
  email: u.email,
  name: u.name,
  firstName: u.firstName || (u.name || '').split(' ')[0],
  phone: u.phone || '',
  address: u.address || '',
  role: u.role,
  status: lc(u.status),
  identityVerified: !!u.identityVerified,
}

const mapBalance = (u) => u && {
  total: Number(u.balanceTotal) || 0,
  currency: u.balanceCurrency || 'MXN',
  monthChangePct: Number(u.monthChangePct) || 0,
  xipeboxTotal: Number(u.xipeboxTotal) || 0,
  hcboxTotal: Number(u.hcboxTotal) || 0,
}

const goalStatusMap = { AL_CORRIENTE: 'al-corriente', VENCIDA: 'vencida', ROTA: 'rota' }
const mapGoal = (g) => ({
  id: g.id,
  title: g.title,
  photo: g.photo || '🎯',
  target: Number(g.target),
  contribution: Number(g.contribution),
  termMonths: g.termMonths,
  initialPayment: Number(g.initialPayment) || 0,
  saved: Number(g.saved) || 0,
  period: lc(g.period),
  status: goalStatusMap[g.status] || 'al-corriente',
})

const mapTx = (t) => ({
  id: t.id,
  type: lc(t.type),
  concept: t.concept,
  amount: Number(t.amount),
  method: t.method,
  date: (t.date || '').slice(0, 10),
})

const mapNotif = (n) => ({
  id: n.id, title: n.title, body: n.body,
  goal: n.goalTitle || '', tone: n.tone,
})

const mapWithdrawal = (w) => ({
  id: w.id, client: w.client, amount: Number(w.amount),
  account: w.account, date: w.date,
  status: lc(w.status),
})

const mapSupport = (s) => ({
  id: s.id, client: s.client, subject: s.subject, body: s.body,
  date: s.date, status: lc(s.status),
})

const today = () => new Date().toISOString().slice(0, 10)

export function MockProvider({ children }) {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState({ total: 0, currency: 'MXN', monthChangePct: 0, xipeboxTotal: 0, hcboxTotal: 0 })
  const [goals, setGoals] = useState([])
  const [transactions, setTransactions] = useState([])
  const [notifications, setNotifications] = useState([])
  const [clients, setClients] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [support, setSupport] = useState([])
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  const applyUser = (u) => { setUser(mapUser(u)); setBalance(mapBalance(u)); setAuthed(true) }

  const loadCore = useCallback(async () => {
    const [g, t, n] = await Promise.all([
      api.get('/me/goals').catch(() => ({ goals: [] })),
      api.get('/me/transactions').catch(() => ({ transactions: [] })),
      api.get('/me/notifications').catch(() => ({ notifications: [] })),
    ])
    setGoals((g.goals || []).map(mapGoal))
    setTransactions((t.transactions || []).map(mapTx))
    setNotifications((n.notifications || []).map(mapNotif))
  }, [])

  const loadAdmin = useCallback(async () => {
    try {
      const [c, w, s] = await Promise.all([
        api.get('/admin/clients'),
        api.get('/admin/withdrawals'),
        api.get('/admin/support'),
      ])
      setClients(c.clients || [])
      setWithdrawals((w.withdrawals || []).map(mapWithdrawal))
      setSupport((s.support || []).map(mapSupport))
    } catch { /* not admin or offline */ }
  }, [])

  // Bootstrap session on mount (only if we already hold a token).
  useEffect(() => {
    (async () => {
      if (!getToken()) { setReady(true); return }
      try {
        const { user: u } = await api.get('/auth/me')
        applyUser(u)
        await loadCore()
        if (u.role === 'ADMIN') await loadAdmin()
      } catch { setToken(null) /* stale/invalid token */ }
      finally { setReady(true) }
    })()
  }, [loadCore, loadAdmin])

  // ---- actions ----
  const login = async (email, password) => {
    const { user: u, token } = await api.post('/auth/login', { email, password })
    setToken(token)
    applyUser(u)
    await loadCore()
    if (u.role === 'ADMIN') await loadAdmin()
    return mapUser(u)
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch { /* noop */ }
    setToken(null)
    setUser(null); setAuthed(false)
    setGoals([]); setTransactions([]); setNotifications([])
    setClients([]); setWithdrawals([]); setSupport([])
  }

  const register = async ({ email, password, name, phone, address }) => {
    const { user: u, token } = await api.post('/auth/register', { email, password, name, phone, address })
    setToken(token)
    applyUser(u)
    await loadCore()
  }

  const updateProfile = async (data) => {
    const { user: u } = await api.patch('/me', data)
    applyUser(u)
  }

  const verifyIdentity = async () => {
    const { user: u } = await api.post('/me/verify-identity')
    applyUser(u)
  }

  const changePassword = async (current, nextPw) => {
    await api.post('/me/password', { current, next: nextPw })
  }

  const addMoney = async (amount, method) => {
    const { user: u, transaction } = await api.post('/me/balance/add', { amount, method })
    applyUser(u)
    setTransactions((t) => [mapTx(transaction), ...t])
  }

  const sendMoney = async (to, amount, concept) => {
    const { user: u, transaction } = await api.post('/me/send', { to, amount, concept })
    applyUser(u)
    setTransactions((t) => [mapTx(transaction), ...t])
  }

  const requestWithdrawal = async (amount, account) => {
    const { user: u, transaction } = await api.post('/me/withdraw', { amount, account })
    applyUser(u)
    setTransactions((t) => [mapTx(transaction), ...t])
  }

  const createGoal = async (g) => {
    const payload = {
      title: g.title,
      photo: g.photo,
      target: Number(g.target),
      contribution: Number(g.contribution),
      termMonths: Number(g.termMonths),
      initialPayment: Number(g.initialPayment) || 0,
      period: (g.period || 'mensual').toUpperCase(),
    }
    const { goal } = await api.post('/me/goals', payload)
    const mapped = mapGoal(goal)
    setGoals((gs) => [...gs, mapped])
    if (payload.initialPayment > 0) await loadCore()  // refresh balance + tx
    return mapped
  }

  const contributeGoal = async (id, amount) => {
    const { goal, user: u } = await api.post(`/me/goals/${id}/contribute`, { amount })
    applyUser(u)
    setGoals((gs) => gs.map((x) => (x.id === id ? mapGoal(goal) : x)))
    await loadCore()
  }

  const breakGoal = async (id) => {
    const { user: u } = await api.post(`/me/goals/${id}/break`)
    applyUser(u)
    setGoals((gs) => gs.filter((x) => x.id !== id))
    await loadCore()
  }

  const setWithdrawalStatus = async (id, status) => {
    await api.patch(`/admin/withdrawals/${id}`, { status: status.toUpperCase() })
    await loadAdmin()
  }

  const setSupportStatus = async (id, status) => {
    await api.patch(`/admin/support/${id}`, { status: status.toUpperCase() })
    await loadAdmin()
  }

  const value = useMemo(() => ({
    ready, authed, user, balance, goals, transactions, notifications,
    clients, withdrawals, support,
    login, logout, register, updateProfile, verifyIdentity, changePassword,
    addMoney, sendMoney, requestWithdrawal,
    createGoal, contributeGoal, breakGoal,
    setWithdrawalStatus, setSupportStatus,
  }), [ready, authed, user, balance, goals, transactions, notifications,
    clients, withdrawals, support])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useMock = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useMock fuera de MockProvider')
  return c
}

export const money = (n, currency = 'MXN') =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(Number(n) || 0)
