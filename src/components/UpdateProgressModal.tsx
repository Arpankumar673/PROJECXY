import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Layout, Sliders, MessageSquare, ChevronRight, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { supabase } from '../lib/supabase'

interface UpdateProgressModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  currentStage: string
  onUpdateSuccess: () => void
}

const STAGES = ['Idea', 'Planning', 'Building', 'Testing', 'Completed']

const STAGE_PROGRESS: Record<string, number> = {
  'Idea': 10,
  'Planning': 25,
  'Building': 50,
  'Testing': 75,
  'Completed': 100
}

export default function UpdateProgressModal({ 
  isOpen, 
  onClose, 
  projectId, 
  currentStage,
  onUpdateSuccess 
}: UpdateProgressModalProps) {
  const [stage, setStage] = useState(currentStage || 'Idea')
  const [completedToday, setCompletedToday] = useState('')
  const [workingOnNext, setWorkingOnNext] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const calculatedProgress = STAGE_PROGRESS[stage] || 0

      // 1. Add Entry to Progress History (Audit Trail)
      const { error: updateHistoryError } = await supabase
        .from('project_updates')
        .insert({
          project_id: projectId,
          user_id: user.id,
          progress: calculatedProgress,
          stage: stage,
          completed_text: completedToday,
          next_text: workingOnNext
        })

      if (updateHistoryError) throw updateHistoryError

      // 2. Update Main Project State
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({
          progress: calculatedProgress,
          status: stage,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (projectUpdateError) throw projectUpdateError

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onUpdateSuccess()
        onClose()
        // Reset local state
        setCompletedToday('')
        setWorkingOnNext('')
      }, 2000)

    } catch (err: any) {
      console.error('[PROJECXY SYNC]: Update Error:', err.message)
      alert('Failed to update progress. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
          >
            {success ? (
              <div className="p-12 text-center space-y-6">
                <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 leading-none">Synced!</h2>
                  <p className="text-gray-500 font-bold">Progress updated successfully.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
                      <Layout size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-none italic uppercase tracking-tighter">Update your work</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Institutional Audit Trail Syncing</p>
                    </div>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X size={20} /></button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                  
                  {/* AUTO PROGRESS DISPLAY */}
                  <div className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <div className="flex justify-between items-end">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sliders size={14} className="text-blue-600" /> Target Milestone
                      </label>
                      <span className="text-3xl font-black text-blue-600 leading-none">{STAGE_PROGRESS[stage] || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-blue-100 p-[2px]">
                       <motion.div 
                        initial={false}
                        animate={{ width: `${STAGE_PROGRESS[stage] || 0}%` }}
                        className="h-full bg-blue-600 rounded-full shadow-lg"
                       />
                    </div>
                    <p className="text-[10px] font-bold text-blue-400 italic">Progress is automatically calculated based on the selected stage.</p>
                  </div>

                  {/* Stage Dropdown */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Select Current Project Stage</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {STAGES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStage(s)}
                          className={clsx(
                            "py-3 px-4 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest",
                            stage === s 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]' 
                              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Completion Text */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} className="text-emerald-500" /> What did you complete?
                    </label>
                    <textarea 
                      required
                      value={completedToday}
                      onChange={(e) => setCompletedToday(e.target.value)}
                      placeholder="e.g. Connected the database, designed the login screen..."
                      className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>

                  {/* Next Step Text */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ChevronRight size={14} className="text-blue-600" /> What's the next step?
                    </label>
                    <input 
                      required
                      value={workingOnNext}
                      onChange={(e) => setWorkingOnNext(e.target.value)}
                      placeholder="e.g. Testing the API, adding user profiles..."
                      className="w-full h-14 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-500/30 disabled:opacity-50 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'PUBLISH PROGRESS'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
