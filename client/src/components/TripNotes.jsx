import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  StickyNote, Plus, Trash2, Save, 
  Clock, Search, FileText, Loader2,
  MoreVertical, Edit3, Trash, ChevronRight
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import debounce from 'lodash/debounce'

export default function TripNotes({ tripId }) {
  const queryClient = useQueryClient()
  const [activeNote, setActiveNote] = useState(null)
  const [search, setSearch] = useState('')

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip-notes', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}`)
      return data
    }
  })

  const notes = trip?.notes || []

  const addMutation = useMutation({
    mutationFn: (content) => api.post(`/trips/${tripId}/notes`, { content }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['trip-notes', tripId])
      setActiveNote(res.data)
      toast.success('Note created')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, content }) => api.put(`/trips/${tripId}/notes/${id}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['trip-notes', tripId])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/trips/${tripId}/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['trip-notes', tripId])
      setActiveNote(null)
      toast.success('Note deleted')
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((id, content) => {
      updateMutation.mutate({ id, content })
    }, 1000),
    []
  )

  const handleContentChange = (e) => {
    const content = e.target.value
    setActiveNote({ ...activeNote, content })
    debouncedSave(activeNote.id, content)
  }

  const filteredNotes = notes.filter(n => 
    n.content?.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] max-h-[700px]">
      {/* Sidebar: Notes List */}
      <div className="lg:col-span-4 card flex flex-col overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
              Trip Notes
            </h3>
            <button 
              onClick={() => addMutation.mutate('New brilliant idea...')}
              disabled={addMutation.isPending}
              className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="input pl-9 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden ${
                activeNote?.id === note.id 
                  ? 'bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500/20' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className={`text-sm font-bold truncate pr-6 ${activeNote?.id === note.id ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {note.content?.split('\n')[0] || 'Untitled Note'}
                </p>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeNote?.id === note.id ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                {note.content?.split('\n').slice(1).join(' ') || 'No additional text'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-xs font-medium text-slate-400">No notes found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-8 card flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl relative">
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Editing Note</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Auto-saving enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {updateMutation.isPending && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-[10px] font-bold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving
                    </div>
                  )}
                  <button 
                    onClick={() => { if(confirm('Permanently delete this note?')) deleteMutation.mutate(activeNote.id) }}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Note Content Area */}
              <div className="flex-1 flex flex-col p-8 space-y-4 overflow-y-auto">
                <textarea
                  value={activeNote.content}
                  onChange={handleContentChange}
                  placeholder="Capture your thoughts, travel plans, or secret spots..."
                  className="w-full flex-1 bg-transparent border-none focus:ring-0 p-0 text-slate-700 dark:text-slate-200 leading-relaxed font-medium text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none"
                />
              </div>

              {/* Formatting Hint */}
              <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Every word is automatically saved to your cloud journey.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 rounded-[2.5rem] flex items-center justify-center border border-brand-500/10"
              >
                <StickyNote className="w-10 h-10 text-brand-300" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your thoughts await</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Notes are the perfect place for packing lists, flight numbers, or local phrases.
                </p>
              </div>
              <button 
                onClick={() => addMutation.mutate('New brilliant idea...')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Create First Note
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
