import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useOutletContext, Link } from 'react-router-dom'
import { 
  Rocket, 
  Users, 
  Plus, 
  ExternalLink, 
  LayoutGrid,
  Zap,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Clock,
  Send,
  User,
  ShieldCheck,
  TrendingUp,
  Activity,
  FolderOpen
} from 'lucide-react'

export default function Dashboard() {
  const { profile } = useOutletContext()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')

  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    fetchDashboardData()
  }, [activeTab, profile])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      let query = supabase
        .from('projects')
        .select('*, profiles(full_name, avatar_url, department, username)')
        .order('created_at', { ascending: false })
      
      if (isAdmin && activeTab === 'department') {
        query = query.eq('domain', profile.department)
      } else {
        query = query.limit(10)
      }

      const { data } = await query
      setProjects(data || [])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
       <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
       <p className="text-text-secondary font-semibold text-xs animate-pulse uppercase tracking-wider">Loading Platform Data...</p>
    </div>
  )

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      
      {/* Role Switcher (Admin Only) */}
      {isAdmin && (
        <div className="card p-1 flex bg-gray-100 border-none rounded-lg">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
              activeTab === 'feed' ? 'bg-white shadow-sm text-brand' : 'text-text-secondary'
            }`}
          >
            Regional Feed
          </button>
          <button 
            onClick={() => setActiveTab('department')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
              activeTab === 'department' ? 'bg-white shadow-sm text-brand' : 'text-text-secondary'
            }`}
          >
            Department Oversight ({profile.department})
          </button>
        </div>
      )}

      {/* Admin Stats Header */}
      {isAdmin && activeTab === 'department' && (
        <div className="grid grid-cols-3 gap-4">
           {[
             { label: 'Active Projects', value: projects.length, icon: FolderOpen, color: 'text-brand' },
             { label: 'Incubating Ideas', value: projects.filter(p => p.status === 'idea').length, icon: Zap, color: 'text-amber-500' },
             { label: 'Department Velocity', value: 'High', icon: TrendingUp, color: 'text-emerald-500' },
           ].map((stat, i) => (
             <div key={i} className="card p-3 flex flex-col items-center justify-center text-center">
                <stat.icon size={16} className={`${stat.color} mb-1`} />
                <span className="text-[10px] font-bold text-text-secondary uppercase">{stat.label}</span>
                <span className="text-sm font-black text-text-main leading-none mt-1">{stat.value}</span>
             </div>
           ))}
        </div>
      )}

      {/* Start Post Bar (Students Only or Feed Mode) */}
      {(isAdmin || activeTab === 'feed') && (
        <div className="card p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border-subtle shadow-sm bg-gray-50">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-text-secondary" />
                  </div>
                )}
              </div>
              <Link to="/profile?action=add_project" className="flex-1 bg-white hover:bg-gray-100 border border-border-subtle rounded-full px-4 py-3 text-sm font-semibold text-text-secondary transition-colors block text-left">
                Initiate collaboration request...
              </Link>
          </div>
        </div>
      )}

      {/* Projects Feed */}
      <div className="space-y-4">
        {projects.map((project) => (
          <article key={project.id} className="card relative group">
            <div className="p-4 flex items-start gap-3">
               <Link to={`/profile/${project.username || project.user_id}`} className="shrink-0">
                  <div className="w-12 h-12 rounded-full border border-border-subtle overflow-hidden bg-gray-50 shadow-sm hover:ring-2 hover:ring-brand/20 transition-all">
                     {project.profiles?.avatar_url ? (
                       <img src={project.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-text-secondary" />
                       </div>
                     )}
                  </div>
               </Link>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                     <Link to={`/profile/${project.profiles?.username || project.user_id}`}>
                        <h4 className="font-semibold text-sm leading-tight text-text-main truncate hover:underline">{project.profiles?.full_name}</h4>
                        <p className="text-[11px] text-text-secondary leading-tight line-clamp-1">@{project.profiles?.username} • {project.profiles?.department}</p>
                     </Link>
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                       project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                       project.status === 'ongoing' ? 'bg-brand/5 text-brand border-brand/10' :
                       'bg-gray-100 text-text-secondary border-border-subtle'
                     }`}>
                        {project.status}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-medium">
                     <Activity className="w-3 h-3 text-brand" /> {project.progress}% Complete • {new Date(project.created_at).toLocaleDateString()}
                  </div>
               </div>
            </div>

            <div className="px-4 pb-2">
               <h3 className="font-semibold text-base text-text-main mb-1 tracking-tight group-hover:text-brand transition-colors">{project.title}</h3>
               <p className="text-sm text-text-main leading-relaxed line-clamp-3 whitespace-pre-wrap italic opacity-80">"{project.description}"</p>
               
               {/* Progress Bar */}
               <div className="mt-4 mb-2">
                 <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase mb-1">
                    <span>Incubation Progress</span>
                    <span>{project.progress}%</span>
                 </div>
                 <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        project.progress > 75 ? 'bg-emerald-500' : 
                        project.progress > 25 ? 'bg-brand' : 'bg-amber-500'
                      }`} 
                      style={{ width: `${project.progress}%` }} 
                    />
                 </div>
               </div>
            </div>

            {project.link && (
               <div className="px-4 py-2 border-t border-border-subtle bg-gray-50 flex items-center justify-between">
                  <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-brand hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> Project Nexus Link
                  </a>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">{project.domain}</span>
               </div>
            )}

            <div className="px-1 border-t border-border-subtle flex">
               <button className="btn-ghost flex-1 py-3 group">
                  <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Appreciate</span>
               </button>
               <button className="btn-ghost flex-1 py-3 group text-brand">
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Join Team</span>
               </button>
               <button className="btn-ghost flex-1 py-3 group">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Disseminate</span>
               </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
