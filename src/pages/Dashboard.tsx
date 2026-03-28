import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, ArrowRight, Star, Search, Filter, Rocket, CheckCircle2, Briefcase, GraduationCap, Compass } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const departments = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Management", "Biotechnology"]
const roles = ["Developer", "Designer", "Marketing", "Researcher", "Manager"]

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Mock data
  const currentProjects = [
    { name: 'Eco-Smart Grid AI', role: 'Team Member', progress: 65, team: 4 },
  ]

  const recommendedProjects = [
    { title: 'Campus Clean App', desc: 'Build a system to keep our college clean and green.', role: 'Designer', id: 1 },
    { title: 'Virtual Study Room', desc: 'Create a space for students to study together online.', role: 'Developer', id: 2 },
  ]

  const campusProjects = [
    { title: 'AI Food Bot', dept: 'Computer Science', role: 'Developer', skills: ['Python', 'Logic'], id: 101 },
    { title: 'E-commerce Mini', dept: 'Management', role: 'Marketing', skills: ['Strategy'], id: 102 },
    { title: 'Bridge Model 2.0', dept: 'Civil Engineering', role: 'Designer', skills: ['AutoCAD'], id: 103 },
    { title: 'Smart Irrigation', dept: 'Agriculture Engineering', role: 'Researcher', skills: ['IoT'], id: 104 },
    { title: 'Bio-Reactor Hub', dept: 'Biotechnology', role: 'Developer', skills: ['LabView'], id: 105 },
    { title: 'Marketing Suite', dept: 'Management', role: 'Manager', skills: ['SEO'], id: 106 },
  ]

  // Filter Logic
  const filteredProjects = campusProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.dept.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = selectedDept === '' || p.dept === selectedDept
    const matchesRole = selectedRole === '' || p.role === selectedRole
    return matchesSearch && matchesDept && matchesRole
  })

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
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
        <p className="text-[#666666] text-xl font-medium max-w-2xl mx-auto">Build projects, work with teams, and grow your skills.</p>
      </section>

      {/* 2. Global Search & Filter Bar */}
      <section className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="li-card p-3 flex flex-col md:flex-row items-center gap-3 bg-white border-[#D9E2ED] shadow-sm transition-all hover:shadow-md">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects or topics..." 
              className="w-full h-12 pl-10 pr-4 bg-[#F3F6F9] border-none rounded-lg text-[15px] focus:ring-1 focus:ring-[#0A66C2] focus:bg-white outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-44">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] z-10" />
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full h-12 pl-10 pr-8 bg-[#F3F6F9] border-none rounded-lg text-sm font-bold text-[#666666] appearance-none focus:ring-1 focus:ring-[#0A66C2] focus:bg-white outline-none cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="relative flex-grow md:w-40">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] z-10" />
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full h-12 pl-10 pr-8 bg-[#F3F6F9] border-none rounded-lg text-sm font-bold text-[#666666] appearance-none focus:ring-1 focus:ring-[#0A66C2] focus:bg-white outline-none cursor-pointer"
              >
                <option value="">All Roles</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compact Create Project Card (Sleeker and Centered) */}
      <section className="flex justify-center">
        <motion.div 
          whileHover={{ y: -2 }}
          className="li-card p-4 w-full max-w-md bg-white border-[#0A66C2]/10 shadow-sm flex items-center justify-between gap-4 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-[#EDF3F8] rounded-full flex items-center justify-center">
               <Plus className="h-5 w-5 text-[#0A66C2]" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-black">New Project?</h3>
               <p className="text-[11px] text-[#666666] font-medium leading-none">Find teammates and build together.</p>
             </div>
          </div>
          <button className="li-button-primary h-8 px-4 text-xs font-bold whitespace-nowrap">Create</button>
        </motion.div>
      </section>

      {/* 4. Recommended Projects (New Section) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
           <h2 className="text-xl font-bold text-black tracking-tight">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {recommendedProjects.map(p => (
              <div key={p.id} className="li-card p-5 bg-white border-[#D9E2ED] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                 <div className="space-y-2">
                    <h3 className="text-[17px] font-extrabold text-black group-hover:text-[#0A66C2] transition-colors">{p.title}</h3>
                    <p className="text-sm text-[#666666] font-medium leading-relaxed line-clamp-2">{p.desc}</p>
                 </div>
                 <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-black bg-[#EDF3F8] text-[#0A66C2] px-2.5 py-1 rounded-full uppercase tracking-wider">{p.role} Needed</span>
                    <button className="text-[#0A66C2] font-bold text-xs flex items-center gap-1 hover:underline">View Details <ArrowRight size={14} /></button>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* 5. Main Feed Area (Active Projects + Explore) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        
        {/* Left: Your Projects Progress */}
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
           <div className="flex items-center gap-2 pb-2">
             <Rocket size={18} className="text-[#0A66C2]" />
             <h2 className="text-lg font-bold text-black">Active Work</h2>
           </div>
           <div className="space-y-4">
             {currentProjects.map((p, i) => (
               <div key={i} className="li-card p-4 space-y-3 bg-[#F9FAFB] border-[#0A66C2]/5">
                 <h3 className="font-bold text-black text-[15px] underline decoration-[#0A66C2]/20 underline-offset-4">{p.name}</h3>
                 <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-[10px] font-bold text-[#666666]">
                      <span>Progress</span>
                      <span className="text-[#0A66C2]">{p.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
                     <div style={{ width: `${p.progress}%` }} className="h-full bg-[#0A66C2] rounded-full" />
                   </div>
                 </div>
                 <div className="flex items-center gap-1 text-[11px] font-bold text-[#666666] pt-1">
                    <Users size={12} className="text-[#0A66C2]" /> {p.team} team members
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Explore Feed (Filtered Campus Projects) */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
               <Compass size={20} className="text-[#0A66C2]" />
               <h2 className="text-xl font-bold text-black">Projects in Campus</h2>
            </div>
            <span className="text-[11px] font-black text-[#666666] bg-[#F3F2EF] px-3 py-1 rounded-full uppercase tracking-widest">
              {filteredProjects.length} ideas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(p => (
                  <motion.div 
                    key={p.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="li-card p-5 group hover:shadow-lg transition-all border-[#D9E2ED]/50 flex flex-col h-full bg-white relative overflow-hidden"
                  >
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                         <span className="px-2 py-0.5 bg-[#F3F6F9] rounded text-[9px] font-black tracking-widest text-[#666666] uppercase">{p.dept}</span>
                         <CheckCircle2 size={16} className="text-[#0A66C2] opacity-20" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-extrabold text-black group-hover:text-[#0A66C2] transition-colors leading-tight">{p.title}</h3>
                        <p className="text-[11px] text-[#0A66C2] font-black uppercase tracking-tighter pt-1">{p.role} REQUIRED</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.skills.map(s => (
                          <span key={s} className="text-[10px] font-bold text-[#666666] bg-[#EDF3F8] px-2 py-0.5 rounded transition-all group-hover:bg-[#0A66C2] group-hover:text-white">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 flex items-center justify-between mt-auto">
                      <button className="text-[#666666] hover:text-[#0A66C2] font-bold text-xs flex items-center gap-1 transition-colors">Details <ArrowRight size={14} /></button>
                      <button className="li-button-primary h-9 px-6 text-xs font-bold shadow-lg shadow-primary/10">Apply Now</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 py-20 text-center space-y-4 bg-white rounded-xl border-2 border-dashed border-[#D9E2ED]"
                >
                  <p className="text-[#666666] font-bold text-lg">No projects match your current filters.</p>
                  <button onClick={() => {setSearchTerm(''); setSelectedDept(''); setSelectedRole('');}} className="li-button-secondary h-10 px-8 font-bold text-sm">Clear Search</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  )
}
