import React, { useState, useEffect } from 'react';
import { 
  Plus, Rocket, Star, TrendingUp, 
  LayoutGrid, List, Loader2, Sparkles, 
  Activity, AlertCircle, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { FilterBar } from '../components/projects/FilterBar';

export const CampusProjects = () => {
    const { user, profile } = useAuth();
    const { projects, loading, error, refetch } = useProjects(user?.id);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All Sectors');
    const [status, setStatus] = useState('All Status');

    // 🧠 DISCOVERY ENGINE
    const filteredProjects = (projects || []).filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || 
                             p.description?.toLowerCase().includes(search.toLowerCase()) ||
                             p.tech_stack?.some(t => t.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCategory = category === 'All Sectors' || p.department === category;
        const matchesStatus = status === 'All Status' || p.status?.toLowerCase() === status.toLowerCase();

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const trendingProjects = (projects || []).slice(0, 3); // Simple logic for now
    const recommendedProjects = (projects || []).filter(p => 
        p.tech_stack?.some(t => profile?.skills?.includes(t))
    ).slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* 🚀 HUB HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[48px] border border-gray-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-projecxy-blue/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
                <div className="space-y-3 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Innovation Hub</h1>
                    <p className="text-sm md:text-lg text-projecxy-secondary font-bold uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-projecxy-blue" /> Discover . Collaborate . Protect
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10">
                    <Button 
                      onClick={() => setIsCreateOpen(true)}
                      size="lg" 
                      className="h-16 px-10 rounded-[28px] uppercase tracking-[0.3em] text-[10px] font-black group shadow-lg shadow-blue-100"
                    >
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> Initiate Project
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-16 px-8 rounded-[28px] uppercase tracking-[0.3em] text-[10px] font-black border-gray-100 bg-white"
                      onClick={() => refetch()}
                    >
                        <RefreshCw className={cn("w-5 h-5 mr-3", loading && "animate-spin")} /> Pulse Update
                    </Button>
                </div>
            </div>

            {/* 🌪️ SEARCH & DISCOVERY MATRIX */}
            <FilterBar 
              search={search} setSearch={setSearch}
              category={category} setCategory={setCategory}
              status={status} setStatus={setStatus}
            />

            {/* 🏆 HUB INTELLIGENCE */}
            {!search && category === 'All Sectors' && status === 'All Status' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  {recommendedProjects.length > 0 && (
                    <Card className="p-8 md:p-10 border-none bg-projecxy-blue/5 rounded-[40px] space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-projecxy-text tracking-tight uppercase flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-projecxy-blue" /> Tailored Recommendation
                            </h3>
                            <button className="text-[10px] font-black tracking-widest uppercase text-projecxy-blue opacity-50">Identity Sync</button>
                        </div>
                        <div className="grid gap-4">
                            {recommendedProjects.map(p => (
                                <ProjectCard key={p.id} project={p} userId={user?.id} onAction={refetch} />
                            ))}
                        </div>
                    </Card>
                  )}
                  <Card className="p-8 md:p-10 border-none bg-emerald-50/20 rounded-[40px] space-y-6">
                      <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-projecxy-text tracking-tight uppercase flex items-center gap-3">
                              <TrendingUp className="w-6 h-6 text-emerald-500" /> Trending Innovations
                          </h3>
                          <button className="text-[10px] font-black tracking-widest uppercase text-emerald-500 opacity-50">Live Pulse</button>
                      </div>
                      <div className="grid gap-4">
                          {trendingProjects.map(p => (
                              <ProjectCard key={p.id} project={p} userId={user?.id} onAction={refetch} />
                          ))}
                      </div>
                  </Card>
              </div>
            )}

            {/* 🧩 PROJECT REPOSITORY GRID */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-50">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Hub Project Repository</h2>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                        <button 
                            onClick={() => setView('grid')}
                            className={cn("p-2.5 rounded-xl transition-all", view === 'grid' ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-300 hover:text-projecxy-text")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setView('list')}
                            className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-300 hover:text-projecxy-text")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 bg-gray-100 rounded-[32px] animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className={cn(
                        "transition-all duration-700",
                        view === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"
                    )}>
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.map((project) => (
                                <motion.div 
                                    layout
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    key={project.id}
                                    className="h-full"
                                >
                                    <ProjectCard 
                                        project={project} 
                                        userId={user?.id}
                                        onAction={refetch}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-6 bg-gray-50 rounded-[48px] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white rounded-[32px] mx-auto flex items-center justify-center text-gray-200 shadow-soft">
                            <Rocket className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-projecxy-text uppercase tracking-tight">No innovations discovered</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Be the first to build institutional legacy on the platform</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-2xl" onClick={() => setIsCreateOpen(true)}>Initiate First Project</Button>
                    </div>
                )}
            </div>

            <CreateProjectModal 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                userId={user?.id}
                onCreated={refetch}
            />
            
            <div className="text-center pt-20 pb-32 opacity-20">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Ledger Verification Complete</p>
            </div>
        </div>
    );
};
