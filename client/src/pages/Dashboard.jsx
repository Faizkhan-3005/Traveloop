import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Map, PlusCircle, Globe, Wallet, Plane, TrendingUp, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import TripCard from '../components/TripCard'

const quickActions = [
  { label: 'Plan a Trip',      to: '/app/trips/new',  icon: PlusCircle, color: 'btn-primary' },
  { label: 'Browse Trips',     to: '/app/trips',      icon: Map,        color: 'btn-secondary' },
  { label: 'Community Feed',   to: '/app/community',  icon: Globe,      color: 'btn-secondary' },
  { label: 'View Analytics',   to: '/app/budget',     icon: TrendingUp, color: 'btn-secondary' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const destinations = [
  { name: 'Paris',       country: 'France',    emoji: '🗼', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop' },
  { name: 'Tokyo',       country: 'Japan',     emoji: '⛩️',  img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&auto=format&fit=crop' },
  { name: 'Bali',        country: 'Indonesia', emoji: '🌴', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop' },
  { name: 'Santorini',   country: 'Greece',    emoji: '🏛️',  img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&auto=format&fit=crop' },
  { name: 'Kyoto',       country: 'Japan',     emoji: '🌸', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop' },
  { name: 'Cape Town',   country: 'S. Africa', emoji: '🏔️',  img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&auto=format&fit=crop' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data } = await api.get('/trips')
      return data
    }
  })

  const statCards = [
    { label: 'Total Trips',        value: trips?.length || 0, icon: Map,        color: 'text-brand-600',   bg: 'bg-brand-50 dark:bg-brand-900/20' },
    { label: 'Upcoming Trips',     value: trips?.filter(t => new Date(t.startDate) > new Date()).length || 0, icon: Plane,      color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Total Budget',       value: `$${trips?.reduce((acc, t) => acc + (t.budget || 0), 0).toLocaleString() || 0}`, icon: Wallet,     color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Destinations',       value: trips?.length ? [...new Set(trips.map(t => t.destination))].length : 0, icon: Globe,      color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* ── Hero greeting ─────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 p-8 text-white"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-20 w-64 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
        </div>
        <div className="relative z-10">
          <p className="text-brand-200 text-sm font-medium mb-1">{greeting},</p>
          <h1 className="text-3xl font-extrabold mb-2">{user?.name || 'Traveler'} ✈️</h1>
          <p className="text-brand-100 max-w-md">
            Ready to plan your next adventure? Start by creating a trip or explore the community for inspiration.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} className={`${color} btn text-sm`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Recent trips ───────────────────────────────────────────────────── */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Trips</h2>
          <Link to="/app/trips" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-bold">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-slate-500">Loading your adventures...</p>
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Map className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-800 dark:text-white">No trips found</p>
              <p className="text-sm text-slate-500 max-w-xs">
                You haven't created any trips yet. Time to start your first journey!
              </p>
            </div>
            <Link to="/app/trips/new" className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Create Your First Trip
            </Link>
          </div>
        )}
      </motion.section>

      {/* ── Trending destinations ───────────────────────────────────────── */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trending Destinations</h2>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full uppercase tracking-widest font-bold">Recommended</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/app/trips/new?dest=${dest.name}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-sm font-bold leading-tight">{dest.name}</p>
                <p className="text-[10px] text-white/70 uppercase tracking-tighter">{dest.country}</p>
              </div>
              <span className="absolute top-2 right-2 text-lg">{dest.emoji}</span>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
