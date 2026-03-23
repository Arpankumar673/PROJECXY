import React, { useState } from 'react';
import { Send, Hash, Rocket, ChevronRight, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '../ui';

export const MessageInput = ({ onSend, loading = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !loading) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white/80 backdrop-blur-xl border-t border-gray-50 flex items-center justify-center">
       <div className="w-full max-w-4xl relative group">
          <form onSubmit={handleSend} className="relative">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-projecxy-blue transition-colors">
                <MessageSquare className="w-5 h-5" />
             </div>
             <textarea 
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Synchronize your message..."
                className="w-full h-16 pl-16 pr-24 py-5 bg-gray-50 border border-gray-100 rounded-[32px] focus:ring-[6px] focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-inner placeholder:text-gray-300 text-sm font-semibold tracking-tight resize-none overflow-hidden"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl mr-1">
                   <Hash className="w-3 h-3 text-gray-300" />
                   <span className="text-[9px] font-black uppercase text-gray-400">Hub-ID</span>
                </div>
                <button 
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="w-12 h-12 bg-projecxy-blue text-white rounded-[24px] flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 transition-all disabled:opacity-30 disabled:shadow-none hover:scale-105"
                >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};
