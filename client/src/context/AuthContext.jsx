import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'traveloop_token'
const USER_KEY  = 'traveloop_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  // ─── Persist helpers ──────────────────────────────────────────────────────
  const persist = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // ─── Listen for global 401 dispatched from api.js ─────────────────────────
  useEffect(() => {
    const handler = () => clear()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [clear])

  // ─── Hydrate from /me on mount (to catch expired/updated tokens) ──────────
  useEffect(() => {
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => clear())
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Auth actions ─────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.token, data.user)
    return data.user
  }

  const register = async (fields) => {
    const { data } = await api.post('/auth/register', fields)
    persist(data.token, data.user)
    return data.user
  }

  const logout = useCallback(() => {
    clear()
  }, [clear])

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated }
    localStorage.setItem(USER_KEY, JSON.stringify(merged))
    setUser(merged)
  }, [user])

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
