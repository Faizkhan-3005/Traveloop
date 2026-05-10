import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, Map, PlusCircle, Globe, 
  Package, StickyNote, Wallet, Settings, 
  ChevronLeft, ChevronRight, LogOut, Sparkles,
  BarChart3, Users, Plus
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const isRTL = i18n.language === 'ar'

  const navItems = [
    { to: '/app/dashboard',  label: t('nav.dashboard'),   icon: LayoutDashboard },
    { to: '/app/ai-planner', label: t('nav.ai_planner'),  icon: Sparkles, premium: true },
    { to: '/app/trips',      label: t('nav.my_trips'),     icon: Map },
    { to: '/app/trips/new',  label: t('nav.new_trip'),     icon: PlusCircle },
    { to: '/app/community',  label: t('nav.community'),    icon: Globe },
    { to: '/app/packing',    label: t('nav.packing'),      icon: Package },
    { to: '/app/notes',      label: t('nav.notes'),        icon: StickyNote },
    { to: '/app/budget',     label: t('nav.budget'),       icon: Wallet },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className={`h-screen bg-white dark:bg-slate-900 ${isRTL ? 'border-l' : 'border-r'} border-slate-100 dark:border-slate-800 flex flex-col sticky top-0 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-colors`}
    >
      {/* Brand Header */}
      <div className={`p-6 flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              className={`flex items-center gap-2 cursor-pointer ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
              onClick={() => navigate('/app/dashboard')}
            >
              <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/30">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Traveloop</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          {collapsed ? (isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />) : (isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}
              ${isActive 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 scale-[1.02]' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${item.premium ? 'text-amber-500' : ''}`} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  className="font-bold whitespace-nowrap overflow-hidden text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {item.premium && !collapsed && (
              <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-lg font-black uppercase tracking-tighter`}>New</span>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <p className={`text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 ${collapsed ? 'text-center' : (isRTL ? 'text-right' : 'text-left')}`}>
              {collapsed ? t('nav.administration').slice(0, 3).toUpperCase() : t('nav.administration')}
            </p>
            <NavLink to="/app/admin" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${isActive ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                    className="font-bold text-sm"
                  >
                    {t('nav.analytics')}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <NavLink 
          to="/app/profile"
          className={({ isActive }) => `
            flex items-center gap-3 p-3 rounded-2xl transition-all group ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}
            ${isActive ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
          `}
        >
          {user?.avatarUrl 
            ? <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            : <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold text-sm">{user?.name?.[0]}</div>
          }
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </motion.aside>
  )
}
