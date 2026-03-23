import React from 'react';
import { 
  Trophy, Medal, Star, Target,
  Zap, Award, Users, Rocket,
  TrendingUp, Activity, BarChart3,
  CheckCircle2, Globe, ShieldCheck, Heart
} from 'lucide-react';
import { Card, Button, cn } from '../components/ui';

const AchievementCard = ({ achievement }) => (
    <Card className="p-8 md:p-10 text-center flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all duration-500 border-none bg-white rounded-[40px] shadow-soft hover:shadow-xl">
        <div className={cn(
            "w-24 h-24 rounded-[32px] flex items-center justify-center border-2 transition-transform group-hover:scale-110",
            achievement.unlocked ? "bg-blue-50 border-blue-100 text-projecxy-blue shadow-lg shadow-blue-100" : "bg-gray-50 border-gray-100 text-gray-200"
        )}>
            {achievement.icon}
        </div>
        <div className="space-y-2">
            <h4 className={cn(
                "text-lg font-black tracking-tighter uppercase leading-none",
                achievement.unlocked ? "text-projecxy-text" : "text-gray-300"
            )}>{achievement.title}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-projecxy-secondary opacity-50 px-4">{achievement.desc}</p>
        </div>
        {achievement.unlocked ? (
            <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> Synchronization Confirmed
            </div>
        ) : (
            <div className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-300 text-[9px] font-black uppercase tracking-widest">
                Potential Locked
            </div>
        )}
    </Card>
);

export const AchievementsPage = () => {
    const stats = [
        { label: 'Platform Reputation', value: '4,850', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Inbound Endorsements', value: '142', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Innovation Velocity', value: '92%', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Global Rank', value: '#12', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    ];

    const achievements = [
        { id: 1, icon: <Rocket className="w-10 h-10" />, title: 'Grand Launch', desc: 'Successfully deployed your first institutional project repository.', unlocked: true },
        { id: 2, icon: <Users className="w-10 h-10" />, title: 'Chief Architect', desc: 'Successfully recruited a cross-functional team of 5 members.', unlocked: true },
        { id: 3, icon: <ShieldCheck className="w-10 h-10" />, title: 'Semantic Guard', desc: 'Achieved 100% originality score on 10 consecutive submissions.', unlocked: true },
        { id: 4, icon: <Medal className="w-10 h-10" />, title: 'Alpha Contributor', desc: 'Ranked top 1% in the campus innovation hub activity matrix.', unlocked: false },
        { id: 5, icon: <Trophy className="w-10 h-10" />, title: 'Master Sync', desc: 'Completed 5 major project milestones before institutional deadlines.', unlocked: false },
        { id: 6, icon: <Award className="w-10 h-10" />, title: 'Global Envoy', desc: 'Shared innovation insights with 10+ departmental projects.', unlocked: false },
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
            
            {/* 🏆 HERO STATS */}
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

            {/* 🎯 BADGES MATRIX */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Authorization Badges</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary opacity-50 pl-1">Legacy Verification Protocol</p>
                    </div>
                    <div className="h-10 px-4 bg-projecxy-blue/5 border border-projecxy-blue/10 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-projecxy-blue">
                        <Activity className="w-4 h-4 animate-pulse" /> Platform Activity: High Intensity
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map(a => (
                        <AchievementCard key={a.id} achievement={a} />
                    ))}
                </div>
            </section>

            <div className="text-center pt-20 pb-32 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Innovation Achievement Matrix Syncing...</p>
            </div>
        </div>
    );
};
