import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Rocket, 
  Users as UsersIcon, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  User,
  Loader2,
  Terminal,
  Flag,
  MessageSquare,
  CheckCircle,
  Shield
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'
import UpdateProgressModal from '../components/UpdateProgressModal'
import ProgressHistory from '../components/ProgressHistory'
import ApplyModal from '../components/projects/ApplyModal'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: string
  title: string
  description: string
  progress?: number
  status?: string
  user_id?: string
  created_by?: string
  department?: string
  created_at: string
  roles_open?: any[]
}

interface Member {
  id: string
  full_name: string
  avatar_url: string
  role?: string
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
  const { user, profile } = useAuth()
  
  const isDepartment = profile?.role === 'department'
  const [project, setProject] = useState<Project | null>(null)
  const [updates, setUpdates] = useState<any[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [myRequest, setMyRequest] = useState<any>(null)
  const [incomingRequests, setIncomingRequests] = useState<any[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  // Department Controls States
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  const isOwner = (project?.user_id === user?.id) || (project?.created_by === user?.id)
  const isAuthorized = useMemo(() => {
    if (!user || !project) return false
    if (isOwner) return true
    return members.some(m => m.id === user.id)
  }, [user, project, members, isOwner])

  const derivedProgress = useMemo(() => {
    if (updates.length > 0) {
      const latest = updates[0]
      return STAGE_PROGRESS[latest.stage || latest.status] || project?.progress || 0
    }
    return project?.progress || 0
  }, [project, updates])

  const fetchData = async () => {
    if (!id) return
    
    try {
      // 1. Fetch Project Core
      const { data: proj, error: projError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (projError) throw projError
      if (proj) setProject(proj)

      // 2. Fetch Milestone Feed
      const { data: hist } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
      
      if (hist) {
        setUpdates(hist.map(u => ({
          ...u,
          stage: u.status,
          update_text: u.description,
          profiles: { full_name: 'Innovation Team' }
        })))
      }

      // 3. Fetch Squad Registry (Wait for Project to get leader ID)
      const { data: membersList } = await supabase
        .from('project_members')
        .select('user_id, role')
        .eq('project_id', id)
      
      const uids = membersList?.map(m => m.user_id) || []
      const leaderId = proj.user_id
      if (!uids.includes(leaderId)) uids.push(leaderId) 

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', uids)
      
      if (profileError) console.error('[PROJECXY]: Profile fetch error:', profileError)
      
      if (profiles) {
        // Map roles to profiles
        const mappedMembers = profiles.map(p => ({
          ...p,
          role: p.id === leaderId ? 'Project Lead' : (membersList?.find(m => m.user_id === p.id)?.role || 'Contributor')
        }))
        // Sort to put Leader at top
        const sortedMembers = [...mappedMembers].sort((a) => a.id === leaderId ? -1 : 1)
        setMembers(sortedMembers)
      }
       // 4. Fetch Recruitment Data
      if (user) {
        if (proj?.user_id === user.id) {
           const { data: requests } = await supabase
             .from('join_requests')
             .select('*, profiles:user_id(full_name, avatar_url, skills)')
             .eq('project_id', id)
             .eq('status', 'pending')
           setIncomingRequests(requests || [])
        } else {
           const { data: myReq } = await supabase
             .from('join_requests')
             .select('*')
             .eq('project_id', id)
             .eq('user_id', user.id)
             .maybeSingle()
           setMyRequest(myReq)
        }
      }

    } catch (err: any) {
      console.error('[PROJECXY SYNC]: Sync Error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, status: 'accepted' | 'rejected', candidateId: string, roleName: string) => {
     setProcessingId(requestId)
     try {
       const { data: updatedRows, error: updateError } = await supabase
         .from('join_requests')
         .update({ status })
         .eq('id', requestId)
         .select()
       
       if (updateError) throw updateError
       if (!updatedRows || updatedRows.length === 0) {
          throw new Error('Update failed: No rows were modified. This is likely due to Supabase RLS (Row Level Security) policies preventing you from updating this request.')
       }

       const { error: notifError } = await supabase.from('notifications').insert({
          user_id: candidateId,
          title: status === 'accepted' ? 'Mission Joined! 🎉' : 'Application Update',
          message: status === 'accepted' 
            ? `You have been accepted into ${project?.title} as a ${roleName}!` 
            : `Your application to ${project?.title} was reviewed. Keep exploring other missions!`
       })
       if (notifError) console.warn('[PROJECXY NOTIF ERROR]:', notifError)

       if (status === 'accepted') {
          const { error: memberError } = await supabase.from('project_members').insert({
            project_id: id!,
            user_id: candidateId,
            role: roleName
          })
          if (memberError) {
             console.error('[PROJECXY MEMBER ERROR]:', memberError)
             if (memberError.code !== '23505') throw memberError
          }
       }
       await fetchData()
       console.log('[PROJECXY]: Action successful for', requestId)
     } catch (err: any) {
       console.error('[PROJECXY ERROR]:', err)
       alert(`CRITICAL ERROR: ${err.message || 'Unknown Error'}. Details logged to console.`)
     } finally {
       setProcessingId(null)
     }
  }
  
  // Department Controls Handlers
  const handleFlagProject = async () => {
    if (!id) return
    setIsActionLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'flagged' })
        .eq('id', id)
      
      if (error) throw error
      alert('SUCCESS: Project has been flagged for review.')
      await fetchData()
    } catch (err: any) {
      console.error('[PROJECXY FLAG ERROR]:', err.message)
      alert('Error flagging project: ' + err.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleSendFeedback = async () => {
    if (!id || !feedbackText.trim()) return
    setIsActionLoading(true)
    try {
       // Universal Schema Fix: Combining feedback into the 'title' column 
       // to bypass 'missing column' errors in the notifications table.
       const { error: notifError } = await supabase.from('notifications').insert({
          user_id: project?.user_id,
          title: `INSTITUTIONAL REVIEW: ${feedbackText}`
       })

       if (notifError) throw notifError

       alert('SUCCESS: Feedback has been transmitted to the project lead.')
       setFeedbackText('')
       setIsFeedbackModalOpen(false)
    } catch (err: any) {
       console.error('[PROJECXY FEEDBACK ERROR]:', err.message)
       alert('Error submitting feedback: ' + err.message)
    } finally {
       setIsActionLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!id) return
    setIsActionLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed', progress: 100 })
        .eq('id', id)
      
      if (error) throw error
      alert('SUCCESS: Project marked as completed.')
      await fetchData()
    } catch (err: any) {
      console.error('[PROJECXY COMPLETE ERROR]:', err.message)
      alert('Error marking project as complete: ' + err.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id, user?.id])

  const availableRoles = project?.roles_open?.length ? project.roles_open : [
    { name: 'Developer', spots: 2, skills: ['React', 'Supabase'] },
    { name: 'Designer', spots: 1, skills: ['Figma', 'Prototyping'] }
  ]

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-black text-gray-400 opacity-20 animate-pulse uppercase tracking-[0.5em]"><Loader2 size={40} className="animate-spin mb-6" /> Progress...</div>
  if (!project) return <div className="p-24 text-center font-black text-rose-600 uppercase tracking-widest bg-white h-screen">SYNC FAIL: PROJECT_OFFLINE</div>

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 pb-32 space-y-12 animate-in fade-in duration-700 font-sans">
      
      {/* Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666666] hover:text-black font-black text-xs uppercase tracking-widest transition-all bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100"
        >
          <ArrowLeft size={16} /> Repository Hub
        </button>

        <div className="flex items-center gap-4">
          {myRequest && (
            <div className="flex items-center gap-3 px-8 py-4 bg-blue-50 text-[#0A66C2] font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-blue-100 italic">
               <ShieldCheck size={16} /> Request Sent
            </div>
          )}

          {isAuthorized && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-3xl hover:bg-black transition-all shadow-xl"
            >
              <Plus size={18} /> Log Progress
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          <section className="li-card p-12 bg-white rounded-[48px] shadow-sm space-y-10 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-blue-50/50 rounded-[32px] flex items-center justify-center text-blue-600 border border-blue-100/50">
                  <Rocket size={48} />
                </div>
                <div className="space-y-1">
                   <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase">{project.title}</h1>
                   <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">MISSION REPOSITORY ID: {id?.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 text-right">
                 <span className="px-6 py-2.5 bg-blue-50 text-[#0A66C2] rounded-full font-black text-[10px] uppercase tracking-widest shadow-blue-500/5 border border-blue-100">
                   {project.status || 'OPERATIONAL'}
                 </span>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 italic">
                    <CheckCircle size={12} /> Sync Engine Online
                 </p>
              </div>
            </div>

            {(isDepartment || isOwner) && (
              <div className="space-y-5 pt-4">
                 <div className="flex justify-between items-end">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Project Progress</h3>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic">{derivedProgress}%</span>
                 </div>
                 <div className="h-6 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1.5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${derivedProgress}%` }}
                      className="h-full bg-blue-600 rounded-full shadow-2xl transition-all duration-1000" 
                    />
                 </div>
              </div>
            )}

            <div className="pt-10 border-t border-gray-50 flex items-center gap-12">
               {(isDepartment || isOwner) && (
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0A66C2] shadow-sm"><UsersIcon size={24} /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">TEAM SIZE</p>
                      <p className="text-sm font-black text-gray-900 mt-2 italic tracking-tighter uppercase">{members.length} INNOVATORS</p>
                    </div>
                 </div>
               )}
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">INITIATED</p>
                    <p className="text-sm font-black text-gray-900 mt-2 italic tracking-tighter uppercase">{new Date(project.created_at).getFullYear()}</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="li-card p-12 bg-white rounded-[40px] shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-[#0A66C2] rounded-full" />
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Mission Objective</h2>
             </div>
             <p className="text-gray-600 font-bold text-xl leading-relaxed italic border-l-4 border-gray-50 pl-8 py-3 bg-gray-50/50 rounded-r-3xl">
               "{project.description}"
             </p>
          </section>

          {/* Join Flow Roles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <Rocket className="text-blue-600" size={24} />
               <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Join Team</h2>
            </div>
            
            {isAuthorized ? (
              <div className="p-8 bg-blue-50 border border-blue-100 rounded-[32px] text-center">
                <p className="text-[#0A66C2] font-black text-lg uppercase tracking-tight italic">You are part of this project</p>
              </div>
            ) : myRequest ? (
              <div className="p-8 bg-gray-50 border border-gray-100 rounded-[32px] text-center">
                <p className="text-gray-500 font-black text-lg uppercase tracking-tight italic">Your application is being reviewed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {availableRoles.map(role => {
                    const existingCount = members.filter(m => m.role === role.name).length
                    const spotsLeft = Math.max(0, role.spots - existingCount)
                    const isFull = spotsLeft === 0

                    return (
                      <div key={role.name} className="li-card p-8 bg-white border-gray-100 shadow-sm hover:shadow-xl transition-all rounded-[32px] space-y-6 group">
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                               <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter group-hover:text-[#0A66C2] transition-colors">{role.name}</h3>
                               <div className="flex flex-wrap gap-2">
                                  {role.skills.map((s: string) => (
                                     <span key={s} className="text-[9px] font-black bg-gray-50 text-gray-500 px-2.5 py-1 rounded-md border border-gray-100 uppercase tracking-widest">{s}</span>
                                  ))}
                               </div>
                            </div>
                            <span className={clsx(
                              "text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border",
                              isFull ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-[#0A66C2] border-blue-100"
                            )}>
                              {isFull ? "Full" : `${spotsLeft} spots left`}
                            </span>
                         </div>
                         <button 
                           disabled={isFull}
                           onClick={() => { setSelectedRole(role.name); setIsApplyModalOpen(true); }}
                           className={clsx(
                             "w-full h-14 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-sm",
                             isFull 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-[#F3F6F9] hover:bg-[#0A66C2] hover:text-white text-[#666666] hover:shadow-xl hover:shadow-blue-500/20"
                           )}
                         >
                            {isFull ? "Role Filled" : "Apply for this role"}
                         </button>
                      </div>
                    )
                 })}
              </div>
            )}
          </section>

          {(isDepartment || isOwner) && (
            <section className="space-y-10">
               <div className="flex items-center gap-3 px-4">
                  <Terminal className="text-blue-600" size={18} />
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Project Review</h2>
               </div>
               <ProgressHistory updates={updates} />
            </section>
          )}

        </div>

        <div className="space-y-10">
           {isOwner && incomingRequests.length > 0 && (
             <div className="p-10 bg-[#0A66C2] rounded-[48px] text-white shadow-3xl shadow-blue-900/40 space-y-8 border border-white/5 relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase">Recruitment Hub</h3>
                   <p className="text-blue-100 font-bold text-[10px] uppercase tracking-[0.2em]">{incomingRequests.length} INCOMING REQUESTS</p>
                </div>
                <div className="space-y-4 relative z-10">
                   {incomingRequests.map(req => (
                      <div key={req.id} className="bg-white p-6 rounded-3xl space-y-4 shadow-2xl">
                         <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0A66C2]"><User size={20} /></div>
                            <div>
                               <p className="text-sm font-black text-gray-900 leading-none">{req.profiles?.full_name}</p>
                               <p className="text-[9px] font-bold text-gray-400 italic uppercase mt-1">Role: {req.role_name}</p>
                            </div>
                         </div>
                         <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">"{req.message}"</p>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => handleRequestAction(req.id, 'accepted', req.user_id, req.role_name)}
                              className="flex-grow h-10 bg-emerald-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                            >
                               Accept
                            </button>
                            <button 
                              onClick={() => handleRequestAction(req.id, 'rejected', req.user_id, req.role_name)}
                              className="flex-grow h-10 bg-gray-50 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest"
                            >
                               Decline
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

            {isDepartment && (
              <div className="p-10 bg-gray-900 rounded-[40px] text-white space-y-8 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="text-blue-400" size={20} />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Department Controls</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    disabled={isActionLoading || project.status === 'flagged'}
                    onClick={handleFlagProject}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    <Flag size={14} /> {project.status === 'flagged' ? 'Issue Flagged' : 'Report Issue'}
                  </button>
                  <button 
                    disabled={isActionLoading}
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <MessageSquare size={14} /> Give Feedback
                  </button>
                  <button 
                    disabled={isActionLoading || project.status === 'completed'}
                    onClick={handleMarkComplete}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:bg-emerald-500/50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={14} /> {project.status === 'completed' ? 'Marked Complete' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            )}

            <div className="li-card p-10 bg-white rounded-[40px] space-y-8 shadow-sm border border-gray-100">
               <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                 <UsersIcon size={14} className="text-blue-600" /> Team Members
               </h3>
               <div className="space-y-5">
                  {members.filter(m => isDepartment || isOwner || m.id === user?.id).map(member => (
                    <div key={member.id} className="flex items-center gap-5 group">
                       <div className="h-14 w-14 bg-gray-100 rounded-[22px] flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                         <User size={26} />
                       </div>
                       <div className="flex-grow">
                          <p className="text-sm font-black text-gray-900 leading-none italic uppercase">{member.full_name}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-[0.15em]">{member.role}</p>
                       </div>
                    </div>
                  ))}
                  {(!isDepartment && !isOwner) && members.filter(m => m.id === user?.id).length === 0 && (
                    <p className="text-xs text-gray-400 font-medium italic">Join the project to see team details.</p>
                  )}
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

      <ApplyModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        project={project}
        roleName={selectedRole}
        onApplySuccess={fetchData}
      />

      <AnimatePresence>
        {isFeedbackModalOpen && (
           <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsFeedbackModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[32px] shadow-3xl p-10 relative z-10 border border-gray-100"
              >
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <MessageSquare size={24} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Give Feedback</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Institutional Review</p>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Comments</label>
                       <textarea 
                         value={feedbackText}
                         onChange={(e) => setFeedbackText(e.target.value)}
                         placeholder="Describe your review or required adjustments..."
                         className="w-full h-40 bg-gray-50 border-none rounded-2xl p-6 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none resize-none transition-all placeholder:text-gray-300"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setIsFeedbackModalOpen(false)}
                          className="h-14 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all"
                        >
                           Cancel
                        </button>
                        <button 
                          disabled={!feedbackText.trim() || isActionLoading}
                          onClick={handleSendFeedback}
                          className="h-14 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                           {isActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={16} />}
                           Finalize Submission
                        </button>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  )
}
