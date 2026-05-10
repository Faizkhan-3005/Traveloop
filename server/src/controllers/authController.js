const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const prisma = require('../prisma')

// ─── Validation schemas ───────────────────────────────────────────────────────

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  city:     z.string().optional(),
  country:  z.string().optional(),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

// ─── Helper ───────────────────────────────────────────────────────────────────

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

const safeUser = (user) => ({
  id:        user.id,
  name:      user.name,
  email:     user.email,
  role:      user.role,
  city:      user.city,
  country:   user.country,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
})

// ─── POST /api/auth/register ──────────────────────────────────────────────────

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name:         data.name,
        email:        data.email,
        passwordHash,
        city:         data.city,
        country:      data.country,
      },
    })

    const token = signToken(user.id)
    return res.status(201).json({ token, user: safeUser(user) })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', issues: error.issues })
    }
    return next(error)
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user.id)
    return res.json({ token, user: safeUser(user) })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', issues: error.issues })
    }
    return next(error)
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// Protected – requireAuth middleware attaches req.user

const me = async (req, res, next) => {
  try {
    // req.user is already the full user object from the middleware
    return res.json({ user: req.user })
  } catch (error) {
    return next(error)
  }
}

// ─── PATCH /api/auth/profile ──────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name:      z.string().min(2).optional(),
  city:      z.string().optional(),
  country:   z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

const updateProfile = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
    })
    return res.json({ user: safeUser(user) })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', issues: error.issues })
    }
    return next(error)
  }
}

module.exports = { register, login, me, updateProfile }
