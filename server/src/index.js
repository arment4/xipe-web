import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import meRoutes from './routes/me.js'
import goalsRoutes from './routes/goals.js'
import adminRoutes from './routes/admin.js'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',').map((s) => s.trim())
app.use(cors({ origin: origins, credentials: true }))

app.get('/api/health', (_, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/me', meRoutes)
app.use('/api/me/goals', goalsRoutes)
app.use('/api/admin', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Error interno' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`▶ Xipe API en http://localhost:${PORT}`)
})
