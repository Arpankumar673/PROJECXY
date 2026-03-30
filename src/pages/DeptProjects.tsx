import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  MoreVertical,
  X,
  Target,
  Users,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Zap,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ProgressHistory from '../components/ProgressHistory'
import { clsx } from 'clsx'

export default function DeptProjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal Data
  const [selectedProjectMembers, setSelectedProjectMembers] = useState<any[]>([])
  const [selectedProjectHistory, setSelectedProjectHistory] = useState<any[]>([])

  const fetchProjects = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[PROJECXY DEPT]: Project Fetch Error:', error.message)
    } else {
      setProjects(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects()

    // Real-time listener for project changes
    const projectSub = supabase
      .channel('dept-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects()
      })
      .subscribe()

    return () => { supabase.removeChannel(projectSub) }
  }, [])

  const fetchProjectDetails = async (project: any) => {
    setSelectedProject(project)
    
    // 1. Fetch Members
    const { data: membersList } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', project.id)
    
    if (membersList && membersList.length > 0) {
      const uids = membersList.map(m => m.user_id)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', uids)
      setSelectedProjectMembers(profiles || [])
    } else {
      setSelectedProjectMembers([])
    }

    // 2. Fetch History (Using correct table: progress_updates)
    const { data: history } = await supabase
      .from('progress_updates')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
    
    setSelectedProjectHistory(history || [])
  }

  const handleTerminate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedProject) return
    const { error } = await supabase
      .from('projects')
      .update({ status: 'Terminated' })
      .eq('id', selectedProject.id)
    
    if (!error) {
      alert('Project Terminated Successfully')
      setSelectedProject(null)
      fetchProjects()
    }
  }

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Duplicate Check logic (Demo)
  const isDuplicate = (title: string) => {
    return projects.filter(p => p.title.toLowerCase() === title.toLowerCase()).length > 1
  }

  // Stuck Project logic (Demo - no update in 7 days)
  const isStuck = (lastUpdated: string) => {
    if (!lastUpdated) return true
    const lastDate = new Date(lastUpdated)
    const diffDays = (new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    return diffDays > 7
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-black p-10 rounded-[40px] text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000"><Zap size={240} /></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="h-2 w-10 bg-blue-500 rounded-full" />
             <h1 className="text-4xl font-black italic tracking-tighter uppercase">Audit Registry</h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs px-1">Institutional Project Oversight Hub</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter innovations..." 
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:bg-white/10 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-gray-400 focus:bg-white/10 outline-none transition-all cursor-pointer uppercase tracking-widest"
          >
            <option value="All">Global Feed</option>
            <option value="Active">Operational</option>
            <option value="Completed">Success</option>
            <option value="Terminated">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-gray-50 rounded-[40px] border border-gray-100 animate-pulse" />
          ))
        ) : filteredProjects.map((p) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onClick={() => fetchProjectDetails(p)}
            className="li-card p-10 bg-white border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden group/card"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="space-y-4">
                  <div className={clsx(
                    "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    p.status === 'Completed' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'
                  )}>
                    {p.status === 'Completed' ? <Zap size={28} /> : <Terminal size={28} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-tight group-hover/card:text-blue-600 transition-colors line-clamp-1">{p.title}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{p.department || 'GLOBAL RESEARCH'}</p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <span className={clsx(
                    "px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border",
                    p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm'
                  )}>
                    {p.status || 'Active'}
                  </span>
                  {p.progress === 100 && (
                    <div className="p-1.5 bg-yellow-400 text-black rounded-lg shadow-lg">
                      <ShieldCheck size={14} />
                    </div>
                  )}
               </div>
            </div>

            <p className="text-gray-500 font-bold text-sm mb-8 line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 pl-4">
               "{p.description || "Building the next generation of campus innovation protocols..."}"
            </p>

            <div className="space-y-5 relative z-10">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                  <span className="text-gray-400">Hub Syncing</span>
                  <span className="text-gray-900">{(p.progress || 0)}% Success</span>
               </div>
               <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-[3px] shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress || 0}%` }}
                    className={clsx(
                      "h-full rounded-full shadow-lg",
                      p.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                    )}
                  />
               </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
               <div className="flex -space-x-4">
                  {/* Visual indication of squad activity */}
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 bg-gray-100 rounded-xl border-4 border-white flex items-center justify-center text-[10px] font-black text-gray-400"><User size={16} /></div>
                  ))}
               </div>
               <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:translate-x-1 transition-transform group/btn">
                  Full Audit <ArrowRight size={14} className="group-hover/btn:scale-125 transition-transform" />
               </button>
            </div>

            {isStuck(p.updated_at) && (
              <div className="absolute top-4 right-4 animate-pulse"><ShieldAlert size={18} className="text-rose-500" /></div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white w-full max-w-[1200px] h-[90vh] rounded-[48px] shadow-3xl overflow-hidden relative z-10 flex flex-col lg:flex-row pointer-events-auto border border-white/20"
            >
              {/* Left Side: Identity & Mission */}
              <div className="w-full lg:w-[450px] bg-gray-900 text-white p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none"><Terminal size={240} /></div>
                 <div className="space-y-12 relative z-10">
                    <button onClick={() => setSelectedProject(null)} className="h-14 w-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all border border-white/10"><X size={24} /></button>
                    
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{selectedProject.title}</h2>
                          <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">Innovation Audit Log</p>
                       </div>
                       <p className="text-gray-400 font-bold text-lg leading-relaxed italic border-l-4 border-blue-600 pl-8 py-2 uppercase tracking-tighter">
                          "{selectedProject.description || "Building the next generation of campus innovation protocols..."}"
                       </p>
                    </div>
                 </div>

                 <div className="relative z-10 space-y-10 pt-12 border-t border-white/5">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center text-blue-500 shadow-inner border border-white/10"><Users size={32} /></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SQUAD REGISTRY</p>
                          <div className="flex gap-2 mt-3">
                             {selectedProjectMembers.map(m => (
                               <div key={m.id} className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden"><User size={20} /></div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <button onClick={handleTerminate} className="h-16 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-rose-900/40 uppercase text-xs tracking-widest flex items-center justify-center gap-3">
                          <ShieldAlert size={20} /> Terminate Innovation
                       </button>
                    </div>
                 </div>
              </div>

              {/* Right Side: High-Fidelity Progress Registry */}
              <div className="flex-grow bg-gray-50 p-10 lg:p-16 overflow-y-auto custom-scrollbar space-y-12">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-10">
                    <div className="space-y-2">
                       <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Audit Timeline</h3>
                       <div className="flex items-center gap-4">
                          <span className="text-5xl font-black text-gray-900 italic tracking-tighter">{(selectedProject.progress || 0)}%</span>
                          <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic">{selectedProject.status || 'Active'}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Sync</p>
                          <p className="text-sm font-black text-gray-900 uppercase">INSTANTANEOUS</p>
                       </div>
                       <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100"><CheckCircle2 size={32} /></div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <ProgressHistory updates={selectedProjectHistory} />
                    {selectedProjectHistory.length === 0 && (
                      <div className="p-16 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200 space-y-4">
                         <Clock size={40} className="mx-auto text-gray-200" />
                         <p className="text-gray-900 font-black uppercase tracking-widest text-xs">No Movement Logged</p>
                         <p className="text-gray-400 font-bold text-sm italic italic">The innovations team has not synchronized their milestones yet.</p>
                      </div>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
