import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import AppLayout  from './layouts/AppLayout'

// Auth pages
import Login    from './pages/Login'
import Register from './pages/Register'

// App pages
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import EditTrip from './pages/EditTrip'
import Profile from './pages/Profile'
import Community from './pages/Community'
import MyTrips from './pages/MyTrips'
import SecuritySettings from './pages/SecuritySettings'
import PackingPage from './pages/PackingPage'
import BudgetPage from './pages/BudgetPage'
import AIPlanner from './pages/AIPlanner'
import Notes from './pages/Notes'
import ComingSoon from './components/ComingSoon'
import ErrorBoundary from './components/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-slate-800 dark:text-white dark:border-slate-700',
                duration: 4000,
              }}
            />
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

              {/* ── Auth routes ──────────────────────────────────────────────── */}
              <Route element={<AuthLayout />}>
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* ── Protected app routes ──────────────────────────────────────── */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"  element={<Dashboard />} />
                <Route path="ai-planner" element={<AIPlanner />} />
                <Route path="trips"      element={<MyTrips />} />
                <Route path="trips/new"  element={<CreateTrip />} />
                <Route path="trips/:id"  element={<TripDetails />} />
                <Route path="trips/:id/edit" element={<EditTrip />} />
                <Route path="community"  element={<Community />} />
                <Route path="packing"    element={<PackingPage />} />
                <Route path="notes"      element={<Notes />} />
                <Route path="budget"     element={<BudgetPage />} />
                <Route path="profile"    element={<Profile />} />
                <Route path="security"   element={<SecuritySettings />} />

                {/* Admin routes */}
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <ComingSoon title="Admin Analytics – Coming in Phase 4" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <ComingSoon title="User Management – Coming in Phase 4" />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  )
}
