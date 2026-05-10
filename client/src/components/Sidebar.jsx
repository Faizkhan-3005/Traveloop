import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Map, PlusCircle, Users, BarChart3,
  Settings, LogOut, Plane, ChevronLeft, ChevronRight,
  Package, StickyNote, Wallet, Globe
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/app/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/app/trips',      label: 'My Trips',     icon: Map },
  { to: '/app/trips/new',  label: 'New Trip',     icon: PlusCircle },
  { to: '/app/community',  label: 'Community',    icon: Globe },
  { to: '/app/packing',    label: 'Packing',      icon: Package },
  { to: '/app/notes',      label: 'Notes',        icon: StickyNote },
  { to: '/app/budget',     label: 'Budget',       icon: Wallet },
]

const adminItems = [
  { to: '/app/admin',      label: 'Analytics',    icon: BarChart3 },
  { to: '/app/admin/users',label: 'Users',        icon: Users },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
          <Plane className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap"
            >
              Traveloop
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              {!collapsed && (
                <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Admin
                </p>
              )}
            </div>
            {adminItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'nav-item-active' : 'nav-item'
                }
                title={collapsed ? label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-3 space-y-1">
        <NavLink to="/app/profile" className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'} title={collapsed ? 'Profile' : undefined}>
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
            : <Settings className="w-5 h-5 flex-shrink-0" />
          }
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap truncate">
                {user?.name || 'Profile'}
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button onClick={handleLogout} className="nav-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title={collapsed ? 'Logout' : undefined}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition z-10"
        aria-label="Toggle sidebar"
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          : <ChevronLeft  className="w-3.5 h-3.5 text-slate-500" />
        }
      </button>
    </motion.aside>
  )
}
