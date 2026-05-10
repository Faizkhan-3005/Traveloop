import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Image as ImageIcon,
  Type,
  AlignLeft,
  ArrowLeft,
  Plane,
  Loader2
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function CreateTrip() {
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
    onSuccess: () => {
      queryClient.invalidateQueries(['trips'])
      toast.success('Trip created successfully! Bon voyage! ✈️')
      navigate('/app/dashboard')
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
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Plan New Adventure</h1>
          <p className="text-slate-500 dark:text-slate-400">Enter your trip details to get started.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6 space-y-6"
          >
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Type className="w-5 h-5 text-brand-500" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Trip Title*</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Summer in Tokyo"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Destination*</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="e.g. Tokyo, Japan"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date*</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">End Date*</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6 space-y-6"
          >
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Trip Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="budget"
                      type="number"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="5000"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="travelersCount"
                      type="number"
                      value={form.travelersCount}
                      onChange={handleChange}
                      min="1"
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="input pl-10"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Leave empty for a random travel image.</p>
              </div>

              <div>
                <label className="label">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell us more about your trip goals..."
                    rows="3"
                    className="input pl-10 pt-2.5 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost px-8"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary btn-lg px-12 relative overflow-hidden"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Planning...
              </>
            ) : (
              <>
                Create Trip
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}
