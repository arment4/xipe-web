import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma, serialize } from '../db.js'
import { requireAuth } from '../auth.js'

const r = Router()
r.use(requireAuth)

const safe = (u) => { const { passwordHash, ...rest } = u; return serialize(rest) }

r.get('/', async (req, res) => {
  res.json({ user: safe(req.user) })
})

r.patch('/', async (req, res, next) => {
  try {
    const data = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
    }).parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...data, firstName: data.name ? data.name.split(' ')[0] : undefined },
    })
    res.json({ user: safe(user) })
  } catch (e) { next(e) }
})

r.post('/password', async (req, res, next) => {
  try {
    const { current, next: nextPw } = z.object({
      current: z.string().min(1),
      next: z.string().min(6),
    }).parse(req.body)
    const ok = await bcrypt.compare(current, req.user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'Contraseña actual incorrecta' })
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: await bcrypt.hash(nextPw, 10) },
    })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// --- Money ---
r.post('/balance/add', async (req, res, next) => {
  try {
    const { amount, method } = z.object({
      amount: z.number().positive().min(100).max(130000),
      method: z.enum(['Stripe', 'Crypto']),
    }).parse(req.body)
    const [user, tx] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { balanceTotal: { increment: amount } },
      }),
      prisma.transaction.create({
        data: { userId: req.user.id, type: 'IN', amount, concept: `Depósito ${method}`, method },
      }),
    ])
    res.json({ user: safe(user), transaction: serialize(tx) })
  } catch (e) { next(e) }
})

r.post('/send', async (req, res, next) => {
  try {
    const { to, amount, concept } = z.object({
      to: z.string().min(1),
      amount: z.number().positive(),
      concept: z.string().optional(),
    }).parse(req.body)
    if (Number(req.user.balanceTotal) < amount)
      return res.status(400).json({ error: 'Saldo insuficiente' })
    const [user, tx] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { balanceTotal: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: { userId: req.user.id, type: 'OUT', amount,
          concept: concept || `Envío a ${to}`, method: 'Xipe' },
      }),
    ])
    res.json({ user: safe(user), transaction: serialize(tx) })
  } catch (e) { next(e) }
})

r.post('/withdraw', async (req, res, next) => {
  try {
    const { amount, account } = z.object({
      amount: z.number().positive(),
      account: z.string().min(2),
    }).parse(req.body)
    if (Number(req.user.balanceTotal) < amount)
      return res.status(400).json({ error: 'Saldo insuficiente' })
    const [user, tx, w] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { balanceTotal: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: { userId: req.user.id, type: 'OUT', amount,
          concept: `Retiro a ${account}`, method: 'Retiro' },
      }),
      prisma.withdrawal.create({
        data: { userId: req.user.id, amount, account, status: 'PENDIENTE' },
      }),
    ])
    res.json({ user: safe(user), transaction: serialize(tx), withdrawal: serialize(w) })
  } catch (e) { next(e) }
})

// --- Reads ---
r.get('/transactions', async (req, res) => {
  const list = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
    take: 200,
  })
  res.json({ transactions: serialize(list) })
})

r.get('/notifications', async (req, res) => {
  const list = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  res.json({ notifications: serialize(list) })
})

r.post('/verify-identity', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { identityVerified: true, status: 'ACTIVO' },
    })
    res.json({ user: safe(user) })
  } catch (e) { next(e) }
})

export default r
