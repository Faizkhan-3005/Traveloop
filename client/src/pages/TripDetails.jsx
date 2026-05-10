import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, MapPin, Users, DollarSign, 
  Loader2, ArrowLeft, Trash2, 
  Edit2, Share2, Info, 
  Layout, Package, Wallet, StickyNote,
  ChevronRight, Globe
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import { useAuth } from '../context/AuthContext'

// Sub-components
import ItinerarySection from '../components/ItinerarySection'
import PackingList from '../components/PackingList'
import BudgetTracker from '../components/BudgetTracker'
import TripNotes from '../components/TripNotes'
import DeleteTripModal from '../components/DeleteTripModal'
import { Link } from 'react-router-dom'

export default function TripDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('itinerary')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${id}`)
      return data
    },
    retry: 1
  })

  const tabs = [
    { id: 'itinerary', label: t('trip_details.itinerary'), icon: Layout },
    { id: 'packing',   label: t('trip_details.packing'),   icon: Package },
    { id: 'budget',    label: t('trip_details.budget'),    icon: Wallet },
    { id: 'notes',     label: t('trip_details.notes'),     icon: StickyNote },
  ]

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/trips/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
      toast.success(t('common.success'))
      setShowDeleteModal(false)
      navigate('/app/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t('trip_details.error_delete'))
    }
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
        <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-brand-300" />
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">{t('common.loading')}</p>
    </div>
  )

  if (error || !trip) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center max-w-sm mx-auto">
      <div className="w-20 h-20 rounded-[2rem] bg-red-50 dark:bg-red-900/10 flex items-center justify-center border border-red-100 dark:border-red-900/30">
        <Info className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t('trip_details.not_found')}</h2>
        <p className="text-sm text-slate-500 font-medium">We couldn't find a journey with ID: <span className="font-mono text-brand-600 font-black">{id}</span></p>
      </div>
      <button onClick={() => navigate('/app/dashboard')} className="btn-primary w-full shadow-lg shadow-brand-500/20">
        {t('trip_details.return')}
      </button>
    </div>
  )

  const startDate = new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
  const endDate = new Date(trip.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Header / Hero */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white dark:border-slate-800">
        <img 
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop'} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/app/dashboard')}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
              <MapPin className="w-3.5 h-3.5 inline mr-2 text-brand-400" />
              {trip.destination}
            </div>
          </div>

          <div className="flex gap-3">
            <Link 
              to={`/app/trips/${id}/edit`}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
            >
              <Edit2 className="w-5 h-5" />
            </Link>
            <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-12 h-12 rounded-2xl bg-red-500/20 backdrop-blur-2xl border border-red-500/30 text-red-200 flex items-center justify-center hover:bg-red-500/40 transition-all hover:scale-110"
            >
              <Trash2 className="w-5 h-5" />
            </button>
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

        <div className="absolute bottom-12 left-12 right-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  <Calendar className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Duration</p>
                  <p className="font-bold text-sm text-white">{startDate} — {endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  <Users className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Travelers</p>
                  <p className="font-bold text-sm text-white">{trip.travelersCount} Explorer{trip.travelersCount > 1 ? 's' : ''}</p>
                </div>
              </div>
              {trip.budget && (
                <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-3xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/80">Total Budget</p>
                    <p className="font-black text-lg text-emerald-400 leading-none">
                      {formatCurrency(trip.budget, user?.currency || 'USD')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="sticky top-16 z-30 py-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl -mx-6 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-[1.75rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30 scale-105' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              {activeTab === 'itinerary' && <ItinerarySection tripId={id} initialDays={trip.itineraryDays} />}
              {activeTab === 'packing'   && <PackingList tripId={id} />}
              {activeTab === 'budget'    && <BudgetTracker tripId={id} totalBudget={trip.budget} />}
              {activeTab === 'notes'     && <TripNotes tripId={id} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-3">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600">
                  <Info className="w-5 h-5" />
                </div>
                {t('trip_details.overview')}
              </h3>
              <Link to={`/app/trips/${id}/edit`} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-brand-600 transition-all">
                <Edit2 className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {trip.description || "Every adventure needs a story. Add yours to begin the legend."}
            </p>
          </motion.div>

          <div className="card p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-dashed border-2">
            <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.2em] text-slate-400">{t('trip_details.stats')}</h3>
            <div className="space-y-5">
              {[
                { label: t('trip_details.planned_days'), value: trip?.itineraryDays?.length || 0, icon: Calendar },
                { label: t('trip_details.saved_activities'), value: trip?.itineraryDays?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0, icon: MapPin },
                { label: t('trip_details.checklist_progress'), value: trip?.packingItems?.length ? `${Math.round((trip.packingItems.filter(i => i.packed).length / trip.packingItems.length) * 100)}%` : '0%', icon: Package }
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition flex items-center justify-center gap-2">
              View Detailed Report
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
