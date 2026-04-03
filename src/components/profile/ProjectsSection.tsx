import { Plus, Edit3, Trash2, Link2, BookOpen, ExternalLink, GraduationCap, Briefcase, Save, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '../ui/Input'

interface Project {
  id?: string
  title: string
  description: string
  project_link: string
  role: string
  year_of_study: string
}

interface ProjectsSectionProps {
  projects: Project[]
  onAdd: (project: Project) => Promise<void>
  onEdit: (project: Project) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isOwnProfile?: boolean
}

export default function ProjectsSection({ projects, onAdd, onEdit, onDelete, isOwnProfile = true }: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  
  const [form, setForm] = useState<Project>({
    title: '',
    description: '',
    project_link: '',
    role: '',
    year_of_study: '1st'
  })

  const resetForm = () => {
    setForm({ title: '', description: '', project_link: '', role: '', year_of_study: '1st' })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(editingId || 'adding')
      if (editingId) {
        await onEdit({ ...form, id: editingId })
      } else {
        await onAdd(form)
      }
      resetForm()
    } finally {
      setLoading(null)
    }
  }

  const startEdit = (p: Project) => {
    setForm(p)
    setEditingId(p.id!)
    setIsAdding(false)
  }

  return (
    <div className="li-card p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-center group">
        <h2 className="text-xl font-bold text-black tracking-tight">Projects</h2>
        {isOwnProfile && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setForm({ title: '', description: '', project_link: '', role: '', year_of_study: '1st' }) }}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
          >
            <Plus className="h-6 w-6 text-[#0A66C2]" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSave}
            className="space-y-4 p-4 bg-[#F3F6F9] rounded-lg border border-[#0A66C2]/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                placeholder="e.g. AI Crop Monitor"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="Role"
                placeholder="e.g. Lead Developer"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Link (URL)"
                icon={Link2}
                placeholder="https://github.com/..."
                value={form.project_link}
                onChange={(e) => setForm({ ...form, project_link: e.target.value })}
              />
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase ml-0.5 group-focus-within:text-[#0A66C2]">Year of Study</label>
                <div className="relative isolate">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2] z-10" />
                  <select
                    className="w-full h-12 bg-white border-[1.5px] border-transparent rounded-lg pl-12 pr-4 appearance-none focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-semibold text-[15px] cursor-pointer"
                    value={form.year_of_study}
                    onChange={(e) => setForm({ ...form, year_of_study: e.target.value })}
                  >
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <textarea
              className="w-full h-32 bg-white border-[1.5px] border-transparent rounded-lg p-4 focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-medium text-[15px] resize-none"
              placeholder="Describe the project goal, tech stack, and impact..."
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 h-10 font-bold text-[#666666] hover:bg-black/5 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!!loading}
                className="li-button-primary h-10 px-8 flex items-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editingId ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <motion.div 
              key={project.id} 
              layout
              className="flex flex-col md:flex-row gap-5 group/item pb-6 border-b border-[#F3F2EF] last:border-0 animate-in fade-in"
            >
              <div className="h-14 w-14 bg-[#EDF3F8] rounded-xl flex-shrink-0 flex items-center justify-center border border-[#0A66C2]/10 transition-transform group-hover/item:rotate-3 shadow-sm mx-auto md:mx-0">
                <Briefcase className="h-7 w-7 text-[#0A66C2]" />
              </div>
              <div className="flex-grow space-y-3 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
                  <div className="space-y-1">
                    <h3 className="text-[18px] font-black text-black hover:text-[#0A66C2] hover:underline cursor-pointer leading-tight transition-colors uppercase tracking-tight">{project.title}</h3>
                    <p className="text-sm text-[#000000e6] font-bold">{project.role} · <span className="text-[#666666] font-medium">{project.year_of_study} Year</span></p>
                  </div>
                  {isOwnProfile && (
                    <div className="flex items-center gap-2 pt-2 md:pt-0 opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(project)}
                        className="h-10 w-10 flex items-center justify-center hover:bg-black/5 rounded-full text-[#666666] hover:text-[#0A66C2] transition-all border border-transparent md:border-none"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(project.id!)}
                        className="h-10 w-10 flex items-center justify-center hover:bg-black/5 rounded-full text-[#666666] hover:text-red-600 transition-all border border-transparent md:border-none"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[15px] text-[#000000e6] font-medium leading-[1.6] line-clamp-3 md:line-clamp-none transition-all px-2 md:px-0">
                  {project.description}
                </p>
                {project.project_link && (
                  <a 
                    href={project.project_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start space-x-1.5 pt-3 text-[#666666] hover:text-[#0A66C2] cursor-pointer transition-colors w-full md:w-fit"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">View Repository</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="min-h-[220px] flex flex-col items-center justify-center text-center space-y-4 bg-[#F3F6F9] rounded-2xl border-2 border-dashed border-[#0A66C2]/10 p-8">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <BookOpen className="h-8 w-8 text-[#0A66C2]/40" />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] text-[#666666] font-black uppercase tracking-widest">The Mission Story Begins</p>
              <p className="text-sm text-[#666666] font-medium opacity-60">Every great innovation starts with a single log.</p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="li-button-primary h-11 px-8 text-xs font-black uppercase tracking-widest"
            >
              Launch First Project
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
