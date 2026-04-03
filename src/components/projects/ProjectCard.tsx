import { motion } from 'framer-motion'
import { Layout, Users, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import DeleteProjectModal from './DeleteProjectModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

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
  const { profile } = useAuth()
  
  const isDepartment = profile?.role === 'department'
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 space-y-3 md:space-y-4 hover:border-blue-400 transition-all duration-300 shadow-sm flex flex-col h-full overflow-hidden w-full"
    >
      {/* Part 1: Top Bar - Name & Status */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight line-clamp-1">
          {project.title}
        </h3>
        <span className={clsx(
          "px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border shadow-sm shrink-0",
          status === 'Completed' || status === 'completed' 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
            : "bg-blue-50 text-blue-700 border-blue-100"
        )}>
          {status}
        </span>
      </div>

      {/* Part 2: Info & Description */}
      <div className="space-y-2 md:space-y-3 flex-grow">
        <div className="flex items-center gap-2 text-slate-500">
          <Users size={14} />
          <span className="text-[11px] md:text-xs font-semibold">{memberCount} {memberCount === 1 ? 'Member' : 'Members'}</span>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[40px]">
          {project.description || 'No project description available.'}
        </p>
      </div>

      {/* Part 3: Progress Section */}
      {(isDepartment || isMyProject) && (
        <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tight">Progress</span>
            <span className="text-xs md:text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              className={clsx(
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-emerald-500" : "bg-blue-600"
              )} 
            />
          </div>
        </div>
      )}

      {/* Part 4: Actions - Optimized for Mobile (Vertical Stack) */}
      <div className="flex flex-col md:flex-row gap-2 pt-2">
        <button 
          onClick={handleOverview}
          className="flex-1 h-10 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200"
        >
          <Layout size={14} /> <span className="md:inline">Details</span>
        </button>
        
        {isMyProject ? (
          <button 
            onClick={handleAudit}
            className="flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Rocket size={14} /> Open
          </button>
        ) : (
          <button 
            onClick={handleOverview}
            className="flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Apply Now
          </button>
        )}

        {isMyProject && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); }}
            className="hidden md:flex p-2.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
            title="Delete Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        )}
      </div>

      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={() => { window.location.reload() }}
        project={project}
      />
    </motion.div>
  )
}
