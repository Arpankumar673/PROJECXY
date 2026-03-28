import { useState } from 'react'
import { X, Save, User, GraduationCap, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '../ui/Input'

const departments = [
  "Electrical Engineering",
  "Civil Engineering",
  "Agriculture Engineering",
  "Biotechnology",
  "Mechanical Engineering",
  "Computer Science",
  "MBA"
]

const csBranches = [
  "AI/ML",
  "CSE Core",
  "Data Science",
  "Cyber Security"
]

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: any
  onSave: (data: any) => Promise<void>
  loading: boolean
}

export default function EditProfileModal({ isOpen, onClose, initialData, onSave, loading }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="li-card w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#F3F2EF] flex justify-between items-center bg-[#F3F6F9] rounded-t-lg">
              <h2 className="text-xl font-bold text-black">Edit Intro</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="h-5 w-5 text-[#666666]" />
              </button>
            </div>

            {/* Form Content */}
            <form id="edit-profile-form" onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="John Doe"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <Input
                  label="Username"
                  placeholder="@username"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase ml-0.5">About You (Bio)</label>
                <textarea
                  className="w-full h-32 bg-[#F3F6F9] border-[1.5px] border-transparent rounded-lg p-4 focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-medium text-[15px] resize-none"
                  placeholder="Tell people about yourself..."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase ml-0.5 group-focus-within:text-[#0A66C2]">Department</label>
                  <div className="relative isolate">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2] z-10" />
                    <select
                      className="w-full h-12 bg-[#F3F6F9] border-[1.5px] border-transparent rounded-lg pl-12 pr-10 appearance-none focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-semibold text-[15px] cursor-pointer"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value, branch: '' })}
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] pointer-events-none" />
                  </div>
                </div>

                <AnimatePresence>
                  {formData.department === 'Computer Science' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-1.5 group"
                    >
                      <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase ml-0.5 group-focus-within:text-[#0A66C2]">Branch</label>
                      <div className="relative isolate">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2] z-10" />
                        <select
                          className="w-full h-12 bg-[#F3F6F9] border-[1.5px] border-transparent rounded-lg pl-12 pr-10 appearance-none focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-semibold text-[15px] cursor-pointer"
                          value={formData.branch || ''}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        >
                          <option value="">Select Branch</option>
                          {csBranches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-[#F3F2EF] flex justify-end gap-3 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="px-6 h-10 font-bold text-[#666666] hover:bg-black/5 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-profile-form"
                disabled={loading}
                className="li-button-primary h-10 px-8 flex items-center gap-2"
              >
                {loading ? 'Saving...' : <><Save size={18} /> Save</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
