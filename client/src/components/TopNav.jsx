import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function TopNav() {
  const { user } = useAuth()
  const [dark, setDark] = useState(() => localStorage.getItem('traveloop_theme') === 'dark')

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

  return (
    <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Search bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search trips, cities, activities…"
          className="input pl-9 py-2 text-sm"
          readOnly
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-ghost p-2 rounded-xl"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications placeholder */}
        <button className="btn-ghost p-2 rounded-xl relative" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-200" />
            : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-brand-200">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )
          }
          <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  )
}
