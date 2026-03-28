import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  ChevronRight, 
  Search, 
  Filter,
  X,
  User,
  ExternalLink,
  ShieldAlert
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
  founder_name?: string
  roles?: string[]
}

export default function DepartmentDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Departments')

  useEffect(() => {
    async function fetchAllProjects() {
      // In a real app, we'd join with profiles, but here we'll mock founder names for the dashboard
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setProjects(data.map(p => ({
          ...p,
          founder_name: "Innovator #" + p.founder_id.slice(0,4), // Mocked for privacy/simplicity
          team_size: Math.floor(Math.random() * 5) + 1, // Mocked team size
          roles: ['Lead Developer', 'UI/UX Designer', 'Documentation']
        })))
      }
      setLoading(false)
    }

    fetchAllProjects()
  }, [])

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = selectedDept === 'All Departments' || p.department === selectedDept
    return matchesSearch && matchesDept
  })

  // Duplicate Detection Logic (Titles that appear more than once)
  const duplicateTitles = projects.reduce((acc: any, curr) => {
    const title = curr.title.toLowerCase().trim()
    acc[title] = (acc[title] || 0) + 1
    return acc
  }, {})

  const stats = {
    total: projects.length,
    active: projects.filter(p => (p.progress || 0) < 100).length,
    completed: projects.filter(p => (p.progress || 0) === 100).length
  }

  const departments = ['All Departments', ...new Set(projects.map(p => p.department))]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Dashboard Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-[#0A66C2]">
          <LayoutDashboard size={24} />
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Department Oversight</h1>
        </div>
        <p className="text-[#666666] font-medium text-sm">Monitor campus-wide innovation and research progress.</p>
      </header>

      {/* 2. Overview Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Projects', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Innovation', value: stats.active, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed Phases', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="li-card p-6 bg-white border-[#D9E2ED] shadow-sm flex items-center gap-6">
             <div className={clsx("h-14 w-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={28} />
             </div>
             <div>
                <p className="text-sm font-black text-[#666666] uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-black">{stat.value}</p>
             </div>
          </div>
        ))}
      </section>

      {/* 3. Filters & Controls */}
      <section className="li-card p-4 bg-white border-[#D9E2ED] flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all projects..."
            className="w-full h-11 pl-10 pr-4 bg-[#F3F6F9] border-none rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#0A66C2] focus:bg-white transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter size={18} className="text-[#666666] hidden sm:block" />
           <select 
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
             className="h-11 px-4 bg-[#F3F6F9] border-none rounded-lg text-sm font-bold text-[#666666] focus:ring-1 focus:ring-[#0A66C2] outline-none cursor-pointer"
           >
             {departments.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
        </div>
      </section>

      {/* 4. Projects Master List */}
      <section className="li-card overflow-hidden bg-white border-[#D9E2ED] shadow-md">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-[#F3F6F9] border-b border-[#D9E2ED]">
                 <th className="p-4 text-[10px] font-black text-[#666666] uppercase tracking-widest">Project / Founder</th>
                 <th className="p-4 text-[10px] font-black text-[#666666] uppercase tracking-widest">Department</th>
                 <th className="p-4 text-[10px] font-black text-[#666666] uppercase tracking-widest">Progress</th>
                 <th className="p-4 text-[10px] font-black text-[#666666] uppercase tracking-widest">Duplicate Check</th>
                 <th className="p-4 text-[10px] font-black text-[#666666] uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#F3F2EF]">
               {filteredProjects.map((p) => {
                 const isDuplicate = duplicateTitles[p.title.toLowerCase().trim()] > 1
                 return (
                   <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors group">
                     <td className="p-4">
                        <div className="space-y-0.5">
                           <p className="font-extrabold text-black text-[15px] leading-tight group-hover:text-[#0A66C2] transition-colors">{p.title}</p>
                           <p className="text-xs text-[#666666] font-medium flex items-center gap-1.5"><User size={12} /> {p.founder_name}</p>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className="text-[10px] font-black text-[#0A66C2] bg-[#EDF3F8] px-2.5 py-1 rounded-sm uppercase">{p.department}</span>
                     </td>
                     <td className="p-4">
                        <div className="w-32 space-y-1.5">
                           <div className="flex justify-between items-center text-[9px] font-black text-[#666666]">
                              <span>{p.progress || 0}%</span>
                              <span className="uppercase">{p.progress === 100 ? 'Final' : 'In Dev'}</span>
                           </div>
                           <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0A66C2] transition-all duration-1000"
                                style={{ width: `${p.progress || 0}%` }}
                              />
                           </div>
                        </div>
                     </td>
                     <td className="p-4">
                        {isDuplicate ? (
                          <div className="flex items-center gap-1.5 text-red-600 animate-pulse">
                             <AlertTriangle size={14} />
                             <span className="text-[10px] font-black uppercase">Collision Risk</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                             <CheckCircle size={14} />
                             <span className="text-[10px] font-black uppercase">Unique</span>
                          </div>
                        )}
                     </td>
                     <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedProject(p)}
                          className="h-9 w-9 bg-white border border-[#D9E2ED] rounded-lg flex items-center justify-center text-[#666666] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-sm"
                        >
                           <ChevronRight size={18} />
                        </button>
                     </td>
                   </tr>
                 )
               })}
             </tbody>
           </table>
         </div>
         {filteredProjects.length === 0 && (
           <div className="p-12 text-center space-y-2">
              <ShieldAlert size={40} className="mx-auto text-[#D9E2ED]" />
              <p className="text-[#666666] font-black uppercase tracking-widest text-xs">No matching projects found</p>
           </div>
         )}
      </section>

      {/* 5. Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedProject(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
             >
                <div className="bg-[#0A66C2] p-8 text-white relative">
                   <button onClick={() => setSelectedProject(null)} className="absolute right-6 top-6 p-2 hover:bg-white/20 rounded-full transition-colors">
                      <X size={24} />
                   </button>
                   <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">{selectedProject.department}</span>
                      <h2 className="text-4xl font-black uppercase tracking-tight leading-none">{selectedProject.title}</h2>
                      <div className="flex items-center gap-4 text-sm font-bold opacity-80">
                         <span className="flex items-center gap-1.5"><User size={16} /> Founder: {selectedProject.founder_name}</span>
                         <span className="flex items-center gap-1.5"><Users size={16} /> Team: {selectedProject.team_size} Members</span>
                      </div>
                   </div>
                </div>

                <div className="p-8 space-y-8">
                   <div className="space-y-3">
                      <h3 className="text-xs font-black text-[#666666] uppercase tracking-widest">Project Mandate</h3>
                      <p className="text-[#000000e6] font-medium leading-relaxed">{selectedProject.description}</p>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <h3 className="text-xs font-black text-[#666666] uppercase tracking-widest">Core Roles</h3>
                         <div className="space-y-2">
                            {selectedProject.roles?.map((role, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm font-bold text-black bg-[#F3F6F9] px-3 py-2 rounded-lg">
                                 <CheckCircle size={14} className="text-[#0A66C2]" /> {role}
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-xs font-black text-[#666666] uppercase tracking-widest">Milestone Tracking</h3>
                         <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-black text-black uppercase">Current Completion</span>
                              <span className="text-2xl font-black text-[#0A66C2]">{selectedProject.progress}%</span>
                           </div>
                           <div className="h-3 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${selectedProject.progress}%` }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-[#0A66C2] to-[#004182]" 
                              />
                           </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-[#F3F2EF] flex justify-between items-center">
                      <p className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">Registered on: {new Date(selectedProject.created_at).toLocaleDateString()}</p>
                      <button className="h-10 px-8 bg-[#0A66C2] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#0A66C2]/20">
                         Audit full project <ExternalLink size={14} />
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
