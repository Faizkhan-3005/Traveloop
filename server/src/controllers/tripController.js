const { z } = require('zod')
const prisma = require('../prisma')
const { createNotification } = require('../services/notificationService')

const tripSchema = z.object({
  title: z.string().min(2),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(0, "Budget must be at least 0").optional(),
  travelersCount: z.number().int().min(1, "Minimum 1 traveler").max(20, "Maximum 20 travelers").optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

const activitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
  durationHrs: z.number().optional(),
  itineraryDayId: z.string(),
  activityId: z.string().optional(),
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

// ─── Trip CRUD ─────────────────────────────────────────────────────────────

const listTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { ownerId: req.user.id },
      include: {
        packingItems: true,
        budgetItems: true,
        notes: true,
        _count: {
          select: {
            itineraryDays: true,
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
    await createNotification({
      userId: req.user.id,
      title: 'New Adventure Started!',
      message: `You successfully created "${trip.title}". Time to start packing!`,
      type: 'trip'
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
        itineraryDays: {
          include: {
            activities: {
              include: { activity: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { dayNumber: 'asc' }
        },
        budgetItems: { orderBy: { createdAt: 'desc' } },
        packingItems: { orderBy: { createdAt: 'asc' } },
        notes: { orderBy: { updatedAt: 'desc' } },
      }
    })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })
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
    const updated = await prisma.trip.update({ where: { id }, data: updateData })
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

// ─── Itinerary ─────────────────────────────────────────────────────────────

const addItineraryDay = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const data = itineraryDaySchema.parse(req.body)
    const day = await prisma.itineraryDay.create({
      data: { ...data, date: data.date ? new Date(data.date) : null, tripId }
    })
    return res.status(201).json(day)
  } catch (error) {
    return next(error)
  }
}

const initializeItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const trip = await prisma.trip.findFirst({ where: { id: tripId, ownerId: req.user.id } })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1
    const days = []
    for (let i = 1; i <= diffDays; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + (i - 1))
      days.push({ dayNumber: i, date, tripId, summary: `Day ${i} Plan` })
    }
    await prisma.itineraryDay.createMany({ data: days })
    const items = await prisma.itineraryDay.findMany({ where: { tripId }, orderBy: { dayNumber: 'asc' } })
    return res.json(items)
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
    const count = await prisma.itineraryActivity.count({ where: { itineraryDayId: dayId } })
    const item = await prisma.itineraryActivity.create({
      data: { order: count + 1, itineraryDayId: dayId, activityId: data.activityId }
    })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

// ─── Packing ───────────────────────────────────────────────────────────────

const addPackingItem = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const item = await prisma.packingItem.create({
      data: { label: req.body.label, category: req.body.category, tripId }
    })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const togglePackingItem = async (req, res, next) => {
  try {
    const { tripId, itemId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const item = await prisma.packingItem.findUnique({ where: { id: itemId } })
    const updated = await prisma.packingItem.update({
      where: { id: itemId },
      data: { packed: !item.packed }
    })
    return res.json(updated)
  } catch (error) {
    return next(error)
  }
}

const deletePackingItem = async (req, res, next) => {
  try {
    const { tripId, itemId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    await prisma.packingItem.delete({ where: { id: itemId } })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── Budget ────────────────────────────────────────────────────────────────

const addBudgetItem = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const item = await prisma.budgetItem.create({
      data: { 
        name: req.body.name || 'Untitled Expense',
        category: req.body.category, 
        amount: Number(req.body.amount), 
        tripId 
      }
    })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const deleteBudgetItem = async (req, res, next) => {
  try {
    const { tripId, itemId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    await prisma.budgetItem.delete({ where: { id: itemId } })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── Notes ─────────────────────────────────────────────────────────────────

const addNote = async (req, res, next) => {
  try {
    const { tripId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const note = await prisma.tripNote.create({
      data: { content: req.body.content || 'New Note', tripId }
    })
    return res.status(201).json(note)
  } catch (error) {
    return next(error)
  }
}

const updateNote = async (req, res, next) => {
  try {
    const { tripId, noteId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    const updated = await prisma.tripNote.update({
      where: { id: noteId },
      data: { content: req.body.content }
    })
    return res.json(updated)
  } catch (error) {
    return next(error)
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const { tripId, noteId } = req.params
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })
    await prisma.tripNote.delete({ where: { id: noteId } })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

// ─── Copy ──────────────────────────────────────────────────────────────────

const copyTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const orig = await prisma.trip.findUnique({
      where: { id },
      include: { itineraryDays: { include: { activities: true } } }
    })
    if (!orig) return res.status(404).json({ message: 'Original trip not found' })
    const newTrip = await prisma.trip.create({
      data: {
        title: `Copy of ${orig.title}`,
        destination: orig.destination,
        description: orig.description,
        startDate: orig.startDate,
        endDate: orig.endDate,
        budget: orig.budget,
        travelersCount: orig.travelersCount,
        coverImage: orig.coverImage,
        ownerId: req.user.id,
        itineraryDays: {
          create: orig.itineraryDays.map(day => ({
            dayNumber: day.dayNumber,
            date: day.date,
            summary: day.summary,
            activities: { create: day.activities.map(act => ({ order: act.order, activityId: act.activityId })) }
          }))
        }
      }
    })
    return res.status(201).json(newTrip)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listTrips, createTrip, getTrip, updateTrip, deleteTrip,
  addItineraryDay, initializeItinerary, addActivityToDay,
  addPackingItem, togglePackingItem, deletePackingItem,
  addBudgetItem, deleteBudgetItem,
  addNote, updateNote, deleteNote,
  copyTrip
}
