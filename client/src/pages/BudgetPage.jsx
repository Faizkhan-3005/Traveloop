import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Wallet, ChevronRight, Loader2, TrendingUp, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import { useState } from 'react'
import BudgetTracker from '../components/BudgetTracker'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import { useAuth } from '../context/AuthContext'

export default function BudgetPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedTripId, setSelectedTripId] = useState(null)

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips-budget-agg'],
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
      <div className="max-w-6xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedTripId(null)}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {t('trip_details.budget')} for {trip.title}
        </h1>
        <BudgetTracker tripId={selectedTripId} totalBudget={trip.budget} />
      </div>
    )
  }

  const totalGlobalBudget = trips?.reduce((acc, t) => acc + (t.budget || 0), 0) || 0
  const totalGlobalSpent = trips?.reduce((acc, t) => {
    return acc + (t.budgetItems?.reduce((a, b) => a + b.amount, 0) || 0)
  }, 0) || 0

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('budget.title')}</h1>
          <p className="text-slate-500 font-medium">{t('budget.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-6 p-6 bg-brand-600 rounded-[2rem] text-white shadow-2xl shadow-brand-600/30">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('budget.total_planned')}</p>
            <p className="text-2xl font-black">{formatCurrency(totalGlobalBudget, user?.currency || 'USD')}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/20" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('budget.actual_spent')}</p>
            <p className="text-2xl font-black">{formatCurrency(totalGlobalSpent, user?.currency || 'USD')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips?.map((trip) => {
          const spent = trip.budgetItems?.reduce((a, b) => a + b.amount, 0) || 0
          const budget = trip.budget || 0
          const progress = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0

          return (
            <button
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className="card p-6 flex flex-col gap-4 group hover:border-brand-500/30 transition shadow-xl text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${progress > 90 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {progress}% {t('budget.used')}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white truncate">{trip.title}</h3>
                <p className="text-xs text-slate-400 font-medium">{trip.destination}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{formatCurrency(spent, user?.currency || 'USD')}</span>
                  <span className="text-slate-400">/ {formatCurrency(budget, user?.currency || 'USD')}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${progress > 90 ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                <TrendingUp className="w-3 h-3" />
                {t('budget.manage')}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
