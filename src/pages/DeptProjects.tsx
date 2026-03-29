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
  User,
  Clock,
  MessageSquare,
  CheckCircle2,
  Send,
  Users,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { clsx } from 'clsx'
import ProgressHistory from '../components/ProgressHistory'

interface Project {
  id: string
  title: string
  description: string
  department: string
  user_id: string
  progress: number
  status: string
  team_size: number
  created_at: string
  last_updated_at?: string
  leader_name?: string
  is_duplicate?: boolean
  is_terminated?: boolean
}

interface Member {
  id: string
  full_name: string
  avatar_url: string
}

export default function DeptProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // States
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedProjectUpdates, setSelectedProjectUpdates] = useState<any[]>([])
  const [selectedProjectMembers, setSelectedProjectMembers] = useState<Member[]>([])
  
  // Termination Flow
  const [projectToTerminate, setProjectToTerminate] = useState<Project | null>(null)
  const [terminationStep, setTerminationStep] = useState(0)
  const [confirmValue, setConfirmValue] = useState('')

  const fetchProjects = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      const projectIds = data.map(p => p.id)
      const userIds = [...new Set(data.map(p => p.user_id).filter(Boolean))]
      
      const [profilesRes, membersRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds),
        supabase.from('project_members').select('project_id').in('project_id', projectIds)
      ])

      const profileMap = (profilesRes.data || []).reduce((acc: any, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})

      const memberCounts = (membersRes.data || []).reduce((acc: any, curr) => {
        acc[curr.project_id] = (acc[curr.project_id] || 0) + 1
        return acc
      }, {})

      setProjects(data.map(p => ({
        ...p,
        leader_name: profileMap[p.user_id]?.full_name || "Project Leader",
        team_size: memberCounts[p.id] || 1,
        is_duplicate: p.title.toLowerCase().includes('solar'),
        is_terminated: p.status === 'Terminated'
      })))
    }
    setLoading(false)
    setRefreshing(false)
  }

  const fetchProjectDetails = async (projectId: string) => {
    // 1. Fetch History
    const { data: updates } = await supabase
      .from('project_updates')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (updates) setSelectedProjectUpdates(updates)

    // 2. Fetch Members
    const { data: memberEntries } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId)
    
    if (memberEntries && memberEntries.length > 0) {
      const userIds = memberEntries.map(m => m.user_id)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)
      
      if (profiles) setSelectedProjectMembers(profiles)
    } else {
      setSelectedProjectMembers([])
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) fetchProjectDetails(selectedProject.id)
  }, [selectedProject])

  const handleTerminate = async () => {
    if (!projectToTerminate || confirmValue !== 'CONFIRM') return
    const { error } = await supabase.from('projects').update({ status: 'Terminated' }).eq('id', projectToTerminate.id)
    if (!error) {
       setProjects(projects.map(p => p.id === projectToTerminate.id ? { ...p, status: 'Terminated', is_terminated: true } : p))
       setProjectToTerminate(null)
       setTerminationStep(0)
    }
  }

  const handleFlag = async (id: string) => {
    const { error } = await supabase.from('projects').update({ status: 'Needs Review' }).eq('id', id)
    if (!error) setProjects(projects.map(p => p.id === id ? { ...p, is_duplicate: true, status: 'Needs Review' } : p))
  }

  const isStuck = (p: Project) => {
    const lastUpdate = new Date(p.last_updated_at || p.created_at)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return lastUpdate < weekAgo && p.status !== 'Completed' && p.status !== 'Terminated'
  }

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && p.status === 'Active') || 
      (filterStatus === 'Completed' && p.status === 'Completed') ||
      (filterStatus === 'Terminated' && p.status === 'Terminated') ||
      (filterStatus === 'Review' && p.status === 'Needs Review') ||
      (filterStatus === 'Stuck' && isStuck(p))
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse tracking-[0.2em] uppercase">Loading Repository...</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* INSTITUTIONAL AUDIT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
               className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-5 h-[85vh]"
             >
                {/* Left Panel: Info & Squad */}
                <div className="lg:col-span-2 p-10 bg-gray-50/50 border-r border-gray-100 flex flex-col space-y-10 overflow-y-auto custom-scrollbar">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="h-16 w-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">{selectedProject.title.charAt(0)}</div>
                         <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-gray-100 rounded-xl lg:hidden"><X /></button>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none uppercase italic">{selectedProject.title}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">PROJECT ID: {selectedProject.id}</p>
                   </div>

                   {/* DESCRIPTION */}
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2"><MessageSquare size={14} /> Mission Description</h4>
                      <p className="text-gray-700 font-bold leading-relaxed border-l-4 border-blue-600 pl-6 py-2 bg-white/40 rounded-r-2xl text-lg italic uppercase tracking-tighter">
                        "{selectedProject.description || 'Connecting innovation streams for research synergy...'}"
                      </p>
                   </div>

                   {/* SQUAD DETAILS */}
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2"><Users size={14} /> Squad Members</h4>
                      <div className="space-y-3">
                         {selectedProjectMembers.length === 0 ? (
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                               <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><User size={20} /></div>
                               <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Founder</p>
                                  <p className="text-sm font-black text-gray-900 leading-none">{selectedProject.leader_name}</p>
                               </div>
                            </div>
                         ) : (
                            selectedProjectMembers.map((member) => (
                              <div key={member.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                                 <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <User size={20} />
                                 </div>
                                 <div className="flex-grow">
                                    <p className="text-sm font-black text-gray-900 leading-none">{member.full_name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">
                                       {member.id === selectedProject.user_id ? 'Project Leader' : 'Collaboration Specialist'}
                                    </p>
                                 </div>
                              </div>
                            ))
                         )}
                      </div>
                   </div>

                   <div className="mt-auto pt-10 space-y-4">
                      <button className="w-full py-5 bg-gray-900 text-white font-black rounded-[20px] flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                         <Send size={14} /> Send message to squad
                      </button>
                      <button onClick={() => setSelectedProject(null)} className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">Close Audit Engine</button>
                </div>
                </div>

                {/* Right Panel: Live Progress */}
                <div className="lg:col-span-3 p-10 space-y-12 overflow-y-auto custom-scrollbar">
                   <div className="space-y-8">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Institutional Progress Monitor</h4>
                         <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                            selectedProject.progress === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>{selectedProject.status || 'Active'}</span>
                      </div>
                      <div className="space-y-5 bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                         <div className="flex justify-between items-end">
                            <span className="text-5xl font-black text-gray-900 leading-none tracking-tighter">{selectedProject.progress || 0}%</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                               <RefreshCw size={12} className="animate-spin-slow" /> DATA SYNCHRONIZED
                            </span>
                         </div>
                         <div className="h-5 bg-white rounded-full overflow-hidden border border-gray-200 p-1 shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedProject.progress || 0}%` }} className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Innovation Milestone Story</h4>
                      <ProgressHistory updates={selectedProjectUpdates} />
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto px-6 py-16 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
           <div className="space-y-3">
              <h1 className="text-6xl font-black text-gray-900 tracking-tighter italic uppercase">Audit Repository</h1>
              <p className="text-gray-400 font-bold text-xl leading-relaxed">Full institutional oversight for student innovations</p>
           </div>
           <button onClick={fetchProjects} className="px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black text-gray-600 shadow-sm hover:shadow-md transition-all uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> REFRESH DATA
           </button>
        </header>

        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
           <div className="relative flex-grow w-full">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search innovations across campus..." className="w-full h-16 pl-16 pr-6 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-gray-800" />
           </div>
           <div className="flex items-center gap-2 bg-gray-50 px-6 rounded-2xl border-transparent h-16 transition-all">
              <Layers size={18} className="text-gray-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-transparent outline-none text-[11px] font-black text-gray-800 cursor-pointer pr-4 uppercase tracking-[0.2em]">
                 <option value="All">All Projects</option>
                 <option value="Active">Active</option>
                 <option value="Completed">Completed</option>
                 <option value="Stuck">Stuck (No updates)</option>
              </select>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {filtered.map((p) => (
             <motion.div key={p.id} layout className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter leading-none italic">{p.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span className="text-gray-900 font-bold">{p.leader_name}</span> • <Building size={12} className="text-blue-600" /> {p.department}
                      </div>
                   </div>
                   {isStuck(p) && (
                      <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2 animate-pulse">
                         <AlertCircle size={14} /> Stuck
                      </div>
                   )}
                </div>

                {/* PROJECT DESCRIPTION PREVIEW */}
                <p className="text-gray-500 font-bold text-sm mb-8 line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                   "{p.description || "Building the next generation of campus innovation..."}"
                </p>

                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Live Build: {(p.progress || 0)}%</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stage: {p.status || 'Active'}</span>
                   </div>
                   <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${p.progress || 0}%` }}
                        className={clsx("h-full rounded-full transition-all shadow-md", p.status === 'Completed' ? "bg-emerald-500 shadow-emerald-500/10" : "bg-blue-600 shadow-blue-500/10")}
                      />
                   </div>
                </div>

                <div className="flex items-center gap-3 pt-8 border-t border-gray-50">
                   <button onClick={() => setSelectedProject(p)} className="flex-grow py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[24px] hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10">Review Audit</button>
                   <button onClick={() => navigate(`/project/${p.id}`)} className="p-5 bg-blue-50 text-blue-600 rounded-[20px] hover:bg-blue-600 hover:text-white transition-all shadow-sm"><ChevronRight size={20} /></button>
                </div>

                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                   <Layers size={140} />
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  )
}
