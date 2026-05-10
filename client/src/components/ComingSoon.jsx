import { Construction } from 'lucide-react'

export default function ComingSoon({ title = 'Coming in Phase 2' }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Construction className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        This feature is being built. Check back after Phase 2 implementation.
      </p>
    </div>
  )
}
