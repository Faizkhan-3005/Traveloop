const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { rateLimiter } = require('./middleware/rateLimit')

const authRoutes      = require('./routes/authRoutes')
const tripRoutes      = require('./routes/tripRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const publicRoutes    = require('./routes/publicRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const aiRoutes        = require('./routes/aiRoutes')
const notesRoutes     = require('./routes/notesRoutes')

const app = express()

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}))
app.use(express.json())
app.use(rateLimiter)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/trips',     tripRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/public',    publicRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai',        aiRoutes)
app.use('/api/notes',     notesRoutes)

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error('[ERROR]', error)

  if (error.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation failed', issues: error.issues })
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'A record with that value already exists' })
  }

  const status = error.status || error.statusCode || 500
  res.status(status).json({ message: error.message || 'Internal server error' })
})

module.exports = app
