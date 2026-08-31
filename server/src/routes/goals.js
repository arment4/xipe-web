import { Router } from 'express'
import { z } from 'zod'
import { prisma, serialize } from '../db.js'
import { requireAuth } from '../auth.js'

const r = Router()
r.use(requireAuth)

const safe = (u) => { const { passwordHash, ...rest } = u; return serialize(rest) }

r.get('/', async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { userId: req.user.id, NOT: { status: 'ROTA' } },
    orderBy: { createdAt: 'asc' },
  })
  res.json({ goals: serialize(goals) })
})

r.post('/', async (req, res, next) => {
  try {
    const data = z.object({
      title: z.string().min(1),
      photo: z.string().optional(),
      target: z.number().positive(),
      contribution: z.number().positive(),
      termMonths: z.number().int().positive(),
      initialPayment: z.number().nonnegative().optional(),
      period: z.enum(['SEMANAL', 'QUINCENAL', 'MENSUAL']).optional(),
    }).parse(req.body)

    const initial = data.initialPayment || 0
    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title: data.title,
        photo: data.photo || '🎯',
        target: data.target,
        contribution: data.contribution,
        termMonths: data.termMonths,
        initialPayment: initial,
        saved: initial,
        period: data.period || 'MENSUAL',
      },
    })

    if (initial > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: req.user.id },
          data: { balanceTotal: { decrement: initial }, xipeboxTotal: { increment: initial } },
        }),
        prisma.transaction.create({
          data: { userId: req.user.id, type: 'OUT', amount: initial,
            concept: `Pago inicial · ${goal.title}`, method: 'XipeBox' },
        }),
      ])
    }

    res.status(201).json({ goal: serialize(goal) })
  } catch (e) { next(e) }
})

r.get('/:id', async (req, res) => {
  const goal = await prisma.goal.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  })
  if (!goal) return res.status(404).json({ error: 'No encontrada' })
  res.json({ goal: serialize(goal) })
})

r.post('/:id/contribute', async (req, res, next) => {
  try {
    const { amount } = z.object({ amount: z.number().positive() }).parse(req.body)
    const goal = await prisma.goal.findFirst({
      where: { id: req.params.id, userId: req.user.id, NOT: { status: 'ROTA' } },
    })
    if (!goal) return res.status(404).json({ error: 'No encontrada' })
    if (Number(req.user.balanceTotal) < amount)
      return res.status(400).json({ error: 'Saldo insuficiente' })

    const [, updated, , user] = await prisma.$transaction([
      prisma.transaction.create({
        data: { userId: req.user.id, type: 'OUT', amount,
          concept: `Aportación XipeBox · ${goal.title}`, method: 'XipeBox' },
      }),
      prisma.goal.update({
        where: { id: goal.id },
        data: { saved: { increment: amount }, status: 'AL_CORRIENTE' },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: { xipeboxTotal: { increment: amount } },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: { balanceTotal: { decrement: amount } },
      }),
    ])
    res.json({ goal: serialize(updated), user: safe(user) })
  } catch (e) { next(e) }
})

r.post('/:id/break', async (req, res, next) => {
  try {
    const goal = await prisma.goal.findFirst({
      where: { id: req.params.id, userId: req.user.id, NOT: { status: 'ROTA' } },
    })
    if (!goal) return res.status(404).json({ error: 'No encontrada' })
    const saved = Number(goal.saved)

    const [, , user] = await prisma.$transaction([
      prisma.goal.update({ where: { id: goal.id }, data: { status: 'ROTA' } }),
      prisma.transaction.create({
        data: { userId: req.user.id, type: 'IN', amount: saved,
          concept: `Alcancía rota · ${goal.title}`, method: 'XipeBox' },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: {
          balanceTotal: { increment: saved },
          xipeboxTotal: { decrement: saved },
        },
      }),
    ])
    res.json({ user: safe(user), recovered: saved })
  } catch (e) { next(e) }
})

export default r
