import { useState, useEffect } from 'react'
import { useParams, useOutletContext, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  User, 
  MapPin, 
  Briefcase, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Loader2, 
  Edit2,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Users,
  Code2,
  Rocket,
  ArrowRight,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react'

export default function Profile() {
  const { username: urlUsername } = useParams()
  const { profile: myProfile, fetchProfile: refetchMyProfile } = useOutletContext()
  const [searchParams] = useSearchParams()
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddingProject, setIsAddingProject] = useState(searchParams.get('action') === 'add_project')
  const [newProject, setNewProject] = useState({ title: '', description: '', domain: '', link: '', progress: 0 })
  const [saving, setSaving] = useState(false)

  const isOwnProfile = !urlUsername || urlUsername === myProfile?.username

  useEffect(() => {
    fetchProfileData()
  }, [urlUsername, myProfile])

  async function fetchProfileData() {
    try {
      setLoading(true)
      let targetProfile = null

      if (!urlUsername) {
        targetProfile = myProfile
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', urlUsername)
          .single()
        targetProfile = data
      }
      
      if (targetProfile) {
        setProfile(targetProfile)
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetProfile.id)
          .order('created_at', { ascending: false })
        
        setProjects(projectsData || [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProject(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          owner_id: myProfile.id,
          ...newProject,
          status: 'idea'
        })
        .select()
      
      if (error) throw error
      
      setProjects([data[0], ...projects])
      setIsAddingProject(false)
      setNewProject({ title: '', description: '', domain: '', link: '', progress: 0 })
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await supabase.from('projects').delete().eq('id', projectId)
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
       <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!profile) return (
    <div className="card p-12 text-center text-text-secondary">
       <X className="w-12 h-12 mx-auto mb-4" />
       <p className="font-semibold">Professional Profile Hub Not Found</p>
       <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Return Hub</Link>
    </div>
  )

  return (
    <div className="space-y-4 animate-fade-in pb-20">
      
      {/* Profile Header */}
      <section className="card overflow-hidden">
         <div className="h-32 bg-brand/5 border-b border-border-subtle"></div>
         <div className="px-6 pb-6 relative">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl bg-white border-4 border-white overflow-hidden shadow-2xl -mt-16 md:-mt-18 inline-block select-none pointer-events-none mb-4">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center border border-border-subtle text-slate-300">
                  <User size={64} />
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
               <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-text-main flex items-center gap-2 text-wrap break-all">
                    {profile.full_name} 
                    {profile.role === 'admin' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    <CheckCircle2 className="w-5 h-5 text-brand fill-brand/10 shrink-0" />
                  </h1>
                  <p className="text-sm font-semibold text-text-secondary leading-none">@{profile.username} • {profile.roll_number}</p>
                  <p className="text-sm font-medium text-text-main mt-2">{profile.department} | {profile.branch}</p>
               </div>
               
               <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <button className="btn-primary h-8 px-6">Set Availability</button>
                      <Link to="/onboarding" className="btn-outline h-8 px-4"><Edit2 size={14} /></Link>
                    </>
                  ) : (
                    <>
                      <button className="btn-primary h-8 px-8 shadow-lg shadow-brand/20">Connect</button>
                      <Link to={`/messages?user=${profile.id}`} className="btn-outline h-8 px-6">Direct Message</Link>
                    </>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* Projects Section */}
      <section className="card p-6 space-y-4">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-text-main">Innovation Hub ({projects.length})</h2>
           {isOwnProfile && (
             <button 
              onClick={() => setIsAddingProject(!isAddingProject)}
              className="p-1 px-3 bg-brand/5 border border-brand/20 text-brand rounded-full text-xs font-black transition-all hover:bg-brand hover:text-white"
             >
              {isAddingProject ? 'Cancel' : '+ New Proposal'}
             </button>
           )}
         </div>

         {isAddingProject && (
            <div className="p-5 bg-gray-50 border border-border-subtle rounded-xl animate-slide-up">
              <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary pl-1">Proposal Title</label>
                        <input 
                           type="text" 
                           placeholder="Ex. Distributed AI Grid"
                           value={newProject.title}
                           onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                           className="input-professional border border-border-subtle bg-white h-11"
                           required
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary pl-1">Domain (AI, Civil, etc.)</label>
                        <input 
                           type="text" 
                           placeholder="Ex. Information Tech"
                           value={newProject.domain}
                           onChange={(e) => setNewProject({...newProject, domain: e.target.value})}
                           className="input-professional border border-border-subtle bg-white h-11"
                           required
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-text-secondary pl-1">Project Abstract</label>
                     <textarea 
                        placeholder="Detailed technical description..."
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        className="input-professional border border-border-subtle bg-white resize-none h-24 p-4"
                        required
                     />
                  </div>
                  <div className="flex justify-end pt-2">
                     <button type="submit" disabled={saving} className="btn-primary min-w-[150px] h-11">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : 'Launch Project'}
                     </button>
                  </div>
              </form>
            </div>
         )}

         <div className="divide-y divide-border-subtle">
            {projects.length > 0 ? (
               projects.map((project) => (
                 <div key={project.id} className="py-6 first:pt-2 last:pb-2 group relative">
                    <div className="flex items-start justify-between gap-4 mb-2">
                       <h4 className="font-bold text-lg text-text-main group-hover:text-brand transition-colors">{project.title}</h4>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isOwnProfile && (
                             <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                <Trash2 size={16} />
                             </button>
                          )}
                       </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <span className="px-2 py-0.5 rounded-full bg-brand/5 border border-brand/10 text-brand font-black text-[9px] uppercase tracking-tighter">
                          {project.status}
                       </span>
                       <span className="text-[10px] font-bold text-text-secondary uppercase">{project.domain}</span>
                    </div>
                    <p className="text-sm text-text-main leading-relaxed mb-4 line-clamp-4">{project.description}</p>
                    
                    <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
                       <div className="h-full bg-brand transition-all duration-700" style={{ width: `${project.progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-text-secondary">
                                <User size={14} />
                             </div>
                          ))}
                       </div>
                       <Link to={`/messages?user=${project.owner_id}`} className="text-xs font-bold text-brand hover:underline flex items-center gap-1 group/btn">
                          Join Teaming <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
               ))
            ) : (
               <div className="py-10 text-center text-text-secondary">
                  <p className="text-sm font-medium">No active proposals in hub.</p>
               </div>
            )}
         </div>
      </section>
    </div>
  )
}
