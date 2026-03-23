import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  Briefcase, GraduationCap, Github, 
  Linkedin, Twitter, Globe, Link, 
  Edit3, Share2, Plus, Rocket, 
  Medal, Star, Award, ShieldCheck, 
  TrendingUp, Activity, Trophy
} from 'lucide-react';
import { Button, Card, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
    const { user, profile } = useAuth();

    const avatar = profile?.avatar_url 
      ? profile.avatar_url 
      : `https://ui-avatars.com/api/?name=${profile?.full_name || "Innovator"}&background=0A84FF&color=fff&size=512`;

    const skills = [
        "React", "Node.js", "TypeScript", "Python", 
        "Machine Learning", "System Design", "Firebase", 
        "Tailwind CSS", "Docker", "Git"
    ];

    const stats = [
        { label: 'Innovations', value: '12', icon: Rocket, bg: 'bg-blue-50', color: 'text-projecxy-blue' },
        { label: 'Endorsements', value: '84', icon: Star, bg: 'bg-amber-50', color: 'text-amber-500' },
        { label: 'Accuracy Score', value: '98%', icon: ShieldCheck, bg: 'bg-emerald-50', color: 'text-emerald-500' },
        { label: 'Impact Rank', value: '#1', icon: Trophy, bg: 'bg-indigo-50', color: 'text-indigo-500' }
    ];

    if (!profile && !user) return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-projecxy-blue animate-pulse mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary">Syncing Private Ledger...</p>
        </div>
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
            
            {/* 👤 PROFILE HEADER (Linear Style) */}
            <div className="relative isolate group">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-projecxy-blue to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full" />
                        <img 
                            src={avatar} 
                            className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] border-[8px] md:border-[12px] border-white shadow-soft relative z-10 hover:scale-105 transition-transform duration-500 object-cover" 
                            alt="Avatar"
                            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${profile?.full_name || "ID"}`}
                        />
                        <button className="absolute bottom-4 right-4 w-12 h-12 bg-projecxy-blue text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white z-20 hover:scale-110 active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mx-auto" />
                        </button>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-4 pb-6">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-6xl font-black text-projecxy-text tracking-tighter uppercase leading-none">{profile?.full_name || 'Anonymous Innovator'}</h1>
                            <p className="text-sm md:text-lg text-projecxy-secondary font-bold uppercase tracking-[0.3em] opacity-60">{profile?.department || 'Sector Unspecified'}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                                <Activity className="w-4 h-4" /> Pulse: {profile?.onboarding_completed ? 'Authenticated' : 'Provisioning'}
                            </div>
                            <div className="bg-blue-50 text-projecxy-blue px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                                <ShieldCheck className="w-4 h-4" /> Grade: High Tier
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pb-10">
                        <Button variant="outline" className="h-14 rounded-2xl px-8 border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-soft hover:-translate-y-1 transition-all">
                           <Share2 className="w-4 h-4 mr-2" /> Export Ledger
                        </Button>
                        <Button className="h-14 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 transition-all">
                           <Edit3 className="w-4 h-4 mr-2" /> Modify Core
                        </Button>
                    </div>
                </div>
            </div>

            {/* 📊 REAL-TIME STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="p-8 flex flex-col items-center gap-4 text-center group bg-white border-none shadow-soft hover:shadow-xl transition-all rounded-[40px]">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", s.bg, s.color)}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-projecxy-secondary opacity-50 leading-tight">{s.label}</p>
                            <h4 className="text-3xl font-black text-projecxy-text tracking-tighter tabular-nums leading-none">{s.value}</h4>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 🛠️ CORE STACK & EXPERTISE */}
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="p-10 lg:col-span-1 space-y-10 rounded-[48px] border-none shadow-soft bg-white group border border-gray-100 transition-all hover:shadow-xl">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Authorization</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 opacity-60 px-1 leading-tight">Verification Level 1</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-300 group-hover/item:text-projecxy-blue transition-colors">
                              <Mail className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-projecxy-text truncate">{user?.email || 'identity@campus.os'}</p>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-300 group-hover/item:text-projecxy-blue transition-colors">
                              <Briefcase className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-projecxy-text">{profile?.role || 'Campus Member'}</p>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-300 group-hover/item:text-projecxy-blue transition-colors">
                              <MapPin className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-projecxy-text">{profile?.roll_no || 'Terminal Assigned'}</p>
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Hub Connections</h3>
                        <div className="flex gap-4">
                            {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                                <button key={i} className="w-12 h-12 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center hover:bg-projecxy-blue/10 hover:text-projecxy-blue transition-all">
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="p-10 lg:col-span-2 space-y-12 rounded-[48px] border-none shadow-soft bg-white transition-all hover:shadow-xl">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Institutional Skills</h3>
                            <button className="text-[10px] font-black tracking-widest uppercase text-projecxy-blue px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">Expand Matrix</button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {skills.map(skill => (
                                <span key={skill} className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-projecxy-secondary shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Innovation Portfolio</h3>
                            <button className="text-[10px] font-black tracking-widest uppercase text-projecxy-blue px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">View All</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-100 transition-all group flex flex-col justify-between h-40">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-projecxy-blue shadow-soft"><Rocket className="w-5 h-5" /></div>
                                        <Link className="w-4 h-4 text-gray-300 group-hover:text-projecxy-blue transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-projecxy-text uppercase tracking-tight truncate">Institutional Initiative</h4>
                                        <p className="text-[10px] font-black text-projecxy-secondary uppercase tracking-[0.2em] opacity-50">Deployed: {new Date().getFullYear()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            
            <div className="text-center pt-20 pb-32 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Ledger Verification Synchronized</p>
            </div>
        </div>
    );
};
