import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma, serialize } from '../db.js'
import { signSession, clearSession, requireAuth } from '../auth.js'

const r = Router()

const safeUser = (u) => {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return serialize(rest)
}

r.post('/register', async (req, res, next) => {
  try {
    const data = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      phone: z.string().optional(),
      address: z.string().optional(),
    }).parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' })

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: await bcrypt.hash(data.password, 10),
        name: data.name,
        firstName: data.name.split(' ')[0],
        phone: data.phone,
        address: data.address,
      },
    })
    signSession(res, user.id)
    res.status(201).json({ user: safeUser(user) })
  } catch (e) { next(e) }
})

r.post('/login', async (req, res, next) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(), password: z.string().min(1),
    }).parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })
    if (user.status === 'SUSPENDIDO') return res.status(403).json({ error: 'Cuenta suspendida' })
    signSession(res, user.id)
    res.json({ user: safeUser(user) })
  } catch (e) { next(e) }
})

r.post('/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

r.get('/me', requireAuth, (req, res) => {
  res.json({ user: safeUser(req.user) })
})

export default r
