import { motion } from 'framer-motion'
import { Clock, CheckCircle2, User, Terminal } from 'lucide-react'

interface ProgressUpdate {
  id: string
  project_id: string
  user_id: string
  stage: string
  update_text: string
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-32 text-center space-y-10 bg-white rounded-[64px] border border-gray-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden group"
      >
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000"><Clock size={200} /></div>
         <div className="h-28 w-28 bg-gray-50 rounded-[40px] mx-auto flex items-center justify-center text-gray-200 border border-gray-100 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-700">
            <Clock size={48} className="animate-pulse" />
         </div>
         <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-gray-900 leading-none italic uppercase tracking-tighter">The Mission Story Begins</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] px-8 max-w-sm mx-auto opacity-70">Every great innovation starts with a single log. Synchronize your first milestone today.</p>
         </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-12 relative pl-16">
      {/* High-Fidelity Timeline Line */}
      <div className="absolute left-7 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-600 via-emerald-500 to-transparent rounded-full opacity-20 shadow-inner" />

      {updates.map((update, i) => (
        <motion.div 
          key={update.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
          className="relative group"
        >
           {/* Pulsing Timeline Node */}
           <div className="absolute -left-[54px] top-6 h-10 w-10 bg-white border-4 border-gray-100 rounded-[14px] z-10 shadow-xl flex items-center justify-center group-hover:border-blue-600 group-hover:scale-110 transition-all duration-500">
              <Terminal size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
           </div>

           <div className="li-card p-10 bg-white border-gray-100 shadow-sm space-y-8 hover:shadow-3xl hover:shadow-blue-500/10 transition-all duration-700 border-l-[12px] border-l-blue-600/5 hover:border-l-blue-600 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-1">
                 <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                       <span className="text-3xl font-black text-gray-900 leading-none italic uppercase tracking-tighter">{update.stage} Phase</span>
                       <span className={clsx(
                         "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                         update.stage === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                       )}>MILESTONE REACHED</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                       <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all"><User size={18} /></div>
                       <span>{update.profiles?.full_name || 'Anonymous Innovator'}</span>
                       <span className="h-1 w-1 bg-gray-200 rounded-full" />
                       <span>{new Date(update.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                 </div>
                 <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                    <Clock size={16} className="text-gray-300 group-hover:text-blue-600" />
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 tracking-widest uppercase">Verified System Log</span>
                 </div>
              </div>

              <div className="relative pt-6 border-t border-gray-50 group-hover:border-blue-50 transition-all">
                 <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 group-hover:bg-white group-hover:shadow-inner transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none"><CheckCircle2 size={120} /></div>
                    <p className="text-[11px] font-black text-blue-600/40 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
                       <CheckCircle2 size={16} className="text-emerald-500" /> Synchronization Entry
                    </p>
                    <p className="text-lg font-black text-gray-700 leading-relaxed italic uppercase tracking-tighter">
                       "{update.update_text || "Establishing innovation protocols..."}"
                    </p>
                 </div>
              </div>
           </div>
        </motion.div>
      ))}
    </div>
  )
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
