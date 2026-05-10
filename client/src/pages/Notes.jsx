import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, StickyNote, Trash2, 
  Pin, Star, Loader2, 
  MapPin, Tag,
  Clock, Save, FileText,
  PlusCircle
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import debounce from 'lodash/debounce'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

export default function Notes() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [activeNote, setActiveNote] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, pinned, favorites, trip-linked

  // Fetch all notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data } = await api.get('/notes')
      return data
    }
  })

  // Create Note
  const createMutation = useMutation({
    mutationFn: (newNote) => api.post('/notes', newNote),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['notes'])
      setActiveNote(res.data)
      toast.success(t('common.success'))
    }
  })

  // Update Note
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/notes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes'])
    }
  })

  // Delete Note
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes'])
      setActiveNote(null)
      toast.success(t('common.success'))
    }
  })

  // Debounced save for content changes
  const debouncedSave = useCallback(
    debounce((id, data) => {
      updateMutation.mutate({ id, ...data })
    }, 1000),
    [updateMutation]
  )

  const handleContentChange = (e) => {
    if (!activeNote) return
    const content = e.target.value
    const updated = { ...activeNote, content }
    setActiveNote(updated)
    debouncedSave(activeNote.id, updated)
  }

  const handleTitleChange = (e) => {
    if (!activeNote) return
    const title = e.target.value
    const updated = { ...activeNote, title }
    setActiveNote(updated)
    debouncedSave(activeNote.id, updated)
  }

  const togglePin = (note) => {
    updateMutation.mutate({ id: note.id, pinned: !note.pinned })
  }

  const toggleFavorite = (note) => {
    updateMutation.mutate({ id: note.id, favorite: !note.favorite })
  }

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase().trim()
    const terms = q.split(/\s+/).filter(Boolean)
    
    let result = notes.filter(n => {
      if (terms.length === 0) return true
      const title = (n.title || '').toLowerCase()
      const content = (n.content || '').toLowerCase()
      const tags = (n.tags || []).map(tag => tag.toLowerCase())
      return terms.every(term => 
        title.includes(term) || 
        content.includes(term) || 
        tags.some(tag => tag.includes(term))
      )
    })

    if (filter === 'pinned') result = result.filter(n => n.pinned)
    if (filter === 'favorites') result = result.filter(n => n.favorite)
    if (filter === 'trip-linked') result = result.filter(n => n.tripId)

    return result
  }, [notes, search, filter])

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('common.loading')}</p>
    </div>
  )

  return (
    <div className="h-[calc(100vh-120px)] flex gap-8">
      {/* LEFT: Notes List Sidebar */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('notes.title')}</h1>
            <button 
              onClick={() => createMutation.mutate({ title: 'New Note', content: '' })}
              className="p-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-500 transition shadow-lg shadow-brand-600/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('notes.search')}
              className="input pl-11 h-12 bg-white/50 dark:bg-slate-900/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'all', label: t('notes.all'), icon: FileText },
              { id: 'pinned', label: t('notes.pinned'), icon: Pin },
              { id: 'favorites', label: t('notes.starred'), icon: Star },
              { id: 'trip-linked', label: t('notes.trips'), icon: MapPin },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  filter === f.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                }`}
              >
                <f.icon className="w-3 h-3" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map(note => (
              <motion.button
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`w-full text-left p-5 rounded-[1.75rem] transition-all group relative overflow-hidden border-2 ${
                  activeNote?.id === note.id 
                    ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-xl shadow-brand-500/10' 
                    : 'bg-white/40 dark:bg-slate-900/40 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                {note.pinned && <Pin className="absolute top-4 right-4 w-3 h-3 text-brand-500" fill="currentColor" />}
                
                <div className="space-y-2">
                  <h3 className={`font-black text-sm transition-colors ${activeNote?.id === note.id ? 'text-brand-600' : 'text-slate-800 dark:text-white'}`}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content || 'No additional text'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {format(new Date(note.updatedAt), 'MMM d')}
                    </span>
                    {note.trip && (
                      <span className="text-[9px] font-black text-brand-500 uppercase tracking-tighter flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {note.trip.destination}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {filteredNotes.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-slate-200">
                <StickyNote className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('notes.empty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Note Editor */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="flex-1 flex flex-col card overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border-none"
            >
              {/* Editor Header */}
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${activeNote.pinned ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} transition-all cursor-pointer hover:scale-110`} onClick={() => togglePin(activeNote)}>
                    <Pin className="w-4 h-4" />
                  </div>
                  <div className={`p-2 rounded-xl ${activeNote.favorite ? 'bg-amber-400 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} transition-all cursor-pointer hover:scale-110`} onClick={() => toggleFavorite(activeNote)}>
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
                  <div className="flex items-center gap-2">
                    {updateMutation.isPending ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <Save className="w-3 h-3" />
                        {t('notes.saving')}
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {t('notes.synced')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { if(confirm(t('notes.delete_confirm'))) deleteMutation.mutate(activeNote.id) }}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 flex flex-col p-12 md:p-16 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto no-scrollbar">
                <input 
                  value={activeNote.title}
                  onChange={handleTitleChange}
                  placeholder={t('notes.placeholder_title')}
                  className="text-5xl font-black text-slate-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-200 dark:placeholder:text-slate-800 tracking-tighter"
                />

                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(activeNote.createdAt), 'MMMM do, yyyy')}
                  </div>
                  {activeNote.trip && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {t('notes.linked')} {activeNote.trip.title}
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] font-bold text-slate-500">
                    <Tag className="w-3.5 h-3.5" />
                    {activeNote.tags?.length || 0} {t('notes.tags')}
                  </div>
                </div>

                <textarea 
                  value={activeNote.content}
                  onChange={handleContentChange}
                  placeholder={t('notes.placeholder_content')}
                  className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium placeholder:text-slate-100 dark:placeholder:text-slate-800 resize-none min-h-[400px]"
                />
              </div>

              {/* Editor Footer */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <p>{t('notes.created')}</p>
                <div className="flex gap-4">
                  <span>Markdown Enabled</span>
                  <span>Auto-save active</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-8">
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-32 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 rounded-[3rem] flex items-center justify-center border border-brand-500/10 relative shadow-inner"
              >
                <div className="absolute inset-0 bg-brand-500/5 blur-3xl rounded-full" />
                <StickyNote className="w-16 h-16 text-brand-300 relative z-10" />
              </motion.div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('notes.hero_title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                  {t('notes.hero_subtitle')}
                </p>
              </div>
              <button 
                onClick={() => createMutation.mutate({ title: 'New Note', content: '' })}
                className="btn-primary btn-lg h-16 px-12 rounded-[2rem] shadow-2xl shadow-brand-500/20 group"
              >
                <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                {t('notes.create_first')}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
