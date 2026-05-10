import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  X, MapPin, Utensils, Calendar, 
  Wallet, Thermometer, Globe2, 
  Activity, Star, Sparkles
} from 'lucide-react'

export default function DestinationPanel({ dest, onClose }) {
  const navigate = useNavigate()
  if (!dest) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="card overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-brand-100/50 dark:border-slate-800 shadow-2xl h-full flex flex-col"
    >
      {/* Hero Section */}
      <div className="relative h-64 shrink-0 overflow-hidden">
        <img 
          src={dest.img} 
          alt={dest.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-2 text-brand-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">
            <Sparkles className="w-3 h-3" />
            Featured Destination
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{dest.name}</h2>
          <p className="text-white/70 font-bold text-sm flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> {dest.country}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {/* Culture */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-brand-500" />
            The Vibe
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
            "{dest.culture}"
          </p>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-brand-100">
            <Thermometer className="w-4 h-4 text-orange-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Weather</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{dest.weather}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-100">
            <Wallet className="w-4 h-4 text-emerald-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{dest.budget}</p>
          </div>
        </div>

        {/* Attractions */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            Must Visit
          </h3>
          <div className="flex flex-wrap gap-2">
            {dest.attractions.map(item => (
              <span key={item} className="px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold border border-brand-100/50">
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Food */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-orange-500" />
            Local Flavors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {dest.foods.map(food => (
              <div key={food} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                {food}
              </div>
            ))}
          </div>
        </section>

        {/* Logistics */}
        <section className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">Language</span>
            <span className="font-black text-slate-900 dark:text-white">{dest.language}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">Currency</span>
            <span className="font-black text-slate-900 dark:text-white">{dest.currency}</span>
          </div>
        </section>
      </div>

      {/* Action */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 shrink-0">
        <button 
          onClick={() => navigate(`/app/trips/new?dest=${dest.name}`)}
          className="btn-primary w-full h-14 rounded-2xl text-sm font-black shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Activity className="w-5 h-5" />
          Plan Adventure Here
        </button>
      </div>
    </motion.div>
  )
}
