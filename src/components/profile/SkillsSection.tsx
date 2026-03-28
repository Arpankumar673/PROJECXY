import { Plus, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '../ui/Input'

interface SkillsSectionProps {
  skills: string[]
  onUpdate: (skills: string[]) => Promise<void>
  isOwnProfile?: boolean
}

export default function SkillsSection({ skills, onUpdate, isOwnProfile = true }: SkillsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return
    
    setIsUpdating(true)
    const updatedSkills = [...skills, newSkill.trim()]
    await onUpdate(updatedSkills)
    setNewSkill('')
    setIsAdding(false)
    setIsUpdating(false)
  }

  const handleRemove = async (skillToRemove: string) => {
    setIsUpdating(true)
    const updatedSkills = skills.filter(s => s !== skillToRemove)
    await onUpdate(updatedSkills)
    setIsUpdating(false)
  }

  return (
    <div className="li-card p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center group">
        <h2 className="text-xl font-bold text-black tracking-tight">Skills</h2>
        {isOwnProfile && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsAdding(true)}
              className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
            >
              <Plus className="h-5 w-5 text-[#666666]" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd} 
            className="flex gap-2 overflow-hidden"
          >
            <Input
              autoFocus
              placeholder="e.g. Machine Learning"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="h-10 text-sm"
              disabled={isUpdating}
            />
            <button 
              type="submit" 
              disabled={isUpdating}
              className="li-button-primary h-10 px-6 font-bold flex-shrink-0"
            >
              Add
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)} 
              className="px-4 h-10 text-red-600 font-bold hover:bg-black/5 rounded-md"
            >
              <X size={18} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2.5">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <motion.div 
              key={skill}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="group/skill bg-[#EDF3F8] border border-[#0A66C2]/10 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-[#0A66C2] hover:text-white cursor-default"
            >
              <Zap size={14} className="text-[#0A66C2] group-hover/skill:text-white" />
              <span className="text-[14px] font-semibold">{skill}</span>
              {isOwnProfile && (
                <button 
                  onClick={() => handleRemove(skill)}
                  className="ml-1 opacity-0 group-hover/skill:opacity-100 p-0.5 hover:bg-white/20 rounded-full transition-all"
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-[#666666] font-medium">Highlight your top 5 technical skills to get found by project leads.</p>
        )}
      </div>
    </div>
  )
}
