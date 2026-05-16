import { createContext, useContext, useMemo, useState } from 'react'
import {
  seedUser, seedBalance, seedGoals, seedTransactions, seedNotifications,
  seedClients, seedWithdrawals, seedSupport,
} from './seed'

const MockCtx = createContext(null)
let idc = 100
const nextId = (p) => `${p}${++idc}`
const today = () => new Date().toISOString().slice(0, 10)

export function MockProvider({ children }) {
  const [user, setUser] = useState(seedUser)
  const [balance, setBalance] = useState(seedBalance)
  const [goals, setGoals] = useState(seedGoals)
  const [transactions, setTransactions] = useState(seedTransactions)
  const [notifications] = useState(seedNotifications)
  const [clients] = useState(seedClients)
  const [withdrawals, setWithdrawals] = useState(seedWithdrawals)
  const [support, setSupport] = useState(seedSupport)
  const [authed, setAuthed] = useState(true)

  const addTx = (tx) =>
    setTransactions((t) => [{ id: nextId('t'), date: today(), ...tx }, ...t])

  const value = useMemo(() => ({
    user, balance, goals, transactions, notifications, clients,
    withdrawals, support, authed,

    login: () => setAuthed(true),
    logout: () => setAuthed(false),
    register: (data) => { setUser((u) => ({ ...u, ...data })); setAuthed(true) },
    updateProfile: (data) => setUser((u) => ({ ...u, ...data })),

    addMoney: (amount, method) => {
      setBalance((b) => ({ ...b, total: b.total + amount }))
      addTx({ type: 'in', concept: `Depósito ${method}`, amount, method })
    },
    sendMoney: (to, amount, concept) => {
      setBalance((b) => ({ ...b, total: b.total - amount }))
      addTx({ type: 'out', concept: concept || `Envío a ${to}`, amount, method: 'Xipe' })
    },
    requestWithdrawal: (amount, account) => {
      setBalance((b) => ({ ...b, total: b.total - amount }))
      addTx({ type: 'out', concept: `Retiro a ${account}`, amount, method: 'Retiro' })
      setWithdrawals((w) => [
        { id: nextId('w'), client: user.name, amount, account, date: today(), status: 'pendiente' },
        ...w,
      ])
    },
    createGoal: (g) => {
      const goal = {
        id: nextId('g'),
        photo: g.photo || '🎯',
        saved: Number(g.initialPayment) || 0,
        status: 'al-corriente',
        ...g,
        target: Number(g.target),
        contribution: Number(g.contribution),
        termMonths: Number(g.termMonths),
        initialPayment: Number(g.initialPayment) || 0,
      }
      setGoals((gs) => [...gs, goal])
      return goal
    },
    contributeGoal: (id, amount) => {
      setBalance((b) => ({ ...b, total: b.total - amount }))
      setGoals((gs) => gs.map((g) =>
        g.id === id ? { ...g, saved: g.saved + amount, status: 'al-corriente' } : g))
      addTx({ type: 'out', concept: `Aportación XipeBox`, amount, method: 'XipeBox' })
    },
    setWithdrawalStatus: (id, status) =>
      setWithdrawals((w) => w.map((x) => (x.id === id ? { ...x, status } : x))),
    setSupportStatus: (id, status) =>
      setSupport((s) => s.map((x) => (x.id === id ? { ...x, status } : x))),
  }), [user, balance, goals, transactions, notifications, clients, withdrawals, support, authed])

  return <MockCtx.Provider value={value}>{children}</MockCtx.Provider>
}

export const useMock = () => {
  const c = useContext(MockCtx)
  if (!c) throw new Error('useMock fuera de MockProvider')
  return c
}

export const money = (n, currency = 'MXN') =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n)
