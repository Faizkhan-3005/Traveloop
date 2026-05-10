import { Outlet } from 'react-router-dom'
import { Plane } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-slate-900 to-slate-800 flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Traveloop</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Plan smarter.<br />Travel better.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
            Build multi-city itineraries, track budgets, manage packing lists, and share your adventures — all in one place.
          </p>

          <div className="flex flex-wrap gap-3">
            {['🗺️ Itinerary Builder', '💰 Budget Tracker', '🧳 Packing Lists', '🌍 Community Feed'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-sm bg-white/10 backdrop-blur-sm border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-400 text-sm">© 2025 Traveloop. All rights reserved.</p>
      </div>

      {/* Right panel – auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Traveloop</span>
          </div>

          <div className="card p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
