import { Router } from 'express'
import { z } from 'zod'
import { prisma, serialize } from '../db.js'
import { requireAuth, requireAdmin } from '../auth.js'

const r = Router()
r.use(requireAuth, requireAdmin)

r.get('/clients', async (_req, res) => {
  const list = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, name: true, status: true, balanceTotal: true, createdAt: true,
    },
  })
  res.json({
    clients: list.map((c) => ({ ...serialize(c), balance: Number(c.balanceTotal) })),
  })
})

r.get('/clients/:id', async (req, res) => {
  const c = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      transactions: { orderBy: { date: 'desc' }, take: 200 },
    },
  })
  if (!c) return res.status(404).json({ error: 'No encontrado' })
  const { passwordHash, transactions, ...rest } = c
  res.json({
    client: { ...serialize(rest), balance: Number(c.balanceTotal) },
    transactions: serialize(transactions),
  })
})

r.get('/withdrawals', async (_req, res) => {
  const list = await prisma.withdrawal.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  })
  res.json({
    withdrawals: list.map((w) => ({
      ...serialize(w), client: w.user.name,
      date: w.createdAt.toISOString().slice(0, 10),
    })),
  })
})

r.patch('/withdrawals/:id', async (req, res, next) => {
  try {
    const { status } = z.object({
      status: z.enum(['APROBADA', 'RECHAZADA']),
    }).parse(req.body)
    const w = await prisma.withdrawal.findUnique({ where: { id: req.params.id } })
    if (!w) return res.status(404).json({ error: 'No encontrada' })

    // Si se rechaza, regresar el monto al usuario.
    const ops = [prisma.withdrawal.update({ where: { id: w.id }, data: { status } })]
    if (status === 'RECHAZADA' && w.status === 'PENDIENTE') {
      ops.push(
        prisma.user.update({
          where: { id: w.userId },
          data: { balanceTotal: { increment: w.amount } },
        }),
        prisma.transaction.create({
          data: { userId: w.userId, type: 'IN', amount: w.amount,
            concept: `Retiro rechazado · ${w.account}`, method: 'Retiro' },
        }),
      )
    }
    const [updated] = await prisma.$transaction(ops)
    res.json({ withdrawal: serialize(updated) })
  } catch (e) { next(e) }
})

r.get('/support', async (_req, res) => {
  const list = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  })
  res.json({
    support: list.map((s) => ({
      ...serialize(s), client: s.user.name,
      date: s.createdAt.toISOString().slice(0, 10),
    })),
  })
})

r.patch('/support/:id', async (req, res, next) => {
  try {
    const { status, reply } = z.object({
      status: z.enum(['ABIERTO', 'CERRADO']).optional(),
      reply: z.string().optional(),
    }).parse(req.body)
    const t = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status, reply },
    })
    res.json({ ticket: serialize(t) })
  } catch (e) { next(e) }
})

export default r
