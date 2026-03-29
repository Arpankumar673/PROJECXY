import { motion } from 'framer-motion'
import { Clock, CheckCircle2, ChevronRight, User } from 'lucide-react'

interface ProgressUpdate {
  id: string
  project_id: string
  user_id: string
  progress: number
  stage: string
  completed_text: string
  next_text: string
  created_at: string
  profiles?: {
     full_name: string
  }
}

interface ProgressHistoryProps {
  updates: ProgressUpdate[]
}

export default function ProgressHistory({ updates }: ProgressHistoryProps) {
  if (updates.length === 0) {
    return (
      <div className="py-24 text-center space-y-4 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
         <div className="h-20 w-20 bg-white rounded-full mx-auto flex items-center justify-center text-gray-200 border border-gray-100 shadow-sm"><Clock size={40} /></div>
         <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-900 leading-none">The Story Begins</h3>
            <p className="text-sm font-bold text-gray-400">Collaborative efforts will build your timeline here.</p>
         </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative pl-12">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

      {updates.map((update, i) => (
        <motion.div 
          key={update.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative"
        >
           {/* Timeline Node */}
           <div className="absolute -left-[30px] top-4 h-5 w-5 bg-white border-2 border-blue-600 rounded-full z-10 shadow-sm" />

           <div className="li-card p-8 bg-white border-gray-100 shadow-sm space-y-6 hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <span className="text-2xl font-black text-gray-900 leading-none">{update.progress}% Complete</span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         update.stage === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                       }`}>{update.stage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <User size={12} className="text-gray-300" /> {update.profiles?.full_name || 'Innovator'} • {new Date(update.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" /> COMPLETED TASK
                    </p>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed italic">"{update.completed_text}"</p>
                 </div>

                 <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                    <ChevronRight size={16} className="text-blue-600 shrink-0" />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none opacity-80 mb-0.5">NEXT STEP</p>
                       <p className="text-sm font-bold truncate">{update.next_text}</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      ))}
    </div>
  )
}
