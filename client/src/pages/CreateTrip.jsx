import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Users, DollarSign, 
  Image as ImageIcon, Type, AlignLeft, 
  ArrowLeft, Plane, Loader2, Sparkles,
  ChevronRight, Plus
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function CreateTrip() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  
  const [form, setForm] = useState({
    title: '',
    destination: searchParams.get('dest') || '',
    startDate: '',
    endDate: '',
    budget: '',
    travelersCount: 1,
    coverImage: '',
    description: ''
  })

  const mutation = useMutation({
    mutationFn: (newTrip) => api.post('/trips', newTrip),
    onSuccess: (res) => {
      console.log("[CREATE TRIP SUCCESS]", res.data)
      queryClient.invalidateQueries(['trips'])
      toast.success('Trip created successfully! Bon voyage! ✈️')
      if (res.data && res.data.id) {
        navigate(`/app/trips/${res.data.id}`)
      } else {
        console.error("[CREATE TRIP ERROR] No ID in response", res.data)
        navigate('/app/dashboard')
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create trip. Try again.')
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: name === 'budget' || name === 'travelersCount' ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.destination || !form.startDate || !form.endDate) {
      toast.error('Please fill in all required fields.')
      return
    }
    mutation.mutate(form)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 group font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t('common.cancel')}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/40">
            <Plane className="w-8 h-8 text-white -rotate-12" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Plan New Adventure</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Enter your trip details to get started.</p>
          </div>
        </div>
        <Link to="/app/ai-planner" className="flex items-center gap-2 px-6 py-3 bg-brand-50 dark:bg-brand-900/30 rounded-2xl text-brand-600 font-black text-xs uppercase tracking-widest hover:bg-brand-100 transition shadow-sm border border-brand-100/50">
          <Sparkles className="w-4 h-4" />
          Use AI Planner
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 space-y-8">
            <h2 className="text-lg font-black flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-brand-50 dark:bg-brand-900/30 rounded-lg text-brand-600"><Type className="w-4 h-4" /></div>
              Basic Information
            </h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="label-xs">Trip Title*</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Summer in Tokyo" className="input pl-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-xs">Destination*</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Tokyo, Japan" className="input pl-11" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-xs">Start Date*</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input" required />
                </div>
                <div className="space-y-2">
                  <label className="label-xs">End Date*</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input" required />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 space-y-8">
            <h2 className="text-lg font-black flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></div>
              Trip Details
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-xs">Budget ($)</label>
                  <input name="budget" type="number" min="0" value={form.budget} onChange={handleChange} placeholder="5000" className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label-xs">Travelers</label>
                  <input name="travelersCount" type="number" min="1" max="20" value={form.travelersCount} onChange={handleChange} className="input" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-xs">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="input pl-11" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-xs">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell us more about your trip goals..." rows="3" className="input pt-3 resize-none" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end gap-4 pt-8">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-8">{t('common.cancel')}</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary btn-lg px-12 shadow-xl shadow-brand-500/20">
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {mutation.isPending ? 'Planning...' : 'Create Adventure'}
          </button>
        </motion.div>
      </form>
    </div>
  )
}


