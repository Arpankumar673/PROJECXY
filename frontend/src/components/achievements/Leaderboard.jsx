import React from 'react';
import { 
  Trophy, Medal, Star, Target,
  Zap, Award, Users, Rocket,
  TrendingUp, Activity, BarChart3,
  CheckCircle2, Globe, ShieldCheck, Heart,
  ChevronRight, ArrowUpRight, Loader2
} from 'lucide-react';
import { Card, cn } from '../ui';

export const Leaderboard = ({ leaders = [], currentUserId }) => {
  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { bg: "bg-amber-50 text-amber-500 border-amber-100", icon: Trophy, color: "text-amber-500" };
      case 1: return { bg: "bg-slate-100 text-slate-500 border-slate-200", icon: Medal, color: "text-slate-500" };
      case 2: return { bg: "bg-amber-100/50 text-amber-600 border-amber-200/50", icon: Award, color: "text-amber-600" };
      default: return { bg: "bg-gray-50 text-gray-400 border-gray-100", icon: Star, color: "text-gray-300" };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* 🚀 HUB HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-1">
              <h2 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Institutional Rankings</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary opacity-50 pl-1">Legacy Verification Protocol</p>
          </div>
          <div className="h-10 px-6 bg-projecxy-blue/5 border border-projecxy-blue/10 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-projecxy-blue shadow-soft transition-all hover:bg-projecxy-blue hover:text-white cursor-pointer group">
              <Activity className="w-4 h-4 group-hover:animate-spin" /> Sector: Campus Mainstream
          </div>
      </div>

      <Card className="rounded-[40px] md:rounded-[56px] border-none shadow-2xl bg-white overflow-hidden group">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-10 py-10 text-left text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Pilot Sequence</th>
                     <th className="px-6 py-10 text-left text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Identity Matrix</th>
                     <th className="px-6 py-10 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Repositories</th>
                     <th className="px-6 py-10 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Hub Score</th>
                     <th className="px-10 py-10 text-right text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Access</th>
                  </tr>
               </thead>
               <tbody>
                  {leaders.map((leader, index) => {
                     const isMe = leader.id === currentUserId;
                     const style = getRankStyle(index);
                     const RankIcon = style.icon;

                     return (
                        <tr 
                          key={leader.id} 
                          className={cn(
                            "group/row border-b border-gray-50/50 hover:bg-projecxy-blue/5 transition-all duration-500",
                            isMe ? "bg-blue-50/50" : ""
                          )}
                        >
                           <td className="px-10 py-8">
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-soft transition-transform group-hover/row:scale-110",
                               style.bg
                             )}>
                               {index + 1}
                             </div>
                           </td>
                           <td className="px-6 py-8">
                              <div className="flex items-center gap-4">
                                 <div className="relative">
                                    <img 
                                      src={leader.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.full_name}`} 
                                      className="w-14 h-14 rounded-2xl border-2 border-white shadow-soft group-hover/row:border-projecxy-blue transition-colors" 
                                      alt="avatar" 
                                    />
                                    {index < 3 && (
                                       <div className={cn("absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center border-2 border-white shadow-lg", style.bg)}>
                                          <RankIcon className="w-4 h-4" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-base font-black text-projecxy-text tracking-tighter uppercase leading-none flex items-center gap-2">
                                        {leader.full_name}
                                        {isMe && <span className="bg-projecxy-blue text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-blue-300">YOU</span>}
                                    </h4>
                                    <p className="text-[10px] font-black text-projecxy-secondary uppercase tracking-[0.2em] opacity-50 flex items-center gap-1.5">
                                       <Activity className="w-3 h-3 text-projecxy-blue" /> Sector: {leader.department || 'Main Hub'}
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-8 text-center">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-[11px] font-black text-projecxy-text group-hover/row:bg-white group-hover/row:border-projecxy-blue group-hover/row:text-projecxy-blue transition-all">
                                 <Rocket className="w-4 h-4" /> {leader.projects_count || 0}
                              </div>
                           </td>
                           <td className="px-6 py-8 text-center">
                              <div className="space-y-1">
                                 <h5 className="text-xl font-black text-projecxy-text tracking-tighter tabular-nums leading-none">{(leader.reputation || 0).toLocaleString()}</h5>
                                 <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Legacy Points</p>
                              </div>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <button className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl hover:bg-projecxy-blue hover:text-white transition-all transform hover:rotate-45 flex items-center justify-center">
                                 <ArrowUpRight className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
         {leaders.length === 0 && (
             <div className="py-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-projecxy-blue/20 mx-auto" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Accessing Sector Ledger...</p>
             </div>
         )}
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8 py-10">
         <div className="p-10 bg-white rounded-[48px] border-none shadow-soft flex items-center gap-8 group hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-50 text-projecxy-blue rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
               <TrendingUp className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black text-projecxy-text tracking-tight uppercase">Platform Equilibrium</h3>
               <p className="text-[10px] font-black text-projecxy-blue uppercase tracking-widest">Growth Factor: +12.4%</p>
            </div>
         </div>
         <div className="p-10 bg-white rounded-[48px] border-none shadow-soft flex items-center gap-8 group hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black text-projecxy-text tracking-tight uppercase">Leaderboard Integrity</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sync Type: Real-time PostgreSQL</p>
            </div>
         </div>
      </div>
    </div>
  );
};
