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
  addPackingItem,
  togglePackingItem,
  deletePackingItem,
  addBudgetItem,
  deleteBudgetItem,
  addNote,
  updateNote,
  deleteNote,
  copyTrip,
} = require('../controllers/tripController')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.get('/', listTrips)
router.post('/', createTrip)
router.get('/:id', getTrip)
router.put('/:id', updateTrip)
router.delete('/:id', deleteTrip)
router.post('/:id/copy', copyTrip)

// Itinerary
router.post('/:tripId/itinerary', addItineraryDay)
router.post('/:tripId/itinerary/initialize', initializeItinerary)
router.post('/:tripId/itinerary/:dayId/activities', addActivityToDay)

// Packing
router.post('/:tripId/packing', addPackingItem)
router.patch('/:tripId/packing/:itemId/toggle', togglePackingItem)
router.delete('/:tripId/packing/:itemId', deletePackingItem)

// Budget
router.post('/:tripId/budget', addBudgetItem)
router.delete('/:tripId/budget/:itemId', deleteBudgetItem)

// Notes
router.post('/:tripId/notes', addNote)
router.put('/:tripId/notes/:noteId', updateNote)
router.delete('/:tripId/notes/:noteId', deleteNote)

module.exports = router
