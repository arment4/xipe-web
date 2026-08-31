import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

// Convert Prisma Decimal fields to plain numbers in JSON responses so the
// frontend can keep doing simple arithmetic without importing Decimal.
const toNumber = (v) => (v && typeof v === 'object' && typeof v.toNumber === 'function' ? v.toNumber() : v)

export const serialize = (obj) => {
  if (Array.isArray(obj)) return obj.map(serialize)
  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    const out = {}
    for (const k in obj) out[k] = serialize(toNumber(obj[k]))
    return out
  }
  return toNumber(obj)
}
