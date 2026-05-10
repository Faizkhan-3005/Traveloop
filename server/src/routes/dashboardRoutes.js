const { Router } = require('express')
const { getDashboard } = require('../controllers/dashboardController')
const { requireAuth } = require('../middleware/auth')
const { authenticatedLimiter } = require('../middleware/rateLimit')

const router = Router()

router.get('/', authenticatedLimiter, requireAuth, getDashboard)

module.exports = router
