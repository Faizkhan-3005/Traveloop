const crypto = require('crypto')
const { z } = require('zod')
const prisma = require('../prisma')

const tripSchema = z.object({
  title: z.string().min(2),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
})

const citySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  order: z.number().int().optional(),
})

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
  estimatedCost: z.number().optional(),
  cityId: z.number().int().optional(),
})

const itinerarySchema = z.object({
  day: z.number().int().positive(),
  summary: z.string().min(1),
  date: z.string().optional(),
})

const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
})

const packingSchema = z.object({
  label: z.string().min(1),
})

const noteSchema = z.object({
  content: z.string().min(1),
})

const parse = (schema, body, res) => {
  const result = schema.safeParse(body)
  if (!result.success) {
    res.status(400).json({ message: 'Invalid input', issues: result.error.issues })
    return null
  }
  return result.data
}

const assertOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } })
  return !!trip
}

const listTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: {
        cities: true,
        activities: true,
        itinerary: true,
        budgetItems: true,
        packingItems: true,
        notes: true,
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
    const data = parse(tripSchema, req.body, res)
    if (!data) return

    const trip = await prisma.trip.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        userId: req.user.id,
      },
    })
    return res.status(201).json(trip)
  } catch (error) {
    return next(error)
  }
}

const addCity = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(citySchema, req.body, res)
    if (!data) return

    const city = await prisma.tripCity.create({ data: { ...data, tripId } })
    return res.status(201).json(city)
  } catch (error) {
    return next(error)
  }
}

const addActivity = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(activitySchema, req.body, res)
    if (!data) return

    const activity = await prisma.activity.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : null,
        tripId,
      },
    })
    return res.status(201).json(activity)
  } catch (error) {
    return next(error)
  }
}

const addItineraryDay = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(itinerarySchema, req.body, res)
    if (!data) return

    const item = await prisma.itineraryDay.create({
      data: { ...data, date: data.date ? new Date(data.date) : null, tripId },
    })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const addBudgetItem = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(budgetSchema, req.body, res)
    if (!data) return

    const item = await prisma.budgetItem.create({ data: { ...data, tripId } })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const addPackingItem = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(packingSchema, req.body, res)
    if (!data) return

    const item = await prisma.packingItem.create({ data: { ...data, tripId } })
    return res.status(201).json(item)
  } catch (error) {
    return next(error)
  }
}

const togglePackingItem = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const itemId = Number(req.params.itemId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const item = await prisma.packingItem.findFirst({ where: { id: itemId, tripId } })
    if (!item) return res.status(404).json({ message: 'Packing item not found' })

    const updated = await prisma.packingItem.update({
      where: { id: itemId },
      data: { packed: !item.packed },
    })
    return res.json(updated)
  } catch (error) {
    return next(error)
  }
}

const addNote = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const data = parse(noteSchema, req.body, res)
    if (!data) return

    const note = await prisma.tripNote.create({ data: { ...data, tripId } })
    return res.status(201).json(note)
  } catch (error) {
    return next(error)
  }
}

const togglePublicShare = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId)
    const owns = await assertOwnership(tripId, req.user.id)
    if (!owns) return res.status(404).json({ message: 'Trip not found' })

    const trip = await prisma.trip.findUnique({ where: { id: tripId } })
    const nextValue = !trip.isPublic
    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        isPublic: nextValue,
        shareSlug: nextValue ? trip.shareSlug || crypto.randomUUID().slice(0, 8) : null,
      },
    })

    return res.json({
      id: updated.id,
      isPublic: updated.isPublic,
      shareSlug: updated.shareSlug,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listTrips,
  createTrip,
  addCity,
  addActivity,
  addItineraryDay,
  addBudgetItem,
  addPackingItem,
  togglePackingItem,
  addNote,
  togglePublicShare,
}
