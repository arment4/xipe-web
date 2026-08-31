import jwt from 'jsonwebtoken'
import { prisma } from './db.js'

const COOKIE = 'xipe_session'

export function signSession(res, userId) {
  const token = jwt.sign({ uid: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE).toLowerCase() === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  })
}

export function clearSession(res) {
  res.clearCookie(COOKIE)
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE]
    if (!token) return res.status(401).json({ error: 'No autenticado' })
    const { uid } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: uid } })
    if (!user) return res.status(401).json({ error: 'Sesión inválida' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Sesión inválida' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Solo admin' })
  next()
}
