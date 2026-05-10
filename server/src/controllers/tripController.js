const { z } = require('zod')
const prisma = require('../prisma')

const tripSchema = z.object({
  title: z.string().min(2),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().optional(),
  travelersCount: z.number().int().min(1).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
})

const activitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
  durationHrs: z.number().optional(),
  itineraryDayId: z.string(),
  activityId: z.string().optional(), // If using seeded activities
})

const itineraryDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  date: z.string().optional(),
  summary: z.string().optional(),
})

const assertOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, ownerId: userId },
  })
  return !!trip
}

const listTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { ownerId: req.user.id },
      include: {
        cities: { include: { city: true } },
        _count: {
          select: {
            itineraryDays: true,
            packingItems: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(trips)
  } catch (error) {
    return next(error)
  }
}

const createTrip = async (req, res, next) => {
  try {
    const data = tripSchema.parse(req.body)

    const trip = await prisma.trip.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        ownerId: req.user.id,
      },
    })
    return res.status(201).json(trip)
  } catch (error) {
    return next(error)
  }
}

const getTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const trip = await prisma.trip.findFirst({
      where: { id, ownerId: req.user.id },
      include: {
        cities: { include: { city: true } },
        itineraryDays: {
          include: {
            activities: {
              include: {
                activity: true
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { dayNumber: 'asc' }
        },
        budgetItems: true,
        packingItems: true,
        notes: true,
      }
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    return res.json(trip)
  } catch (error) {
    return next(error)
  }
}

const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const owns = await assertOwnership(id, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = tripSchema.partial().parse(req.body)
    
    const updateData = { ...data }
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate) updateData.endDate = new Date(data.endDate)

    const updated = await prisma.trip.update({
      where: { id },
      data: updateData,
    })
    return res.json(updated)
  } catch (error) {
    return next(error)
  }
}

const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const owns = await assertOwnership(id, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    await prisma.trip.delete({ where: { id } })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── Itinerary Management ───────────────────────────────────────────────────

const addItineraryDay = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = itineraryDaySchema.parse(req.body)
    
    const day = await prisma.itineraryDay.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : null,
        tripId,
      }
    })
    return res.status(201).json(day)
  } catch (error) {
    return next(error)
  }
}

const initializeItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, ownerId: req.user.id },
    })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })

    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const days = []
    for (let i = 1; i <= diffDays; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + (i - 1))
      days.push({
        dayNumber: i,
        date,
        tripId,
        summary: `Day ${i} Plan`
      })
    }

    await prisma.itineraryDay.createMany({ data: days })
    
    const updatedTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { itineraryDays: true }
    })

    return res.json(updatedTrip.itineraryDays)
  } catch (error) {
    return next(error)
  }
}

const addActivityToDay = async (req, res, next) => {
  try {
    const { tripId, dayId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = activitySchema.parse(req.body)
    
    // Check if it's a seeded activity or custom
    // If activityId is provided, we use that.
    
    const count = await prisma.itineraryActivity.count({ where: { itineraryDayId: dayId } })

    const item = await prisma.itineraryActivity.create({
      data: {
        order: count + 1,
        itineraryDayId: dayId,
        activityId: data.activityId, // Can be null if custom
        // If custom, we might need more logic, but for Phase 2 let's assume seeded
      }
    })

    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  addItineraryDay,
  initializeItinerary,
  addActivityToDay,
}
