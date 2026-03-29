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
  Lock
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
  progress: number
  status: string
  user_id: string
  department: string
  created_at: string
}

interface Member {
  id: string
  full_name: string
  avatar_url: string
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

  // 🛡️ REQUISITE AUTH: Derived State for Authorization
  const isAuthorized = useMemo(() => {
    if (!user || !project) return false
    
    // Check if user is the primary owner
    if (project.user_id === user.id) return true
    
    // Check if user is in the squad members list
    return members.some(m => m.id === user.id)
  }, [user, project, members])

  const fetchData = async () => {
    if (!id) return
    
    try {
      // 1. Fetch Project State
      const { data: proj, error: projError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (projError) throw projError
      if (proj) setProject(proj)

      // 2. Fetch Milestone Feed
      const { data: hist } = await supabase
        .from('project_updates')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false })
      
      if (hist) setUpdates(hist)

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
      } else {
        setMembers([]) // Reset if empty
      }

    } catch (err: any) {
      console.error('[PROJECXY SYNC]: Integrity Error:', err.message)
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
      await fetchData() // Refresh all state
    } catch (err: any) {
      console.error('[PROJECXY AUTH]: Join Failed:', err.message)
      alert('Failed to join squad. Ensure you are not already a member.')
    } finally {
      setIsJoining(false)
    }
  }

  useEffect(() => {
    fetchData()

    // 🚀 CROSS-CHANNEL SYNC: Real-time listener for projects and updates
    const syncChannel = supabase
      .channel(`sync-hub-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${id}` }, (p) => {
        setProject(p.new as Project)
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_updates', filter: `project_id=eq.${id}` }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(syncChannel) }
  }, [id, user?.id])

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-black text-gray-400 opacity-20 animate-pulse uppercase tracking-[0.5em]"><Loader2 size={40} className="animate-spin mb-6" /> Syncing Innovation Hub...</div>
  if (!project) return <div className="p-24 text-center font-black text-rose-600">SYNCC FAIL: PROJECT TERMINATED OR UNREACHABLE</div>

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 pb-32 space-y-12 animate-in fade-in duration-700">
      
      {/* 🚀 ACTION HEADER: Context-Aware Hub Navigation */}
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
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {isJoining ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Join Squad</>}
            </button>
          )}

          {isAuthorized ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-3xl hover:bg-black transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.15)] group"
            >
              <Plus size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
              Update project progress
            </button>
          ) : (
            <div className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-gray-100">
               <Lock size={16} /> View Only Access
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Data & Story */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 📊 LIVE MONITORING Card */}
          <section className="li-card p-12 bg-white border-gray-100 shadow-sm space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
               <Rocket size={180} />
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-blue-50/50 rounded-[32px] flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-inner">
                  <Rocket size={48} />
                </div>
                <div className="space-y-1">
                   <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">{project.title}</h1>
                   <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Institutional Key: {id?.slice(0, 12)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <span className={clsx(
                    "px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border shadow-xl",
                    project.progress === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5'
                 )}>
                   {project.status || 'Active'}
                 </span>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                    <CheckCircle2 size={12} /> Live Sync Active
                 </p>
              </div>
            </div>

            {/* HIGH-FIDELITY PROGRESS BAR */}
            <div className="space-y-5 pt-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Current Milestone Success</h3>
                  <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic">{(project.progress || 0)}%</span>
               </div>
               <div className="h-6 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1.5 shadow-inner">
                  <motion.div 
                    initial={false}
                    animate={{ width: `${project.progress || 0}%` }}
                    className={clsx(
                      "h-full rounded-full shadow-2xl transition-all duration-1000", 
                      project.progress === 100 ? "bg-emerald-500 shadow-emerald-500/30" : "bg-blue-600 shadow-blue-500/40"
                    )}
                  />
               </div>
            </div>

            <div className="pt-10 border-t border-gray-50 grid grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="flex items-center gap-4 group/stat">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all"><UsersIcon size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">COLLABORATORS</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase italic">{Math.max(members.length, 1)} SQUAD MATES</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group/stat">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">INITIATED</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase">JULY 2024</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group/stat hidden lg:flex">
                  <div className="h-12 w-12 bg-gray-50 rounded-[18px] flex items-center justify-center text-gray-400 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-600 transition-all"><ShieldCheck size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">VERIFICATION</p>
                    <p className="text-sm font-black text-gray-900 leading-none mt-2 uppercase">SYNCED HUB</p>
                  </div>
               </div>
            </div>
          </section>

          {/* MISSION STATMENT */}
          <section className="li-card p-12 bg-white border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-blue-600 rounded-full" />
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Mission Focus</h2>
             </div>
             <p className="text-gray-600 font-bold text-xl leading-relaxed italic border-l-4 border-gray-100 pl-8 py-3 bg-gray-50/30 rounded-r-3xl uppercase tracking-tighter">
               "{project.description || 'BUILDING THE NEXT GENERATION OF CAMPUS INNOVATION PROTOCOLS...'}"
             </p>
          </section>

          {/* TIMELINE Registry */}
          <section className="space-y-10">
             <div className="flex items-center justify-between px-4">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Audit Milestone History</h2>
                <div className="px-6 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{updates.length} TOTAL ENTRIES</div>
             </div>
             <ProgressHistory updates={updates} />
          </section>

        </div>

        {/* RIGHT COLUMN: Squad & Institutional Data */}
        <div className="space-y-10">
           
           {/* Squad Collaborators */}
           <div className="li-card p-10 bg-white border-gray-100 shadow-sm space-y-8">
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
                 {members.length === 0 && <p className="text-[11px] font-bold text-gray-400 italic">Synchronizing squad roster...</p>}
              </div>
           </div>

           {/* Institutional Stats */}
           <div className="p-10 bg-gray-900 rounded-[48px] text-white shadow-3xl shadow-gray-900/40 space-y-10 border border-white/5">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Campus Integrity Data</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Integrity Score</p>
                       <p className="text-2xl font-black text-emerald-400 tracking-tighter">98/100</p>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-400" />
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
