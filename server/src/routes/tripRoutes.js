const { Router } = require('express')
const {
  addActivity,
  addBudgetItem,
  addCity,
  addItineraryDay,
  addNote,
  addPackingItem,
  createTrip,
  listTrips,
  togglePackingItem,
  togglePublicShare,
} = require('../controllers/tripController')
const { requireAuth } = require('../middleware/auth')
const { authenticatedLimiter } = require('../middleware/rateLimit')

const router = Router()

router.use(requireAuth)
router.use(authenticatedLimiter)
router.get('/', listTrips)
router.post('/', createTrip)
router.post('/:tripId/cities', addCity)
router.post('/:tripId/activities', addActivity)
router.post('/:tripId/itinerary', addItineraryDay)
router.post('/:tripId/budget', addBudgetItem)
router.post('/:tripId/packing', addPackingItem)
router.patch('/:tripId/packing/:itemId/toggle', togglePackingItem)
router.post('/:tripId/notes', addNote)
router.patch('/:tripId/share', togglePublicShare)

module.exports = router
