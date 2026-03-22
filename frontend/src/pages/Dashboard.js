import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Users, ArrowRight, MessageSquare, Activity, 
  Search, Filter, Bookmark, Star, Rocket, Zap, 
  ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { Button, Card, Input, cn } from '../components/ui';
import { projectService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * 🎨 STATUS BADGE
 */
const StatusBadge = ({ status }) => {
    const configs = {
        open: "bg-emerald-50 text-emerald-600 border-emerald-100",
        closed: "bg-gray-100 text-gray-500 border-gray-200",
        in_progress: "bg-blue-50 text-projecxy-blue border-blue-100",
        completed: "bg-projecxy-blue text-white border-projecxy-blue"
    };
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            configs[status] || configs.open
        )}>
            {status.replace('_', ' ')}
        </span>
    );
};

/**
 * 📊 PROGRESS BAR
 */
const ProgressBar = ({ progress, label }) => (
    <div className="w-full">
        {label && <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5 text-projecxy-secondary">
            <span>{label}</span>
            <span>{progress}%</span>
        </div>}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-projecxy-blue transition-all duration-1000" 
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

/**
 * 📦 PROJECT CARD (FEED)
 */
const FeedCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="p-6 border border-gray-100 hover:shadow-soft transition-all cursor-pointer bg-white group rounded-2xl" 
      onClick={() => navigate(`/projects/${project.id}`)}
    >
        <div className="flex justify-between items-start mb-4">
            <StatusBadge status={project.status || 'open'} />
            <button className="text-gray-300 hover:text-amber-400 transition-colors">
                <Bookmark className="w-5 h-5" />
            </button>
        </div>

        <h3 className="text-lg font-bold text-projecxy-text group-hover:text-projecxy-blue transition-colors mb-2">{project.title}</h3>
        <p className="text-sm text-projecxy-secondary line-clamp-2 mb-4 leading-relaxed">{project.abstract}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
           {(project.tags || ['Web', 'AI']).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-50 text-projecxy-secondary text-[10px] font-bold uppercase rounded-md border border-gray-100">
                 {tag}
              </span>
           ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + project.id}`} className="w-7 h-7 rounded-lg ring-2 ring-white border border-gray-100" alt="avatar" />
                ))}
             </div>
             <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-tight">{project.team_size || 3} Slots Left</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-projecxy-blue transform group-hover:translate-x-1 transition-all" />
        </div>
    </Card>
  );
};

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();
    const [view, setView] = useState('campus_feed'); // 'campus_feed' or 'my_projects'
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
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
            setProjects(data || []);
        } catch(e) { console.error("Sync failure:", e); }
        finally { setLoading(false); }
    };

    if (authLoading) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 👋 WELCOME HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-soft">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-projecxy-text flex items-center gap-3">
                        Hi, {profile?.full_name?.split(' ')[0] || 'Innovator'}! 
                        <span className="text-2xl animate-bounce">🚀</span>
                    </h1>
                    <p className="text-projecxy-secondary font-medium">Ready to change the academic landscape today?</p>
                </div>
                <Button size="lg" className="rounded-2xl shadow-soft h-14 px-8 uppercase tracking-widest text-xs font-bold" onClick={() => navigate('/projects/new')}>
                    <Plus className="w-5 h-5 mr-2" /> Launch New Project
                </Button>
            </header>

            {/* 📊 STATS (MINIFIED) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Live Projects', value: '24', icon: Rocket, color: 'text-blue-500' },
                    { label: 'Connections', value: '142', icon: Users, color: 'text-emerald-500' },
                    { label: 'Activity', value: 'High', icon: Activity, color: 'text-amber-500' },
                    { label: 'Reputation', value: '820', icon: Star, color: 'text-purple-500' }
                ].map((s, i) => (
                    <Card key={i} className="p-4 border-none shadow-soft flex items-center gap-4 bg-white rounded-2xl group cursor-default hover:bg-projecxy-blue/5 transition-all">
                        <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-110", s.color)}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-tight">{s.label}</p>
                            <h4 className="text-lg font-black text-projecxy-text leading-tight">{s.value}</h4>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 🧭 NAVIGATION TABS */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-px">
                <div className="flex gap-8">
                    {['campus_feed', 'my_projects'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setView(t)}
                            className={cn(
                                "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                                view === t ? "text-projecxy-blue" : "text-gray-400 hover:text-projecxy-text"
                            )}
                        >
                            {t.replace('_', ' ')}
                            {view === t && <span className="absolute bottom-0 left-0 right-0 h-1 bg-projecxy-blue rounded-full" />}
                        </button>
                    ))}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-projecxy-blue transition-colors"><LayoutGrid className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-projecxy-blue transition-colors"><List className="w-5 h-5" /></button>
                </div>
            </div>

            {/* 🔎 SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-soft focus:ring-2 focus:ring-projecxy-blue outline-none transition-all placeholder:text-gray-400 text-sm"
                        placeholder="Search for projects, domains, or students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 border-gray-100 rounded-2xl text-xs uppercase tracking-widest font-bold px-6">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
            </div>

            {/* 🌪️ MAIN FEED */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {view === 'campus_feed' ? (
                    projects.length > 0 ? (
                        projects.map(p => <FeedCard key={p.id} project={p} />)
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-gray-200">
                                <Plus className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold">No projects discovered yet</h3>
                            <Button variant="secondary" onClick={() => navigate('/projects/new')}>Create the first one</Button>
                        </div>
                    )
                ) : (
                    <div className="col-span-full flex flex-col gap-6">
                        {/* 📊 ACTIVE PROJECTS CONTROL CENTER */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <Card key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-soft group hover:translate-x-1 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-projecxy-blue"><Rocket className="w-6 h-6" /></div>
                                            <div>
                                                <h4 className="font-bold text-projecxy-text">Institutional Data Mesh</h4>
                                                <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-widest">In Development</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-projecxy-blue"><ChevronRight className="w-6 h-6" /></button>
                                    </div>
                                    <ProgressBar progress={65} label="Milestone Completion" />
                                    <div className="mt-6 flex justify-between items-center text-[10px] font-bold uppercase text-gray-400">
                                        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> 4 Active Members</div>
                                        <div className="flex items-center gap-2 font-black text-projecxy-blue cursor-pointer">Workspace <ArrowRight className="w-3 h-3" /></div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 🔔 NOTIFICATION STRIP */}
            <div className="bg-projecxy-blue/5 border border-projecxy-blue/10 p-4 rounded-2xl flex items-center justify-between text-projecxy-blue text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-projecxy-blue rounded-full animate-ping" />
                    <span>3 students requested to join your "AgriBot" initiative</span>
                </div>
                <button className="underline">View All</button>
            </div>

        </div>
    );
};
