const prisma = require('../prisma')

const getDashboard = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: { budgetItems: true, activities: true },
      orderBy: { startDate: 'asc' },
    })

    const totalBudget = trips.reduce(
      (sum, trip) => sum + trip.budgetItems.reduce((tripSum, item) => tripSum + item.amount, 0),
      0,
    )

    const totalActivities = trips.reduce((sum, trip) => sum + trip.activities.length, 0)

    return res.json({
      summary: {
        totalTrips: trips.length,
        totalBudget,
        totalActivities,
      },
      upcomingTrips: trips.map((trip) => ({
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
      })),
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getDashboard }
