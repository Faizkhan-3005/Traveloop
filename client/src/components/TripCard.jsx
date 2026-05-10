import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function TripCard({ trip }) {
  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card overflow-hidden group border-none shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop'}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold leading-tight">{trip.title}</h3>
          <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
            <MapPin className="w-3 h-3" />
            <span>{trip.destination}</span>
          </div>
        </div>
        {trip.isPublic && (
          <span className="absolute top-4 right-4 badge-blue">Public</span>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4" />
            <span>{trip.travelersCount}</span>
          </div>
        </div>

        {trip.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {trip.description}
          </p>
        )}

        <div className="pt-2">
          <Link
            to={`/app/trips/${trip.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
          >
            View Itinerary
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
