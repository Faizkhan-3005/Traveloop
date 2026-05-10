import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Plus, Trash2, CheckCircle2, 
  Circle, Tag, Filter, Search, Loader2 
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

const categories = ['Essentials', 'Clothing', 'Toiletries', 'Electronics', 'Documents', 'Other']

export default function PackingList({ tripId }) {
  const queryClient = useQueryClient()
  const [newItem, setNewItem] = useState('')
  const [category, setCategory] = useState('Essentials')

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['packing', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}`)
      return data.packingItems || []
    }
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post(`/trips/${tripId}/packing`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['packing', tripId])
      queryClient.invalidateQueries(['trip', tripId])
      queryClient.invalidateQueries(['trips-packing'])
      queryClient.invalidateQueries(['trips'])
      setNewItem('')
      toast.success('Item added')
    }
  })

  const toggleMutation = useMutation({
    mutationFn: (itemId) => api.patch(`/trips/${tripId}/packing/${itemId}/toggle`),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(['packing', tripId])
      const previous = queryClient.getQueryData(['packing', tripId])
      queryClient.setQueryData(['packing', tripId], (old) => 
        (old || []).map(item => item.id === itemId ? { ...item, packed: !item.packed } : item)
      )
      return { previous }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['packing', tripId], context.previous)
      toast.error('Failed to update')
    },
    onSettled: () => {
      queryClient.invalidateQueries(['packing', tripId])
      queryClient.invalidateQueries(['trip', tripId])
      queryClient.invalidateQueries(['trips-packing'])
      queryClient.invalidateQueries(['trips'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/trips/${tripId}/packing/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['packing', tripId])
      queryClient.invalidateQueries(['trip', tripId])
      queryClient.invalidateQueries(['trips-packing'])
      queryClient.invalidateQueries(['trips'])
    }
  })

  const packedCount = items.filter(i => i.packed).length
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-500" /></div>

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-none shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none">Packing Progress</h3>
              <p className="text-xs text-white/70 mt-1">{packedCount} of {items.length} items packed</p>
            </div>
          </div>
          <span className="text-3xl font-black">{progress}%</span>
        </div>
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-white h-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>
      </div>

      <div className="card p-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); if (newItem) addMutation.mutate({ label: newItem, category }) }}
          className="flex flex-wrap gap-3"
        >
          <div className="flex-1 min-w-[200px] relative">
            <input 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="What do you need to pack?"
              className="input pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg border-none focus:ring-0"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={addMutation.isPending} className="btn-primary">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          if (catItems.length === 0) return null

          return (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Tag className="w-3 h-3" /> {cat}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence>
                  {catItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all group ${
                        item.packed 
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-100 dark:border-emerald-900/30' 
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <button onClick={() => toggleMutation.mutate(item.id)} className="flex items-center gap-3 flex-1 text-left">
                        {item.packed ? (
                          <div className="text-emerald-500"><CheckCircle2 className="w-5 h-5 fill-emerald-500/10" /></div>
                        ) : (
                          <div className="text-slate-300"><Circle className="w-5 h-5" /></div>
                        )}
                        <span className={`text-sm font-medium transition-all ${item.packed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                          {item.label}
                        </span>
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-500">List is empty</p>
          </div>
        )}
      </div>
    </div>
  )
}
