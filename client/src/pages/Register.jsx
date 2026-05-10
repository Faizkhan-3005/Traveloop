import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, MapPin, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', city: '', country: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { id: 'name',     label: 'Full Name',       type: 'text',     icon: User,    placeholder: 'Jane Doe',            required: true },
    { id: 'email',    label: 'Email',           type: 'email',    icon: Mail,    placeholder: 'jane@example.com',    required: true },
    { id: 'city',     label: 'City (optional)', type: 'text',     icon: MapPin,  placeholder: 'London',              required: false },
    { id: 'country',  label: 'Country (optional)', type: 'text', icon: MapPin,  placeholder: 'UK',                  required: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start planning your perfect trips</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ id, label, type, icon: Icon, placeholder, required }) => (
          <div key={id}>
            <label htmlFor={id} className="label">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id={id}
                name={id}
                type={type}
                required={required}
                value={form[id]}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete={id}
                className="input pl-10"
              />
            </div>
          </div>
        ))}

        {/* Password */}
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className="input pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-lg w-full justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
