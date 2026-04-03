import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, Search, Rocket, Compass, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import ProjectCard from '../components/projects/ProjectCard'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDashboardData = async () => {
    if (!user) return
    setIsLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
       console.error('[PROJECXY DOCK]: Sync Error:', error.message)
       setProjects([])
    } else {
       setProjects(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const myWork = projects.filter(p => p.user_id === user?.id)
  const exploreProjects = projects.filter(p => p.user_id !== user?.id)

  const filteredExplore = exploreProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const recommendedItems = exploreProjects.slice(0, 2)

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center grayscale opacity-10 animate-pulse px-4 border-2">
         <Loader2 size={32} className="animate-spin mb-4 text-blue-600" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Syncing Innovation Hub...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1240px] mx-auto px-3 md:px-8 py-6 md:py-8 space-y-8 md:space-y-12 animate-in fade-in duration-700">
      
      {/* 1. Intro Section */}
      <section className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Welcome, {profile?.full_name?.split(' ')[0] || 'Innovator'}! 👋
        </motion.h1>
        <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto px-4 md:px-0">
          Scale your ideas, collaborate with world-class teams, and track your progress.
        </p>
      </section>

      {/* 2. Global Search & Filter Bar */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="bg-white p-2 flex flex-col md:flex-row items-center gap-2 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search innovation keywords..." 
              className="w-full h-11 md:h-12 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm md:text-[15px] focus:ring-1 focus:ring-blue-600 focus:bg-white outline-none transition-all"
            />
          </div>
          <button className="w-full md:w-auto h-11 md:h-12 px-8 bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 whitespace-nowrap">
            Search Hub
          </button>
        </div>
      </section>

      {/* 3. Create Hook Card */}
      <section className="flex justify-center w-full">
        <motion.div 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ y: -2 }}
          className="bg-white p-3 md:p-4 w-full max-w-md border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between gap-3 md:gap-4 group cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center gap-3 md:gap-4">
             <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Plus className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
             </div>
             <div className="space-y-0.5">
               <p className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Quick Actions</p>
               <p className="text-sm md:text-base font-bold text-slate-900">Start New Innovation</p>
             </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
            <Rocket size={14} />
          </div>
        </motion.div>
      </section>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchDashboardData(); }} />

      {/* 4. Recommended Projects */}
      {recommendedItems.length > 0 && (
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-amber-50 flex items-center justify-center">
               <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500 fill-amber-500" />
             </div>
             <h2 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight">Curated Picks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             {recommendedItems.map(p => (
                <ProjectCard key={p.id} project={p} isMyProject={false} />
             ))}
          </div>
        </section>
      )}

      {/* 5. Main Feed Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pt-2 md:pt-4">
        
        {/* Left Sidebar: My Active Work */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6 order-2 lg:order-1">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Rocket size={14} className="md:size-[16px] text-blue-600" />
                </div>
                <h2 className="text-base md:text-xl font-bold text-slate-900 tracking-tight">Active Work</h2>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-400">{myWork.length} Projects</span>
           </div>

           <div className="flex flex-col gap-3 md:gap-4">
             {myWork.length > 0 ? myWork.slice(0, 3).map((p) => (
                <ProjectCard key={p.id} project={p} isMyProject={true} />
             )) : (
               <div className="p-8 md:p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                  <p className="text-xs md:text-sm font-bold text-slate-400">No active work found.</p>
                  <button onClick={() => setIsModalOpen(true)} className="mt-2 text-blue-600 text-[11px] md:text-xs font-bold hover:underline underline-offset-4">Create your first project</button>
               </div>
             )}
           </div>
        </div>

        {/* Right Feed: Global Archive */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6 order-1 lg:order-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
               <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                 <Compass size={14} className="md:size-[18px] text-blue-600" />
               </div>
               <h2 className="text-base md:text-xl font-bold text-slate-900 tracking-tight">Global Archive</h2>
            </div>
            <span className="text-[9px] md:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">
              {filteredExplore.length} Innovations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filteredExplore.length > 0 ? (
                filteredExplore.map(p => (
                  <ProjectCard key={p.id} project={p} isMyProject={false} />
                ))
              ) : (
                <div className="col-span-full py-16 md:py-24 text-center space-y-3 md:space-y-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <Rocket size={32} className="mx-auto text-slate-200" />
                   <div className="space-y-0.5 md:space-y-1 shrink-0">
                      <p className="text-slate-900 font-bold text-sm md:text-base text-center">No matches found</p>
                      <p className="text-slate-400 text-xs md:text-sm text-center">Try searching for keywords like "AI", "SaaS", or "Web".</p>
                   </div>
                   <button onClick={() => setSearchTerm('')} className="text-blue-600 font-bold text-xs md:text-sm hover:underline underline-offset-4 w-full">Clear search</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
