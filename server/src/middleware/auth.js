const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token' })
  }

  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.userId }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid authorization token' })
  }
}

module.exports = { requireAuth }
