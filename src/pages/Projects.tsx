import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Briefcase, Globe, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import ProjectCard from '../components/projects/ProjectCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState<'my' | 'campus'>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. REAL FETCH FROM SUPABASE
  const fetchLocalProjects = async () => {
    if (!user) return
    setLoading(true)
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLocalProjects()
  }, [user])

  // 2. FILTER LOGIC
  const myProjects = projects.filter(p => p.user_id === user?.id)
  const campusProjects = projects.filter(p => p.user_id !== user?.id)

  const filteredMy = myProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCampus = campusProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Search Header */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-black tracking-tight uppercase italic">Innovation Hub</h1>
          <p className="text-[#666666] font-medium italic">Discover campus breakthroughs or manage your own innovation squad.</p>
        </div>

        <div className="max-w-2xl mx-auto relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2] transition-colors" />
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by innovation name..." 
             className="w-full h-14 pl-12 pr-4 bg-white border border-[#D9E2ED] rounded-xl text-[15px] font-medium shadow-sm focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none transition-all"
           />
        </div>
      </section>

      {/* Tabs */}
      <div className="flex justify-center border-b border-[#D9E2ED]">
        <div className="flex gap-8">
           {[
             { id: 'my', label: 'My Innovation', icon: Briefcase },
             { id: 'campus', label: 'Global Campus', icon: Globe }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveFilter(tab.id as any)}
               className={clsx(
                 "flex items-center gap-2 pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
                 activeFilter === tab.id ? "text-[#0A66C2]" : "text-[#666666] hover:text-black"
               )}
             >
               <tab.icon size={18} />
               {tab.label}
               {activeFilter === tab.id && (
                 <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A66C2] rounded-t-full" />
               )}
             </button>
           ))}
        </div>
      </div>

      <main className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20 animate-pulse">
             <Loader2 size={40} className="animate-spin mb-4" />
             <p className="font-black uppercase tracking-[0.4em] text-xs">Syncing Repository...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeFilter === 'my' ? (
              <motion.div 
                key="my-projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-black italic">Your Active Squads</h2>
                   <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="li-button-primary h-10 px-6 font-bold flex items-center gap-2 group hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                   >
                      <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Launch Innovation
                   </button>
                </div>

                <CreateProjectModal 
                  isOpen={isCreateModalOpen} 
                  onClose={() => { setIsCreateModalOpen(false); fetchLocalProjects(); }} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMy.length > 0 ? (
                    filteredMy.map(p => (
                      <ProjectCard key={p.id} project={p} isMyProject={true} />
                    ))
                  ) : (
                    <div className="col-span-2 py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300"><Briefcase size={32} /></div>
                      <div>
                        <p className="text-gray-900 font-black uppercase tracking-widest text-xs">No Innovations Launched</p>
                        <p className="text-gray-400 font-medium text-sm mt-1">Start your journey by launching your first project.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Campus Projects */
              <motion.div 
                key="campus-projects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-black italic">Live Campus Opportunities</h2>
                    <span className="text-xs font-black text-[#666666] bg-[#F3F2EF] px-3 py-1 rounded-full uppercase tracking-widest italic">{filteredCampus.length} Innovating Now</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredCampus.map(p => (
                     <ProjectCard key={p.id} project={p} isMyProject={false} />
                   ))}
                   
                   {filteredCampus.length === 0 && (
                      <div className="col-span-3 py-24 text-center space-y-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                         <Globe size={40} className="mx-auto text-gray-200" />
                         <p className="text-gray-400 font-bold italic">No public campus innovations found at the moment.</p>
                      </div>
                   )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

    </div>
  )
}
