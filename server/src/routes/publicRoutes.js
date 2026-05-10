const { Router } = require('express')
const prisma = require('../prisma')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.get('/cities', async (req, res) => {
  const cities = await prisma.city.findMany({
    orderBy: { name: 'asc' }
  })
  res.json(cities)
})

router.get('/cities/:cityId/activities', async (req, res) => {
  const { cityId } = req.params
  const activities = await prisma.activity.findMany({
    where: { cityId },
    orderBy: { name: 'asc' }
  })
  res.json(activities)
})

// Community Feed: Get all public trips with optional search
router.get('/trips/feed', async (req, res) => {
  const { q } = req.query
  
  const where = { isPublic: true }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { destination: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { owner: { name: { contains: q, mode: 'insensitive' } } }
    ]
  }

  const trips = await prisma.trip.findMany({
    where,
    include: {
      owner: {
        select: { name: true, avatarUrl: true }
      },
      _count: {
        select: { itineraryDays: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Map to "post" structure expected by frontend (author instead of owner, mock social counts for now)
  const feed = trips.map(t => ({
    ...t,
    author: t.owner,
    likesCount: Math.floor(Math.random() * 50) + 10, // Mock for MVP
    savesCount: Math.floor(Math.random() * 20) + 5,  // Mock for MVP
  }))

  res.json(feed)
})

// Search activities by city name
router.get('/activities/search', async (req, res) => {
  const { q } = req.query
  if (!q) return res.json([])
  
  const activities = await prisma.activity.findMany({
    where: {
      city: {
        name: { contains: q, mode: 'insensitive' }
      }
    },
    include: { city: true },
    take: 10
  })
  res.json(activities)
})

module.exports = router
