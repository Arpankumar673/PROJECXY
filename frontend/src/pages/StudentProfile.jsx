import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, 
  Briefcase, GraduationCap, Github, 
  Linkedin, Twitter, Globe, Link, 
  Share2, MessageSquare, Rocket, 
  Medal, Star, Award, ShieldCheck, 
  TrendingUp, Activity, Trophy,
  Hash, ExternalLink, Calendar, Loader2
} from 'lucide-react';
import { Button, Card, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { SocialLinks } from '../components/profile/SocialLinks';

export const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageLoading, setMessageLoading] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            // 👤 FETCH UNIVERSAL IDENTITY
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProfile(data);

            // 🚀 FETCH RECENT INNOVATIONS (PROJECTS)
            const { data: projData } = await supabase
                .from('projects')
                .select('*')
                .eq('created_by', id)
                .limit(4);
            setProjects(projData || []);

        } catch (err) {
            console.error("Hub Sync Interrupted:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    // 📩 DIRECT MESSAGING ENGINE
    const handleMessage = async () => {
        if (!user || !profile) return;
        if (user.id === profile.id) return; // Cannot message self
        
        setMessageLoading(true);
        try {
            // STEP 1: SCAN FOR EXISTING CHANNEL
            const { data: existingParticipants, error: scanError } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', user.id);

            if (scanError) throw scanError;

            // Simple intersection check for common conversation
            const commonConvIds = existingParticipants.map(p => p.conversation_id);
            
            const { data: commonConv, error: intersectError } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .in('conversation_id', commonConvIds)
                .eq('user_id', profile.id)
                .maybeSingle();

            if (intersectError) throw intersectError;

            let finalConversationId;

            if (commonConv) {
                finalConversationId = commonConv.conversation_id;
            } else {
                // STEP 2: INITIALIZE NEW CHANNEL
                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert([{}])
                    .select()
                    .single();

                if (createError) throw createError;

                const participants = [
                    { conversation_id: newConv.id, user_id: user.id },
                    { conversation_id: newConv.id, user_id: profile.id }
                ];

                const { error: partError } = await supabase
                    .from('conversation_participants')
                    .insert(participants);

                if (partError) throw partError;
                
                finalConversationId = newConv.id;
            }

            // STEP 3: HANDSHAKE REDIRECT
            navigate(`/inbox?chat=${finalConversationId}`);

        } catch (err) {
            console.error("Message Authorization Failure:", err.message);
        } finally {
            setMessageLoading(false);
        }
    };

    // Auto-trigger message if action=message is in URL
    useEffect(() => {
        if (searchParams.get('action') === 'message' && profile && !loading) {
            handleMessage();
        }
    }, [profile, loading, searchParams]);

    if (loading) return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-projecxy-blue/20" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">Synchronizing Public Institutional Hub...</p>
      </div>
    );

    if (!profile) return (
        <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Identity Expired</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">The specific student hub index was not discovered.</p>
        </div>
    );

    const avatar = profile?.avatar_url 
      ? profile.avatar_url 
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || "Innovator"}&background=0A84FF&color=fff&size=512`;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-10 lg:px-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
            
            {/* 👤 PUBLIC HUB HEADER */}
            <div className="relative isolate group">
                <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
                    <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover/avatar:opacity-20 transition-opacity duration-1000 rounded-full" />
                        <img 
                            src={avatar} 
                            className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] border-[12px] border-white shadow-soft relative z-10 hover:scale-105 transition-transform duration-500 object-cover bg-white" 
                            alt="Avatar"
                        />
                        {profile.onboarding_completed && (
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl z-20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-4 pb-6">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-6xl font-black text-projecxy-text tracking-tighter uppercase leading-none">{profile?.full_name}</h1>
                            <p className="text-sm md:text-lg text-projecxy-secondary font-bold uppercase tracking-[0.3em] opacity-60">
                                {profile?.department || 'Sector Unspecified'} 
                                {profile?.branch && <span className="text-projecxy-blue mx-2 opacity-50 block lg:inline-block">({profile.branch})</span>}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                             <div className="bg-blue-50 text-projecxy-blue px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                                <Rocket className="w-4 h-4" /> Sector: Innovator Hub
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                                <TrendingUp className="w-4 h-4" /> Status: Authenticated
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pb-10">
                        <Button 
                            onClick={handleMessage}
                            disabled={messageLoading || user?.id === profile.id}
                            className={cn(
                                "h-16 rounded-2xl px-12 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg transition-all",
                                user?.id === profile.id ? "opacity-30 cursor-not-allowed" : "shadow-blue-100 hover:-translate-y-1"
                            )}
                        >
                            {messageLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : (
                                <span className="flex items-center justify-center gap-3">
                                   <MessageSquare className="w-5 h-5" /> Message Hub
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 🛠️ CORE STACK & EXPERTISE */}
            <div className="grid lg:grid-cols-3 gap-10">
                <Card className="p-10 lg:col-span-1 space-y-10 rounded-[48px] border-none shadow-soft bg-white group transition-all hover:shadow-xl">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Authentication</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 opacity-60 px-1 leading-tight">Verification Level 1</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-300 group-hover/item:text-projecxy-blue transition-colors">
                              <Calendar className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-projecxy-text">Roll No: {profile?.roll_no || 'Confidential'}</p>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-300 group-hover/item:text-projecxy-blue transition-colors">
                              <Briefcase className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-projecxy-text">{profile?.role || 'Senior Contributor'}</p>
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-projecxy-blue opacity-50 px-2 flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5" /> Hub Connections
                        </h3>
                        <SocialLinks links={{
                             github_url: profile?.github_url,
                             linkedin_url: profile?.linkedin_url,
                             twitter_url: profile?.twitter_url,
                             portfolio_url: profile?.portfolio_url
                        }} />
                    </div>
                </Card>

                <Card className="p-12 lg:col-span-2 space-y-12 rounded-[56px] border-none shadow-soft bg-white transition-all hover:shadow-xl">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Institutional Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {profile?.skills && profile.skills.length > 0 ? profile.skills.map(skill => (
                                <span key={skill} className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest text-projecxy-secondary shadow-sm hover:bg-white hover:border-projecxy-blue hover:text-projecxy-blue hover:-translate-y-1 transition-all cursor-default">
                                    {skill}
                                </span>
                            )) : (
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-50 py-4 px-2">No expertise synchronized for this identity.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Innovation Portfolio</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.length > 0 ? projects.map(p => (
                                <div key={p.id} className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-blue-100 hover:bg-white transition-all group flex flex-col justify-between h-56 shadow-soft hover:shadow-xl">
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-projecxy-blue shadow-soft"><Rocket className="w-6 h-6" /></div>
                                        <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-projecxy-blue transition-colors cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-projecxy-text uppercase tracking-tight truncate">{p.title}</h4>
                                        <p className="text-[10px] font-black text-projecxy-secondary uppercase tracking-[0.2em] opacity-40">Repositories Synchronized</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 py-10 text-center opacity-30">
                                   <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">No public repositories discovered.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
            
            <div className="text-center pt-20 pb-32 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Public Hub Verified &copy; 2026</p>
            </div>
        </div>
    );
};
