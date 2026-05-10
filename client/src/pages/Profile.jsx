import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, MapPin, Camera, 
  Lock, LogOut, ChevronRight,
  Shield, CheckCircle2, Loader2, Save,
  Sparkles, Languages, Wallet
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { CURRENCIES } from '../utils/currency'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    bannerUrl: user?.bannerUrl || '',
    currency: user?.currency || 'USD',
    language: user?.language || 'en',
    gender: user?.gender || 'PREFER_NOT_TO_SAY'
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        currency: user.currency || 'USD',
        language: user.language || 'en',
        gender: user.gender || 'PREFER_NOT_TO_SAY'
      })
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: (updatedData) => api.put('/auth/profile', updatedData),
    onSuccess: (res) => {
      updateUser(res.data.user)
      queryClient.invalidateQueries(['user'])
      queryClient.invalidateQueries(['auth'])
      toast.success(t('common.success'))
      setEditing(false)
      if (res.data.user.language !== i18n.language) {
        i18n.changeLanguage(res.data.user.language)
      }
    },
    onError: () => toast.error(t('profile.error_update'))
  })

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate(form)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Banner & Avatar Section */}
      <div className="relative group">
        <div className="h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <img 
            src={form.bannerUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop'} 
            alt="Banner" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute -bottom-16 left-8 md:left-12 flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover ring-8 ring-white dark:ring-slate-900 shadow-2xl" />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-5xl font-black ring-8 ring-white dark:ring-slate-900 shadow-2xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            {editing && (
              <button className="absolute bottom-2 right-2 p-3 bg-brand-600 text-white rounded-2xl shadow-xl">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="mb-4 space-y-2">
            <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
              {user?.name}
              <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {user?.city || 'Globe'}, {user?.country || 'Earth'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-20">
        {/* Left Col: Settings & Prefs */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t('profile.bio')}
              </h3>
              {editing ? (
                <textarea 
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                  className="input min-h-[100px] text-sm"
                  placeholder="Tell the world your story..."
                />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  {form.bio || "No bio yet. Travel is about discovery—discover yourself here!"}
                </p>
              )}
            </div>

            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">{t('profile.preferences')}</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Wallet className="w-3 h-3" /> {t('common.currency')}
                  </label>
                  <select 
                    disabled={!editing}
                    value={form.currency}
                    onChange={(e) => setForm({...form, currency: e.target.value})}
                    className="input h-10 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 border-none"
                  >
                    {Object.keys(CURRENCIES).map(code => (
                      <option key={code} value={code}>{code} ({CURRENCIES[code].symbol})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Languages className="w-3 h-3" /> {t('common.language')}
                  </label>
                  <select 
                    disabled={!editing}
                    value={form.language}
                    onChange={(e) => setForm({...form, language: e.target.value})}
                    className="input h-10 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 border-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> {t('common.gender')}
                  </label>
                  <select 
                    disabled={!editing}
                    value={form.gender}
                    onChange={(e) => setForm({...form, gender: e.target.value})}
                    className="input h-10 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 border-none"
                  >
                    <option value="MALE">{t('common.male')}</option>
                    <option value="FEMALE">{t('common.female')}</option>
                    <option value="OTHER">{t('common.other')}</option>
                    <option value="PREFER_NOT_TO_SAY">{t('common.prefer_not_to_say')}</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{t('profile.personal_info')}</h3>
                <p className="text-sm text-slate-500 font-medium">Keep your identity up to date</p>
              </div>
              <button onClick={() => setEditing(!editing)} className={`btn-secondary btn-sm ${editing ? 'bg-red-50 text-red-600' : ''}`}>
                {editing ? t('common.cancel') : t('profile.update')}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-xs">Full Name</label>
                  <input disabled={!editing} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label-xs">Email</label>
                  <input disabled value={user?.email} className="input opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="label-xs">City</label>
                  <input disabled={!editing} value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="label-xs">Country</label>
                  <input disabled={!editing} value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input" />
                </div>
                {editing && (
                  <>
                    <div className="space-y-2">
                      <label className="label-xs">{t('profile.banner')} URL</label>
                      <input value={form.bannerUrl} onChange={(e) => setForm({...form, bannerUrl: e.target.value})} className="input" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <label className="label-xs">Avatar URL</label>
                      <input value={form.avatarUrl} onChange={(e) => setForm({...form, avatarUrl: e.target.value})} className="input" placeholder="https://..." />
                    </div>
                  </>
                )}
              </div>

              {editing && (
                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" disabled={updateMutation.isPending} className="btn-primary px-8 h-12">
                    {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {t('common.save')}
                  </button>
                </div>
              )}
            </form>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => navigate('/app/security')} className="card p-6 flex items-center justify-between group hover:border-brand-500/30 transition">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{t('common.security')}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Password & Sessions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={logout} className="card p-6 flex items-center justify-between group hover:border-red-500/30 transition">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{t('nav.logout')}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Clear local access</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
