const { Router } = require('express')
const { getSharedTrip } = require('../controllers/publicController')

const router = Router()

router.get('/trips/:slug', getSharedTrip)

module.exports = router
