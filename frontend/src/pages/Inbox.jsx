import React, { useState } from 'react';
import { 
  Search, MoreHorizontal, Send, 
  Smile, Paperclip, Phone, Video,
  Search as SearchIcon, Users, CheckCheck,
  CheckCircle2, Loader2, ArrowLeft
} from 'lucide-react';
import { cn } from '../components/ui';

const ChatList = ({ chats, activeChat, setActiveChat }) => (
    <div className="w-full lg:w-96 border-r border-gray-100 bg-white flex flex-col h-full rounded-[32px] overflow-hidden lg:rounded-none lg:border-none">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-black text-projecxy-text tracking-tighter uppercase">Inbound</h2>
            <div className="w-10 h-10 bg-blue-50 text-projecxy-blue rounded-xl flex items-center justify-center font-black text-xs border border-blue-100">
               12
            </div>
        </div>
        <div className="p-6">
            <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-projecxy-blue transition-colors" />
                <input 
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-projecxy-blue/20 transition-all placeholder:text-gray-300" 
                    placeholder="Search messages..."
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar pb-10">
            {chats.map(chat => (
                <button 
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={cn(
                        "w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 group",
                        activeChat?.id === chat.id 
                            ? "bg-blue-50/50 shadow-soft border border-blue-100" 
                            : "bg-white hover:bg-gray-50 hover:translate-x-1"
                    )}
                >
                    <div className="relative">
                        <img src={chat.avatar} className="w-12 h-12 rounded-xl object-cover border border-gray-100" alt={chat.name} />
                        {chat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-soft" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[13px] font-black text-projecxy-text truncate uppercase tracking-tight">{chat.name}</h4>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{chat.time}</span>
                        </div>
                        <p className={cn(
                            "text-[11px] truncate tracking-tight font-medium",
                            chat.unread ? "text-projecxy-blue font-bold" : "text-projecxy-secondary"
                        )}>{chat.lastMsg}</p>
                    </div>
                    {chat.unread && (
                        <div className="w-2 h-2 bg-projecxy-blue rounded-full shadow-[0_0_8px_rgba(10,132,255,0.6)] animate-pulse" />
                    )}
                </button>
            ))}
        </div>
    </div>
);

const ChatWindow = ({ activeChat, onBack }) => {
    const [msg, setMsg] = useState("");
    
    if (!activeChat) return (
        <div className="hidden lg:flex flex-1 items-center justify-center flex-col gap-6 text-projecxy-secondary/20 p-20 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-[32px] flex items-center justify-center">
               <Users className="w-12 h-12" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Hub Connection Inactive</p>
        </div>
    );

    const messages = [
        { id: 1, text: "Hey! How's the AI ML model coming along?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "Almost finished the training phase. Just tuning the hyperparameters.", sender: "me", time: "10:32 AM" },
        { id: 3, text: "Awesome! Let me know if you need help with the backend integration.", sender: "them", time: "10:34 AM" },
        { id: 4, text: "Will do. Thanks!", sender: "me", time: "10:35 AM" },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-white lg:bg-transparent animate-in slide-in-from-right-10 duration-500">
            {/* 🛸 HEADER */}
            <div className="p-6 md:p-8 border-b border-gray-100 bg-white/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10 lg:bg-white lg:backdrop-blur-none">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-projecxy-blue"><ArrowLeft className="w-6 h-6" /></button>
                    <div className="relative">
                        <img src={activeChat.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-gray-100 shadow-soft" />
                        {activeChat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-soft" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-projecxy-text tracking-tighter uppercase leading-none mb-1.5">{activeChat.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-projecxy-secondary/50">
                            {activeChat.online ? <span className="text-emerald-500">Live Connection</span> : <span>Offline Hub</span>}
                            <span className="opacity-30">•</span>
                            <span>{activeChat.role || 'Contributor'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="hidden md:flex p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                    <button className="hidden md:flex p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                    <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
            </div>

            {/* 💬 MESSAGES */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar pb-32">
                {messages.map((m, i) => (
                    <div key={m.id} className={cn(
                        "flex flex-col max-w-[85%] md:max-w-[70%] space-y-2 group",
                        m.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
                    )}>
                        <div className={cn(
                            "px-5 py-4 rounded-3xl text-[13px] md:text-sm shadow-soft transition-all duration-300",
                            m.sender === "me" 
                                ? "bg-projecxy-blue text-white rounded-tr-none hover:shadow-blue-100" 
                                : "bg-white border border-gray-100 text-projecxy-text rounded-tl-none hover:border-blue-100"
                        )}>
                            {m.text}
                        </div>
                        <div className="flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{m.time}</span>
                            {m.sender === "me" && <CheckCheck className="w-3.5 h-3.5 text-projecxy-blue" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* ⌨️ INPUT */}
            <div className="p-8 sticky bottom-0 bg-white/50 backdrop-blur-xl border-t border-gray-100/50 lg:bg-white lg:border-none lg:p-10 lg:bg-transparent">
                <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white p-3 rounded-[32px] border border-gray-100 shadow-xl shadow-blue-50 group transition-all focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-projecxy-blue/20">
                    <button className="p-3 text-gray-400 hover:text-projecxy-blue hover:bg-blue-50 rounded-2xl transition-all"><Paperclip className="w-5 h-5" /></button>
                    <input 
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Encrypted transmission..."
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-gray-300"
                    />
                    <button className="p-3 text-gray-400 hover:text-projecxy-blue transition-all"><Smile className="w-5 h-5" /></button>
                    <button className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-2xl transition-all",
                        msg.trim() ? "bg-projecxy-blue text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-300"
                    )}>
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const InboxPage = () => {
    const [activeChat, setActiveChat] = useState(null);

    const chats = [
        { id: 1, name: "Arpan Kumar", role: "Frontend Lead", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arpan", lastMsg: "Hey! How's the AI ML model coming along?", time: "10:30 AM", unread: true, online: true },
        { id: 2, name: "Sarah Taylor", role: "UI Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", lastMsg: "The updated mockups are in Figma.", time: "Yesterday", unread: false, online: false },
        { id: 3, name: "David Miller", role: "Backend Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david", lastMsg: "API docs are updated.", time: "Monday", unread: false, online: true },
        { id: 4, name: "Innovation Hub", role: "Global Group", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hub", lastMsg: "New project: AgriBot is live!", time: "Sunday", unread: true, online: true },
    ];

    return (
        <div className="h-screen bg-projecxy-bg lg:p-6">
            <div className="h-full bg-white border border-gray-100 rounded-[32px] overflow-hidden flex shadow-soft relative lg:border-none lg:bg-transparent">
                <ChatList chats={chats} activeChat={activeChat} setActiveChat={setActiveChat} />
                <ChatWindow activeChat={activeChat} onBack={() => setActiveChat(null)} />
            </div>
        </div>
    );
};
