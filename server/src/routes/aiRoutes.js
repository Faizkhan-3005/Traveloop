const { Router } = require('express')
const { generateTripPlan } = require('../controllers/aiController')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.post('/plan', generateTripPlan)

module.exports = router
