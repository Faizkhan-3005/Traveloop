const prisma = require('../prisma')

const getSharedTrip = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { shareSlug: req.params.slug, isPublic: true },
      include: {
        cities: true,
        activities: true,
        itinerary: true,
        budgetItems: true,
        packingItems: true,
        notes: true,
      },
    })

    if (!trip) {
      return res.status(404).json({ message: 'Shared trip not found' })
    }

    return res.json(trip)
  } catch (error) {
    return next(error)
  }
}

module.exports = { getSharedTrip }
