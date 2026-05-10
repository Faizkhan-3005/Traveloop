import { Calendar, MapPin, Users, ArrowRight, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import DeleteTripModal from './DeleteTripModal'

export default function TripCard({ trip }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const menuRef = useRef(null)

  const startDate = trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) : 'TBD'
  const endDate = trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : ''

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/trips/${trip.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
      toast.success('Trip deleted successfully')
      setShowDeleteModal(false)
    },
    onError: () => toast.error('Failed to delete trip')
  })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          <span className="absolute top-4 left-4 badge-blue backdrop-blur-md bg-brand-500/20 text-brand-100 border border-brand-500/30">Public</span>
        )}

        <div className="absolute top-4 right-4" ref={menuRef}>
          <button 
            onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu) }}
            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all border border-white/20"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 p-1.5 overflow-hidden"
              >
                <Link 
                  to={`/app/trips/${trip.id}/edit`}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-brand-500" />
                  Edit Trip
                </Link>
                <button 
                  onClick={(e) => { e.preventDefault(); setShowDeleteModal(true); setShowMenu(false) }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Trip
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteTripModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate()}
        tripName={trip.title}
        destination={trip.destination}
        isPending={deleteMutation.isPending}
      />

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
