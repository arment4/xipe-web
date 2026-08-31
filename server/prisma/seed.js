import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 10)
  const adminHash = await bcrypt.hash('admin1234', 10)

  // Wipe in safe order
  await prisma.supportTicket.deleteMany()
  await prisma.withdrawal.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.user.deleteMany()

  const gerardo = await prisma.user.create({
    data: {
      email: 'gerardo@xipe.mx',
      passwordHash,
      name: 'Gerardo Heredia',
      firstName: 'Gerardo',
      phone: '+52 55 1234 5678',
      address: 'Av. Reforma 123, CP 06600, CDMX',
      role: 'CLIENT',
      status: 'ACTIVO',
      identityVerified: true,
      balanceTotal: 28560,
      monthChangePct: 12.5,
      xipeboxTotal: 8350,
      hcboxTotal: 15210,
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@xipe.mx',
      passwordHash: adminHash,
      name: 'Equipo Xipe',
      firstName: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVO',
    },
  })

  await prisma.user.createMany({
    data: [
      { email: 'maria.lopez@mail.com', passwordHash, name: 'María López', balanceTotal: 14200 },
      { email: 'juanp@mail.com', passwordHash, name: 'Juan Pérez', balanceTotal: 5300 },
      { email: 'ana.torres@mail.com', passwordHash, name: 'Ana Torres', balanceTotal: 92750, status: 'VERIFICACION' },
      { email: 'luisr@mail.com', passwordHash, name: 'Luis Ramírez', balanceTotal: 0, status: 'SUSPENDIDO' },
    ],
  })

  await prisma.goal.createMany({
    data: [
      { userId: gerardo.id, title: 'Viaje a Cancún', photo: '🏝️',
        target: 10000, contribution: 1500, termMonths: 4, initialPayment: 1000,
        saved: 6000, period: 'MENSUAL', status: 'AL_CORRIENTE' },
      { userId: gerardo.id, title: 'Auto nuevo', photo: '🚗',
        target: 150000, contribution: 5000, termMonths: 24, initialPayment: 2000,
        saved: 12000, period: 'MENSUAL', status: 'AL_CORRIENTE' },
      { userId: gerardo.id, title: 'Casa propia', photo: '🏠',
        target: 500000, contribution: 8000, termMonths: 60, initialPayment: 5000,
        saved: 20000, period: 'MENSUAL', status: 'VENCIDA' },
    ],
  })

  await prisma.transaction.createMany({
    data: [
      { userId: gerardo.id, type: 'IN', concept: 'Depósito Stripe', amount: 5000, method: 'Stripe',
        date: new Date('2026-05-12') },
      { userId: gerardo.id, type: 'OUT', concept: 'Envío a María López', amount: 1200, method: 'Xipe',
        date: new Date('2026-05-10') },
      { userId: gerardo.id, type: 'IN', concept: 'Depósito Crypto (USDT)', amount: 3200, method: 'Crypto',
        date: new Date('2026-05-08') },
      { userId: gerardo.id, type: 'OUT', concept: 'Aportación XipeBox · Viaje a Cancún', amount: 1500, method: 'XipeBox',
        date: new Date('2026-05-05') },
      { userId: gerardo.id, type: 'OUT', concept: 'Retiro a cuenta BBVA', amount: 2000, method: 'Retiro',
        date: new Date('2026-05-02') },
      { userId: gerardo.id, type: 'IN', concept: 'Solicitud cobrada a Juan P.', amount: 800, method: 'Xipe',
        date: new Date('2026-04-28') },
    ],
  })

  await prisma.notification.createMany({
    data: [
      { userId: gerardo.id, title: 'Tu alcancía te necesita',
        body: 'Se requiere tu aportación. El mero día — min 0.',
        goalTitle: 'Viaje a Cancún', tone: 'info' },
      { userId: gerardo.id, title: 'Te estamos esperando',
        body: 'No olvides tu aportación, no olvides tu meta. 12:00',
        goalTitle: 'Auto nuevo', tone: 'info' },
      { userId: gerardo.id, title: 'El tiempo se agota',
        body: 'Pon al corriente tu alcancía.',
        goalTitle: 'Casa propia', tone: 'warn' },
      { userId: gerardo.id, title: 'Ups, tu alcancía está vencida',
        body: 'Ponte al corriente, tu plazo terminó.',
        goalTitle: 'Casa propia', tone: 'danger' },
      { userId: gerardo.id, title: 'Pon al corriente tu alcancía',
        body: 'Pon al corriente tu alcancía con $8,000.00.',
        goalTitle: 'Casa propia', tone: 'danger' },
    ],
  })

  const maria = await prisma.user.findUnique({ where: { email: 'maria.lopez@mail.com' } })
  const juan = await prisma.user.findUnique({ where: { email: 'juanp@mail.com' } })
  const ana = await prisma.user.findUnique({ where: { email: 'ana.torres@mail.com' } })

  await prisma.withdrawal.createMany({
    data: [
      { userId: maria.id, amount: 3000, account: 'BBVA ****4521', status: 'PENDIENTE' },
      { userId: juan.id,  amount: 1500, account: 'Santander ****8890', status: 'PENDIENTE' },
      { userId: ana.id,   amount: 25000, account: 'Banorte ****1102', status: 'APROBADA' },
    ],
  })

  await prisma.supportTicket.createMany({
    data: [
      { userId: juan.id, subject: 'No puedo retirar',
        body: 'Mi retiro lleva 3 días pendiente.', status: 'ABIERTO' },
      { userId: maria.id, subject: 'Duda con XipeBox',
        body: '¿Cómo cambio el plazo de mi alcancía?', status: 'ABIERTO' },
      { userId: ana.id, subject: 'Verificación de identidad',
        body: 'Subí mi INE pero sigue en revisión.', status: 'CERRADO' },
    ],
  })

  console.log('✅ Seed completo.')
  console.log('   Cliente demo: gerardo@xipe.mx / demo1234')
  console.log('   Admin:        admin@xipe.mx   / admin1234')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
