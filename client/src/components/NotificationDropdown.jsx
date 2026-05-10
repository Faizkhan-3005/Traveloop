import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Plane, Heart, MessageSquare, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function NotificationDropdown({ isOpen, onClose }) {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications')
      return data
    },
    enabled: isOpen,
    refetchInterval: 30000 // Poll every 30s
  })

  const readMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  const readAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-3 w-85 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          Notifications
          {unreadCount > 0 && <span className="bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => readAllMutation.mutate()} 
            className="text-[10px] font-black text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-widest"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-none flex gap-3 group transition-colors ${n.read ? 'opacity-60' : 'bg-brand-50/20 dark:bg-brand-900/10'}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                n.type === 'packing' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                n.type === 'community' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' :
                n.type === 'trip' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
              }`}>
                {n.type === 'packing' && <Package className="w-5 h-5" />}
                {n.type === 'community' && <Heart className="w-5 h-5" />}
                {n.type === 'trip' && <Plane className="w-5 h-5" />}
                {n.type === 'info' && <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{n.title}</p>
                  <button onClick={() => deleteMutation.mutate(n.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  {n.message}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                  {!n.read && (
                    <button 
                      onClick={() => readMutation.mutate(n.id)}
                      className="text-[9px] font-black text-brand-600 uppercase hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800">
              <Bell className="w-8 h-8 text-slate-200" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No new notifications for you.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
        <button className="text-[10px] font-black text-slate-500 hover:text-brand-600 transition uppercase tracking-widest">
          View all notifications
        </button>
      </div>
    </motion.div>
  )
}
