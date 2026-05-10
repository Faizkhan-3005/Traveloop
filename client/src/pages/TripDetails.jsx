import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Share2,
  Clock,
  Info
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import ItinerarySection from '../components/ItinerarySection'

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${id}`)
      return data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/trips/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
      toast.success('Trip deleted successfully')
      navigate('/app/dashboard')
    },
    onError: () => toast.error('Failed to delete trip')
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your journey details...</p>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trip not found</h2>
        <button onClick={() => navigate('/app/dashboard')} className="btn-secondary">
          Go back to Dashboard
        </button>
      </div>
    )
  }

  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', { dateStyle: 'long' })
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', { dateStyle: 'long' })

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header / Hero */}
      <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop'} 
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="absolute top-6 left-6 btn bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="absolute top-6 right-6 flex gap-2">
          <button className="btn bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="btn bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to delete this trip?')) deleteMutation.mutate()
            }}
            className="btn bg-red-500/20 backdrop-blur-md text-red-200 border-none hover:bg-red-500/40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span className="font-semibold">{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>{startDate} — {endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-400" />
                <span>{trip.travelersCount} Travelers</span>
              </div>
              {trip.budget && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Budget: ${trip.budget.toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itinerary Section (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Itinerary</h2>
          </div>

          <ItinerarySection tripId={id} initialDays={trip.itineraryDays} />
        </div>

        {/* Sidebar Section (Right) */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Trip Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {trip.description || "No description provided for this trip."}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Budget Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Budget</span>
                <span className="font-bold">${trip.budget?.toLocaleString() || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%]" />
              </div>
              <p className="text-[10px] text-slate-400 text-center">Remaining: $4,000 (Mocked)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
