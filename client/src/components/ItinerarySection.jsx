import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ItineraryDay from './ItineraryDay'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Loader2, Sparkles } from 'lucide-react'

export default function ItinerarySection({ tripId, initialDays = [] }) {
  const [days, setDays] = useState(initialDays)
  const queryClient = useQueryClient()

  useEffect(() => {
    setDays(initialDays)
  }, [initialDays])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const initMutation = useMutation({
    mutationFn: () => api.post(`/trips/${tripId}/itinerary/initialize`),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['trip', tripId])
      toast.success('Itinerary generated successfully!')
    },
    onError: () => toast.error('Failed to initialize itinerary')
  })

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      setDays((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      // In a real app, I would also call a mutation to save the new order in DB
      toast.success('Order updated (locally for now)')
    }
  }

  if (days.length === 0) {
    return (
      <div className="card p-12 text-center flex flex-col items-center gap-6 border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Itinerary is Empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            We can automatically generate a day-by-day plan based on your trip dates.
          </p>
        </div>
        <button 
          onClick={() => initMutation.mutate()}
          disabled={initMutation.isPending}
          className="btn-primary"
        >
          {initMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Initialize Magic Itinerary
        </button>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={days.map((d) => d.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6">
          {days.map((day) => (
            <ItineraryDay key={day.id} day={day} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
