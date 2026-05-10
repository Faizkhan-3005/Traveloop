import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

export default function DeleteTripModal({ isOpen, onClose, onConfirm, tripName, destination, isPending }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden"
        >
          <div className="p-8 md:p-10 text-center space-y-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Delete Journey?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base px-4">
                Are you sure you want to permanently delete <span className="text-slate-900 dark:text-white font-bold">"{tripName}"</span> to {destination}?
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Destructive Action Warning</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This will permanently remove the <span className="font-bold text-slate-700 dark:text-slate-200">itinerary, trip notes, packing lists, and budget entries</span>. This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={onClose}
                className="h-14 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Keep Journey
              </button>
              <button 
                onClick={onConfirm}
                disabled={isPending}
                className="h-14 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isPending ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
