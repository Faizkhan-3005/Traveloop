import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Map, PlusCircle, Globe, Wallet, Plane, TrendingUp, Loader2, Sparkles, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import TripCard from '../components/TripCard'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import { useState } from 'react'
import { destinations as trendingDestinations } from '../data/destinations'
import DestinationPanel from '../components/DestinationPanel'
import { AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [selectedDest, setSelectedDest] = useState(null)
  const hour = new Date().getHours()
  
  const getGreeting = () => {
    if (hour < 12) return t('common.good_morning')
    if (hour < 17) return t('common.good_afternoon')
    return t('common.good_evening')
  }

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data } = await api.get('/trips')
      return data
    }
  })

  const statCards = [
    { label: t('nav.my_trips'), value: trips.length, icon: Map, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/20' },
    { label: t('dashboard.upcoming'), value: trips.filter(t => new Date(t.startDate) > new Date()).length, icon: Plane, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: t('nav.budget'), value: formatCurrency(trips.reduce((acc, t) => acc + (t.budget || 0), 0), user?.currency || 'USD'), icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: t('dashboard.visited'), value: [...new Set(trips.map(t => t.destination))].length, icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] p-10 md:p-14 text-white border border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <p className="text-brand-500 font-bold uppercase tracking-[0.4em] text-[9px]">{getGreeting()}</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white/95 leading-none">
              {getGreeting().split(' ')[0]}, <span className="text-slate-400">{user?.name?.split(' ')[0] || t('common.explorer')}</span>
            </h1>
            <p className="text-slate-400 max-w-md text-base font-medium leading-relaxed opacity-80">
              {t('dashboard.hero_subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: t('nav.new_trip'), to: '/app/trips/new', icon: PlusCircle, primary: true },
              { label: t('nav.ai_planner'), to: '/app/ai-planner', icon: Sparkles, primary: false },
              { label: t('nav.community'), to: '/app/community', icon: Globe, primary: false },
            ].map(({ label, to, icon: Icon, primary }) => (
              <Link 
                key={to} 
                to={to} 
                className={`flex items-center gap-3 px-8 h-12 rounded-xl text-xs font-bold transition-all group ${
                  primary 
                    ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-xl shadow-brand-600/20' 
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md'
                }`}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-6 flex flex-col gap-4 group hover:border-brand-500/30 transition-all hover:shadow-xl shadow-slate-200/50">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white truncate">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recent Trips Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('nav.my_trips')}</h2>
            <p className="text-sm text-slate-500 font-medium">{t('dashboard.recent_trips_subtitle')}</p>
          </div>
          <Link to="/app/trips" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:opacity-80 transition">
            {t('common.view_all')}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hydrating adventures...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="card p-16 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-20 h-20 rounded-[2.5rem] bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl">
              <Map className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-slate-800 dark:text-white">{t('dashboard.no_trips')}</p>
              <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                The world is waiting for your story. Start by creating your first itinerary today.
              </p>
            </div>
            <Link to="/app/trips/new" className="btn-primary btn-lg h-14 px-10">
              <PlusCircle className="w-5 h-5" /> {t('dashboard.create_first')}
            </Link>
          </div>
        )}
      </motion.section>

      {/* Recommended Section & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.section variants={itemVariants} className={`${selectedDest ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-500`}>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('dashboard.trending_destinations')}</h2>
              <p className="text-sm text-slate-500 font-medium">{t('dashboard.trending_subtitle')}</p>
            </div>
          </div>
          <div className={`grid gap-6 ${selectedDest ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
            {trendingDestinations.map((dest) => (
              <button 
                key={dest.name} 
                onClick={() => setSelectedDest(selectedDest?.name === dest.name ? null : dest)}
                className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${
                  selectedDest?.name === dest.name ? 'border-brand-500 ring-4 ring-brand-500/20' : 'border-transparent'
                }`}
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 text-left">
                  <p className="text-lg font-black leading-tight drop-shadow-md text-white">{dest.name}</p>
                  <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Info Panel */}
        <AnimatePresence>
          {selectedDest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 h-[600px] lg:sticky lg:top-24"
            >
              <DestinationPanel dest={selectedDest} onClose={() => setSelectedDest(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
