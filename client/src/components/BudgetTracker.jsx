import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, Plus, Trash2, DollarSign, 
  PieChart as PieChartIcon, TrendingUp,
  Tag, Loader2, ArrowUpRight, ArrowDownRight,
  PlusCircle, Sparkles, AlertCircle
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend
} from 'recharts'

const categories = [
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Accommodation', color: '#8b5cf6' },
  { name: 'Food', color: '#10b981' },
  { name: 'Activities', color: '#f59e0b' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Other', color: '#64748b' },
]

export default function BudgetTracker({ tripId, totalBudget = 0 }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name: '', amount: '', category: 'Food' })

  const { data: trip, isLoading, isRefetching } = useQuery({
    queryKey: ['trip-budget', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/trips/${tripId}`)
      return data
    }
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post(`/trips/${tripId}/budget`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['trip-budget', tripId])
      queryClient.invalidateQueries(['trip', tripId])
      setForm({ name: '', amount: '', category: 'Food' })
      toast.success('Expense logged successfully! 💸')
    },
    onError: () => toast.error('Failed to log expense.')
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/trips/${tripId}/budget/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['trip-budget', tripId])
      queryClient.invalidateQueries(['trip', tripId])
      toast.success('Expense removed')
    }
  })

  const expenses = useMemo(() => trip?.budgetItems || [], [trip])
  const totalSpent = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses])
  const remaining = totalBudget - totalSpent
  const percentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0

  const chartData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      value: expenses.filter(e => e.category === cat.name).reduce((acc, curr) => acc + curr.amount, 0),
      color: cat.color
    })).filter(d => d.value > 0)
  }, [expenses])

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calculating expenses...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 bg-brand-600 text-white border-none shadow-2xl shadow-brand-500/20">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><DollarSign className="w-6 h-6" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Budget</span>
          </div>
          <p className="text-4xl font-black tracking-tighter">${totalBudget.toLocaleString()}</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-white/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Defined in trip settings</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8 bg-slate-900 text-white border-none shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/10 rounded-2xl"><ArrowUpRight className="w-6 h-6 text-red-400" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Spent</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black tracking-tighter">${totalSpent.toLocaleString()}</p>
            {isRefetching && <Loader2 className="w-4 h-4 animate-spin text-brand-500" />}
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="opacity-40">Utilization</span>
              <span className={percentage > 90 ? 'text-red-400' : 'text-brand-400'}>{percentage}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${percentage > 90 ? 'bg-red-500' : 'bg-brand-500'}`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`card p-8 border-none shadow-xl ${remaining < 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-emerald-50 dark:bg-emerald-950/20'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${remaining < 0 ? 'bg-red-100 dark:bg-red-900/40 text-red-600' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'}`}>
              {remaining < 0 ? <AlertCircle className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>Remaining</span>
          </div>
          <p className={`text-4xl font-black tracking-tighter ${remaining < 0 ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
            ${remaining.toLocaleString()}
          </p>
          <p className="mt-6 text-xs font-bold text-slate-500">
            {remaining < 0 ? "You've exceeded your limit!" : "Safe to spend more"}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Analytics Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="card p-8 flex flex-col min-h-[450px]">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600"><PieChartIcon className="w-5 h-5" /></div>
              Expense Vibe
            </h3>
            <div className="flex-1 flex items-center justify-center">
              {chartData.length > 0 ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-slate-200">
                    <TrendingUp className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No data to visualize</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Add Form */}
          <div className="card p-6 bg-white dark:bg-slate-900 border-2 border-brand-100/50 dark:border-brand-900/30">
            <form 
              onSubmit={(e) => { 
                e.preventDefault()
                if (form.amount && form.name) addMutation.mutate({ 
                  name: form.name,
                  amount: Number(form.amount), 
                  category: form.category 
                }) 
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Expense title (e.g. Ramen)"
                    className="input pl-11 h-14 bg-slate-50/50 dark:bg-slate-800/50"
                    required
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    placeholder="Amount"
                    className="input pl-11 h-14 bg-slate-50/50 dark:bg-slate-800/50"
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-black uppercase tracking-widest px-6 h-14 rounded-2xl border-none focus:ring-2 ring-brand-500/20"
                  >
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={addMutation.isPending}
                className="btn-primary w-full h-14 rounded-2xl font-black text-sm shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
              >
                {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                {addMutation.isPending ? 'Logging...' : 'Log Expense'}
              </button>
            </form>
          </div>

          {/* Expense History */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 px-2">
              Recent Transactions
              <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
            </h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence mode="popLayout">
                {expenses.length > 0 ? (
                  expenses.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="card p-4 flex items-center justify-between group hover:border-brand-100 dark:hover:border-brand-900 transition-all bg-white dark:bg-slate-900/50 shadow-sm"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110">
                          <Tag className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-white group-hover:text-brand-600 transition-colors">
                            {item.name || 'Untitled Expense'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900 dark:text-white leading-none">${item.amount.toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
                    <Wallet className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">Your expense history is clean</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
