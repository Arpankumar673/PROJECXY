import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Zap, CheckCircle2, Loader2, Sparkles, Terminal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { clsx } from 'clsx'

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
  project: { id: string, title: string, user_id?: string }
  roleName: string
  onApplySuccess: () => void
}

export default function ApplyModal({ isOpen, onClose, project, roleName, onApplySuccess }: ApplyModalProps) {
  const { user, profile } = useAuth()
  const [message, setMessage] = useState('')
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '')
  const [timeCommitment, setTimeCommitment] = useState('5-10 hours')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('join_requests')
        .insert({
          project_id: project.id,
          user_id: user.id,
          message,
          role_name: roleName,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          time_commitment: timeCommitment,
          status: 'pending'
        })
      
      if (error) throw error
      
      // Notify Project Owner
      if (project.user_id) {
        try {
          const { error: notifError } = await supabase.from('notifications').insert({
             user_id: project.user_id,
             title: 'New Mission Request! 🚀',
             message: `${profile?.full_name || 'An innovator'} wants to join ${project.title} as a ${roleName}.`
          })
          if (notifError) console.error('[PROJECXY NOTIF ERROR]:', notifError)
        } catch (e) {
          console.error('[PROJECXY NOTIF EXCEPTION]:', e)
        }
      }
      
      setSent(true)
      setTimeout(() => {
        onApplySuccess()
        onClose()
        setSent(false)
      }, 2000)
      
    } catch (err: any) {
      console.error('[PROJECXY APPLY]: Submit Error:', err.message)
      alert('Failed to send request. Check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full h-full sm:h-auto sm:max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-3xl overflow-hidden relative z-10 pointer-events-auto border border-white/20"
          >
            {sent ? (
              <div className="p-12 text-center space-y-6 flex flex-col items-center">
                 <div className="h-20 w-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-bounce">
                    <CheckCircle2 size={40} />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Application Transmitted!</h2>
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">The mission leader has been notified.</p>
                 </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-[#0A66C2] p-8 text-white relative">
                   <button 
                     type="button"
                     onClick={onClose} 
                     className="absolute right-6 top-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                   >
                      <X size={24} />
                   </button>
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <Sparkles size={16} className="text-yellow-400" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Direct Application</span>
                      </div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Apply for Role</h2>
                      <p className="text-blue-100 font-bold text-xs uppercase tracking-widest opacity-80">Project: {project.title}</p>
                   </div>
                </div>

                <div className="p-8 space-y-8 h-[60vh] md:h-auto overflow-y-auto custom-scrollbar">
                   {/* Role Indicator */}
                   <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#0A66C2] shadow-sm"><Zap size={20} /></div>
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Applying as:</p>
                         <p className="text-sm font-black text-gray-900 mt-1 uppercase italic tracking-tighter">{roleName}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest ml-1">Why do you want to join?</label>
                         <textarea 
                           required
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           className="w-full h-32 bg-[#F3F6F9] border-none rounded-2xl p-6 text-sm font-bold focus:ring-2 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none resize-none placeholder:text-gray-400"
                           placeholder="Tell the leader about your motivation..."
                         />
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest ml-1">Your Skills (Comma separated)</label>
                         <input 
                           required
                           type="text"
                           value={skills}
                           onChange={(e) => setSkills(e.target.value)}
                           className="w-full h-14 bg-[#F3F6F9] border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none placeholder:text-gray-400"
                           placeholder="e.g. React, Node.js, Figma"
                         />
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-[#666666] uppercase tracking-widest ml-1">Time Commitment (per week)</label>
                         <div className="grid grid-cols-2 gap-3">
                            {['5-10 hours', '10-20 hours', '20+ hours'].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setTimeCommitment(opt)}
                                className={clsx(
                                  "h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                                  timeCommitment === opt 
                                   ? "bg-[#0A66C2] text-white border-[#0A66C2] shadow-lg shadow-blue-500/20" 
                                   : "bg-white text-gray-400 border-gray-100 hover:border-blue-200"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                      <button 
                        type="button"
                        onClick={onClose}
                        className="flex-grow h-14 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all"
                      >
                         Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="flex-grow h-14 bg-[#0A66C2] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                      >
                         {isLoading ? <Loader2 className="animate-spin" /> : <><Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Send Request</>}
                      </button>
                   </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
