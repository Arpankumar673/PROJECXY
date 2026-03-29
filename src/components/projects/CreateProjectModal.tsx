import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronRight, ChevronLeft, Plus, CheckCircle2, 
  Sparkles, Target, Calendar, Globe, Building2,
  ArrowRight, Eye, ClipboardCheck
} from 'lucide-react'
import { clsx } from 'clsx'
import RoleInput from './RoleInput'
import type { RoleInputData } from './RoleInput'
import { useCreateProject } from '../../hooks/useCreateProject'
import type { ProjectData } from '../../hooks/useCreateProject'
import { useNavigate } from 'react-router-dom'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  { id: 1, title: 'Concept', description: 'Basic details & goals' },
  { id: 2, title: 'Team', description: 'Recruit your pioneers' },
  { id: 3, title: 'Logistics', description: 'Timeline & Department' },
  { id: 4, title: 'Preview', description: 'Review your innovation' }
]

const projectCategories = ['Tech', 'Management', 'Social', 'Research', 'Creative', 'Others']
const timelines = ['1 Week (Mini)', '1 Month (Short)', '3-6 Months (Standard)', '1 Year+ (Long Term)']
const workTypes = ['Online', 'Offline', 'Hybrid']

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const navigate = useNavigate()
  const { createProject, loading, error: createError } = useCreateProject()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    category: 'Tech',
    goal: '',
    timeline: '3-6 Months (Standard)',
    work_type: 'Hybrid',
    open_to_all: true,
    roles: [{
      id: crypto.randomUUID(),
      role_name: '',
      skills_required: [],
      count: 1,
      experience_level: 'Beginner'
    }]
  })

  // Basic Validation
  const isStep1Valid = formData.title.trim().length > 3 && formData.description.trim().length > 10
  const isStep2Valid = formData.roles.length > 0 && formData.roles.every(r => r.role_name.trim().length > 2 && r.skills_required.length > 0)
  
  const handleNext = () => {
     if (currentStep < 4) setCurrentStep(s => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }

  const handleSubmit = async () => {
     const result = await createProject(formData)
     if (result) {
        onClose()
        navigate(`/projects`) // Redirect to projects list or specific hub if known
     }
  }

  const addRole = () => {
    setFormData({
      ...formData,
      roles: [...formData.roles, {
        id: crypto.randomUUID(),
        role_name: '',
        skills_required: [],
        count: 1,
        experience_level: 'Beginner'
      }]
    })
  }

  const updateRole = (updatedRole: RoleInputData) => {
    setFormData({
      ...formData,
      roles: formData.roles.map(r => r.id === updatedRole.id ? updatedRole : r)
    })
  }

  const removeRole = (id: string) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter(r => r.id !== id)
    })
  }

  // AI-like Role Suggestions Mock
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([])
  useEffect(() => {
    if (formData.title.toLowerCase().includes('website') || formData.title.toLowerCase().includes('app')) {
      setSuggestedRoles(['Frontend Developer', 'UI/UX Designer', 'Product Manager'])
    } else if (formData.title.toLowerCase().includes('ai') || formData.title.toLowerCase().includes('ml')) {
      setSuggestedRoles(['ML Engineer', 'Data Scientist', 'Researcher'])
    } else {
      setSuggestedRoles([])
    }
  }, [formData.title])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F3F2EF] flex items-center justify-between bg-white relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-[#EDF3F8] text-[#0A66C2] flex items-center justify-center border-2 border-[#D9E2ED]">
                  <Sparkles size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-black leading-tight tracking-tight uppercase">Launch Innovation</h2>
                  <p className="text-xs font-black text-[#666666] uppercase tracking-[0.2em]">{steps[currentStep-1].title} — {steps[currentStep-1].description}</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#F3F2EF] overflow-x-auto">
             <div className="flex items-center justify-between min-w-[500px]">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 group cursor-default">
                    <div className={clsx(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black transition-all",
                      currentStep === step.id ? "bg-[#0A66C2] text-white shadow-lg shadow-blue-200 scale-110" : 
                      currentStep > step.id ? "bg-green-500 text-white" : "bg-[#EDF3F8] text-[#666666]"
                    )}>
                       {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                    </div>
                    <span className={clsx(
                      "text-xs font-black uppercase tracking-widest",
                      currentStep === step.id ? "text-black" : "text-[#666666]"
                    )}>{step.title}</span>
                    {step.id < 4 && <ChevronRight size={14} className="mx-2 text-gray-300" />}
                  </div>
                ))}
             </div>
          </div>

          {/* Form Content */}
          <div className="flex-grow overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {/* STEP 1: BASIC DETAILS */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
                         <ClipboardCheck size={14} className="text-[#0A66C2]" /> Project Title
                       </label>
                       <input 
                         required
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder="e.g. Next-Gen AgriBot, Campus Wallet..."
                         className="w-full h-14 px-4 rounded-xl border border-[#D9E2ED] text-lg font-bold text-black focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition-all placeholder:text-gray-300"
                       />
                       <p className="text-[10px] font-black text-[#666666]/50 uppercase tracking-widest">Min 4 characters. Keep it catchy.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-[#666666] uppercase tracking-widest">Innovation Category</label>
                          <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full h-14 px-4 rounded-xl border border-[#D9E2ED] text-[14px] font-black text-black outline-none focus:border-[#0A66C2] bg-gray-50/50"
                          >
                            {projectCategories.map(cat => <option key={cat}>{cat}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
                         <Target size={14} className="text-[#0A66C2]" /> Project Goal
                       </label>
                       <textarea 
                        required
                        value={formData.goal}
                        onChange={(e) => setFormData({...formData, goal: e.target.value})}
                        placeholder="What problem are you solving? What is the end goal?"
                        className="w-full min-h-[100px] p-4 rounded-xl border border-[#D9E2ED] text-[15px] font-medium outline-none focus:border-[#0A66C2] resize-none"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-[#666666] uppercase tracking-widest">Short Description</label>
                       <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Briefly explain your idea to attract your team."
                        className="w-full min-h-[120px] p-4 rounded-xl border border-[#D9E2ED] text-[15px] font-medium outline-none focus:border-[#0A66C2] resize-none"
                       />
                    </div>
                  </div>
                )}

                {/* STEP 2: TEAM REQUIREMENTS */}
                {currentStep === 2 && (
                  <div className="space-y-8 pb-10">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                       <Sparkles className="text-[#0A66C2] flex-shrink-0" size={20} />
                       <div>
                          <p className="text-sm font-black text-[#0A66C2] uppercase mb-1">Squad Builder</p>
                          <p className="text-xs text-blue-700/80 font-medium leading-relaxed">Great innovations happen in teams. Define exactly who you're looking for.</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {formData.roles.map((role) => (
                         <RoleInput 
                            key={role.id}
                            role={role}
                            onUpdate={updateRole}
                            onRemove={() => removeRole(role.id)}
                            isRemovable={formData.roles.length > 1}
                         />
                       ))}
                    </div>

                    <button 
                      onClick={addRole}
                      className="w-full py-4 border-2 border-dashed border-[#D9E2ED] text-[#0A66C2] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#F3F6F8] hover:border-[#0A66C2] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add Another Role
                    </button>

                    {suggestedRoles.length > 0 && (
                      <div className="space-y-3">
                         <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Might need:</p>
                         <div className="flex flex-wrap gap-2">
                            {suggestedRoles.map(role => (
                              <button 
                                key={role}
                                onClick={() => {
                                  const id = crypto.randomUUID()
                                  setFormData({...formData, roles: [...formData.roles, { id, role_name: role, skills_required: [], count: 1, experience_level: 'Intermediate' }]})
                                }}
                                className="px-4 py-2 bg-white border border-[#D9E2ED] rounded-xl text-xs font-bold text-gray-600 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all flex items-center gap-2 shadow-sm"
                              >
                                <Plus size={12} /> {role}
                              </button>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: LOGISTICS */}
                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={14} className="text-[#0A66C2]" /> Estimated Timeline
                          </label>
                          <div className="space-y-2">
                             {timelines.map(t => (
                               <button 
                                 key={t}
                                 onClick={() => setFormData({...formData, timeline: t})}
                                 className={clsx(
                                   "w-full p-4 rounded-xl border text-left text-sm font-bold transition-all",
                                   formData.timeline === t ? "bg-[#0A66C2] text-white border-[#0A66C2] shadow-lg shadow-blue-100" : "bg-white border-[#D9E2ED] text-[#666666] hover:bg-gray-50"
                                 )}
                               >
                                 {t}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-xs font-black text-[#666666] uppercase tracking-widest flex items-center gap-2">
                               <Globe size={14} className="text-[#0A66C2]" /> Mode of Work
                            </label>
                            <div className="flex gap-2">
                               {workTypes.map(w => (
                                 <button 
                                   key={w}
                                   onClick={() => setFormData({...formData, work_type: w as any})}
                                   className={clsx(
                                     "flex-grow py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all",
                                     formData.work_type === w ? "bg-black text-white border-black" : "bg-white border-[#D9E2ED] text-[#666666] hover:bg-gray-50"
                                   )}
                                 >
                                   {w}
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-3 pt-6 border-t border-[#F3F2EF]">
                            <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Visibility</p>
                            <div className="p-4 bg-[#F8FAFC] rounded-2xl flex items-center justify-between border border-[#EDF3F8]">
                               <div>
                                  <p className="text-sm font-bold text-black">Multi-Dept Synergy</p>
                                  <p className="text-[10px] font-medium text-[#666666]">Enable students from any dept to join.</p>
                               </div>
                               <button 
                                onClick={() => setFormData({...formData, open_to_all: !formData.open_to_all})}
                                className={clsx(
                                  "h-6 w-12 rounded-full relative transition-colors duration-300",
                                  formData.open_to_all ? "bg-[#0A66C2]" : "bg-gray-300"
                                )}
                               >
                                  <div className={clsx(
                                    "absolute top-1 h-4 w-4 bg-white rounded-full transition-all",
                                    formData.open_to_all ? "right-1" : "left-1"
                                  )} />
                               </button>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & PREVIEW */}
                {currentStep === 4 && (
                  <div className="space-y-10 pb-10">
                    <div className="text-center space-y-2">
                       <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye size={32} />
                       </div>
                       <h3 className="text-xl font-black text-black uppercase tracking-tight">Eagle Eye View</h3>
                       <p className="text-[#666666] font-medium">Please review your innovation details before launching.</p>
                    </div>

                    {/* Preview Card */}
                    <div className="li-card p-6 bg-white border-2 border-[#D9E2ED] shadow-xl rounded-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#EDF3F8] rounded-bl-full -mr-4 -mt-4 opacity-50 transition-all group-hover:scale-110" />
                       
                       <div className="relative space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <h4 className="text-2xl font-black text-black leading-tight">{formData.title}</h4>
                                <div className="flex gap-2">
                                  <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded uppercase tracking-widest">{formData.category}</span>
                                  <span className="text-[9px] font-black bg-[#EDF3F8] text-[#0A66C2] px-2 py-0.5 rounded uppercase tracking-widest">{formData.work_type}</span>
                                </div>
                             </div>
                          </div>

                          <p className="text-sm text-[#666666] font-medium leading-relaxed italic border-l-4 border-[#0A66C2] pl-4">
                             {formData.description}
                          </p>

                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-black uppercase tracking-[0.1em]">Squad Details:</p>
                             <div className="flex flex-wrap gap-2">
                               {formData.roles.map(r => (
                                  <span key={r.id} className="px-3 py-1.5 bg-[#F3F2EF] rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2">
                                    <div className="h-2 w-2 bg-[#0A66C2] rounded-full animate-pulse" />
                                    {r.role_name} ({r.count})
                                  </span>
                               ))}
                             </div>
                          </div>

                          <div className="pt-4 flex justify-between items-center text-[10px] font-black text-[#666666] uppercase tracking-widest border-t border-[#F3F2EF]">
                             <span className="flex items-center gap-1.5"><Calendar size={12} /> {formData.timeline}</span>
                             <span className="flex items-center gap-1.5 text-[#0A66C2]"><Building2 size={12} /> Synergy Enabled</span>
                          </div>
                       </div>
                    </div>

                    {createError && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                         Error: {createError}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-[#F3F2EF] bg-white flex items-center justify-between sticky bottom-0 z-50">
             <button 
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={clsx(
                "h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all",
                currentStep === 1 ? "opacity-0 invisible" : "text-[#666666] hover:bg-gray-50"
              )}
             >
                <ChevronLeft size={20} /> Back
             </button>

             {currentStep === 4 ? (
               <button 
                onClick={handleSubmit}
                disabled={loading}
                className="h-14 px-10 bg-[#0A66C2] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-[#004182] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
               >
                  {loading ? 'Launching...' : 'Create Project'} 
                  {!loading && <ArrowRight size={20} />}
               </button>
             ) : (
               <button 
                onClick={handleNext}
                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                className="h-14 px-10 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-gray-800 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30"
               >
                  Next <ChevronRight size={20} />
               </button>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
