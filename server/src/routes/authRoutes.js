const { Router } = require('express')
const { register, login, me, updateProfile } = require('../controllers/authController')
const { requireAuth } = require('../middleware/auth')
const { authLimiter } = require('../middleware/rateLimit')

const router = Router()

// Public routes (stricter rate limit)
router.post('/register', authLimiter, register)
router.post('/login',    authLimiter, login)

// Protected routes
router.get('/me',            requireAuth, me)
router.patch('/profile',     requireAuth, updateProfile)

module.exports = router
