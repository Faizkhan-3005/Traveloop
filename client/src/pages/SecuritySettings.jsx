import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, Shield, Key, Smartphone, 
  LogOut, Trash2, ChevronRight, 
  AlertTriangle, CheckCircle2, Loader2,
  Eye, EyeOff
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function SecuritySettings() {
  const { logout } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const passwordMutation = useMutation({
    mutationFn: (data) => api.put('/auth/password', data),
    onSuccess: () => {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  })

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? This will delete all your trips and data forever.')) {
      toast.error('Account deletion is restricted in demo mode.')
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    passwordMutation.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-brand-600 font-black uppercase tracking-widest text-[10px]">
          <Shield className="w-4 h-4" />
          Security Center
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Privacy & Security</h1>
        <p className="text-slate-500 font-medium">Manage your password, active sessions, and account protection.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Password Update */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Change Password</h3>
              <p className="text-sm text-slate-500 font-medium">Ensure your account is using a long, random password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="label-xs">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={(e) => setForm({...form, currentPassword: e.target.value})}
                    className="input pr-12" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="label-xs">New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={(e) => setForm({...form, newPassword: e.target.value})}
                  className="input" 
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-1.5">
                <label className="label-xs">Confirm New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  className="input" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={passwordMutation.isPending}
              className="btn-primary px-8 h-12"
            >
              {passwordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Update Password
            </button>
          </form>
        </motion.div>

        {/* Sessions & Devices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Active Sessions</h3>
              <p className="text-sm text-slate-500 font-medium">Logged in devices and browser sessions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-brand-100 dark:border-brand-900/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">Current Session</p>
                  <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest">Active Now</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400">Singapore • Mac OS</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <button className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
              <LogOut className="w-4 h-4" />
              Sign out from all other devices
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-8 border-red-100 dark:border-red-900/20 bg-red-50/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-red-600">Danger Zone</h3>
              <p className="text-sm text-slate-500 font-medium">Irreversible actions for your account</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">Delete Account</p>
              <p className="text-xs text-slate-500">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="btn-sm bg-red-600 text-white hover:bg-red-700 px-6"
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
