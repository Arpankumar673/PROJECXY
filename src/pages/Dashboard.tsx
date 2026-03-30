import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowRight, Star, Search, Rocket, Compass, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import ProjectCard from '../components/projects/ProjectCard'

// Removed unused constants to fix deployment error.

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  // Removed unused filter states to fix deployment error.

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

  // Data Derivation
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center grayscale opacity-10 animate-pulse">
         <Loader2 size={32} className="animate-spin mb-4" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em]">Optimizing Innovation Feed...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-12 animate-in fade-in duration-700">
      
      {/* 1. Intro Section */}
      <section className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-black tracking-tight"
        >
          Welcome, {profile?.full_name?.split(' ')[0] || 'Innovator'}! 👋
        </motion.h1>
        <p className="text-[#666666] text-xl font-medium max-w-2xl mx-auto italic">Build projects, work with teams, and grow your skills.</p>
      </section>

      {/* 2. Global Search & Filter Bar */}
      <section className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="li-card p-3 flex flex-col md:flex-row items-center gap-3 bg-white border-[#D9E2ED] shadow-sm transition-all hover:shadow-md">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search innovation keywords..." 
              className="w-full h-12 pl-10 pr-4 bg-[#F3F6F9] border-none rounded-lg text-[15px] focus:ring-1 focus:ring-[#0A66C2] focus:bg-white outline-none transition-all"
            />
          </div>
          <button className="li-button-primary h-12 px-8 font-black text-xs uppercase tracking-widest">Search Hub</button>
        </div>
      </section>

      {/* 3. Create Hook Card */}
      <section className="flex justify-center">
        <motion.div 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ y: -2 }}
          className="li-card p-4 w-full max-w-md bg-white border-[#0A66C2]/10 shadow-sm flex items-center justify-between gap-4 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-[#EDF3F8] rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5 text-[#0A66C2]" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-tight italic">Launch New Squad</h3>
                <p className="text-[11px] text-[#666666] font-medium leading-none">Find teammates and build together.</p>
             </div>
          </div>
          <button className="li-button-primary h-8 px-4 text-xs font-black uppercase tracking-widest whitespace-nowrap">Create</button>
        </motion.div>
      </section>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchDashboardData(); }} />

      {/* 4. Recommended Projects (Mapped) */}
      {recommendedItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
             <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
             <h2 className="text-xl font-bold text-black tracking-tight uppercase italic">Curated Picks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {recommendedItems.map(p => (
                <div key={p.id} className="li-card p-5 bg-white border-[#D9E2ED] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                   <div className="space-y-2">
                      <h3 className="text-[17px] font-extrabold text-black group-hover:text-[#0A66C2] transition-colors">{p.title}</h3>
                      <p className="text-sm text-[#666666] font-medium leading-relaxed line-clamp-2 italic">"{p.description}"</p>
                   </div>
                   <div className="pt-4 flex items-center justify-between mt-4 border-t border-gray-50">
                      <span className="text-[10px] font-black bg-[#EDF3F8] text-[#0A66C2] px-2.5 py-1 rounded-full uppercase tracking-wider italic">External Squad</span>
                      <button className="text-[#0A66C2] font-black text-[10px] flex items-center gap-1 hover:underline uppercase tracking-widest">Audit <ArrowRight size={14} /></button>
                   </div>
                </div>
             ))}
          </div>
        </section>
      )}

      {/* 5. Main Feed Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        
        {/* Left: Your Projects Progress */}
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
           <div className="flex items-center gap-2 pb-2">
             <Rocket size={18} className="text-[#0A66C2]" />
             <h2 className="text-lg font-bold text-black uppercase tracking-tighter">My Active Work</h2>
           </div>
           <div className="space-y-4">
             {myWork.length > 0 ? myWork.slice(0, 3).map((p) => (
                <ProjectCard key={p.id} project={p} isMyProject={true} />
             )) : (
               <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Idle Innovation</p>
               </div>
             )}
           </div>
        </div>

        {/* Right: Explore Feed (Filtered Campus Projects) */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
               <Compass size={20} className="text-[#0A66C2]" />
               <h2 className="text-xl font-bold text-black uppercase tracking-tighter">Global Archive</h2>
            </div>
            <span className="text-[11px] font-black text-[#666666] bg-[#F3F2EF] px-3 py-1 rounded-full uppercase tracking-widest italic">
              {filteredExplore.length} INNOVATIONS LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredExplore.length > 0 ? (
                filteredExplore.map(p => (
                  <ProjectCard key={p.id} project={p} isMyProject={false} />
                ))
              ) : (
                <div className="col-span-2 py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                   <Rocket size={40} className="mx-auto text-gray-200" />
                   <div className="space-y-1">
                      <p className="text-gray-900 font-black uppercase tracking-widest text-xs">No Innovations Matching</p>
                      <p className="text-gray-400 font-medium text-sm">Clear filters to resume exploring.</p>
                   </div>
                   <button onClick={() => setSearchTerm('')} className="text-[#0A66C2] font-black text-[10px] uppercase tracking-widest underline underline-offset-4">Reset Feed</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  )
}
