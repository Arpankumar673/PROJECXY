import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Briefcase, Globe, CheckCircle2, Layout, Settings, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

// Mock Data
const myProjects = [
  { id: 1, title: 'Autonomous Drone Swarm', role: 'Team Lead', progress: 75, dept: 'Aerospace Engineering', status: 'Active' },
  { id: 2, title: 'Neural Stock Prediction', role: 'Architect', progress: 40, dept: 'Computer Science', status: 'Ongoing' },
  { id: 3, title: 'Quantum Ledger UI', role: 'Frontend Dev', progress: 95, dept: 'Information Technology', status: 'Polishing' },
]

const campusProjects = [
  { id: 101, title: 'Eco-Smart City Bot', desc: 'Developing an AI bot to optimize waste management in city centers.', roleNeeded: 'Python Dev', dept: 'Computer Science', tags: ['AI', 'Sustainability'] },
  { id: 102, title: 'Bridge Strength Analysis', desc: 'Structural analysis of campus bridges using modern sensors and IoT.', roleNeeded: 'Civil Engineer', dept: 'Civil Engineering', tags: ['IoT', 'Sensors'] },
  { id: 103, title: 'Bio-Informatics Portal', desc: 'A portal for students to share biological data for collaborative research.', roleNeeded: 'UI/UX Designer', dept: 'Biotechnology', tags: ['Research', 'Design'] },
  { id: 104, title: 'Solar Power Efficiency', desc: 'Optimizing solar panel placement across campus roofs for maximum yield.', roleNeeded: 'Data Analyst', dept: 'Electrical Engineering', tags: ['Data', 'Energy'] },
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'my' | 'campus'>('my')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMyProjects = myProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.dept.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCampusProjects = campusProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.roleNeeded.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Global Search & Title */}
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Project Hub</h1>
          <p className="text-[#666666] font-medium">Manage your progress or discover new innovations across campus.</p>
        </div>

        <div className="max-w-2xl mx-auto relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666] group-focus-within:text-[#0A66C2] transition-colors" />
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by name, skill, or role..." 
             className="w-full h-14 pl-12 pr-4 bg-white border border-[#D9E2ED] rounded-xl text-[15px] font-medium shadow-sm focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none transition-all"
           />
        </div>
      </section>

      {/* 2. Filter Tabs */}
      <div className="flex justify-center border-b border-[#D9E2ED]">
        <div className="flex gap-8">
           {[
             { id: 'my', label: 'My Projects', icon: Briefcase },
             { id: 'campus', label: 'Campus Projects', icon: Globe }
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
        <AnimatePresence mode="wait">
          {activeFilter === 'my' ? (
            /* 3. My Projects Section */
            <motion.div 
              key="my-projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-black">Your active innovations</h2>
                 <button className="li-button-primary h-10 px-6 font-bold flex items-center gap-2">
                    <Plus size={18} /> New Project
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMyProjects.length > 0 ? (
                  filteredMyProjects.map(p => (
                    <div key={p.id} className="li-card p-5 group hover:shadow-md transition-all border-[#D9E2ED]/60 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                           <h3 className="text-[17px] font-extrabold text-black group-hover:text-[#0A66C2] transition-colors">{p.title}</h3>
                           <p className="text-xs font-black text-[#666666] uppercase tracking-tighter">{p.role}</p>
                        </div>
                        <span className="text-[10px] font-black bg-[#EDF3F8] text-[#0A66C2] px-2 py-0.5 rounded uppercase tracking-widest">{p.status}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#666666]">
                           <span>Goal Progress</span>
                           <span>{p.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#F3F6F9] rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${p.progress}%` }}
                             className="h-full bg-[#0A66C2] rounded-full" 
                           />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <button className="flex-grow h-10 bg-[#F3F6F9] text-black font-bold text-xs rounded-lg hover:bg-[#EBEBEB] transition-colors flex items-center justify-center gap-2">
                           <Settings size={14} /> Manage
                        </button>
                        <button className="flex-grow h-10 border border-[#0A66C2] text-[#0A66C2] font-bold text-xs rounded-lg hover:bg-[#0A66C2] hover:text-white transition-all flex items-center justify-center gap-2">
                           <Layout size={14} /> View Hub
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center space-y-3 bg-[#F3F6F9] rounded-xl border-2 border-dashed border-[#D9E2ED]">
                    <p className="text-[#666666] font-bold">No matching projects in your list.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* 4. Campus Projects Section (New) */
            <motion.div 
              key="campus-projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-black">Opportunities across campus</h2>
                  <span className="text-xs font-black text-[#666666] bg-[#F3F2EF] px-3 py-1 rounded-full uppercase tracking-widest">{filteredCampusProjects.length} found</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredCampusProjects.map(p => (
                   <div key={p.id} className="li-card p-6 flex flex-col justify-between group hover:shadow-lg transition-all border-[#D9E2ED] bg-white relative overflow-hidden">
                      <div className="space-y-4 flex-grow">
                         <div className="flex justify-between items-start">
                            <span className="px-2 py-1 bg-[#F3F6F9] rounded text-[9px] font-black tracking-widest text-[#666666] uppercase">{p.dept}</span>
                            <CheckCircle2 size={18} className="text-[#0A66C2] opacity-10" />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-lg font-extrabold text-black group-hover:text-[#0A66C2] transition-colors leading-tight">{p.title}</h3>
                           <p className="text-sm text-[#666666] font-medium leading-relaxed line-clamp-3">{p.desc}</p>
                         </div>
                         <div className="pt-2">
                            <p className="text-[10px] font-black text-[#0A66C2] uppercase tracking-tighter mb-2">Role Needed: {p.roleNeeded}</p>
                            <div className="flex flex-wrap gap-1.5">
                               {p.tags.map(t => (
                                 <span key={t} className="text-[9px] font-bold text-[#666666] bg-[#F3F2EF] px-2 py-0.5 rounded">{t}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="pt-6 flex items-center justify-between mt-auto">
                         <button className="text-[#666666] hover:text-[#0A66C2] font-bold text-xs flex items-center gap-1 transition-colors">Details <ArrowRight size={14} /></button>
                         <button className="li-button-primary h-9 px-6 text-xs font-bold shadow-md shadow-primary/10">Apply Now</button>
                      </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  )
}
