import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building,
  AlertCircle,
  RefreshCw,
  X,
  Layers,
  Trash2,
  SearchIcon,
  Flag,
  User
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { clsx } from 'clsx'

interface Project {
  id: string
  title: string
  description: string
  department: string
  founder_id: string
  progress: number
  status: string
  team_size: number
  created_at: string
  leader_name?: string
  is_duplicate?: boolean
  is_terminated?: boolean
}

export default function DeptProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // States
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  // Termination Flow
  const [projectToTerminate, setProjectToTerminate] = useState<Project | null>(null)
  const [terminationStep, setTerminationStep] = useState(0) // 0: None, 1: Warning, 2: Confirm Text
  const [confirmValue, setConfirmValue] = useState('')

  const fetchProjects = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setProjects(data.map(p => ({
        ...p,
        leader_name: "Leader #" + p.founder_id.slice(0, 4),
        team_size: Math.floor(Math.random() * 5) + 3,
        is_duplicate: p.title.toLowerCase().includes('solar'),
        is_terminated: p.status === 'Terminated'
      })))
    }
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Action: Terminate Project
  const handleTerminate = async () => {
    if (!projectToTerminate || confirmValue !== 'CONFIRM') return
    
    const { error } = await supabase
      .from('projects')
      .update({ status: 'Terminated' })
      .eq('id', projectToTerminate.id)

    if (!error) {
       setProjects(projects.map(p => p.id === projectToTerminate.id ? { ...p, status: 'Terminated', is_terminated: true } : p))
       setProjectToTerminate(null)
       setTerminationStep(0)
       setConfirmValue('')
    }
  }

  // Action: Flag Duplicate
  const handleFlag = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'Needs Review' })
      .eq('id', id)
    
    if (!error) {
       setProjects(projects.map(p => p.id === id ? { ...p, is_duplicate: true, status: 'Needs Review' } : p))
    }
  }

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && p.status === 'Active') || 
      (filterStatus === 'Completed' && p.status === 'Completed') ||
      (filterStatus === 'Terminated' && p.status === 'Terminated') ||
      (filterStatus === 'Review' && p.status === 'Needs Review')
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse tracking-[0.2em] uppercase">Loading Repository...</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
             >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">{selectedProject.title.charAt(0)}</div>
                      <div>
                         <h3 className="text-xl font-black text-gray-900 leading-none">{selectedProject.title}</h3>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Key: {selectedProject.id.slice(0, 8)}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={24} /></button>
                </div>
                <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
                   <div className="space-y-3">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">📌 Project Info</h4>
                       <p className="text-gray-700 leading-relaxed font-bold italic">"{selectedProject.description || 'No detailed record available.'}"</p>
                       <div className="flex items-center gap-4 pt-2">
                          <span className="text-xs font-bold text-gray-400">Created: {new Date(selectedProject.created_at).toLocaleDateString()}</span>
                          <span className="text-xs font-bold text-gray-400">Dept: {selectedProject.department}</span>
                       </div>
                   </div>
                   
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">👥 Team Information</h4>
                      <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><User size={20} /></div>
                                <span className="font-bold text-gray-900">{selectedProject.leader_name}</span>
                             </div>
                             <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Founder / Lead</span>
                         </div>
                         <div className="pt-4 border-t border-gray-100">
                             <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-widest leading-none">+ {selectedProject.team_size - 1} Collaborative Members Joined</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">📊 Progress Analytics</h4>
                      <div className="space-y-2">
                         <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{selectedProject.progress}% Milestone Reached</span>
                            <span className="text-[10px] font-bold text-gray-400">Current Stage: Research & Development</span>
                         </div>
                         <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedProject.progress}%` }} className="h-full bg-blue-600" />
                         </div>
                      </div>
                   </div>
                </div>
                <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                   <button onClick={() => setSelectedProject(null)} className="px-12 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all active:scale-95 uppercase text-xs tracking-[0.2em]">Close Audit</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TERMINATE PROJECT MODAL (DOUBLE VERIFICATION) */}
      <AnimatePresence>
        {projectToTerminate && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[300] bg-rose-600/20 backdrop-blur-xl flex items-center justify-center p-6"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-rose-100 overflow-hidden"
              >
                 {terminationStep === 1 ? (
                   <div className="p-10 space-y-8 text-center">
                      <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                         <AlertCircle size={40} />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">Irreversible Action</h3>
                         <p className="text-gray-500 font-bold leading-relaxed px-4">Are you sure you want to terminate <strong>"{projectToTerminate.title}"</strong>? Students will lose all access.</p>
                      </div>
                      <div className="flex flex-col gap-3">
                         <button onClick={() => setTerminationStep(2)} className="w-full py-4 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 uppercase text-xs tracking-widest">Continue Termination</button>
                         <button onClick={() => { setProjectToTerminate(null); setTerminationStep(0); }} className="w-full py-4 bg-white text-gray-400 font-black rounded-xl hover:bg-gray-50 transition border border-gray-100 uppercase text-xs tracking-widest">Cancel Action</button>
                      </div>
                   </div>
                 ) : (
                   <div className="p-10 space-y-8">
                      <div className="text-center space-y-2">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Identity Verification</h3>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type CONFIRM to finalize termination</p>
                      </div>
                      <div className="space-y-2">
                         <input 
                           value={confirmValue}
                           onChange={e => setConfirmValue(e.target.value)}
                           placeholder="Type CONFIRM"
                           className="w-full h-16 bg-gray-50 rounded-2xl border border-gray-200 text-center font-black text-xl text-rose-600 tracking-[0.2em] outline-none focus:ring-4 focus:ring-rose-100 transition-all uppercase placeholder:text-gray-300 placeholder:tracking-normal"
                         />
                      </div>
                      <button 
                        disabled={confirmValue !== 'CONFIRM'}
                        onClick={handleTerminate}
                        className="w-full py-5 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition shadow-2xl shadow-rose-500/30 disabled:opacity-30 disabled:grayscale uppercase text-xs tracking-[0.3em]"
                      >
                         Terminate Project
                      </button>
                      <button onClick={() => setTerminationStep(1)} className="w-full text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">← Go Back</button>
                   </div>
                 )}
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto px-6 py-16 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
           <div className="space-y-3">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">Institutional Control</h1>
              <p className="text-gray-400 font-bold text-xl leading-relaxed">
                 Manage and audit all campus projects in real-time
              </p>
           </div>
           <button onClick={fetchProjects} className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black text-gray-600 shadow-sm hover:shadow-md transition-all active:scale-95 uppercase tracking-widest">
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> Audit Archive
           </button>
        </div>

        {/* 6. ADD FILTER FOR STATUS */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
           <div className="relative flex-grow w-full">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search across all projects..."
                className="w-full h-16 pl-16 pr-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-gray-800 shadow-inner"
              />
           </div>
           
           <div className="flex items-center gap-2 bg-gray-50 px-6 rounded-2xl border border-transparent h-16 group transition-all">
              <Layers size={18} className="text-gray-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-transparent outline-none text-[11px] font-black text-gray-800 cursor-pointer pr-4 uppercase tracking-[0.2em]">
                 <option value="All">All Projects</option>
                 <option value="Active">Active</option>
                 <option value="Completed">Completed</option>
                 <option value="Terminated">Terminated</option>
                 <option value="Review">Needs Review</option>
              </select>
           </div>
        </section>

        {/* Audit Registry */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">All Campus Projects</h2>
              <div className="h-[1px] bg-gray-200 flex-grow mx-8" />
              <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{filtered.length} Indexed</div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((p) => (
                <motion.div 
                  layout
                  key={p.id}
                  whileHover={{ y: -6 }}
                  className={clsx(
                    "bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative",
                    p.status === 'Terminated' && "grayscale opacity-80"
                  )}
                >
                  <div className="flex justify-between items-start mb-8">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter leading-none">{p.title}</h3>
                        <div className="flex items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                           <Building size={14} className="text-blue-600" /> {p.department}
                        </div>
                     </div>
                     <span className={clsx(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border",
                       p.status === 'Terminated' ? "bg-rose-50 text-rose-600 border-rose-100" :
                       p.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                       "bg-blue-50 text-blue-600 border-blue-100"
                     )}>
                       {p.status}
                     </span>
                  </div>

                  <div className="space-y-8 mb-10">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-transparent group-hover:border-gray-100 transition-all">
                           <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-bold">L</div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Leader</p>
                              <p className="text-sm font-bold text-gray-900 leading-none">{p.leader_name}</p>
                           </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-transparent group-hover:border-gray-100 transition-all">
                           <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 font-bold tracking-tighter">+{p.team_size - 1}</div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Members</p>
                              <p className="text-sm font-bold text-gray-900 leading-none">Collaborative</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Institutional Progress</span>
                           <span className="text-lg font-black text-gray-900 leading-none">{p.progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${p.progress}%` }}
                             className={clsx("h-full", p.status === 'Terminated' ? 'bg-gray-400' : p.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600')} 
                            />
                        </div>
                     </div>
                  </div>

                  {/* 5. TERMINATED LABEL */}
                  {p.status === 'Terminated' && (
                     <div className="absolute inset-x-0 bottom-4 text-center">
                        <span className="px-6 py-2 bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full shadow-lg shadow-rose-600/20">Terminated by Department</span>
                     </div>
                  )}

                  <div className="flex items-center gap-3 pt-8 border-t border-gray-50">
                     <button onClick={() => setSelectedProject(p)} className="flex-grow py-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all active:scale-95 border border-transparent group-hover:border-gray-200">View Details</button>
                     <button disabled={p.status === 'Terminated'} className="flex-grow py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-20 disabled:grayscale">Review</button>
                     
                     <div className="flex gap-2">
                        {/* 8. FLAG DUPLICATE */}
                        <button 
                          disabled={p.status === 'Terminated' || p.is_duplicate}
                          onClick={() => handleFlag(p.id)}
                          className={clsx(
                             "p-4 rounded-2xl transition-all active:scale-90 border",
                             p.is_duplicate ? "bg-amber-100 border-amber-200 text-amber-600" : "bg-gray-50 border-transparent text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                          )}
                        >
                           <Flag size={20} className={p.is_duplicate ? "fill-amber-600" : ""} />
                        </button>
                        
                        {/* 2. TERMINATE BUTTON */}
                        <button 
                          disabled={p.status === 'Terminated'}
                          onClick={() => { setProjectToTerminate(p); setTerminationStep(1); }}
                          className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-90 border border-rose-100 disabled:opacity-20 disabled:grayscale"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </section>

      </div>
    </div>
  )
}
