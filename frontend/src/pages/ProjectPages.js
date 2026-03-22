import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, CheckCircle, Clock, Users, ArrowLeft, UserPlus, TrendingUp, Loader2, UserMinus, Upload, FileText } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { supabase } from '../services/supabase';
import { projectService, teamService, milestoneService, storageService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Onboarding Page
export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dept, setDept] = useState('');
  const [batch, setBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnboarding = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ full_name: user?.user_metadata?.full_name }).eq('id', user.id);
    if (error) console.error(error);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-linkedin-bg flex items-center justify-center p-6 lg:p-12 animate-fade-in-up">
      <Card className="max-w-4xl p-16 border-none shadow-2xl relative group bg-white overflow-hidden rounded-[40px] border border-gray-100">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-48 h-48" /></div>
         <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 space-y-8">
               <div className="space-y-2">
                  <h1 className="text-4xl font-black text-linkedin-text leading-tight">Welcome to Projecxy! 🎉</h1>
                  <p className="text-gray-400 font-bold text-lg leading-relaxed">Let's set up your institutional identity.</p>
               </div>
               <div className="space-y-6">
                  <Input label="Select Department" placeholder="E.g. Computer Science" value={dept} onChange={(e) => setDept(e.target.value)} />
                  <Input label="Student ID / Batch" placeholder="E.g. 2024-CSE-01" value={batch} onChange={(e) => setBatch(e.target.value)} />
                  <Button className="w-full py-4 text-xl h-14" onClick={handleOnboarding} disabled={loading}>
                     {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Onboarding'}
                  </Button>
               </div>
            </div>
            <div className="hidden md:flex w-1/2 flex-col items-center justify-center space-y-12">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Projecxy" alt="User" className="w-[280px] h-[280px] rounded-[60px] border-[12px] border-blue-50 shadow-2xl shadow-blue-100 transform -rotate-3 transition-transform" />
            </div>
         </div>
      </Card>
    </div>
  );
};

// Create Project
export const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: depts } = await supabase.from('departments').select('id').limit(1);
    
    if (depts && depts.length > 0) {
      const proj = await projectService.create({ title, abstract, created_by: user.id, department_id: depts[0].id, status: 'pending' });
      await teamService.addMember(proj.id, user.id, 'Lead');
      navigate('/dashboard');
    } else {
      alert("No departments found. Seed DB first.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
      <header className="flex items-center gap-6">
        <button onClick={() => navigate(-1)} className="p-4 bg-white hover:bg-linkedin-blue hover:text-white rounded-2xl shadow-md transition-all border border-gray-50"><ArrowLeft className="w-6 h-6" /></button>
        <div><h1 className="text-4xl font-extrabold text-[#1D2226]">Propose a Unique Project</h1></div>
      </header>

      <section className="bg-white p-12 rounded-[40px] shadow-card border border-gray-100 relative overflow-hidden group">
        <form className="space-y-8" onSubmit={handleSubmit}>
            <Input label="Project Title" placeholder="E.g. Decentralized File Sharing" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="space-y-2">
               <label className="text-sm font-black text-gray-700">Detailed Abstract</label>
               <textarea className="w-full p-6 border border-gray-200 rounded-3xl min-h-[180px] focus:ring-4 focus:ring-blue-100 focus:border-linkedin-blue outline-none transition-all font-medium" placeholder="Describe your innovative idea..." value={abstract} onChange={(e) => setAbstract(e.target.value)} required />
            </div>
            <Button size="lg" className="w-full py-5 text-xl h-16 shadow-xl hover:shadow-blue-200" type="submit" disabled={loading}>
               {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : 'Submit to Supabase'}
            </Button>
        </form>
      </section>
    </div>
  );
};

// Project Details Component
export const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!user) return;
    try {
        const p = await projectService.getById(id);
        const m = await milestoneService.getByProject(id);
        const members = await teamService.getMembers(id);
        
        setProject(p);
        setMilestones(m);
        setIsMember(members.some(mem => mem.user_id === user.id));

        const { data: req } = await supabase.from('join_requests').select('status').eq('project_id', id).eq('user_id', user.id).maybeSingle();
        if (req) setRequestSent(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleJoinRequest = async () => {
    try {
      await supabase.from('join_requests').insert([{ project_id: id, user_id: user.id, message: 'I would like to contribute!' }]);
      setRequestSent(true);
    } catch(e) { alert(e.message); }
  };

  const handleFileUpload = async (milestoneId, file) => {
     try {
        const path = `milestones/${milestoneId}/${Date.now()}_${file.name}`;
        const url = await storageService.uploadFile('project-assets', path, file);
        await milestoneService.complete(milestoneId, url);
        fetchData();
     } catch (e) { alert(e.message); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-12 h-12 text-linkedin-blue animate-spin" /></div>;
  if (!project) return <div className="p-20 text-center">Project not found or RLS access denied.</div>;

  const isCreator = user?.id === project.created_by;

  return (
    <div className="grid lg:grid-cols-3 gap-10 items-start animate-fade-in-up">
      <div className="lg:col-span-2 space-y-10">
        <header className="bg-white p-12 rounded-[40px] shadow-card border-l-8 border-l-linkedin-blue relative">
           <div className="flex justify-between items-start mb-8 gap-6">
              <div>
                 <h1 className="text-4xl font-extrabold text-linkedin-text leading-tight">{project.title}</h1>
                 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">POSTED {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <div className="px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-linkedin-blue text-[10px] font-black uppercase tracking-widest shadow-sm">{project.status}</div>
           </div>
           <p className="text-gray-600 text-lg font-medium leading-[2] mb-12">{project.abstract}</p>
           {!isCreator && !isMember && (
              <Button size="lg" disabled={requestSent} onClick={handleJoinRequest} className="h-14 px-10 text-lg">
                 {requestSent ? <><CheckCircle className="w-5 h-5 mr-2" /> Request Sent</> : <><UserPlus className="w-5 h-5 mr-2" /> Request to Join Team</>}
              </Button>
           )}
        </header>

        <section className="bg-white p-10 rounded-[40px] shadow-card border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black flex items-center gap-4"><CheckCircle className="w-8 h-8 text-linkedin-blue" /> Project Milestones</h2>
              {isCreator && <Button variant="ghost" size="sm" className="font-black text-xs">+ New Milestone</Button>}
           </div>
           <div className="space-y-6">
              {milestones.length > 0 ? milestones.map((m, i) => (
                 <div key={i} className={`p-8 rounded-3xl flex items-center justify-between border-2 transition-all group ${m.status === 'completed' ? 'bg-green-50/30 border-green-100' : 'bg-gray-50/50 border-gray-100 hover:border-blue-100'}`}>
                    <div className="flex items-center gap-6">
                       {m.status === 'completed' ? <CheckCircle className="w-10 h-10 text-emerald-500 fill-emerald-50" /> : <Clock className="w-10 h-10 text-gray-200 group-hover:text-amber-400 transition-colors" />}
                       <div>
                          <p className="font-extrabold text-lg text-linkedin-text group-hover:text-linkedin-blue transition-colors">{m.title}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${m.status === 'completed' ? 'text-emerald-500' : 'text-gray-400'}`}>{m.status === 'completed' ? 'VERIFIED' : 'AWAITING PROOF'}</p>
                       </div>
                    </div>
                    {isMember && m.status !== 'completed' && (
                       <label className="cursor-pointer">
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(m.id, e.target.files[0])} />
                          <div className="h-12 px-6 bg-white border border-gray-100 font-bold text-xs rounded-xl flex items-center gap-2 hover:shadow-md transition-shadow"><Upload className="w-4 h-4" /> Upload</div>
                       </label>
                    )}
                    {m.status === 'completed' && (
                       <a href={m.file_url} target="_blank" rel="noreferrer" className="h-12 w-12 flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:text-linkedin-blue transition-colors"><FileText className="w-6 h-6" /></a>
                    )}
                 </div>
              )) : <p className="text-center py-10 text-gray-400 font-medium italic">No milestones set by lead creator.</p>}
           </div>
        </section>
      </div>

      <aside className="space-y-10">
         <Card className="p-10 border-none shadow-2xl bg-[#1D2226] text-white rounded-[40px] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-32 h-32" /></div>
            <h3 className="font-black text-linkedin-blue text-xs uppercase tracking-[0.2em] mb-4">Team Hub</h3>
            <p className="text-xl font-bold mb-10">Collaboration center for development.</p>
            <Button onClick={() => navigate(`/projects/${id}/team`)} className="w-full bg-linkedin-blue text-white h-14 font-black rounded-2xl border-none">Manage Team Hub</Button>
         </Card>
      </aside>
    </div>
  );
};

// Team Management Component
export const TeamManagement = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreator, setIsCreator] = useState(false);
  
    useEffect(() => {
      fetchTeamData();
    }, [id, user]);
  
    const fetchTeamData = async () => {
      if(!user) return;
      try {
          const p = await projectService.getById(id);
          setProject(p);
          setIsCreator(user?.id === p.created_by);
          
          const m = await teamService.getMembers(id);
          setMembers(m);
  
          if (user?.id === p?.created_by) {
             const r = await teamService.getJoinRequests(id);
             setRequests(r);
          }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
  
    const handleRequestAction = async (requestId, userId, action) => {
       try {
        if (action === 'accept') {
            await teamService.addMember(id, userId);
            await teamService.handleRequest(requestId, 'accepted');
         } else {
            await teamService.handleRequest(requestId, 'rejected');
         }
         fetchTeamData();
       } catch (e) { alert(e.message); }
    };
  
    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-12 h-12 text-linkedin-blue animate-spin" /></div>;
  
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in-up pb-20">
         <header className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-4 bg-white hover:bg-linkedin-blue hover:text-white rounded-2xl shadow-md transition-all border border-gray-50"><ArrowLeft className="w-6 h-6" /></button>
            <div><h1 className="text-4xl font-extrabold text-[#1D2226]">Team Management</h1><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">{project?.title}</p></div>
         </header>
  
         <div className="grid lg:grid-cols-2 gap-10">
            <section className="bg-white p-10 rounded-[40px] shadow-card border border-gray-100">
               <h2 className="text-2xl font-black mb-10 flex items-center gap-4"><Users className="w-8 h-8 text-linkedin-blue" /> Current Members</h2>
               <div className="space-y-6">
                  {members.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-blue-100 transition-all">
                        <div className="flex items-center gap-4 text-nowrap">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user_id}`} className="w-14 h-14 rounded-2xl shadow-sm border border-white" alt="Team Member" />
                           <div>
                              <p className="font-extrabold text-lg leading-tight truncate max-w-[150px]">{m.profiles?.full_name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{m.role_in_team}</p>
                           </div>
                        </div>
                        {isCreator && m.user_id !== project.created_by && (
                           <button className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><UserMinus className="w-6 h-6" /></button>
                        )}
                     </div>
                  ))}
               </div>
            </section>
  
            {isCreator && (
               <section className="bg-white p-10 rounded-[40px] shadow-card border border-gray-100 border-t-8 border-t-amber-400">
                  <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-amber-500"><UserPlus className="w-8 h-8" /> Join Requests</h2>
                  <div className="space-y-6">
                     {requests.map(r => (
                        <Card key={r.id} className="p-8 border border-amber-100 bg-amber-50/10 hover:shadow-xl transition-all">
                           <div className="flex items-center gap-4 mb-6">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id}`} className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-amber-100" alt="Requester" />
                              <div className="flex-1 min-w-0">
                                 <p className="font-extrabold text-lg leading-tight truncate">{r.profiles?.full_name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Aspiring Team Member</p>
                              </div>
                           </div>
                           <p className="text-gray-500 text-sm italic mb-8 p-4 bg-white/50 rounded-xl border border-dashed border-amber-200">"{r.message}"</p>
                           <div className="flex gap-3">
                              <Button onClick={() => handleRequestAction(r.id, r.user_id, 'accept')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-none h-12 text-sm">ACCEPT</Button>
                              <Button onClick={() => handleRequestAction(r.id, r.user_id, 'reject')} className="flex-1 bg-red-400 hover:bg-red-500 border-none h-12 text-sm">REJECT</Button>
                           </div>
                        </Card>
                     ))}
                     {requests.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No pending requests.</p>}
                  </div>
               </section>
            )}
         </div>
      </div>
    );
  };
