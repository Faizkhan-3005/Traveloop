import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, Heart, MessageSquare, Share2, 
  MapPin, Clock, Search, Filter, 
  Loader2, Sparkles, TrendingUp, Users,
  Plane, Bookmark
} from 'lucide-react'
import api from '../services/api'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useDebounce from '../hooks/useDebounce'
import { destinations } from '../data/destinations'
import DestinationPanel from '../components/DestinationPanel'
import { Plus } from 'lucide-react'

const Highlight = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) 
          ? <mark key={i} className="bg-brand-100 text-brand-900 rounded-sm px-0.5">{part}</mark> 
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export default function Community() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [category, setCategory] = useState('All')
  const [selectedDest, setSelectedDest] = useState(null)

  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts', debouncedSearch],
    queryFn: async () => {
      const { data } = await api.get(`/public/trips/feed${debouncedSearch ? `?q=${debouncedSearch}` : ''}`)
      return data
    }
  })

  const filteredPosts = posts || []

  const filteredDestinations = useMemo(() => {
    if (!debouncedSearch) return destinations
    return destinations.filter(d => 
      d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(debouncedSearch.toLowerCase()))
    )
  }, [debouncedSearch])

  const handleCopy = async (tripId) => {
    try {
      await api.post(`/trips/${tripId}/copy`)
      toast.success('Trip copied to your adventures! ✈️')
    } catch (err) {
      toast.error('Failed to copy trip.')
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Exploring the world...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-widest text-[10px]">
            <Globe className="w-4 h-4" />
            Global Explorers Network
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Discover Your Next Journey</h1>
          <p className="text-slate-500 font-medium max-w-xl text-lg">Browse curated itineraries from travelers worldwide and start your own story.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations, travelers, or vibes..."
              className="input pl-11 h-12 bg-white dark:bg-slate-900 shadow-sm border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
          </div>
          {!search && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trending:</span>
              {['Tokyo', 'Surfing', 'Budget', 'Luxury'].map(s => (
                <button key={s} onClick={() => setSearch(s)} className="text-[10px] font-bold text-brand-600 hover:underline">
                  #{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Destinations & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={`space-y-6 transition-all duration-500 ${selectedDest ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-brand-500" />
              {debouncedSearch ? 'Matching Destinations' : 'Trending Now'}
            </h2>
          </div>
          <div className={`grid gap-6 ${selectedDest ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
            <AnimatePresence>
              {filteredDestinations.map((city, i) => (
                <motion.button 
                  key={city.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedDest(selectedDest?.id === city.id ? null : city)}
                  className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg transition-all group border-2 ${
                    selectedDest?.id === city.id ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-2xl' : 'border-transparent shadow-slate-200/50'
                  }`}
                >
                  <img src={city.img} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 text-left">
                    <p className="text-white font-black text-xl leading-tight drop-shadow-xl">{city.name}</p>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{city.country}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Panel Column */}
        <AnimatePresence>
          {selectedDest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 h-[600px] lg:sticky lg:top-24"
            >
              <DestinationPanel dest={selectedDest} onClose={() => setSelectedDest(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feed Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-500" />
            Explorer Feed
          </h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {['All', 'Recent', 'Popular'].map(c => (
              <button 
                key={c}
                onClick={() => setCategory(c)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  category === c 
                    ? 'bg-white dark:bg-slate-700 shadow-md text-brand-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredPosts?.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800"
              >
                {/* Card Image */}
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={post.trip?.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'} 
                    alt={post.trip?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {post.trip?.destination.split(',').pop()}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleCopy(post.tripId)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                    title="Copy to My Trips"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {post.author?.avatarUrl ? (
                      <img src={post.author.avatarUrl} alt="" className="w-8 h-8 rounded-full border-2 border-brand-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-black">
                        {post.author?.name?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">By {post.author?.name}</p>
                      <h3 className="font-bold text-slate-800 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                        <Highlight text={post.trip?.title} highlight={debouncedSearch} />
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {post.caption || `Exploring ${post.trip?.destination} with Traveloop's AI assistant.`}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{post.likesCount}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-brand-500 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{post.savesCount}</span>
                      </button>
                    </div>
                    <Link 
                      to={`/app/trips/${post.tripId}`}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline"
                    >
                      View Trip
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts?.length === 0 && (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800">
              <MapPin className="w-10 h-10 text-slate-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">No adventurers found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Be the first to share your journey and inspire the world!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
