import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Trash2, Loader2, ShieldAlert } from 'lucide-react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabase'

interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
  project: { id: string; title: string }
}

export default function DeleteProjectModal({ isOpen, onClose, onDeleted, project }: DeleteProjectModalProps) {
  const [step, setStep] = useState(1)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setStep(1)
    setConfirmText('')
    setError(null)
    onClose()
  }

  const handleDelete = async () => {
    if (confirmText.trim().toLowerCase() !== project.title.trim().toLowerCase()) return
    
    setIsDeleting(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (deleteError) throw deleteError
      onDeleted()
      handleClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 99999 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-rose-100"
          >
             <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-2">
                 <AlertTriangle className="text-rose-600" size={24} />
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Destruction Protocol</h2>
               </div>
               <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black">
                 <X size={24} />
               </button>
             </div>

             <div className="p-6 md:p-10 space-y-8">
               {step === 1 ? (
                 <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-rose-50 text-rose-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                       <ShieldAlert className="w-12 h-12" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-none uppercase">Irreversible Action</h3>
                       <p className="text-sm md:text-base text-gray-500 font-bold leading-relaxed italic">
                         You are about to permanently delete <strong>"{project.title}"</strong>. All squad data will be incinerated.
                       </p>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition shadow-xl shadow-rose-500/20 uppercase text-xs tracking-[0.3em]"
                    >
                       Continue to Verification
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="text-center space-y-2">
                       <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Identity Match</h3>
                       <p className="text-[11px] font-bold text-gray-400 italic">Type the project name exactly to enable termination.</p>
                       <p className="text-sm font-black text-rose-600 uppercase tracking-widest mt-2 px-4 py-2 bg-rose-50 rounded-lg inline-block select-all">"{project.title.trim()}"</p>
                    </div>

                    <div className="space-y-4">
                       <input 
                         autoFocus
                         value={confirmText}
                         onChange={e => setConfirmText(e.target.value)}
                         placeholder="Match project name here"
                         className="w-full h-14 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-rose-600 text-center font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300 placeholder:font-medium italic"
                       />
                       
                       {error && (
                         <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
                           ⚠️ {error}
                         </div>
                       )}

                       <button 
                         disabled={confirmText.trim().toLowerCase() !== project.title.trim().toLowerCase() || isDeleting}
                         onClick={handleDelete}
                         className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-black transition shadow-2xl shadow-rose-500/30 disabled:opacity-20 disabled:grayscale uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3"
                       >
                          {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                          Confirm Deletion
                       </button>

                       <button 
                         disabled={isDeleting}
                         onClick={() => setStep(1)} 
                         className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
                       >
                         ← Go Back
                       </button>
                    </div>
                 </div>
               )}
             </div>

             <div className="p-4 bg-gray-50 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Verification Required</p>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
