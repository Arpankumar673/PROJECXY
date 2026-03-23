import React, { useRef, useEffect } from 'react';
import { 
  Phone, Video, Info, ArrowLeft, 
  MessageSquare, Loader2, Rocket, 
  ShieldCheck, Activity, Search,
  ChevronDown, X, Trash2, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../ui';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

export const ChatWindow = ({ conversation, messages = [], onSend, onBack, loading = false, userId }) => {
  const scrollRef = useRef(null);
  const otherParticipant = conversation?.participants?.find(p => p.user_id !== userId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/20 md:p-12 text-center group">
         <div className="md:w-[500px] p-12 md:p-20 bg-white rounded-[72px] shadow-soft border border-gray-100 flex flex-col items-center gap-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-1000 group">
            <div className="relative isolate">
               <div className="absolute inset-0 bg-projecxy-blue blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="w-24 h-24 md:w-32 md:h-32 bg-projecxy-blue text-white rounded-[40px] md:rounded-[56px] flex items-center justify-center shadow-lg shadow-blue-100 relative z-10 hover:scale-110 transition-transform">
                  <Rocket className="w-10 h-10 md:w-16 md:h-16 fill-current animate-bounce" />
               </div>
            </div>
            <div className="space-y-4">
               <h2 className="text-3xl md:text-5xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Hub Terminal</h2>
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-projecxy-blue flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Sync Ready . Inbound Passive
               </p>
            </div>
            <p className="text-xs md:text-sm text-projecxy-secondary font-bold uppercase tracking-widest opacity-60 max-w-[300px] leading-relaxed">Select an institutional channel to begin real-time message synchronization with other pilots.</p>
            <button className="px-10 py-4 bg-projecxy-blue text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">Open Transmission</button>
         </div>
         <div className="mt-12 text-center opacity-20">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Messaging Protocol v1.4.2</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative z-10 transition-all">
      
      {/* 🏙️ HEADER COMMAND */}
      <header className="px-8 py-5 border-b border-gray-50 bg-white shadow-soft flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="lg:hidden p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue rounded-2xl transition-all">
               <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-5">
               <div className="relative animate-in slide-in-from-left duration-700">
                  <img 
                     src={otherParticipant?.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.profile?.full_name || 'Pilot'}`} 
                     className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[24px] border-2 border-white shadow-soft" 
                     alt="avatar" 
                  />
                  <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white", conversation.online ? "bg-emerald-500" : "bg-gray-300")} />
               </div>
               <div className="space-y-0.5 min-w-0">
                  <h4 className="text-lg font-black text-projecxy-text tracking-tighter truncate leading-none uppercase">{otherParticipant?.profile?.full_name || 'Pilot Navigator'}</h4>
                  <div className="flex items-center gap-2">
                     <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 leading-none shadow-glow shadow-emerald-500/50">
                        <ShieldCheck className="w-3.5 h-3.5" /> Synchronized
                     </p>
                     <span className="w-1 h-1 bg-gray-300 rounded-full" />
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">Sector: {otherParticipant?.profile?.department || 'Hub Core'}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 mr-4">
               <Search className="w-5 h-5 text-gray-300 hover:text-projecxy-blue cursor-pointer transition-colors" />
               <Bookmark className="w-5 h-5 text-gray-300 hover:text-projecxy-blue cursor-pointer transition-colors" />
            </div>
            <button className="p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue hover:bg-blue-50 rounded-2xl transition-all flex items-center gap-2">
               <Phone className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue hover:bg-blue-50 rounded-2xl transition-all">
               <Video className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-50 text-gray-400 hover:text-projecxy-blue hover:bg-blue-50 rounded-2xl transition-all">
               <Info className="w-5 h-5" />
            </button>
         </div>
      </header>

      {/* 🛰️ MESSAGE HUB */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-4 md:space-y-6 scroll-smooth no-scrollbar bg-gray-50/20"
      >
        <AnimatePresence mode='popLayout'>
        {loading && messages.length === 0 ? (
           <div className="h-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-projecxy-blue/20" />
           </div>
        ) : messages.length > 0 ? (
           messages.map((msg, i) => (
              <MessageBubble 
                key={msg.id || i}
                message={msg}
                isMe={msg.sender_id === userId}
              />
           ))
        ) : (
           <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
              <MessageSquare className="w-16 h-16" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Zero Inbound Pulses Discovered</p>
           </div>
        )}
        </AnimatePresence>
        
        {/* Typers indicator could go here */}
      </div>

      {/* ⌨️ INPUT COMMAND */}
      <MessageInput onSend={onSend} loading={loading} />
    </div>
  );
};
