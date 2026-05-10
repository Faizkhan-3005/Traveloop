import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Plane, MapPin, 
  Calendar, DollarSign, Loader2, 
  BrainCircuit, Lightbulb,
  CloudSun, Utensils, Info, Save, RotateCcw, Package
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AIPlanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState('input') // 'input', 'generating', 'result'
  const [form, setForm] = useState({
    destination: '',
    budget: '',
    travelers: 1,
    style: 'Relaxing',
    duration: 3,
    interests: '',
    transport: 'Flight',
    mode: 'Mid-range'
  })
  const [result, setResult] = useState(null)

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Defensive check before sending
      if (!data.destination?.trim()) {
        throw new Error('NO_DESTINATION')
      }
      const response = await api.post('/ai/plan', data)
      return response.data
    },
    onSuccess: (data) => {
      setResult(data)
      setStep('result')
      toast.success(t('common.success'))
    },
    onError: (err) => {
      console.error('[AI PLANNER ERROR]', err)
      if (err.message === 'NO_DESTINATION') {
        toast.error(t('ai.error_no_destination'))
      } else if (err.response?.status === 429) {
        toast.error(t('ai.error_limit'))
      } else {
        const msg = err.response?.data?.message || t('ai.error_planner')
        toast.error(msg)
      }
      setStep('input')
    }
  })

  const saveMutation = useMutation({
    mutationFn: (plan) => api.post('/trips', {
      title: plan.title,
      destination: form.destination,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + form.duration * 86400000).toISOString(),
      budget: parseFloat(form.budget) || 0,
      travelersCount: form.travelers,
      description: plan.description
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['trips'])
      toast.success(t('common.success'))
      navigate(`/app/trips/${res.data.id}`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t('common.error'))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.destination.trim()) {
      toast.error(t('ai.error_no_destination'))
      return
    }
    setStep('generating')
    mutation.mutate(form)
  }

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-brand-500/50"
        >
          <Sparkles className="text-white w-10 h-10" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t('ai.generating')}</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">{t('ai.analyzing')}</p>
        </div>
        
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="w-2 h-2 rounded-full bg-brand-500"
            />
          ))}
        </div>
      </div>
    )
  }

  if (step === 'result' && result) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto space-y-10 pb-20"
      >
        {/* Result Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-widest text-[10px]">
              <BrainCircuit className="w-4 h-4" />
              {t('ai.insights_title')}
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{result.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">{result.description}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => setStep('input')}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              {t('ai.start_over')}
            </button>
            <button 
              onClick={() => saveMutation.mutate(result)}
              disabled={saveMutation.isPending}
              className="btn-primary shadow-xl shadow-brand-500/30"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('ai.save_to_trips')}
            </button>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-brand-50/50 dark:bg-brand-900/20 border-brand-100 dark:border-brand-900/30">
            <CloudSun className="w-6 h-6 text-brand-600 mb-4" />
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('ai.weather')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{result.weather}</p>
          </div>
          <div className="card p-6 bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30">
            <DollarSign className="w-6 h-6 text-emerald-600 mb-4" />
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('ai.cost')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{result.estimatedTotalCost}</p>
          </div>
          <div className="card p-6 bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30">
            <Utensils className="w-6 h-6 text-amber-600 mb-4" />
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('ai.food')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{result.localFood?.join(', ')}</p>
          </div>
        </div>

        {/* Itinerary */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-brand-500" />
            {t('ai.itinerary')}
          </h3>
          <div className="space-y-6">
            {result.itinerary?.map((day, idx) => (
              <motion.div 
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-8 border-l-4 border-l-brand-600"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {day.day}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white">Day {day.day}</h4>
                    <p className="text-sm text-slate-500 font-bold">{day.summary}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {day.activities?.map((act, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                      <div className="w-16 text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-1">{act.time}</div>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-600 transition-colors">{act.name}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{act.description}</p>
                        <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 bg-white dark:bg-slate-900 rounded-lg text-slate-400 ring-1 ring-slate-100 dark:ring-slate-800">{act.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-indigo-600 uppercase tracking-widest text-xs">
              <Package className="w-4 h-4" />
              {t('ai.packing')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.packingSuggestions?.map(item => (
                <span key={item} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">{item}</span>
              ))}
            </div>
          </div>
          <div className="card p-8 space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-brand-600 uppercase tracking-widest text-xs">
              <Lightbulb className="w-4 h-4" />
              {t('ai.tips')}
            </h4>
            <ul className="space-y-2">
              {result.travelTips?.map((tip, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-500/40"
        >
          <Sparkles className="text-white w-8 h-8" />
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('ai.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-xl mx-auto">{t('ai.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="card p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="label text-xs font-black uppercase tracking-widest text-slate-400">{t('ai.label_destination')}</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  value={form.destination}
                  onChange={(e) => setForm({...form, destination: e.target.value})}
                  placeholder={t('ai.placeholder_destination')}
                  className="input pl-11 h-14 font-bold text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label text-xs font-black uppercase tracking-widest text-slate-400">{t('ai.label_style')}</label>
              <div className="relative">
                <BrainCircuit className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select 
                  value={form.style}
                  onChange={(e) => setForm({...form, style: e.target.value})}
                  className="input pl-11 h-14 font-bold appearance-none"
                >
                  {['Relaxing', 'Adventurous', 'Cultural', 'Backpacking', 'Luxury', 'Family-friendly'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="label text-xs font-black uppercase tracking-widest text-slate-400">{t('ai.label_duration')}</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="number"
                  min="1"
                  max="14"
                  value={form.duration}
                  onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})}
                  className="input pl-11 h-14 font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label text-xs font-black uppercase tracking-widest text-slate-400">{t('ai.label_budget')}</label>
              <div className="grid grid-cols-3 gap-2">
                {['Budget', 'Mid-range', 'Luxury'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({...form, mode: m})}
                    className={`h-14 rounded-2xl font-bold text-xs transition-all ${
                      form.mode === m 
                        ? 'bg-brand-600 text-white shadow-lg' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="label text-xs font-black uppercase tracking-widest text-slate-400">{t('ai.label_interests')}</label>
              <input 
                value={form.interests}
                onChange={(e) => setForm({...form, interests: e.target.value})}
                placeholder={t('ai.placeholder_interests')}
                className="input h-14 font-bold"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              type="submit" 
              className="btn-primary btn-lg h-16 px-16 text-xl shadow-2xl shadow-brand-500/50 group"
              disabled={mutation.isPending}
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              {t('ai.generate')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-12 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">{t('ai.free_tier')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">{t('ai.powered_by')}</span>
          </div>
        </div>
      </form>
    </div>
  )
}
