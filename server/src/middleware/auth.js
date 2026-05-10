const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

// ─── Require valid JWT ────────────────────────────────────────────────────────
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token' })
  }

  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // Attach full user from DB so controllers always have role, etc.
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    })
    if (!user) return res.status(401).json({ message: 'User not found' })
    req.user = user
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// ─── Require ADMIN role ───────────────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  return next()
}

module.exports = { requireAuth, requireAdmin }
