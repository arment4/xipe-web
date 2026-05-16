export const seedUser = {
  id: 'u1',
  name: 'Gerardo Heredia',
  firstName: 'Gerardo',
  phone: '+52 55 1234 5678',
  email: 'gerardo@xipe.mx',
  address: 'Av. Reforma 123, CP 06600, CDMX',
  initialDepositUSD: 7000,
}

export const seedBalance = {
  total: 28560,
  currency: 'MXN',
  monthChangePct: 12.5,
  xipeboxTotal: 8350,
  hcboxTotal: 15210,
}

export const seedGoals = [
  {
    id: 'g1',
    title: 'Viaje a Cancún',
    photo: '🏝️',
    saved: 6000,
    target: 10000,
    contribution: 1500,
    termMonths: 4,
    initialPayment: 1000,
    status: 'al-corriente',
  },
  {
    id: 'g2',
    title: 'Auto nuevo',
    photo: '🚗',
    saved: 12000,
    target: 150000,
    contribution: 5000,
    termMonths: 24,
    initialPayment: 2000,
    status: 'al-corriente',
  },
  {
    id: 'g3',
    title: 'Casa propia',
    photo: '🏠',
    saved: 20000,
    target: 500000,
    contribution: 8000,
    termMonths: 60,
    initialPayment: 5000,
    status: 'vencida',
  },
]

export const seedTransactions = [
  { id: 't1', type: 'in', concept: 'Depósito Stripe', amount: 5000, date: '2026-05-12', method: 'Stripe' },
  { id: 't2', type: 'out', concept: 'Envío a María López', amount: 1200, date: '2026-05-10', method: 'Xipe' },
  { id: 't3', type: 'in', concept: 'Depósito Crypto (USDT)', amount: 3200, date: '2026-05-08', method: 'Crypto' },
  { id: 't4', type: 'out', concept: 'Aportación XipeBox · Viaje a Cancún', amount: 1500, date: '2026-05-05', method: 'XipeBox' },
  { id: 't5', type: 'out', concept: 'Retiro a cuenta BBVA', amount: 2000, date: '2026-05-02', method: 'Retiro' },
  { id: 't6', type: 'in', concept: 'Solicitud cobrada a Juan P.', amount: 800, date: '2026-04-28', method: 'Xipe' },
]

export const seedNotifications = [
  { id: 'n1', title: 'Tu alcancía te necesita', body: 'Se requiere tu aportación. El mero día — min 0.', goal: 'Viaje a Cancún', tone: 'info' },
  { id: 'n2', title: 'Te estamos esperando', body: 'No olvides tu aportación, no olvides tu meta. 12:00', goal: 'Auto nuevo', tone: 'info' },
  { id: 'n3', title: 'El tiempo se agota', body: 'Pon al corriente tu alcancía.', goal: 'Casa propia', tone: 'warn' },
  { id: 'n4', title: 'Ups, tu alcancía está vencida', body: 'Ponte al corriente, tu plazo terminó.', goal: 'Casa propia', tone: 'danger' },
  { id: 'n5', title: 'Pon al corriente tu alcancía', body: 'Pon al corriente tu alcancía con $8,000.00.', goal: 'Casa propia', tone: 'danger' },
]

export const seedClients = [
  { id: 'c1', name: 'Gerardo Heredia', email: 'gerardo@xipe.mx', balance: 28560, status: 'activo' },
  { id: 'c2', name: 'María López', email: 'maria.lopez@mail.com', balance: 14200, status: 'activo' },
  { id: 'c3', name: 'Juan Pérez', email: 'juanp@mail.com', balance: 5300, status: 'activo' },
  { id: 'c4', name: 'Ana Torres', email: 'ana.torres@mail.com', balance: 92750, status: 'verificación' },
  { id: 'c5', name: 'Luis Ramírez', email: 'luisr@mail.com', balance: 0, status: 'suspendido' },
]

export const seedWithdrawals = [
  { id: 'w1', client: 'María López', amount: 3000, account: 'BBVA ****4521', date: '2026-05-13', status: 'pendiente' },
  { id: 'w2', client: 'Juan Pérez', amount: 1500, account: 'Santander ****8890', date: '2026-05-12', status: 'pendiente' },
  { id: 'w3', client: 'Ana Torres', amount: 25000, account: 'Banorte ****1102', date: '2026-05-11', status: 'aprobada' },
]

export const seedSupport = [
  { id: 's1', client: 'Juan Pérez', subject: 'No puedo retirar', body: 'Mi retiro lleva 3 días pendiente.', date: '2026-05-13', status: 'abierto' },
  { id: 's2', client: 'María López', subject: 'Duda con XipeBox', body: '¿Cómo cambio el plazo de mi alcancía?', date: '2026-05-12', status: 'abierto' },
  { id: 's3', client: 'Ana Torres', subject: 'Verificación de identidad', body: 'Subí mi INE pero sigue en revisión.', date: '2026-05-10', status: 'cerrado' },
]
