import { Bell, Moon, Sun, Search, Loader2, MapPin, Activity, Plane, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useDebounce from '../hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import NotificationDropdown from './NotificationDropdown'

export default function TopNav() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('traveloop_theme') === 'dark')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [showResults, setShowResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef(null)
  const notificationRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('traveloop_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('traveloop_theme', 'light')
    }
  }, [dark])

  const { data: searchData, isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null
      const [tripsRes, publicRes] = await Promise.all([
        api.get('/trips'),
        api.get(`/public/activities/search?q=${debouncedQuery}`)
      ])
      
      const filteredTrips = tripsRes.data.filter(t => 
        t.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).map(t => ({ ...t, type: 'trip' }))

      const activities = publicRes.data.map(a => ({ ...a, type: 'activity' }))

      return [...filteredTrips, ...activities].slice(0, 10)
    },
    enabled: debouncedQuery.length > 0
  })

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowResults(false)
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Search bar */}
      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative group">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${query ? 'text-brand-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder={t('common.search')}
            className="input pl-9 py-2 text-sm bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 border-slate-200/60"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true) }}
            onFocus={() => setShowResults(true)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition">
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showResults && query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 card shadow-2xl border-slate-200 dark:border-slate-700 max-h-[450px] overflow-y-auto z-50 p-2"
            >
              {isLoading ? (
                <div className="p-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('common.searching')}</p>
                </div>
              ) : searchData?.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('common.no_results')} "{query}"</p>
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {searchData?.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.type === 'trip') navigate(`/app/trips/${item.id}`)
                        else navigate(`/app/trips/new?dest=${item.city?.name || item.name}`)
                        setShowResults(false)
                        setQuery('')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition ${
                        item.type === 'trip' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                      }`}>
                        {item.type === 'trip' ? <Plane className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{item.title || item.name}</p>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {item.destination || item.city?.name || t('common.explorer')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t('common.recent_searches')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Paris', 'Tokyo', 'London'].map(s => (
                    <button key={s} onClick={() => setQuery(s)} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
          {['en', 'hi', 'ar'].map(lng => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                i18n.language === lng ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-400'
              }`}
            >
              {lng}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDark((d) => !d)}
          className="btn-ghost p-2 rounded-xl transition-transform hover:rotate-12"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`btn-ghost p-2 rounded-xl transition-all ${showNotifications ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' : ''}`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900" />
          </button>
          <AnimatePresence>
            {showNotifications && (
              <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>
        </div>

        <Link 
          to="/app/profile"
          className="flex items-center gap-2 ml-1 p-1 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
        >
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-500/50 transition" />
            : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-brand-500/20">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )
          }
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-widest">{t('common.welcome')}</p>
            <p className="text-xs font-black text-slate-800 dark:text-white max-w-[80px] truncate leading-tight">
              {user?.name?.split(' ')[0]}
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}
