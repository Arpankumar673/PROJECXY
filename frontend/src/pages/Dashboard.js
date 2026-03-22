import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, TrendingUp, Users, ArrowRight, MessageSquare, ListTodo, Activity, 
  Loader2, CheckCircle2, Award, Zap, ShieldCheck, LayoutDashboard, Tag, Calendar, Rocket 
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { projectService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * 🍱 INDUSTRIAL PROJECT CARD
 * Provides a high-impact overview of a specific institutional initiative.
 */
export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="p-0 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer bg-white group flex flex-col md:flex-row items-center border-l-8 border-l-linkedin-blue overflow-hidden rounded-[32px] shadow-sm" 
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex-1 p-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
             project.status === 'recruiting' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
             project.status === 'completed' ? 'bg-linkedin-blue text-white border-linkedin-blue' : 
             'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
           }`}>{project.status}</span>
           
           <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
           </div>
        </div>

        <h3 className="text-3xl font-black mb-4 group-hover:text-linkedin-blue transition-colors leading-tight text-linkedin-text tracking-tight">{project.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-8 font-medium max-w-xl">{project.abstract}</p>
        
        {/* Dynamic Tag Architecture */}
        <div className="flex flex-wrap gap-2 mb-10">
           {(project.tags || ['Innovation', 'Collaboration']).map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF3F8] text-gray-600 text-[10px] font-black uppercase rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:text-linkedin-blue transition-colors">
                 <Tag className="w-3 h-3" />
                 {tag}
              </span>
           ))}
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-50 pt-8">
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + project.id}`} className="inline-block h-10 w-10 rounded-full ring-4 ring-white border border-gray-50 shadow-sm" alt="collaborator" />
                ))}
             </div>
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden sm:block">ACTIVE TEAM</p>
          </div>
          <div className="flex items-center gap-2 text-linkedin-blue font-black text-[10px] uppercase tracking-[0.25em] group-hover:gap-4 transition-all">
             Examine Blueprint <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const { data, error } = await projectService.getProjects();
        if (error) throw error;
        if (data) {
           setProjects(data);
        }
    } catch(e) { console.error("DEBUG: Sync failure:", e); }
    finally { setLoading(false); }
  };

  if (authLoading || loading) return (
     <div className="flex h-screen flex-col items-center justify-center bg-[#F3F6F8] gap-6 animate-pulse">
        <div className="relative scale-150">
           <div className="w-16 h-16 border-4 border-linkedin-blue/20 rounded-full"></div>
           <div className="w-16 h-16 border-4 border-linkedin-blue border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
        <div className="text-center pt-8">
           <p className="text-linkedin-text font-black uppercase tracking-[0.4em] text-xs">Accessing Institutional Archives</p>
           <p className="text-gray-400 text-[9px] mt-2 font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-linkedin-blue" />
              Secure Profile Synchronized
           </p>
        </div>
     </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-24 px-4 sm:px-0">
        
        {/* PERSUASIVE HEADER */}
        <header className="relative p-16 bg-white rounded-[48px] shadow-card border border-gray-100 overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-1000 scale-150"><LayoutDashboard className="w-64 h-64 text-linkedin-blue" /></div>
           <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 text-linkedin-blue text-[10px] font-black uppercase tracking-[0.25em] border border-blue-100 shadow-sm">INSTITUTIONAL HUB</div>
              <h1 className="text-5xl md:text-6xl font-black text-linkedin-text leading-[1.1] tracking-tight">Fuel Your <span className="text-linkedin-blue underline decoration-[12px] underline-offset-8 decoration-linkedin-blue/10">Academic</span> Legacy.</h1>
              <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">Your professional portfolio starts here, <span className="text-linkedin-text font-bold uppercase tracking-tight">{profile?.full_name?.split(' ')[0] || 'Innovator'}</span>. Navigate institutional projects and lead collaborative excellence.</p>
              <div className="flex gap-4 pt-4">
                 <Button size="lg" className="h-16 px-12 rounded-2xl shadow-xl hover:shadow-blue-200 text-lg uppercase tracking-widest font-black" onClick={() => navigate('/projects/new')}>Launch Initiative</Button>
              </div>
           </div>
        </header>

        {/* STATS: DATA DRIVEN SOCIAL PROOF */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
              { label: 'Total Archives', value: projects.length, icon: ListTodo, color: 'text-linkedin-blue' },
              { label: 'Network Size', value: '142', icon: Users, color: 'text-emerald-500' },
              { label: 'Platform Rank', value: '#12', icon: TrendingUp, color: 'text-amber-500' },
              { label: 'Certifications', value: '3', icon: Award, color: 'text-purple-500' }
           ].map((s, i) => (
              <Card key={i} className="p-10 border-none shadow-md hover:shadow-xl transition-all group flex flex-col items-center text-center bg-white rounded-[40px]">
                 <div className={`w-14 h-14 rounded-[20px] bg-gray-50 flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-sm ${s.color}`}>
                    <s.icon className="w-7 h-7" />
                 </div>
                 <h4 className="text-4xl font-black text-linkedin-text mb-2 tracking-tighter">{s.value}</h4>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">{s.label}</p>
              </Card>
           ))}
        </section>

        {/* CORE DISCOVERY FEED */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-14 rounded-[48px] shadow-card border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                 <div className="space-y-2">
                    <h2 className="text-4xl font-black flex items-center gap-5 uppercase tracking-tighter">
                       <Rocket className="w-10 h-10 text-linkedin-blue animate-pulse" />
                       Discovery Hub
                    </h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] pl-1">REAL-TIME INSTITUTIONAL PROJECT FEED</p>
                 </div>
                 <button onClick={fetchData} className="text-linkedin-blue font-black text-[10px] bg-blue-50 px-8 h-12 rounded-xl border border-blue-100 hover:bg-linkedin-blue hover:text-white transition-all uppercase tracking-widest shadow-sm">Sync Database</button>
              </div>
              
              <div className="space-y-10">
                {projects.length > 0 ? (
                  projects.map(p => <ProjectCard key={p.id} project={p} />)
                ) : (
                  <div className="text-center py-32 border-[6px] border-dashed border-gray-50 rounded-[48px] flex flex-col items-center group">
                     <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-12 shadow-inner group-hover:scale-105 transition-transform">
                        <Plus className="w-16 h-16" />
                     </div>
                     <h3 className="text-3xl font-black text-linkedin-text mb-6 tracking-tighter uppercase">No projects yet</h3>
                     <p className="text-gray-400 font-medium mb-12 max-w-sm mx-auto tracking-normal leading-relaxed">Your department's innovation stream is quiet. Anchor the first initiative today.</p>
                     <Button size="lg" className="h-18 px-16 text-xl shadow-2xl hover:shadow-blue-300 rounded-[24px] uppercase tracking-widest font-black" onClick={() => navigate('/projects/new')}>Post First project</Button>
                  </div>
                )}
              </div>
            </section>
          </div>
          
          <div className="space-y-12">
            {/* GATEWAY */}
            <section className="bg-white p-12 rounded-[48px] shadow-card border border-gray-100">
               <h3 className="font-black text-2xl mb-10 flex items-center gap-4 uppercase tracking-tighter"><Zap className="w-7 h-7 text-linkedin-blue" /> Quick Gateway</h3>
               <div className="space-y-5">
                  {[
                     { label: 'Anchor New Project', path: '/projects/new', icon: Plus },
                     { label: 'Incoming Interest', path: '/dashboard', icon: MessageSquare },
                     { label: 'Institutional Flux', path: '/dashboard', icon: Users },
                  ].map((action, i) => (
                     <button key={i} onClick={() => navigate(action.path)} className="w-full p-8 text-left border border-gray-100 hover:border-linkedin-blue hover:bg-blue-50/20 rounded-[32px] transition-all group flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-[20px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-linkedin-blue group-hover:text-white transition-all shadow-sm"><action.icon className="w-7 h-7" /></div>
                           <p className="font-black text-sm text-linkedin-text uppercase tracking-tighter group-hover:text-linkedin-blue transition-colors">{action.label}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-200 group-hover:text-linkedin-blue transform group-hover:translate-x-2 transition-all" />
                     </button>
                  ))}
               </div>
            </section>

            {/* LIVE STREAM */}
            <section className="bg-white p-12 rounded-[48px] shadow-card border border-gray-100 relative group overflow-hidden">
               <h3 className="font-black text-2xl mb-12 flex items-center gap-4 uppercase tracking-tighter"><Activity className="w-7 h-7 text-linkedin-blue" /> Institutional Flux</h3>
               <div className="space-y-12">
                  {[
                     { user: 'Sarah J.', action: 'requested to join', target: 'Agri Bot', time: '2h ago' },
                     { user: 'Me', action: 'added milestone', target: 'Grid Pro', time: '5h ago' }
                  ].map((act, i) => (
                     <div key={i} className="flex gap-5 relative group/item">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user}`} className="w-16 h-16 rounded-[24px] border border-gray-100 shadow-md group-hover/item:scale-110 transition-transform" alt="innovator" />
                        <div className="flex flex-col pt-2">
                           <p className="text-sm font-medium text-gray-500 leading-snug">
                              <span className="font-black text-linkedin-text uppercase text-xs">{act.user}</span> {act.action} <span className="font-black text-linkedin-blue">{act.target}</span>
                           </p>
                           <p className="text-[10px] text-gray-400 font-black uppercase mt-2 tracking-widest">{act.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
          </div>
        </div>
      </div>
  );
};
