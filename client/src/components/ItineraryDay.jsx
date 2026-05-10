import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ItineraryDay({ day }) {
  const [isOpen, setIsOpen] = useState(true)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: day.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  const date = day.date ? new Date(day.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }) : `Day ${day.dayNumber}`

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="card overflow-hidden border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Day Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center gap-4">
          <button 
            {...attributes} 
            {...listeners}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
              {day.dayNumber}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {date}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{day.summary || 'No summary'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Activities List */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {day.activities?.length > 0 ? (
                  <div className="space-y-3">
                    {day.activities.map((item, idx) => (
                      <div key={item.id} className="flex gap-4 items-start pl-2 relative">
                        {/* Timeline line */}
                        {idx !== day.activities.length - 1 && (
                          <div className="absolute left-[25px] top-8 bottom-[-16px] w-[2px] bg-slate-200 dark:bg-slate-700" />
                        )}
                        
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-brand-500 flex items-center justify-center z-10 shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                        </div>
                        
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm">{item.activity?.name || 'Unknown Activity'}</h4>
                            <span className="text-[10px] bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">
                              {item.activity?.category || 'General'}
                            </span>
                          </div>
                          {item.activity?.description && (
                            <p className="text-xs text-slate-500 mt-1">{item.activity.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.activity?.durationHrs || 0}h</span>
                            {item.activity?.price > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${item.activity.price}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <p className="text-xs text-slate-400">No activities scheduled for this day.</p>
                  </div>
                )}

                <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-colors border border-transparent hover:border-brand-100 dark:hover:border-brand-900/40">
                  <Plus className="w-4 h-4" />
                  Add Activity
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
