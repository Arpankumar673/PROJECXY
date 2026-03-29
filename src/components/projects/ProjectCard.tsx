import { motion } from 'framer-motion'
import { Settings, Layout, ArrowRight, Users, Clock, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import DeleteProjectModal from './DeleteProjectModal'
import { supabase } from '../../lib/supabase'

interface Project {
  id: string
  title: string
  description?: string
  status?: string
  user_id?: string
  progress?: number
  role?: string
}

interface ProjectCardProps {
  project: Project
  isMyProject?: boolean
}

export default function ProjectCard({ project, isMyProject = false }: ProjectCardProps) {
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [memberCount, setMemberCount] = useState<number>(0)

  useEffect(() => {
    const fetchMemberCount = async () => {
      const { count } = await supabase
        .from('project_members')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
      
      setMemberCount(count || 1) // Fallback to 1 (the leader)
    }
    fetchMemberCount()
  }, [project.id])

  const handleAudit = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/project/${project.id}/audit`)
  }

  const handleOverview = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/project/${project.id}`)
  }

  const progress = project.progress || 0
  const status = project.status || 'Active'

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={clsx(
        "li-card p-6 group hover:shadow-xl transition-all border-[#D9E2ED] bg-white relative overflow-hidden",
        !isMyProject && "flex flex-col justify-between"
      )}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
           <h3 className="text-lg font-black text-black group-hover:text-[#0A66C2] transition-colors leading-tight italic uppercase tracking-tight">
             {project.title}
           </h3>
           <div className="flex items-center gap-2 text-[10px] font-black text-[#666666] uppercase tracking-[0.2em] italic">
             <Users size={12} className="text-[#0A66C2]" /> {memberCount} Squad Members
           </div>
        </div>
        <div className="flex items-center gap-2">
           {isMyProject && (
             <motion.button 
               whileHover={{ scale: 1.1, rotate: 10 }}
               whileTap={{ scale: 0.9 }}
               onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); }}
               className="p-2 text-gray-300 hover:text-rose-600 transition-colors"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
             </motion.button>
           )}
           <span className={clsx(
             "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1em] border shadow-sm",
             status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-[#EDF3F8] text-[#0A66C2] border-[#0A66C2]/10"
           )}>
             {status}
           </span>
        </div>
      </div>

      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={() => { window.location.reload() }}
        project={project}
      />

      <div className="space-y-4 flex-grow relative z-10">
         <p className="text-sm text-[#666666] font-bold leading-relaxed italic line-clamp-2 border-l-2 border-gray-50 pl-4">
           "{project.description || 'Optimizing campus innovation through collaborative cross-functional synergy.'}"
         </p>
         
         <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Clock size={10} /> Sync Progress</span>
               <span className="text-[#0A66C2]">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-[#F3F6F9] rounded-full overflow-hidden border border-gray-100/50 p-[2px]">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${progress}%` }} 
                 className={clsx(
                   "h-full rounded-full shadow-lg",
                   progress === 100 ? "bg-emerald-500 shadow-emerald-500/20" : "bg-[#0A66C2] shadow-blue-500/20"
                 )} 
               />
            </div>
         </div>
      </div>

      <div className={clsx("flex gap-3 mt-8 relative z-10", !isMyProject && "border-t border-gray-50 pt-6")}>
        {isMyProject ? (
          <>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAudit}
              className="flex-grow h-11 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
            >
               <Settings size={14} className="group-hover:rotate-45 transition-transform" /> Audit Hub
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleOverview}
              className="flex-grow h-11 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10"
            >
               <Layout size={14} /> Squad Overview
            </motion.button>
          </>
        ) : (
          <>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleOverview}
              className="text-[#666666] hover:text-[#0A66C2] font-black text-[10px] flex items-center gap-1 transition-colors uppercase tracking-widest"
            >
              Learn More <ArrowRight size={14} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="li-button-primary h-10 px-6 text-[10px] font-black shadow-lg shadow-primary/20 uppercase tracking-widest italic"
            >
              Collaborate
            </motion.button>
          </>
        )}
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
         <Rocket size={140} />
      </div>
    </motion.div>
  )
}
