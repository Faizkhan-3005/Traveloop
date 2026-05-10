const { Router } = require('express')
const {
  listTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  addItineraryDay,
  initializeItinerary,
  addActivityToDay,
} = require('../controllers/tripController')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.get('/', listTrips)
router.post('/', createTrip)
router.get('/:id', getTrip)
router.put('/:id', updateTrip)
router.delete('/:id', deleteTrip)

router.post('/:tripId/itinerary', addItineraryDay)
router.post('/:tripId/itinerary/initialize', initializeItinerary)
router.post('/:tripId/itinerary/:dayId/activities', addActivityToDay)

module.exports = router
