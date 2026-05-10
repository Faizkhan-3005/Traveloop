import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map, Plus, Search, Filter, 
  Loader2, Plane, LayoutGrid, List 
} from 'lucide-react'
import api from '../services/api'
import TripCard from '../components/TripCard'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function MyTrips() {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')

  const { data: trips, isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      console.log("[MY_TRIPS] Fetching all trips...")
      const { data } = await api.get('/trips')
      console.log("[MY_TRIPS] Received trips:", data)
      return data
    }
  })

  if (error) {
    console.error("[MY_TRIPS] Query error:", error)
  }

  const filteredTrips = trips?.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.destination.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      <p className="text-slate-500 font-medium">Loading your adventures...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Trips</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and explore all your planned journeys</p>
        </div>
        <Link to="/app/trips/new" className="btn-primary w-fit">
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your trips..."
            className="input pl-10 bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="btn-secondary btn-sm h-10 px-4">
            <Filter className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredTrips?.length > 0 ? (
        <div className={view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          <AnimatePresence>
            {filteredTrips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
            <Plane className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No trips found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
              {search ? `We couldn't find any trips matching "${search}"` : "You haven't planned any trips yet. Start your next adventure today!"}
            </p>
          </div>
          {!search && (
            <Link to="/app/trips/new" className="btn-primary mx-auto">
              Plan Your First Trip
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
