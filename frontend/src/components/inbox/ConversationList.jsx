import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Loader2, ArrowRight, Activity, Filter, Hash, Star } from 'lucide-react';
import { cn } from '../ui';

export const ConversationList = ({ conversations = [], activeId, onSelect, loading = false, userId }) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p.user_id !== userId);
    return otherParticipant?.profile?.full_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside className={cn(
      "h-full flex flex-col bg-white border-r border-gray-100 transition-all duration-500 relative group overflow-hidden",
      activeId ? "hidden lg:flex w-[380px]" : "w-full lg:w-[420px]"
    )}>
      
      {/* 🧭 NAVIGATION HEADER */}
      <div className="p-8 space-y-8 flex-shrink-0">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h1 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Inbound Channel</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-blue pl-px flex items-center gap-2">
                   <Activity className="w-4 h-4" /> Priority Sync
                </p>
             </div>
             <button className="w-12 h-12 bg-projecxy-blue/5 text-projecxy-blue rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-soft border border-projecxy-blue/10">
                <Plus className="w-6 h-6" />
             </button>
          </div>

          <div className="relative group">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-projecxy-blue transition-colors">
                <Search className="w-4 h-4" />
             </div>
             <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pilot name or project hub..."
                className="w-full h-14 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[28px] focus:ring-[6px] focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all placeholder:text-gray-300 text-sm font-semibold tracking-tight"
             />
             <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <Filter className="w-4 h-4 text-gray-300 cursor-pointer hover:text-projecxy-blue transition-colors" />
             </div>
          </div>
      </div>

      {/* 📩 CHANNEL STREAM */}
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 no-scrollbar">
         {loading ? (
             <div className="py-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-projecxy-blue/20 mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Synchronizing Ledger...</p>
             </div>
         ) : filtered.length > 0 ? (
             filtered.map(conv => {
                const other = conv.participants?.find(p => p.user_id !== userId);
                const lastMsg = conv.messages?.[0];
                const isActive = activeId === conv.id;

                return (
                  <button 
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={cn(
                      "w-full p-5 rounded-[32px] transition-all flex items-center gap-4 group/item isolate relative",
                      isActive 
                        ? "bg-projecxy-blue shadow-lg shadow-blue-100 border-none scale-[1.02]" 
                        : "hover:bg-gray-50 border border-transparent"
                    )}
                  >
                     <div className="relative flex-shrink-0 animate-in zoom-in-0 duration-500">
                        <img 
                           src={other?.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.profile?.full_name || 'Pilot'}`} 
                           className={cn("w-14 h-14 rounded-2xl md:rounded-[24px] border-2 shadow-soft ring-4 ring-white/10", isActive ? "border-white/20" : "border-white")} 
                           alt="avatar" 
                        />
                        <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white", conv.online ? "bg-emerald-500" : "bg-gray-300")} />
                     </div>

                     <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className={cn("text-sm font-black tracking-tight truncate flex items-center gap-1.5", isActive ? "text-white" : "text-projecxy-text")}>
                              {other?.profile?.full_name || 'Institutional Pilot'}
                              {conv.trending && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                           </h4>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest tabular-nums", isActive ? "text-white/60" : "text-gray-300")}>
                              {lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                           </span>
                        </div>
                        <p className={cn("text-[11px] font-bold truncate tracking-tight py-0.5", isActive ? "text-white/80" : "text-projecxy-secondary")}>
                           {lastMsg ? (lastMsg.sender_id === userId ? `You: ${lastMsg.content}` : lastMsg.content) : "Open channel initiation..."}
                        </p>
                     </div>

                     {conv.unread_count > 0 && !isActive && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 min-w-[20px] h-5 bg-projecxy-blue text-white rounded-full flex items-center justify-center text-[9px] font-black px-1.5 border-2 border-white shadow-soft animate-bounce">
                           {conv.unread_count}
                        </div>
                     )}

                     {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full" />
                     )}
                  </button>
                );
             })
         ) : (
            <div className="py-14 text-center space-y-6">
                <div className="w-16 h-16 bg-gray-50 rounded-[28px] mx-auto flex items-center justify-center text-gray-200">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <div className="space-y-1 mx-auto max-w-[200px]">
                    <h3 className="text-xs font-black text-projecxy-text uppercase tracking-tight">Zero Inbound Activity</h3>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">Initiate a sync with institutional members to open channels</p>
                </div>
                <button className="px-6 py-2.5 bg-projecxy-blue/5 text-projecxy-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-projecxy-blue/10 hover:bg-projecxy-blue hover:text-white transition-all">Start Hub Sync</button>
            </div>
         )}
      </div>

      {/* 🚀 HUB STATUS */}
      <div className="p-8 border-t border-gray-50 bg-gray-50/20 backdrop-blur-md">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500/50" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-projecxy-secondary opacity-50">Hub Core Latency: 4ms</p>
         </div>
      </div>
    </aside>
  );
};
