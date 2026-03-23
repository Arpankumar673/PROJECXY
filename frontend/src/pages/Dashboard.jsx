import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Users, ArrowRight, Activity, 
  Search, Filter, Bookmark, Star, Rocket,
  ChevronRight, LayoutGrid, List, Loader2, AlertCircle, Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

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
            {status?.replace('_', ' ') || 'OPEN'}
        </span>
    );
};

const FeedCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="p-6 border border-gray-100 hover:shadow-soft transition-all cursor-pointer bg-white group rounded-2xl" 
      onClick={() => navigate(`/projects/${project.id}`)}
    >
        <div className="flex justify-between items-start mb-4">
            <StatusBadge status={project.status} />
            <button className="text-gray-300 hover:text-amber-400 transition-colors">
                <Bookmark className="w-5 h-5" />
            </button>
        </div>

        <h3 className="text-lg font-bold text-projecxy-text group-hover:text-projecxy-blue transition-colors mb-2 truncate">{project.title}</h3>
        <p className="text-sm text-projecxy-secondary line-clamp-2 mb-4 leading-relaxed">{project.description || project.abstract}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
           {(project.tags || ['General']).map((tag, i) => (
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
             <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-tight">Active Team</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-projecxy-blue transform group-hover:translate-x-1 transition-all" />
        </div>
    </Card>
  );
};

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const { projects, myProjects, loading, error } = useProjects(user?.id);
    const [view, setView] = useState('campus_feed');
    const [search, setSearch] = useState('');

    const filteredProjects = projects.filter(p => 
        p.title?.toLowerCase().includes(search.toLowerCase()) || 
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-projecxy-secondary">
            <Loader2 className="w-10 h-10 animate-spin text-projecxy-blue" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Syncing Campus OS...</p>
        </div>
    );

    if (error) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-red-500">
            <AlertCircle className="w-10 h-10" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">{error}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 lg:px-0">
            
            {/* 👋 WELCOME HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-soft">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-projecxy-text flex items-center gap-3">
                        Hi, {profile?.full_name?.split(' ')[0] || 'Innovator'}! 
                        <span className="text-2xl animate-bounce">🚀</span>
                    </h1>
                    <p className="text-projecxy-secondary font-medium text-sm md:text-base">{profile?.department || 'Set your department'} Hub</p>
                </div>
                <Button size="lg" className="rounded-2xl h-14 px-8 uppercase tracking-widest text-[10px] font-black" onClick={() => navigate('/projects/new')}>
                    <Plus className="w-5 h-5 mr-3" /> Initiate Project
                </Button>
            </header>

            {/* 📊 REAL-TIME STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Campus Projects', value: projects.length, icon: Rocket, color: 'text-blue-500' },
                    { label: 'My Initiatives', value: myProjects.length, icon: Star, color: 'text-emerald-500' },
                    { label: 'Network', value: 'Live', icon: Activity, color: 'text-amber-500' },
                    { label: 'Points', value: '450', icon: Trophy, color: 'text-purple-500' }
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
                                "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                                view === t ? "text-projecxy-blue" : "text-gray-400 hover:text-projecxy-text"
                            )}
                        >
                            {t.replace('_', ' ')}
                            {view === t && <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-projecxy-blue rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🔎 SEARCH BAR */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-projecxy-blue transition-colors" />
                <input 
                    className="w-full h-14 pl-14 pr-6 bg-white border border-gray-100 rounded-2xl shadow-soft focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                    placeholder="Search innovation hub..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* 🌪️ DYNAMIC FEED */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(view === 'campus_feed' ? filteredProjects : myProjects).map(p => (
                    <FeedCard key={p.id} project={p} />
                ))}
                
                {(view === 'campus_feed' ? filteredProjects : myProjects).length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-[20px] mx-auto flex items-center justify-center text-gray-200">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="font-black text-projecxy-text uppercase tracking-tight">No data discovered</h3>
                        <p className="text-xs text-projecxy-secondary font-bold uppercase tracking-widest">Initiate the first project in your department</p>
                        <Button variant="outline" className="rounded-xl" onClick={() => navigate('/projects/new')}>Create New</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
