import { Edit3, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AboutSectionProps {
  bio: string | null
  onSave: (bio: string) => Promise<void>
  isOwnProfile?: boolean
}

export default function AboutSection({ bio, onSave, isOwnProfile = true }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempBio, setTempBio] = useState(bio || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      await onSave(tempBio)
      setIsEditing(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="li-card p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black tracking-tight">About</h2>
        {!isEditing && isOwnProfile && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <Edit3 className="h-5 w-5 text-[#666666]" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <textarea
              autoFocus
              className="w-full h-40 bg-[#F3F6F9] border-[1.5px] border-transparent rounded-lg p-4 focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-medium text-[15px] resize-none"
              placeholder="Tell us about your technical journey..."
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setIsEditing(false); setTempBio(bio || ''); }}
                disabled={loading}
                className="px-4 py-2 text-sm font-bold text-[#666666] hover:bg-black/5 rounded-full transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="li-button-primary px-6 py-2 flex items-center gap-2 text-sm font-bold"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[15px] text-[#000000e6] font-medium leading-[1.6] whitespace-pre-wrap"
          >
            {bio || <span className="text-[#666666] italic">Add a bio to highlight your expertise and project interests.</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
