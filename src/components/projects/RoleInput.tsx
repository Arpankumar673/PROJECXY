import { X, Users, Award, Tag } from 'lucide-react'
import { useState } from 'react'

export interface RoleInputData {
  id: string
  role_name: string
  skills_required: string[]
  count: number
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface RoleInputProps {
  role: RoleInputData
  onUpdate: (role: RoleInputData) => void
  onRemove: () => void
  isRemovable: boolean
}

export default function RoleInput({ role, onUpdate, onRemove, isRemovable }: RoleInputProps) {
  const [skillInput, setSkillInput] = useState('')

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newSkill = skillInput.trim().replace(/,$/, '')
      if (newSkill && !role.skills_required.includes(newSkill)) {
        onUpdate({ 
          ...role, 
          skills_required: [...role.skills_required, newSkill] 
        })
        setSkillInput('')
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onUpdate({ 
      ...role, 
      skills_required: role.skills_required.filter(s => s !== skillToRemove) 
    })
  }

  return (
    <div className="li-card p-6 bg-[#F8FAFC] border-2 border-[#EDF3F8] rounded-2xl relative animate-in fade-in slide-in-from-top-4 duration-300">
      {isRemovable && (
        <button 
          onClick={onRemove}
          className="absolute -top-2 -right-2 h-8 w-8 bg-white border border-[#EBEBEB] text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all shadow-sm z-10"
        >
          <X size={16} />
        </button>
      )}

      <div className="space-y-6">
        {/* Role Name */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
            <Award size={14} className="text-[#0A66C2]" /> Role Title
          </label>
          <input 
            value={role.role_name}
            onChange={(e) => onUpdate({ ...role, role_name: e.target.value })}
            placeholder="e.g. AI Researcher, UI Designer..."
            className="w-full h-12 px-4 rounded-xl border border-[#D9E2ED] bg-white text-[15px] font-medium focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition-all"
          />
        </div>

        {/* Skills Tags */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
            <Tag size={14} className="text-[#0A66C2]" /> Mandatory Skills
          </label>
          <div className="w-full min-h-[56px] p-2 rounded-xl border border-[#D9E2ED] bg-white focus-within:border-[#0A66C2] transition-all flex flex-wrap gap-2 items-center">
            {role.skills_required.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-[#EDF3F8] text-[#0A66C2] text-xs font-bold rounded-lg flex items-center gap-1.5 group border border-[#D9E2ED]">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder={role.skills_required.length === 0 ? "Type and press Enter..." : ""}
              className="flex-grow min-w-[120px] h-8 px-2 text-sm font-medium outline-none"
            />
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
               <Users size={14} className="text-[#0A66C2]" /> Headcount
             </label>
             <input 
               type="number"
               min={1}
               max={10}
               value={role.count}
               onChange={(e) => onUpdate({ ...role, count: parseInt(e.target.value) || 1 })}
               className="w-full h-12 px-4 rounded-xl border border-[#D9E2ED] bg-white text-[15px] font-bold focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition-all"
             />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-black text-[#666666] uppercase tracking-widest">Experience</label>
             <select 
               value={role.experience_level}
               onChange={(e) => onUpdate({ ...role, experience_level: e.target.value as any })}
               className="w-full h-12 px-4 rounded-xl border border-[#D9E2ED] bg-white text-[14px] font-bold text-gray-700 outline-none focus:border-[#0A66C2]"
             >
               <option>Beginner</option>
               <option>Intermediate</option>
               <option>Advanced</option>
             </select>
          </div>
        </div>
      </div>
    </div>
  )
}
