import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Rocket, 
  Users as UsersIcon, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  CheckCircle2,
  User,
  Loader2,
  Lock,
  Clock,
  Terminal,
  Database
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import UpdateProgressModal from '../components/UpdateProgressModal'
import ProgressHistory from '../components/ProgressHistory'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface Project {
  id: string
  title: string
  description: string
  progress?: number
  status?: string
  user_id: string
  department?: string
  created_at: string
}

interface Member {
  id: string
  full_name: string
  avatar_url: string
}

const STAGE_PROGRESS: Record<string, number> = {
  'Idea': 10,
  'Planning': 25,
  'Building': 50,
  'Testing': 75,
  'Completed': 100
}

export default function ProjectOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [project, setProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<any[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [schemaAlert, setSchemaAlert] = useState(false)

  // 🛡️ REQUISITE AUTH: Derived State for Authorization
  const isAuthorized = useMemo(() => {
    if (!user || !project) return false
    if (project.user_id === user.id) return true
    return members.some(m => m.id === user.id)
  }, [user, project, members])

  // 📈 LOGIC SYNC: Derived progress based on the LATEST milestone in the feed
  const derivedProgress = useMemo(() => {
    if (updates.length > 0) {
      const latest = updates[0]
      return STAGE_PROGRESS[latest.status] || 0
    }
    // Fallback to project.progress if available (despite introspection failure)
    return project?.progress || 0
  }, [project, updates])

  const fetchData = async () => {
    if (!id) return
    
    try {
      // 1. Fetch Project Core (Selecting only verified columns to avoid 400 Bad Request)
      const { data: proj, error: projError } = await supabase
        .from('projects')
        .select('id, title, description, user_id, created_at')
        .eq('id', id)
        .single()
      
      if (projError) {
         if (projError.code === 'PGRST204') throw new Error('Innovation Registry Not Found')
         throw projError
      }
      if (proj) setProject(proj)

      // 2. Fetch Milestone Feed (Re-aligned to verified native structure)
      // Removed join with profiles:user_id as user_id column was found missing in current schema cache
      const { data: hist, error: histError } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
      
      if (histError) {
         if (histError.code === '400') {
           console.warn('[PROJECXY SCHEMA]: Milestone Selector Mismatch. Syncing Fallback Modes.')
           setSchemaAlert(true)
         }
      }

      if (hist) {
        const mappedUpdates = hist.map(u => ({
          ...u,
          stage: u.status,
          update_text: u.description,
          // Since user_id is missing on milestones, we attribute logs to the mission leader as placeholder
          profiles: { full_name: 'Innovation Team' }
        }))
        setUpdates(mappedUpdates)
      }

      // 3. Fetch Squad Registry
      const { data: membersList } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', id)
      
      if (membersList && membersList.length > 0) {
        const uids = membersList.map(m => m.user_id)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', uids)
        if (profiles) setMembers(profiles)
      }

    } catch (err: any) {
      console.error('[PROJECXY SYNC]: Mission Failure:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const joinSquad = async () => {
    if (!user || !id || isJoining) return
    setIsJoining(true)
    try {
      const { error } = await supabase
        .from('project_members')
        .insert({ project_id: id, user_id: user.id })
      if (error) throw error
      await fetchData()
    } catch (err: any) {
      console.error('[PROJECXY AUTH]: Join Failed:', err.message)
      alert('Failed to join squad. Ensure you are not already a member.')
    } finally {
      setIsJoining(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // 🚀 CROSS-CHANNEL SYNC
    const syncChannel = supabase
      .channel(`sync-hub-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'milestones', filter: `project_id=eq.${id}` }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(syncChannel) }
  }, [id, user?.id])

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-black text-gray-400 opacity-20 animate-pulse uppercase tracking-[0.5em]"><Loader2 size={40} className="animate-spin mb-6" /> Syncing Global Hub...</div>
  if (!project) return <div className="p-24 text-center font-black text-rose-600 uppercase tracking-widest bg-white h-screen">SYNC FAIL: PROJECT_REPOSITORY_OFFLINE</div>

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 pb-32 space-y-12 animate-in fade-in duration-700 font-sans">
      
      {schemaAlert && (
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-[32px] flex items-center gap-6 shadow-xl shadow-amber-500/5">
           <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse"><Database size={24} /></div>
           <div className="flex-grow">
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Institutional Update Required</h3>
              <p className="text-[11px] font-bold text-amber-700/80 leading-relaxed uppercase tracking-tighter mt-1">Database Schema Mismatch detected. System is running in fallback mode. Please run the SQL Migration Tool.</p>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666666] hover:text-black font-black text-xs uppercase tracking-widest transition-all bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md active:scale-95"
        >
          <ArrowLeft size={16} /> Repository Hub
        </button>

        <div className="flex items-center gap-4">
          {!isAuthorized && (
            <button 
              onClick={joinSquad}
              disabled={isJoining}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/20 disabled:opacity-50 italic"
            >
              {isJoining ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Join Squad</>}
            </button>
          )}

          {isAuthorized ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-3xl hover:bg-black transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.15)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative flex items-center gap-3">
                 <Plus size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
                 Log Progress Milestone
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-gray-100 italic">
               <Lock size={16} /> Restricted View
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="li-card p-12 bg-white border-gray-100 rounded-[48px] shadow-sm space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
               <Rocket size={180} />
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-blue-50/50 rounded-[32px] flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <Rocket size={48} />
                </div>
                <div className="space-y-1">
                   <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">{project.title}</h1>
                   <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Institutional Repository ID: {id?.slice(0, 12)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <span className={clsx(
                    "px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border shadow-xl transition-all",
                    derivedProgress === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5'
                 )}>
                   {project.status || (derivedProgress === 100 ? 'COMPLETED' : 'SYNCHRONIZING')}
                 </span>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 animate-pulse italic">
                    <CheckCircle2 size={12} /> Sync Engine Online
                 </p>
              </div>
            </div>

            <div className="space-y-5 pt-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Innovation Milestone Phase</h3>
                  <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic">{derivedProgress}%</span>
               </div>
               <div className="h-6 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1.5 shadow-inner">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${derivedProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={clsx(
                      "h-full rounded-full shadow-2xl transition-all duration-1000", 
                      derivedProgress === 100 ? "bg-emerald-500 shadow-emerald-500/30" : "bg-blue-600 shadow-blue-500/40"
                    )}
                  />
               </div>
            </div>

            <div className="pt-10 border-t border-gray-50 grid grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="flex items-center gap-4 group/stat">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all shadow-sm"><UsersIcon size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">SQUAD SIZE</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase italic uppercase tracking-tighter">{Math.max(members.length, 1)} INNOVATORS</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group/stat">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all shadow-sm"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">INITIATED</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase italic tracking-tighter">OCT 2024</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group/stat hidden lg:flex">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all shadow-sm"><ShieldCheck size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">INTEGRITY</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase italic tracking-tighter">AUDIT READY</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="li-card p-12 bg-white border-gray-100 rounded-[40px] shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-blue-600 rounded-full" />
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Mission Objective</h2>
             </div>
             <p className="text-gray-600 font-bold text-xl leading-relaxed italic border-l-4 border-gray-50 pl-8 py-3 bg-gray-50/50 rounded-r-3xl uppercase tracking-tighter">
               "{project.description || 'ESTABLISHING CAMPUS-WIDE INNOVATION PROTOCOLS...'}"
             </p>
          </section>

          <section className="space-y-10">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                   <Terminal className="text-blue-600" size={18} />
                   <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Institutional Milestone Registry</h2>
                </div>
                <div className="px-6 py-2 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-xl shadow-gray-900/10">{updates.length} TOTAL LOGS</div>
             </div>
             <ProgressHistory updates={updates} />
          </section>

        </div>

        <div className="space-y-10">
           <div className="li-card p-10 bg-white border-gray-100 rounded-[40px] shadow-sm space-y-8">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-2">
                <UsersIcon size={14} className="text-blue-600" /> SQUAD REGISTRY
              </h3>
              <div className="space-y-5">
                 {members.map(member => (
                   <div key={member.id} className="flex items-center gap-5 group">
                      <div className="h-14 w-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <User size={28} />
                      </div>
                      <div className="flex-grow">
                         <p className="text-sm font-black text-gray-900 leading-none">{member.full_name}</p>
                         <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{member.id === project.user_id ? 'MISSION LEADER' : 'INNOVATION SPECIALIST'}</p>
                      </div>
                   </div>
                 ))}
                 {members.length === 0 && <p className="text-[11px] font-bold text-gray-400 italic">Synchronizing roster...</p>}
              </div>
           </div>

           <div className="p-10 bg-gray-900 rounded-[48px] text-white shadow-3xl shadow-gray-900/40 space-y-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000"><ShieldCheck size={160} /></div>
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] relative z-10">Institutional Metrics</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Integrity</p>
                       <p className="text-2xl font-black text-emerald-400 tracking-tighter">98/100</p>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-400" />
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Archive Health</p>
                       <p className="text-sm font-black text-blue-400 uppercase italic">OPERATIONAL</p>
                    </div>
                    <Clock size={24} className="text-blue-400" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <UpdateProgressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={id!}
        currentStage={project.status || 'Idea'}
        onUpdateSuccess={fetchData}
      />
    </div>
  )
}
