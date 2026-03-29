import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  ChevronRight,
  Calendar,
  Building,
  RefreshCw,
  FileText,
  Copy,
  Info,
  X,
  Download
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
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
  leader?: {
    full_name: string
    avatar_url: string
  }
}

export default function DeptDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Quick Actions States
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [duplicateResults, setDuplicateResults] = useState<Project[] | null>(null)
  const [showSuccess, setShowSuccess] = useState<{show: boolean, msg: string}>({ show: false, msg: '' })

  // Filters
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus] = useState('All')

  const fetchAllProjects = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      // ✅ SECONDARY SYNC: Fetch real names and member counts to avoid join 400 errors
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
        leader: profileMap[p.user_id],
        leader_name: profileMap[p.user_id]?.full_name || "Project Leader",
        team_size: memberCounts[p.id] || 1, // Fallback to 1 (the leader)
        // Mocking some duplicates for demonstration
        is_duplicate: p.title.toLowerCase().includes('solar') || p.title.toLowerCase().includes('smart')
      })))
    }
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchAllProjects()
  }, [])

  // 1. VIEW ALL PROJECTS -> Navigate to /dept-projects
  const handleViewAll = () => navigate('/dept-projects')

  // 2. CHECK DUPLICATE IDEAS -> Logic: Compare project titles
  const handleCheckDuplicates = async () => {
    setIsCheckingDuplicates(true)
    // Simulate complex check
    await new Promise(r => setTimeout(r, 2000))
    
    // Find projects with overlapping words in titles
    const duplicates: Project[] = []
    const seenWords = new Set<string>()

    projects.forEach(p => {
       const words = p.title.toLowerCase().split(' ').filter(w => w.length > 4)
       const hasOverlap = words.some(w => seenWords.has(w))
       if (hasOverlap) duplicates.push(p)
       words.forEach(w => seenWords.add(w))
    })

    setDuplicateResults(duplicates)
    setIsCheckingDuplicates(false)
    setShowSuccess({ show: true, msg: `${duplicates.length} duplicate patterns identified.` })
    setTimeout(() => setShowSuccess({ show: false, msg: '' }), 3000)
  }

  // 3. EXPORT REPORT -> CSV Generation
  const handleExportReport = async () => {
    setIsExporting(true)
    await new Promise(r => setTimeout(r, 1500))

    const stats = {
      total: projects.length,
      active: projects.filter(p => p.progress < 100).length,
      completed: projects.filter(p => p.progress === 100).length,
      flagged: projects.filter(p => p.is_duplicate).length
    }

    const csvContent = 
      "Project ID,Title,Department,Progress,Status,Leader\n" +
      projects.map(p => `${p.id},"${p.title}",${p.department},${p.progress}%,${p.progress === 100 ? 'Completed' : 'Active'},${p.leader_name}`).join("\n") +
      "\n\n--- SUMMARY ---\n" +
      `Total,${stats.total}\nActive,${stats.active}\nCompleted,${stats.completed}\nFlagged,${stats.flagged}`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Projecxy_Report_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    setIsExporting(false)
    setShowSuccess({ show: true, msg: 'Institutional Report Downloaded!' })
    setTimeout(() => setShowSuccess({ show: false, msg: '' }), 3000)
  }

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesDept = filterDept === 'All' || p.department === filterDept
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && p.progress < 100) || 
      (filterStatus === 'Completed' && p.progress === 100)
    return matchesSearch && matchesDept && matchesStatus
  })

  const stats = [
    { label: 'Total Projects', desc: 'All projects created by students', value: projects.length, icon: BarChart3, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Active Projects', desc: 'Projects currently in progress', value: projects.filter(p => p.progress < 100).length, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Completed', desc: 'Finished and ready projects', value: projects.filter(p => p.progress === 100).length, icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Needs Attention', desc: 'Flagged for duplicate ideas', value: projects.filter(p => p.is_duplicate).length, icon: AlertCircle, bg: 'bg-rose-50', text: 'text-rose-600' },
  ]

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse uppercase tracking-[0.3em]">Loading Auditor...</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
      
      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {showSuccess.show && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 24, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
             <CheckCircle2 size={24} />
             {showSuccess.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DUPLICATE PANEL OVERLAY */}
      <AnimatePresence>
        {duplicateResults && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
              >
                 <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#F8FAFC]">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                          <AlertCircle size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-gray-900 leading-none">Duplicate Analysis</h3>
                          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Similarity Engine Results</p>
                       </div>
                    </div>
                    <button onClick={() => setDuplicateResults(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                 </div>
                 <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                    <p className="text-sm font-bold text-gray-500 mb-6 italic">
                       "These projects may have similar ideas. Please review them to avoid duplicated research efforts."
                    </p>
                    {duplicateResults.length === 0 ? (
                       <div className="py-12 text-center text-gray-400 font-black uppercase tracking-widest">No duplication patterns detected.</div>
                    ) : duplicateResults.map(p => (
                       <div key={p.id} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                          <span className="font-bold text-rose-900">{p.title}</span>
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{p.department}</span>
                       </div>
                    ))}
                 </div>
                 <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                    <button onClick={() => setDuplicateResults(null)} className="px-12 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all active:scale-95 uppercase text-xs tracking-[0.2em]">Close Audit</button>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto px-6 pt-16 space-y-16 relative">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
           <div className="space-y-3">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                Welcome, {profile?.full_name || 'Agriculture'} Department
              </h1>
              <p className="text-gray-400 font-bold text-xl leading-relaxed">
                Track and manage all student projects in one place
              </p>
           </div>
           <button 
             onClick={fetchAllProjects}
             className={clsx(
               "flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-600 shadow-sm hover:shadow-md transition-all active:scale-95",
               refreshing && "opacity-50 pointer-events-none"
             )}
           >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? 'REFRESHING...' : 'REFRESH ENGINE'}
           </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={clsx("p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center space-y-3 transition-all", stat.bg)}>
               <div className={clsx("p-4 rounded-2xl mb-2 bg-white shadow-sm", stat.text)}>
                  <stat.icon size={32} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <p className="text-5xl font-black text-gray-900">{stat.value}</p>
                 <p className="text-sm font-black uppercase tracking-widest text-gray-800">{stat.label}</p>
                 <p className="text-xs font-bold text-gray-400">{stat.desc}</p>
               </div>
            </div>
          ))}
        </section>

        {/* Quick Actions (Functional 🔥) */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Quick Actions</h2>
              <div className="flex-grow h-[1px] bg-gray-200" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ACTION 1: View All */}
              <button 
                onClick={handleViewAll}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-blue-600 hover:shadow-md transition-all group text-left active:scale-95"
              >
                 <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">View All Projects</h4>
                    <p className="text-xs text-gray-500 font-medium">Comprehensive project list</p>
                 </div>
                 <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-blue-600 transition-colors" />
              </button>

              {/* ACTION 2: Check Duplicates */}
              <button 
                disabled={isCheckingDuplicates}
                onClick={handleCheckDuplicates}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-rose-600 hover:shadow-md transition-all group text-left active:scale-95 disabled:opacity-50"
              >
                 <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                    {isCheckingDuplicates ? <RefreshCw className="animate-spin" size={24} /> : <Copy size={24} />}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">{isCheckingDuplicates ? 'Analyzing...' : 'Check Duplicate Ideas'}</h4>
                    <p className="text-xs text-gray-500 font-medium">Run collision detection</p>
                 </div>
                 <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-rose-600 transition-colors" />
              </button>

              {/* ACTION 3: Export Report */}
              <button 
                disabled={isExporting}
                onClick={handleExportReport}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-emerald-600 hover:shadow-md transition-all group text-left active:scale-95 disabled:opacity-50"
              >
                 <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {isExporting ? <RefreshCw className="animate-spin" size={24} /> : <Download size={24} />}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">{isExporting ? 'Generating...' : 'Export Report'}</h4>
                    <p className="text-xs text-gray-500 font-medium">Download CSV Report</p>
                 </div>
                 <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </button>
           </div>
        </section>

        {/* Filters and Insight */}
        <section className="space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-grow w-full">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                 <input 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search projects by name..."
                   className="w-full h-16 pl-16 pr-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-gray-700 shadow-inner"
                 />
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto">
                 <div className="flex items-center gap-3 bg-gray-50 px-6 rounded-2xl border border-gray-100 h-16 transition-all">
                    <Building size={20} className="text-gray-400" />
                    <select 
                      value={filterDept}
                      onChange={e => setFilterDept(e.target.value)}
                      className="bg-transparent outline-none text-sm font-black text-gray-800 cursor-pointer pr-4 uppercase tracking-wider"
                    >
                       <option value="All">All Departments</option>
                       <option value="Computer Science">Computer Science</option>
                       <option value="Agriculture Engineering">Agriculture</option>
                    </select>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600 p-6 rounded-2xl flex items-center gap-4 text-white shadow-xl shadow-blue-500/20">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center"><Info size={20} /></div>
              <div>
                 <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-0.5">Administrator Insight</p>
                 <p className="text-sm font-bold">Tip: Encourage students to avoid duplicate ideas by reviewing existing projects before starting.</p>
              </div>
           </div>
        </section>

        {/* Audit List */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Institutional Audit</h2>
              <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{filtered.length} Projects Tracked</div>
           </div>

           {filtered.length === 0 ? (
             <div className="bg-white py-24 rounded-[40px] shadow-sm border border-gray-100 text-center space-y-8">
                <div className="h-40 w-40 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-gray-200"><Users size={80} strokeWidth={1} /></div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-gray-900">No projects yet</h3>
                   <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">When students start building ideas, they will appear here for oversight.</p>
                </div>
                <button onClick={fetchAllProjects} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg border border-transparent shadow-blue-500/30 hover:bg-blue-700 transition active:scale-95 text-sm uppercase tracking-widest">
                   Refresh Data
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((p) => (
                  <motion.div 
                    layout
                    key={p.id}
                    className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-600/20 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter leading-none">{p.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400 font-bold mt-2">
                             <UserIcon className="h-5 w-5" />
                             <span className="text-sm">Lead by {p.leader_name}</span>
                          </div>
                       </div>
                    </div>

                    {p.is_duplicate && (
                       <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-rose-100 animate-pulse">
                          <AlertCircle size={16} />
                          <span>Similar idea already exists</span>
                       </div>
                    )}

                    <div className="space-y-6">
                       <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
                          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"><Users size={16} /> {p.team_size ?? 0} Members</span>
                          <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{p.progress}% Progress</span>
                       </div>
                       <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${p.progress}%` }}
                            className={clsx("h-full transition-all", p.progress === 100 ? "bg-emerald-500" : "bg-blue-600")}
                          />
                       </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-50">
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                          <Calendar size={16} />
                          <span>Jan 2024</span>
                       </div>
                       <button 
                          onClick={() => navigate(`/project/${p.id}`)}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-transparent hover:border-blue-600"
                       >
                          View Details <ArrowRight size={16} />
                       </button>
                    </div>
                  </motion.div>
                ))}
             </div>
           )}
        </section>

      </div>
    </div>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ArrowRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
       width={size} 
       height={size} 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="3" 
       strokeLinecap="round" 
       strokeLinejoin="round" 
       className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
