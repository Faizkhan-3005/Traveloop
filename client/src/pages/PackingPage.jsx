import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Plane, ChevronRight, Loader2, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import { useState } from 'react'
import PackingList from '../components/PackingList'
import { useTranslation } from 'react-i18next'

export default function PackingPage() {
  const { t } = useTranslation()
  const [selectedTripId, setSelectedTripId] = useState(null)

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips-packing'],
    queryFn: async () => {
      const { data } = await api.get('/trips')
      return data
    }
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      <p className="text-slate-500 font-medium">{t('common.loading')}</p>
    </div>
  )

  if (selectedTripId) {
    const trip = trips.find(t => t.id === selectedTripId)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedTripId(null)}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            Packing for {trip.title}
            <div className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-black uppercase tracking-widest">
              {trip.destination}
            </div>
          </h1>
        </div>
        <PackingList tripId={selectedTripId} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('packing.title')}</h1>
        <p className="text-slate-500 font-medium">{t('packing.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trips?.map((trip) => {
          const items = trip.packingItems || []
          const packed = items.filter(i => i.packed).length
          const total = items.length
          const progress = total > 0 ? Math.round((packed / total) * 100) : 0

          return (
            <button
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className="card p-6 flex items-center justify-between group hover:border-brand-500/30 transition shadow-xl text-left"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center shrink-0">
                  <Package className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate">{trip.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{progress}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {packed} of {total} {t('packing.progress')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform ml-4" />
            </button>
          )
        })}

        {trips?.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <Plane className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-400 font-medium">{t('packing.empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
