import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Plus, CheckCircle2, Clock, Users, ArrowLeft, UserPlus, 
  TrendingUp, Loader2, UserMinus, Upload, FileText, 
  LayoutDashboard, Briefcase, Settings, MessageSquare, 
  Calendar, Layers, ShieldCheck, Zap, Globe, Lock, Rocket
} from 'lucide-react';
import { Button, Card, Input, cn } from '../components/ui';
import { supabase } from '../services/supabase';
import { projectService, teamService, milestoneService, storageService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { KanbanBoard } from '../components/workspace/KanbanBoard';


/**
 * 🏗️ CREATE PROJECT
 * Enhanced Multi-Step Form Logic.
 */
export const CreateProject = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ title: '', abstract: '', team_size: 4, privacy: 'public', tech_stack: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        const { data: depts } = await supabase.from('departments').select('id').limit(1);
        
        if (depts && depts.length > 0) {
            const { data: proj } = await projectService.create({ 
                title: formData.title, 
                abstract: formData.abstract, 
                created_by: user.id, 
                department_id: depts[0].id, 
                status: 'pending',
                team_size_limit: formData.team_size
            });
            if (proj) await teamService.addMember(proj.id, user.id, 'Lead');
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-6">
                <button onClick={() => navigate(-1)} className="p-4 bg-white hover:bg-projecxy-blue hover:text-white rounded-2xl shadow-soft transition-all"><ArrowLeft className="w-6 h-6" /></button>
                <div>
                    <h1 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase">Launch Initiative</h1>
                    <p className="text-projecxy-secondary text-xs font-bold uppercase tracking-widest mt-1">Innovation Protocol Step {step} of 3</p>
                </div>
            </header>

            <section className="bg-white p-12 rounded-[48px] shadow-soft border border-gray-100 overflow-hidden relative">
                <div className="w-full h-2 bg-gray-50 mb-12 rounded-full overflow-hidden">
                    <div className="h-full bg-projecxy-blue transition-all" style={{ width: `${(step/3)*100}%` }} />
                </div>

                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <Input label="Initiative Title" placeholder="E.g. AgriBot v2.0" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="h-16 text-xl rounded-2xl font-bold px-6" />
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase text-projecxy-secondary tracking-widest pl-2">The Abstract</label>
                            <textarea className="w-full p-8 bg-gray-50 border border-gray-100 rounded-3xl min-h-[220px] focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all font-bold text-projecxy-text leading-relaxed placeholder:text-gray-300" placeholder="Describe the problem and your solution..." value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})} required />
                        </div>
                        <Button className="w-full h-18 text-xl font-black uppercase tracking-widest rounded-3xl shadow-soft" onClick={() => setStep(2)}>Next Level <Zap className="w-6 h-6 ml-2" /></Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Input label="Max Team Size" type="number" value={formData.team_size} onChange={(e) => setFormData({...formData, team_size: e.target.value})} className="h-14 font-bold rounded-xl" />
                            <Input label="Primary Tech Stack" value={formData.tech_stack} onChange={(e) => setFormData({...formData, tech_stack: e.target.value})} placeholder="E.g. React, Python" className="h-14 font-bold rounded-xl" />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setFormData({...formData, privacy: 'public'})} className={cn("flex-1 p-8 rounded-3xl border-2 transition-all text-left", formData.privacy === 'public' ? 'border-projecxy-blue bg-blue-50' : 'border-gray-50 hover:border-gray-100')}>
                                <Globe className={cn("w-10 h-10 mb-4", formData.privacy === 'public' ? 'text-projecxy-blue' : 'text-gray-300')} />
                                <h4 className="font-bold text-lg">Public Arena</h4>
                                <p className="text-xs text-projecxy-secondary font-medium">Visible to all campus students</p>
                            </button>
                            <button onClick={() => setFormData({...formData, privacy: 'private'})} className={cn("flex-1 p-8 rounded-3xl border-2 transition-all text-left", formData.privacy === 'private' ? 'border-projecxy-blue bg-blue-50' : 'border-gray-50 hover:border-gray-100')}>
                                <Lock className={cn("w-10 h-10 mb-4", formData.privacy === 'private' ? 'text-projecxy-blue' : 'text-gray-300')} />
                                <h4 className="font-bold text-lg">Stealth Mode</h4>
                                <p className="text-xs text-projecxy-secondary font-medium">Invite only. Private to team.</p>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="h-16 px-10 rounded-2xl text-xs uppercase tracking-widest font-black" onClick={() => setStep(1)}>Back</Button>
                            <Button className="flex-1 h-16 rounded-2xl text-xs uppercase tracking-widest font-black shadow-soft" onClick={() => setStep(3)}>Finalize <ShieldCheck className="w-5 h-5 ml-2" /></Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10 text-center animate-in fade-in duration-300">
                        <div className="w-24 h-24 bg-blue-50 text-projecxy-blue rounded-full mx-auto flex items-center justify-center animate-bounce shadow-soft border border-blue-100">
                            <Rocket className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-projecxy-text uppercase tracking-tighter">Ready for blastoff?</h2>
                        <p className="text-projecxy-secondary text-lg font-medium max-w-sm mx-auto">Your initiative will be broadcasted to the discovery feed. Are you prepared to lead?</p>
                        <div className="pt-8 flex flex-col gap-4">
                            <Button className="w-full h-18 text-xl font-black rounded-3xl shadow-soft uppercase tracking-widest" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : 'Anchor Initiative'}
                            </Button>
                            <button className="text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-projecxy-blue" onClick={() => setStep(2)}>Review Specifications</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

/**
 * 🛰️ PROJECT DETAILS & WORKSPACE
 * The Heart of Collaboration.
 */
export const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'workspace', 'team', 'resources'
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: p } = await projectService.getById(id);
            const { data: m } = await milestoneService.getByProject(id);
            const { data: members } = await teamService.getMembers(id);
            
            if (p) setProject(p);
            if (m) setMilestones(m);
            if (members) setIsMember(user && members.some(mem => mem.user_id === user.id));
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (loading && !project) return (
        <div className="flex flex-col h-[70vh] items-center justify-center gap-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-projecxy-blue animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Workspace Assets...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 🛸 PROJECT HUB HEADER */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-12 rounded-[48px] border border-gray-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/3 -translate-y-1/3 group-hover:rotate-12 transition-transform duration-1000"><Briefcase className="w-64 h-64 text-projecxy-blue" /></div>
                
                <div className="relative z-10 space-y-6 flex-1">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-projecxy-blue font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Campus Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black text-projecxy-text leading-tight tracking-tighter">{project?.title}</h1>
                        <div className="px-4 py-1.5 rounded-full bg-blue-50 text-projecxy-blue text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">{project?.status}</div>
                    </div>
                    <p className="text-lg text-projecxy-secondary font-medium leading-relaxed max-w-2xl">{project?.abstract}</p>
                    
                    {/* 📊 WORKSPACE NAV TABS */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl w-fit">
                        {[
                            { id: 'overview', icon: LayoutDashboard },
                            { id: 'workspace', icon: Layers, protected: true },
                            { id: 'team', icon: Users },
                            { id: 'resources', icon: MessageSquare, protected: true }
                        ].map((t) => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id)}
                                disabled={t.protected && !isMember}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === t.id ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-400 hover:text-projecxy-text disabled:opacity-30 disabled:cursor-not-allowed"
                                )}
                            >
                                <t.icon className="w-4 h-4" /> {t.id}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* 🏗️ ACTIVE VIEW AREA */}
            <div className="min-h-[50vh]">
                {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <section className="bg-white p-12 rounded-[48px] shadow-soft border border-gray-100">
                                <div className="flex items-center justify-between mb-12">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4"><CheckCircle2 className="w-8 h-8 text-projecxy-blue" /> Milestones</h2>
                                    <StatusBadge status="verified" value="4 / 6 Done" />
                                </div>
                                <div className="space-y-6">
                                    {milestones.map((m, i) => (
                                        <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-gray-50 transition-all hover:bg-white hover:shadow-soft border border-transparent hover:border-projecxy-blue/10 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-projecxy-blue shadow-soft group-hover:scale-110 transition-transform">
                                                {m.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-projecxy-text">{m.title}</h4>
                                                <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-widest">{m.status || 'Awaiting Action'}</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-xl border-gray-100 text-[10px] font-black uppercase tracking-widest px-6 h-10">Examine</Button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                        <aside className="space-y-10">
                            <Card className="p-10 bg-projecxy-text text-white rounded-[40px] shadow-soft relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform"><Zap className="w-32 h-32" /></div>
                                <h3 className="font-black text-xs text-projecxy-blue uppercase tracking-widest mb-4">Innovation Score</h3>
                                <p className="text-4xl font-black mb-8 leading-none tracking-tighter">82% <span className="text-xs text-projecxy-secondary font-bold uppercase tracking-widest block mt-2">Team Efficiency</span></p>
                                <Button className="w-full h-14 rounded-2xl bg-projecxy-blue text-white uppercase tracking-widest font-black text-xs shadow-soft border-none">View Full Analytics</Button>
                            </Card>
                        </aside>
                    </div>
                )}

                {activeTab === 'workspace' && isMember && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Technical Kanban</h2>
                            <Button variant="outline" className="h-10 text-[10px] uppercase font-black rounded-xl">Batch Update</Button>
                        </div>
                        <KanbanBoard />
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="animate-in fade-in duration-500">
                         <TeamManagement minimal />
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ value }) => (
    <div className="bg-blue-50 border border-blue-100 text-projecxy-blue px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-soft">
        {value}
    </div>
);

/**
 * 👪 TEAM MANAGEMENT
 * Robust recruitment and membership logic.
 */
export const TeamManagement = ({ minimal = false }) => {
    const { id } = useParams();
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isCreator, setIsCreator] = useState(false);
  
    useEffect(() => {
      fetchTeamData();
    }, [id, user]);
  
    const fetchTeamData = async () => {
      if(!user) return;
      try {
          const { data: p } = await projectService.getById(id);
          if (p) {
             setIsCreator(user?.id === p.created_by);
             const { data: mems } = await teamService.getMembers(id);
             setMembers(mems || []);
             if (user?.id === p?.created_by) {
                const { data: reqs } = await teamService.getJoinRequests(id);
                setRequests(reqs || []);
             }
          }
      } catch (e) { console.error(e); }
    };
  
    return (
      <div className={cn("space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700", !minimal && "max-w-7xl mx-auto pb-20")}>
         {!minimal && (
            <header className="flex items-center gap-6">
                <button className="p-4 bg-white hover:bg-projecxy-blue hover:text-white rounded-2xl shadow-soft transition-all border border-gray-50"><ArrowLeft className="w-6 h-6" /></button>
                <div><h1 className="text-4xl font-black text-projecxy-text uppercase tracking-tighter leading-none">Team Hub</h1><p className="text-[10px] font-bold uppercase tracking-widest text-projecxy-secondary mt-2 tracking-widest">Recruitment & Governance Engine</p></div>
            </header>
         )}
  
         <div className="grid lg:grid-cols-2 gap-10">
            <section className="bg-white p-12 rounded-[48px] shadow-soft border border-gray-100">
               <h2 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter"><Users className="w-8 h-8 text-projecxy-blue" /> Active Squad</h2>
               <div className="space-y-6">
                  {members.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-projecxy-blue transition-all group">
                        <div className="flex items-center gap-5">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user_id}`} className="w-16 h-16 rounded-2xl border-4 border-white shadow-soft group-hover:scale-110 transition-transform" alt="Member" />
                           <div>
                              <p className="font-bold text-lg text-projecxy-text leading-tight">{m.profiles?.full_name}</p>
                              <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-widest mt-1 underline decoration-projecxy-blue/20">{m.role_in_team || 'Core Contributor'}</p>
                           </div>
                        </div>
                        {isCreator && m.user_id !== user.id && (
                           <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><UserMinus className="w-6 h-6" /></button>
                        )}
                     </div>
                  ))}
               </div>
            </section>
  
            {isCreator && (
               <section className="bg-white p-12 rounded-[48px] shadow-soft border border-gray-100 relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><UserPlus className="w-32 h-32" /></div>
                  <h2 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter text-amber-500"><Zap className="w-8 h-8" /> Incoming Interest</h2>
                  <div className="space-y-6">
                     {requests.map(r => (
                        <Card key={r.id} className="p-8 border-amber-100 bg-amber-50/10 hover:shadow-soft transition-all rounded-3xl">
                           <div className="flex items-center gap-5 mb-8">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id}`} className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-amber-50" alt="Requester" />
                              <div className="flex-1">
                                 <p className="font-bold text-lg leading-tight">{r.profiles?.full_name}</p>
                                 <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-widest mt-1">Aspiring Innovator</p>
                              </div>
                           </div>
                           <p className="text-projecxy-secondary text-sm italic mb-8 p-4 bg-white/50 rounded-2xl border border-dashed border-amber-100">"{r.message}"</p>
                           <div className="flex gap-3">
                              <Button className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border-none">Approve</Button>
                              <Button variant="ghost" className="flex-1 h-12 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest">Deny</Button>
                           </div>
                        </Card>
                     ))}
                     {requests.length === 0 && <p className="text-center py-10 text-projecxy-secondary font-bold uppercase text-[10px] tracking-widest">No pending join requests</p>}
                  </div>
               </section>
            )}
         </div>
      </div>
    );
};
