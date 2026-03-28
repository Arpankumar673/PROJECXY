import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Building, 
  GraduationCap, 
  MessageSquare, 
  UserPlus, 
  ArrowLeft,
  Layers,
  Award,
  ChevronRight,
  Check
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ProfileData {
  id: string
  full_name: string | null
  username: string | null
  role: 'student' | 'department'
  department?: string
  about?: string
  skills?: string[]
  avatar_url?: string
  created_at?: string
}

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (!error && data) {
        setProfile(data as ProfileData)
      } else {
        navigate('/people')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [id, navigate])

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse tracking-[0.3em] uppercase italic bg-[#F3F2EF]">Syncing Identity Profile...</div>

  if (!profile) return null

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-24">
      {/* HEADER HERO */}
      <section className="bg-white border-b border-[#EBEBEB] relative">
         <div className="h-48 bg-gradient-to-r from-[#0A66C2] to-[#004182] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
         </div>
         
         <div className="max-w-[1128px] mx-auto px-4 lg:px-0 relative -mt-24 pb-8">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
               <div className="h-40 w-40 rounded-3xl bg-white p-1.5 shadow-2xl shadow-blue-900/10">
                  <div className="h-full w-full rounded-2xl bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] font-black text-6xl uppercase">
                     {profile.full_name?.charAt(0)}
                  </div>
               </div>
               
               <div className="flex-grow pb-2 space-y-2">
                  <div className="flex items-center gap-3">
                     <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">{profile.full_name}</h1>
                     <span className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        profile.role === 'department' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"
                     )}>
                        {profile.role}
                     </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#666666] font-bold text-sm uppercase tracking-widest italic opacity-80">
                     <p className="flex items-center gap-1.5 leading-none">@{profile.username}</p>
                     <p className="flex items-center gap-1.5 leading-none">
                        {profile.role === 'department' ? <Building size={16} /> : <GraduationCap size={16} />}
                        {profile.department || 'General Institutional Account'}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3 pb-2">
                  <button 
                    onClick={() => navigate('/messages')}
                    className="flex items-center justify-center gap-2 h-12 px-8 bg-[#0A66C2] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#004182] transition-colors shadow-lg shadow-blue-500/10"
                  >
                     <MessageSquare size={18} /> Message
                  </button>
                  <button 
                    onClick={() => setIsConnected(!isConnected)}
                    className={clsx(
                      "flex items-center justify-center gap-2 h-12 px-6 font-black uppercase text-xs tracking-widest rounded-xl border transition-all",
                      isConnected 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : "bg-white border-[#0A66C2] text-[#0A66C2] hover:bg-[#F3F6F9]"
                    )}
                  >
                     {isConnected ? <><Check size={18} /> Connected</> : <><UserPlus size={18} /> Connect</>}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* BODY GRID */}
      <main className="max-w-[1128px] mx-auto px-4 lg:px-0 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: ABOUT & SKILLS */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT */}
            <section className="bg-white rounded-3xl border border-[#EBEBEB] overflow-hidden">
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                     <h2 className="font-black text-gray-900 uppercase tracking-tighter text-xl italic leading-none">Professional About</h2>
                     <Layers size={20} className="text-gray-300" />
                  </div>
                  <div className="text-[#666666] font-medium leading-relaxed uppercase tracking-tighter text-base whitespace-pre-wrap">
                     {profile.about || "This representative has not yet formalized their academic or institutional background summary. Connection required to request a comprehensive record update."}
                  </div>
               </div>
            </section>

            {/* PROJECTS PLACEHOLDER (Institutional Record) */}
            <section className="bg-white rounded-3xl border border-[#EBEBEB] p-8 space-y-6">
               <div className="flex justify-between items-center">
                  <h2 className="font-black text-gray-900 uppercase tracking-tighter text-xl italic leading-none">Campus Initiatives</h2>
                  <Award size={20} className="text-gray-300" />
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="group p-6 rounded-2xl border border-[#F3F2EF] hover:border-[#0A66C2] transition-all flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="font-black text-gray-900 uppercase tracking-tight text-lg group-hover:text-[#0A66C2] transition-colors leading-none">Research Initiative Record {i+1}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">In Progress • Active Archive</p>
                       </div>
                       <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0A66C2] transition-all" />
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* RIGHT COLUMN: STATS & SKILLS */}
         <div className="space-y-8">
            
            {/* SKILLS */}
            <section className="bg-white rounded-3xl border border-[#EBEBEB] p-8 space-y-6">
               <h2 className="font-black text-gray-900 uppercase tracking-tighter text-xl italic leading-none">Competencies</h2>
               <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, ridx) => (
                    <span key={ridx} className="px-4 py-2 bg-[#F3F2EF] text-[#666666] font-black uppercase text-[10px] tracking-widest rounded-xl border border-transparent hover:border-gray-200 transition-all">
                       {skill}
                    </span>
                  )) : (
                    <p className="text-xs text-gray-400 font-black uppercase leading-none italic">No skill tags indexed yet.</p>
                  )}
               </div>
            </section>

            {/* QUICK ACTIONS / STATS */}
            <section className="bg-white rounded-3xl border border-[#EBEBEB] overflow-hidden">
               <div className="p-8 space-y-6">
                  <h2 className="font-black text-gray-900 uppercase tracking-tighter text-xl italic leading-none">Account Intel</h2>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between border-b border-[#F3F2EF] pb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</span>
                        <span className="text-xs font-black text-gray-900 uppercase">{profile.created_at ? format(new Date(profile.created_at), 'MMM yyyy') : 'N/A'}</span>
                     </div>
                     <div className="flex items-center justify-between border-b border-[#F3F2EF] pb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Verification</span>
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                           <Check size={12} strokeWidth={3} /> Institutional Proxy
                        </div>
                     </div>
                  </div>
               </div>
               <button 
                 onClick={() => navigate('/people')}
                 className="w-full h-16 bg-[#F3F2EF] text-[#666666] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#EBEBEB] transition-colors border-t border-[#EBEBEB]"
               >
                  <ArrowLeft size={16} /> Return to Registry
               </button>
            </section>
         </div>
      </main>
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function format(date: Date, formatStr: string) {
   // Basic formatter mock since we already use date-fns in Messages but I want to keep this simple
   const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
   if (formatStr === 'MMM yyyy') return `${months[date.getMonth()]} ${date.getFullYear()}`
   return date.toLocaleDateString()
}
