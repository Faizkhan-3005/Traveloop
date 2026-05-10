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
