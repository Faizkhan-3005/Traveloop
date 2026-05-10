const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const cities = [
  { name: 'Paris',       country: 'France',       continent: 'Europe',   description: 'City of light and love', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { name: 'Tokyo',       country: 'Japan',         continent: 'Asia',     description: 'Neon-lit megacity meets ancient temples', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
  { name: 'New York',    country: 'USA',           continent: 'Americas', description: 'The city that never sleeps', imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800' },
  { name: 'Bali',        country: 'Indonesia',     continent: 'Asia',     description: 'Island of gods and surf', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
  { name: 'Barcelona',   country: 'Spain',         continent: 'Europe',   description: 'Gaudí architecture and beach vibes', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800' },
  { name: 'Dubai',       country: 'UAE',           continent: 'Asia',     description: 'Futuristic skyline in the desert', imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800' },
  { name: 'Rome',        country: 'Italy',         continent: 'Europe',   description: 'Eternal city of ancient history', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
  { name: 'Sydney',      country: 'Australia',     continent: 'Oceania',  description: 'Harbour bridge and golden beaches', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800' },
  { name: 'Cape Town',   country: 'South Africa',  continent: 'Africa',   description: 'Mountain meets ocean at the tip of Africa', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800' },
  { name: 'Santorini',   country: 'Greece',        continent: 'Europe',   description: 'White-washed cliffs above the Aegean', imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800' },
  { name: 'Kyoto',       country: 'Japan',         continent: 'Asia',     description: 'Ancient temples and cherry blossoms', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' },
  { name: 'Marrakech',   country: 'Morocco',       continent: 'Africa',   description: 'Medinas, souks and vibrant colour', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800' },
  { name: 'Amsterdam',   country: 'Netherlands',   continent: 'Europe',   description: 'Canals, bicycles and tulips', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5702?w=800' },
  { name: 'Maldives',    country: 'Maldives',      continent: 'Asia',     description: 'Crystal lagoons and overwater bungalows', imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800' },
  { name: 'Prague',      country: 'Czech Republic',continent: 'Europe',   description: 'Gothic spires and cobblestone streets', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800' },
]

const activityTemplates = {
  Paris: [
    { name: 'Eiffel Tower Visit',     category: 'Culture',    durationHrs: 2, price: 30 },
    { name: 'Louvre Museum Tour',     category: 'Culture',    durationHrs: 4, price: 22 },
    { name: 'Seine River Cruise',     category: 'Adventure',  durationHrs: 1, price: 18 },
    { name: 'Montmartre Walk',        category: 'Leisure',    durationHrs: 3, price: 0  },
    { name: 'French Cooking Class',   category: 'Food',       durationHrs: 3, price: 95 },
  ],
  Tokyo: [
    { name: 'Shibuya Crossing',       category: 'Culture',    durationHrs: 1, price: 0  },
    { name: 'Tsukiji Market Tour',    category: 'Food',       durationHrs: 2, price: 25 },
    { name: 'Mount Fuji Day Trip',    category: 'Adventure',  durationHrs: 10,price: 80 },
    { name: 'Akihabara Electronics',  category: 'Shopping',   durationHrs: 3, price: 0  },
    { name: 'Onsen Hot Spring Bath',  category: 'Wellness',   durationHrs: 2, price: 20 },
  ],
  'New York': [
    { name: 'Statue of Liberty Tour', category: 'Culture',    durationHrs: 4, price: 25 },
    { name: 'Central Park Bike Ride', category: 'Adventure',  durationHrs: 2, price: 15 },
    { name: 'Broadway Show',          category: 'Culture',    durationHrs: 3, price: 150},
    { name: 'Brooklyn Bridge Walk',   category: 'Leisure',    durationHrs: 1, price: 0  },
    { name: 'NYC Food Tour',          category: 'Food',       durationHrs: 3, price: 60 },
  ],
  Bali: [
    { name: 'Uluwatu Temple Sunset',  category: 'Culture',    durationHrs: 3, price: 5  },
    { name: 'Rice Terrace Trek',      category: 'Adventure',  durationHrs: 5, price: 20 },
    { name: 'Surf Lesson',            category: 'Adventure',  durationHrs: 2, price: 35 },
    { name: 'Traditional Cooking Class', category: 'Food',   durationHrs: 4, price: 45 },
    { name: 'Waterfall Hike',         category: 'Adventure',  durationHrs: 4, price: 10 },
  ],
  Barcelona: [
    { name: 'Sagrada Familia Tour',   category: 'Culture',    durationHrs: 2, price: 30 },
    { name: 'Park Güell Visit',       category: 'Culture',    durationHrs: 2, price: 14 },
    { name: 'Las Ramblas Walk',       category: 'Leisure',    durationHrs: 1, price: 0  },
    { name: 'Tapas Food Tour',        category: 'Food',       durationHrs: 3, price: 55 },
    { name: 'Barceloneta Beach Day',  category: 'Leisure',    durationHrs: 4, price: 0  },
  ],
  Rome: [
    { name: 'Colosseum Tour',         category: 'Culture',    durationHrs: 3, price: 20 },
    { name: 'Vatican Museums',        category: 'Culture',    durationHrs: 4, price: 25 },
    { name: 'Trevi Fountain Visit',   category: 'Leisure',    durationHrs: 1, price: 0  },
    { name: 'Roman Pizza Class',      category: 'Food',       durationHrs: 3, price: 75 },
    { name: 'Catacombs Tour',         category: 'Culture',    durationHrs: 2, price: 15 },
  ],
  Kyoto: [
    { name: 'Fushimi Inari Hike',     category: 'Adventure',  durationHrs: 3, price: 0  },
    { name: 'Tea Ceremony',           category: 'Culture',    durationHrs: 2, price: 40 },
    { name: 'Arashiyama Bamboo',      category: 'Leisure',    durationHrs: 2, price: 0  },
    { name: 'Gion Geisha District',   category: 'Culture',    durationHrs: 2, price: 0  },
    { name: 'Nishiki Market Food',    category: 'Food',       durationHrs: 2, price: 20 },
  ],
  Santorini: [
    { name: 'Oia Sunset View',        category: 'Leisure',    durationHrs: 2, price: 0  },
    { name: 'Sailing Caldera Tour',   category: 'Adventure',  durationHrs: 5, price: 80 },
    { name: 'Wine Tasting Tour',      category: 'Food',       durationHrs: 3, price: 60 },
    { name: 'Black Sand Beach',       category: 'Leisure',    durationHrs: 3, price: 0  },
    { name: 'Akrotiri Archaeological Site', category: 'Culture', durationHrs: 2, price: 12 },
  ],
}

async function main() {
  console.log('🌱 Starting seed...')

  // ─── Admin user ─────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin1234', 12)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@traveloop.com' },
    update: {},
    create: {
      name:         'Admin',
      email:        'admin@traveloop.com',
      passwordHash: adminHash,
      role:         'ADMIN',
      city:         'San Francisco',
      country:      'USA',
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ─── Demo user ───────────────────────────────────────────────────────────────
  const demoHash = await bcrypt.hash('demo1234', 12)
  const demo = await prisma.user.upsert({
    where:  { email: 'demo@traveloop.com' },
    update: {},
    create: {
      name:         'Demo Traveler',
      email:        'demo@traveloop.com',
      passwordHash: demoHash,
      role:         'USER',
      city:         'London',
      country:      'UK',
    },
  })
  console.log('✅ Demo user:', demo.email)

  // ─── Cities + Activities ─────────────────────────────────────────────────────
  for (const cityData of cities) {
    const city = await prisma.city.upsert({
      where:  { id: cityData.name }, // use name as natural key for seed idempotency
      update: {},
      create: cityData,
    }).catch(async () => {
      // upsert by name search if above fails
      const existing = await prisma.city.findFirst({ where: { name: cityData.name } })
      if (existing) return existing
      return prisma.city.create({ data: cityData })
    })

    const templates = activityTemplates[cityData.name] || []
    for (const act of templates) {
      const exists = await prisma.activity.findFirst({
        where: { name: act.name, cityId: city.id },
      })
      if (!exists) {
        await prisma.activity.create({ data: { ...act, cityId: city.id } })
      }
    }
    console.log(`✅ ${cityData.name} seeded with ${templates.length} activities`)
  }

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
