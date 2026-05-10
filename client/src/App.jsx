import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyTrip = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
}

const cardClass = 'rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200'

function App() {
  const [token, setToken] = useState(localStorage.getItem('traveloop_token') || '')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [dashboard, setDashboard] = useState(null)
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [tripForm, setTripForm] = useState(emptyTrip)
  const [message, setMessage] = useState('')

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    [token],
  )

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)

  const refreshData = async () => {
    if (!token) return
    const [dashboardRes, tripsRes] = await Promise.all([api.get('/dashboard'), api.get('/trips')])
    setDashboard(dashboardRes.data)
    setTrips(tripsRes.data)
    if (!selectedTripId && tripsRes.data[0]) {
      setSelectedTripId(tripsRes.data[0].id)
    }
  }

  useEffect(() => {
    if (!token) return

    let cancelled = false
    const load = async () => {
      try {
        const [dashboardRes, tripsRes] = await Promise.all([api.get('/dashboard'), api.get('/trips')])
        if (cancelled) return
        setDashboard(dashboardRes.data)
        setTrips(tripsRes.data)
        if (!selectedTripId && tripsRes.data[0]) {
          setSelectedTripId(tripsRes.data[0].id)
        }
      } catch {
        if (!cancelled) {
          setMessage('Failed to load data')
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [api, token, selectedTripId])

  const onAuthSubmit = async (event) => {
    event.preventDefault()
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register'
      const payload =
        authMode === 'login'
          ? { email: authForm.email, password: authForm.password }
          : authForm
      const response = await api.post(endpoint, payload)
      localStorage.setItem('traveloop_token', response.data.token)
      setToken(response.data.token)
      setMessage('Authentication successful')
    } catch {
      setMessage('Authentication failed')
    }
  }

  const createTrip = async (event) => {
    event.preventDefault()
    await api.post('/trips', tripForm)
    setTripForm(emptyTrip)
    await refreshData()
  }

  const postToTrip = async (path, payload) => {
    if (!selectedTrip) return
    await api.post(`/trips/${selectedTrip.id}/${path}`, payload)
    await refreshData()
  }

  const togglePacking = async (itemId) => {
    await api.patch(`/trips/${selectedTrip.id}/packing/${itemId}/toggle`)
    await refreshData()
  }

  const toggleSharing = async () => {
    await api.patch(`/trips/${selectedTrip.id}/share`)
    await refreshData()
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md p-4 md:py-16">
        <div className={cardClass}>
          <h1 className="text-2xl font-semibold text-slate-900">Traveloop</h1>
          <p className="mb-4 mt-1 text-sm text-slate-600">Sign in to plan and share trips.</p>
          <form onSubmit={onAuthSubmit} className="space-y-3">
            {authMode === 'register' && (
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                required
              />
            )}
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              required
            />
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              required
            />
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white">
              {authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
          <button
            className="mt-2 text-sm text-blue-700"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <header className={`${cardClass} flex flex-col justify-between gap-2 md:flex-row`}>
        <div>
          <h1 className="text-2xl font-semibold">Traveloop Dashboard</h1>
          <p className="text-sm text-slate-600">Plan cities, activities, budget, packing, and notes.</p>
        </div>
        <button
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          onClick={() => {
            localStorage.removeItem('traveloop_token')
            setToken('')
          }}
        >
          Logout
        </button>
      </header>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      {dashboard && (
        <section className="grid gap-3 md:grid-cols-3">
          <div className={cardClass}>Trips: {dashboard.summary.totalTrips}</div>
          <div className={cardClass}>Budget: ₹{dashboard.summary.totalBudget}</div>
          <div className={cardClass}>Activities: {dashboard.summary.totalActivities}</div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <form className={`${cardClass} space-y-2`} onSubmit={createTrip}>
            <h2 className="font-semibold">Create Trip</h2>
            {['title', 'destination', 'startDate', 'endDate'].map((field) => (
              <input
                key={field}
                type={field.includes('Date') ? 'date' : 'text'}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder={field}
                value={tripForm[field]}
                onChange={(e) => setTripForm({ ...tripForm, [field]: e.target.value })}
                required
              />
            ))}
            <button className="rounded-md bg-blue-600 px-3 py-2 text-white">Save Trip</button>
          </form>

          <div className={cardClass}>
            <h2 className="mb-2 font-semibold">My Trips</h2>
            <ul className="space-y-2">
              {trips.map((trip) => (
                <li key={trip.id}>
                  <button
                    className={`w-full rounded-md px-3 py-2 text-left ${
                      selectedTripId === trip.id ? 'bg-blue-100' : 'bg-slate-100'
                    }`}
                    onClick={() => setSelectedTripId(trip.id)}
                  >
                    {trip.title} • {trip.destination}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {selectedTrip ? (
            <>
              <TripSection
                title="Itinerary Builder"
                onSubmit={(payload) => postToTrip('itinerary', payload)}
                fields={[
                  { key: 'day', type: 'number', label: 'Day' },
                  { key: 'summary', label: 'Summary' },
                  { key: 'date', type: 'date', label: 'Date', required: false },
                ]}
                list={selectedTrip.itinerary}
                listRender={(item) => `Day ${item.day}: ${item.summary}`}
              />
              <TripSection
                title="City Management"
                onSubmit={(payload) => postToTrip('cities', payload)}
                fields={[
                  { key: 'name', label: 'City' },
                  { key: 'country', label: 'Country' },
                ]}
                list={selectedTrip.cities}
                listRender={(item) => `${item.name}, ${item.country}`}
              />
              <TripSection
                title="Activity Management"
                onSubmit={(payload) => postToTrip('activities', payload)}
                fields={[
                  { key: 'title', label: 'Activity' },
                  { key: 'description', label: 'Description', required: false },
                  { key: 'estimatedCost', type: 'number', label: 'Estimated Cost', required: false },
                ]}
                list={selectedTrip.activities}
                listRender={(item) => `${item.title}${item.estimatedCost ? ` (₹${item.estimatedCost})` : ''}`}
              />
              <TripSection
                title="Budget Tracking"
                onSubmit={(payload) => postToTrip('budget', payload)}
                fields={[
                  { key: 'category', label: 'Category' },
                  { key: 'amount', type: 'number', label: 'Amount' },
                ]}
                list={selectedTrip.budgetItems}
                listRender={(item) => `${item.category}: ₹${item.amount}`}
              />
              <TripSection
                title="Packing Checklist"
                onSubmit={(payload) => postToTrip('packing', payload)}
                fields={[{ key: 'label', label: 'Item' }]}
                list={selectedTrip.packingItems}
                listRender={(item) => (
                  <button className="text-left" onClick={() => togglePacking(item.id)}>
                    {item.packed ? '✅' : '⬜'} {item.label}
                  </button>
                )}
              />
              <TripSection
                title="Trip Notes"
                onSubmit={(payload) => postToTrip('notes', payload)}
                fields={[{ key: 'content', label: 'Note' }]}
                list={selectedTrip.notes}
                listRender={(item) => item.content}
              />

              <div className={cardClass}>
                <h2 className="font-semibold">Public Trip Sharing</h2>
                <button className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-white" onClick={toggleSharing}>
                  {selectedTrip.isPublic ? 'Disable Sharing' : 'Enable Sharing'}
                </button>
                {selectedTrip.shareSlug && (
                  <p className="mt-2 text-sm text-slate-600">
                    Share URL: {API_URL.replace('/api', '')}/api/public/trips/{selectedTrip.shareSlug}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className={cardClass}>Create and select a trip to manage details.</div>
          )}
        </div>
      </section>
    </main>
  )
}

function TripSection({ title, fields, onSubmit, list, listRender }) {
  const [form, setForm] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.key]: field.type === 'number' ? 0 : '' }), {}),
  )

  const submit = async (event) => {
    event.preventDefault()
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value === '' ? undefined : value]),
    )
    await onSubmit(payload)
    setForm(fields.reduce((acc, field) => ({ ...acc, [field.key]: field.type === 'number' ? 0 : '' }), {}))
  }

  return (
    <div className={cardClass}>
      <h2 className="font-semibold">{title}</h2>
      <form onSubmit={submit} className="mt-2 grid gap-2 md:grid-cols-4">
        {fields.map((field) => (
          <input
            key={field.key}
            type={field.type || 'text'}
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder={field.label}
            value={form[field.key]}
            onChange={(e) =>
              setForm({
                ...form,
                [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
              })
            }
            required={field.required ?? true}
          />
        ))}
        <button className="rounded-md bg-slate-900 px-3 py-2 text-white">Add</button>
      </form>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {list.map((item) => {
          const rendered = listRender(item)
          return (
            <li key={item.id} className="rounded bg-slate-100 px-2 py-1">
              {rendered}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
