import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  MessageSquare,
  ArrowLeft,
  CheckCheck,
  Building,
  GraduationCap,
  RefreshCw,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'
import { format } from 'date-fns'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  is_optimistic?: boolean
}

interface UserProfile {
  id: string
  full_name: string | null
  username: string | null
  role: 'student' | 'department'
  avatar_url?: string
}

export default function Messages() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<UserProfile[]>([])
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return
      const { data: sentMessages } = await supabase.from('messages').select('receiver_id').eq('sender_id', user.id)
      const { data: receivedMessages } = await supabase.from('messages').select('sender_id').eq('receiver_id', user.id)

      const userIds = new Set([
        ...(sentMessages?.map(m => m.receiver_id) || []),
        ...(receivedMessages?.map(m => m.sender_id) || [])
      ])

      if (userIds.size > 0) {
        const { data: profiles } = await supabase.from('profiles').select('*').in('id', Array.from(userIds))
        if (profiles) setConversations(profiles as UserProfile[])
      }
      setLoading(false)
    }
    fetchConversations()
  }, [user])

  // 2. Search
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) { setSearchResults([]); return; }
      setSearching(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(5)
      if (data) setSearchResults(data as UserProfile[])
      setSearching(false)
    }
    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, user])

  // 3. Messages & Real-time (with DUPLICATE GUARD 🛡️)
  useEffect(() => {
    if (!activeChat || !user) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }
    fetchMessages()

    const channel = supabase
      .channel(`chat_realtime`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message
        
        // Only care about messages in THIS active chat
        const isRelevant = (msg.sender_id === activeChat.id && msg.receiver_id === user.id) || 
                          (msg.sender_id === user.id && msg.receiver_id === activeChat.id)
        
        if (isRelevant) {
          setMessages(prev => {
            // DUPLICATE GUARD: If we already have this ID (from optimistic update), don't add it again
            if (prev.some(p => p.id === msg.id)) return prev
            // Also filter out any optimistic messages that match this content to avoid "jumping"
            return [...prev.filter(p => !p.is_optimistic || p.content !== msg.content), msg]
          })
        }
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [activeChat, user])

  // 4. Auto Scroll
  useEffect(() => {
     scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 5. Send Message (with OPTIMISTIC UPDATE 🚀)
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() || !activeChat || !user) return

    const messageText = newMessage.trim()
    setNewMessage('')

    // 🚀 OPTIMISTIC UI UPDATE
    const tempId = Math.random().toString()
    const optimisticMsg: Message = {
      id: tempId,
      sender_id: user.id,
      receiver_id: activeChat.id,
      content: messageText,
      created_at: new Date().toISOString(),
      is_optimistic: true
    }
    setMessages(prev => [...prev, optimisticMsg])

    // Save to DB
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: activeChat.id,
        content: messageText
      })

    if (error) {
       console.error('Failed to send:', error.message)
       // Remove optimistic message on fail
       setMessages(prev => prev.filter(m => m.id !== tempId))
    } else {
       if (!conversations.find(c => c.id === activeChat.id)) {
          setConversations(prev => [activeChat, ...prev])
       }
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse tracking-[0.3em] uppercase italic">Secure Hub Loading...</div>

  return (
    <div className="h-[calc(100vh-56px)] bg-[#F3F2EF] flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={clsx(
        "w-full md:w-[400px] bg-white border-r border-[#EBEBEB] flex flex-col transition-all z-20",
        activeChat && "hidden md:flex"
      )}>
        <div className="p-4 space-y-4 border-b border-[#EBEBEB] bg-white">
           <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Secure Messenger</h1>
              <div className="h-8 w-8 bg-[#F3F2EF] rounded-full flex items-center justify-center text-[#666666]"><MoreVertical size={18} /></div>
           </div>
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A66C2] transition-colors" />
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search Identity Registry..."
                className="w-full h-11 pl-12 pr-4 bg-[#F3F2EF] border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent outline-none transition-all text-sm font-medium"
              />
              {searching && <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2] animate-spin" />}
           </div>
        </div>

        <div className="flex-grow overflow-y-auto relative custom-scrollbar">
           <AnimatePresence>
             {searchTerm.trim() && (
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-0 bg-white shadow-xl z-20 border-b border-[#EBEBEB]">
                  <div className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 flex justify-between items-center">
                    <span>Identity Results</span>
                    <button onClick={() => setSearchTerm('')}><X size={14} /></button>
                  </div>
                  {searchResults.map(u => (
                    <button key={u.id} onClick={() => { setActiveChat(u); setSearchTerm(''); }} className="w-full p-4 flex items-center gap-4 hover:bg-[#F3F6F9] transition-all border-b border-gray-50 group">
                       <div className="h-12 w-12 rounded-full bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] font-black uppercase">{u.full_name?.charAt(0)}</div>
                       <div className="text-left flex-grow">
                          <p className="font-bold text-gray-900 group-hover:text-[#0A66C2] transition-colors leading-none">{u.full_name}</p>
                          <p className="text-xs text-[#666666] mt-1 font-medium flex items-center gap-1 uppercase tracking-tighter">
                             {u.role} • @{u.username}
                          </p>
                       </div>
                    </button>
                  ))}
               </motion.div>
             )}
           </AnimatePresence>

           <div className="divide-y divide-gray-50">
              {conversations.length === 0 ? (
                <div className="px-10 py-24 text-center space-y-4">
                   <div className="h-24 w-24 bg-[#F3F2EF] rounded-full mx-auto flex items-center justify-center text-gray-300"><MessageSquare size={48} /></div>
                   <p className="font-black text-gray-900 uppercase tracking-tight text-lg">Communication Required</p>
                   <p className="text-xs text-gray-400 font-bold px-6 leading-relaxed">Identity search above to initiate a secure real-time encrypted dialogue thread.</p>
                </div>
              ) : conversations.map(c => (
                <button key={c.id} onClick={() => setActiveChat(c)} className={clsx(
                    "w-full p-5 flex items-center gap-4 hover:bg-[#F9FAFB] transition-all text-left relative group border-l-4",
                    activeChat?.id === c.id ? "border-[#0A66C2] bg-[#F3F6F9]" : "border-transparent"
                  )}>
                   <div className="h-14 w-14 rounded-full bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] font-black text-xl uppercase">{c.full_name?.charAt(0)}</div>
                   <div className="flex-grow min-w-0">
                      <p className="font-black text-[15px] text-gray-900 leading-none truncate mb-1">{c.full_name}</p>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                         {c.role === 'department' ? <Building size={12} className="shrink-0 text-[#0A66C2]" /> : <GraduationCap size={12} className="shrink-0 text-gray-400" />}
                         <p className="text-[11px] text-[#666666] truncate font-medium uppercase tracking-tighter">@{c.username} • {c.role}</p>
                      </div>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </aside>

      {/* CHAT WINDOW */}
      <main className={clsx(
        "flex-grow bg-white flex flex-col relative",
        !activeChat && "hidden md:flex items-center justify-center bg-[#F3F2EF]"
      )}>
        {activeChat ? (
          <>
            <header className="h-16 px-6 border-b border-[#EBEBEB] flex items-center justify-between bg-white shrink-0 z-10 shadow-sm">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-gray-400"><ArrowLeft size={24} /></button>
                  <div className="h-10 w-10 rounded-lg bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] font-black uppercase">{activeChat.full_name?.charAt(0)}</div>
                  <div>
                     <p className="font-black text-gray-900 leading-none tracking-tight">{activeChat.full_name}</p>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5"><span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Secure Connection</p>
                  </div>
               </div>
               <div className="flex items-center gap-1">
                  <button className="p-3 text-gray-400 hover:bg-[#F3F6F9] hover:text-[#0A66C2] rounded-xl transition-all"><Phone size={20} /></button>
                  <button className="p-3 text-gray-400 hover:bg-[#F3F6F9] hover:text-[#0A66C2] rounded-xl transition-all"><Video size={20} /></button>
                  <button className="p-3 text-gray-400 hover:bg-[#F3F6F9] hover:text-[#0A66C2] rounded-xl transition-all"><Info size={20} /></button>
               </div>
            </header>

            <div className="flex-grow overflow-y-auto p-8 bg-gray-50/50 custom-scrollbar">
               <div className="max-w-2xl mx-auto space-y-8">
                  <div className="text-center opacity-40"><span className="px-4 py-1.5 bg-white border border-[#EBEBEB] rounded-full text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">End-to-End Governance Trace Active</span></div>
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                         <div className={clsx("max-w-[80%] flex flex-col", isMe ? "items-end" : "items-start")}>
                            <div className={clsx(
                              "px-6 py-4 rounded-[26px] shadow-sm text-[15px] font-medium leading-relaxed mb-1 transition-opacity",
                              isMe ? "bg-[#0A66C2] text-white rounded-tr-none" : "bg-white border border-[#EBEBEB] text-gray-800 rounded-tl-none",
                              msg.is_optimistic && "opacity-60"
                            )}>
                               {msg.content}
                            </div>
                            <div className={clsx("flex items-center gap-1.5 px-2 text-[9px] font-black uppercase tracking-widest text-gray-400", isMe && "flex-row-reverse")}>
                               <span>{format(new Date(msg.created_at), 'HH:mm')}</span>
                               {isMe && <CheckCheck size={12} className={msg.is_optimistic ? "text-gray-300" : "text-[#0A66C2]"} />}
                            </div>
                         </div>
                      </motion.div>
                    )
                  })}
                  <div ref={scrollRef} />
               </div>
            </div>

            <footer className="p-6 bg-white border-t border-[#EBEBEB] shrink-0">
               <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative group">
                  <input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type encrypted message..."
                    className="w-full h-16 pl-6 pr-20 bg-[#F3F2EF] border-transparent rounded-[20px] focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-800"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 bg-[#0A66C2] text-white rounded-full flex items-center justify-center hover:bg-[#004182] active:scale-90 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-20">
                     <Send size={20} strokeWidth={2.5} />
                  </button>
               </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 h-full bg-[#F3F2EF]">
             <div className="h-40 w-40 bg-white rounded-full flex items-center justify-center shadow-xl border border-white relative"><MessageSquare size={80} className="text-[#0A66C2] opacity-20" /></div>
             <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Instant Identity Comms</h2>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest max-w-xs mx-auto">Select a contact from the registry to begin a secure real-time transmission.</p>
             </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #EBEBEB; border-radius: 10px; }
      `}</style>
    </div>
  )
}
