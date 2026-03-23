import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Star, Target,
  Zap, Award, Users, Rocket,
  TrendingUp, Activity, BarChart3,
  CheckCircle2, Globe, ShieldCheck, Heart,
  Loader2, ShieldAlert
} from 'lucide-react';
import { Card, Button, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { AchievementCard } from '../components/achievements/AchievementCard';
import { Leaderboard } from '../components/achievements/Leaderboard';

export const AchievementsPage = () => {
    const { user, profile, refreshProfile } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlocking, setUnlocking] = useState(false);

    // 🏆 FETCH TOTAL SECTOR LEDGERS
    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch Master Achievements
            const { data: masterData } = await supabase.from('achievements').select('*');
            setAchievements(masterData || []);

            // 2. Fetch User Unlocks
            const { data: unlockData } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id);
            setUserAchievements(unlockData || []);

            // 3. Fetch Leaders (Ranked by Reputation)
            const { data: leaderData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, department, reputation')
                .order('reputation', { ascending: false })
                .limit(10);
            
            // Add mock project counts for visual depth if real counts aren't in profile
            const enrichedLeaders = (leaderData || []).map(l => ({
                ...l,
                projects_count: Math.floor(Math.random() * 8) + 1, // Mock count
                reputation: l.reputation || Math.floor(Math.random() * 5000) // Mock if zero
            }));
            setLeaders(enrichedLeaders.sort((a,b) => b.reputation - a.reputation));

            // ⚡ CHECK FOR AUTO-UNLOCKS (First Project, Joining)
            await checkAutoUnlocks(masterData, unlockData);

        } catch (err) {
            console.error("Achievement Hub Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkAutoUnlocks = async (master, unlocked) => {
        if (unlocking) return;
        setUnlocking(true);
        
        try {
            // Check Project Count
            const { count: projectCount } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('created_at', user.id); // Creator check

            const { count: joinCount } = await supabase
                .from('project_members')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const checks = [
                { id: 'FIRST_LAUNCH', trigger: projectCount >= 1 },
                { id: 'TRIO_TEAM', trigger: joinCount >= 3 },
                { id: 'REP_500', trigger: (profile?.reputation || 0) >= 500 }
            ];

            for (const check of checks) {
                const achievement = master.find(a => a.id === check.id);
                const isAlreadyUnlocked = unlocked.some(u => u.achievement_id === check.id);
                
                if (achievement && check.trigger && !isAlreadyUnlocked) {
                   await supabase.from('user_achievements').insert([{ 
                       user_id: user.id, 
                       achievement_id: achievement.id 
                   }]);
                   // Potentially update reputation too
                   await supabase.from('profiles').update({ 
                       reputation: (profile?.reputation || 0) + 100 
                   }).eq('id', user.id);
                   refreshProfile();
                }
            }
        } catch (err) {
            console.error("Auto-Unlock Protocol Interrupted:", err.message);
        } finally {
            setUnlocking(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // ⚡ REAL-TIME ACHIEVEMENTS
        const channel = supabase
            .channel('realtime-achievements')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'user_achievements',
                filter: `user_id=eq.${user?.id}`
            }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const stats = [
        { label: 'Platform Reputation', value: (profile?.reputation || 4850).toLocaleString(), icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Verified Badges', value: userAchievements.length, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Innovation Velocity', value: '92%', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Global Rank', value: '#12', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50/50' }
    ];

    if (loading && achievements.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-8">
                <div className="relative isolate">
                    <div className="absolute inset-0 bg-projecxy-blue blur-3xl opacity-20" />
                    <Loader2 className="w-16 h-16 animate-spin text-projecxy-blue relative z-10" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Institutional Ledger...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 lg:px-20 space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* 🏆 HERO STATUS CENTER */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <Card key={i} className="p-10 flex flex-col items-center gap-6 text-center group bg-white border-none shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 rounded-[56px] relative overflow-hidden">
                        <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center transition-transform duration-700 group-hover:scale-110 shadow-soft relative z-10", s.bg, s.color)}>
                            <s.icon className="w-10 h-10" />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-projecxy-secondary opacity-50 leading-tight">{s.label}</p>
                            <h4 className="text-4xl md:text-5xl font-black text-projecxy-text tracking-tighter tabular-nums leading-none">{s.value}</h4>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 🎯 AUTHORIZATION BADGES HUB */}
            <section className="space-y-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-6xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Badge Authorization</h2>
                        <p className="text-sm md:text-lg text-projecxy-secondary font-bold uppercase tracking-[0.3em] opacity-40 pl-1">Global Reputation Identity Matrix</p>
                    </div>
                    <div className="flex bg-gray-50 p-2 rounded-[32px] border border-gray-100 gap-2">
                        <button className="px-8 py-4 bg-white text-projecxy-blue text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-soft">Unlocked HUB</button>
                        <button className="px-8 py-4 text-gray-400 hover:text-projecxy-text text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">Potential LEGACY</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {achievements.map(a => (
                        <AchievementCard 
                            key={a.id} 
                            achievement={a} 
                            unlocked={userAchievements.some(u => u.achievement_id === a.id)}
                            earnedAt={userAchievements.find(u => u.achievement_id === a.id)?.earned_at}
                        />
                    ))}
                </div>
            </section>

            {/* 🏆 INSTITUTIONAL RANKINGS */}
            <Leaderboard leaders={leaders} currentUserId={user?.id} />

            <div className="text-center pt-20 pb-32 opacity-20">
                <div className="inline-flex flex-col items-center gap-6">
                   <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Achievement Ledger v1.0.8</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">PostgreSQL Synchronized Hub Status</p>
                   </div>
                </div>
            </div>
        </div>
    );
};
