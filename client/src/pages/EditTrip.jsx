import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Users, DollarSign, 
  Image as ImageIcon, Type, AlignLeft, 
  ArrowLeft, Loader2, Save,
  Globe, Lock
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function EditTrip() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelersCount: 1,
    coverImage: '',
    description: '',
    isPublic: false
  })

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${id}`)
      return data
    }
  })

  useEffect(() => {
    if (trip) {
      setForm({
        title: trip.title,
        destination: trip.destination,
        startDate: new Date(trip.startDate).toISOString().split('T')[0],
        endDate: new Date(trip.endDate).toISOString().split('T')[0],
        budget: trip.budget || '',
        travelersCount: trip.travelersCount,
        coverImage: trip.coverImage || '',
        description: trip.description || '',
        isPublic: trip.isPublic || false
      })
    }
  }, [trip])

  const mutation = useMutation({
    mutationFn: (updatedTrip) => api.put(`/trips/${id}`, updatedTrip),
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
      queryClient.invalidateQueries(['trip', id])
      toast.success(t('common.success'))
      navigate(`/app/trips/${id}`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t('edit_trip.error_update'))
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : (name === 'budget' || name === 'travelersCount' ? Number(value) : value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t('common.loading')}</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group font-black text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t('common.cancel')}
      </button>

      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-2xl shadow-brand-600/20">
          <Save className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('edit_trip.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base">{t('edit_trip.subtitle')} {form.destination}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 space-y-8">
            <h2 className="text-lg font-black flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-brand-50 dark:bg-brand-900/30 rounded-lg text-brand-600"><Type className="w-4 h-4" /></div>
              {t('edit_trip.basic_info')}
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-70">{t('edit_trip.trip_title')}</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Summer in Tokyo" className="input pl-11 h-12" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.destination')}*</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Tokyo, Japan" className="input pl-11" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.start_date')}*</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input" required />
                </div>
                <div className="space-y-2">
                  <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.end_date')}*</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input" required />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 space-y-8">
            <h2 className="text-lg font-black flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></div>
              {t('edit_trip.trip_details')}
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.budget')} ($)</label>
                  <input name="budget" type="number" min="0" value={form.budget} onChange={handleChange} placeholder="5000" className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.travelers')}</label>
                  <input name="travelersCount" type="number" min="1" max="20" value={form.travelersCount} onChange={handleChange} className="input" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400">{t('edit_trip.cover_image')}</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="input pl-11" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className={`p-2 rounded-xl ${form.isPublic ? 'bg-brand-100 text-brand-600' : 'bg-slate-200 text-slate-500'}`}>
                  {form.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t('edit_trip.public')}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t('edit_trip.public_desc')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
           <label className="label-xs text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">{t('edit_trip.description')}</label>
           <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell us more about your trip goals..." rows="4" className="input pt-3 resize-none" />
        </motion.div>

        <div className="flex justify-end items-center gap-6 pt-12 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={() => navigate(-1)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">{t('common.cancel')}</button>
          <button type="submit" disabled={mutation.isPending} className="h-14 px-12 rounded-xl bg-brand-600 text-white font-black text-sm shadow-xl shadow-brand-600/20 hover:bg-brand-500 active:scale-95 transition-all flex items-center justify-center gap-3">
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {mutation.isPending ? t('edit_trip.saving') : t('edit_trip.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
