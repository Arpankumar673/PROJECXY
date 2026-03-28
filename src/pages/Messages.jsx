import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useOutletContext, useSearchParams, Link } from 'react-router-dom'
import { Send, User, MessageSquare, Clock, Search, ArrowLeft, Loader2, Sparkles, AlertCircle, CheckCircle2, MoreVertical, MoreHorizontal, Paperclip, Smile, Image as ImageIcon } from 'lucide-react'

export default function Messages() {
  const { profile: myProfile } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedUserId = searchParams.get('user')
  
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (myProfile?.id) {
      fetchConversations()
      if (selectedUserId) {
        fetchSelectedUser(selectedUserId)
        fetchMessages(selectedUserId)
      }
    }
  }, [selectedUserId, myProfile])

  useEffect(() => {
    if (!selectedUserId || !myProfile) return

    const channel = supabase
      .channel(`room:${[myProfile.id, selectedUserId].sort().join('-')}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `and(or(sender_id.eq.${myProfile.id},receiver_id.eq.${myProfile.id}),or(sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}))`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedUserId, myProfile])

  useEffect(scrollToBottom, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function fetchConversations() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .rpc('get_conversations', { user_uuid: myProfile.id })
      
      if (error) {
        const { data: profiles } = await supabase.from('profiles').select('*').limit(10)
        setConversations(profiles.filter(p => p.id !== myProfile.id))
      } else {
        setConversations(data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function fetchSelectedUser(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setSelectedUser(data)
  }

  async function fetchMessages(uid) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${myProfile.id},receiver_id.eq.${uid}),and(sender_id.eq.${uid},receiver_id.eq.${myProfile.id})`)
      .order('created_at', { ascending: true })
    
    setMessages(data || [])
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: myProfile.id,
          receiver_id: selectedUserId,
          content: newMessage
        })
      
      if (error) throw error
      setNewMessage('')
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const selectConversation = (id) => {
    setSearchParams({ user: id })
  }

  if (loading && !selectedUserId) return (
     <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin shadow-sm"></div>
        <p className="text-text-secondary font-semibold text-xs animate-pulse uppercase tracking-widest uppercase">Initializing transmission logic...</p>
     </div>
  )

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 animate-fade-in pb-10">
      
      {/* Conversations List - Left Col */}
      <aside className={`w-full lg:w-72 flex flex-col card p-0 border-t-4 border-t-brand/50 ${selectedUserId ? 'hidden lg:flex' : 'flex'}`}>
         <div className="p-4 border-b border-border-subtle flex flex-col gap-3">
            <div className="flex items-center justify-between">
               <h3 className="font-semibold text-sm text-text-main">Messaging</h3>
               <button className="text-text-secondary hover:text-brand transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5 group-focus-within:text-brand transition-colors" />
               <input type="text" placeholder="Search messages" className="input-professional pl-8 h-9 text-xs font-semibold focus:bg-white" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto divide-y divide-border-subtle scrollbar-hide py-1">
            {conversations.length > 0 ? (
               conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full flex items-start gap-3 p-4 transition-all duration-300 relative group border-l-2 ${
                      selectedUserId === conv.id ? 'bg-[#EEF3F8] border-brand shadow-sm' : 'hover:bg-gray-50 border-transparent active:bg-gray-100'
                    }`}
                  >
                     <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-border-subtle overflow-hidden pointer-events-none group-hover:scale-105 transition-transform">
                           {conv.avatar_url ? (
                              <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                 <User className="w-6 h-6 text-slate-300" />
                              </div>
                           )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                     </div>
                     <div className="flex-1 text-left min-w-0 pr-1">
                        <div className="flex justify-between items-start">
                           <h4 className={`text-sm font-semibold truncate leading-tight transition-colors ${selectedUserId === conv.id ? 'text-brand' : 'text-text-main group-hover:text-brand'}`}>{conv.full_name}</h4>
                           <span className="text-[10px] text-text-secondary font-semibold shrink-0 uppercase tracking-tighter">Apr 12</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-tight mt-1 line-clamp-2 italic truncate pr-2">"{conv.branch || 'Innovator Hub Proposal'}"</p>
                     </div>
                  </button>
               ))
            ) : (
               <div className="text-center py-20 px-6 opacity-40 select-none grayscale">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No Transmissions Logged</p>
               </div>
            )}
         </div>
      </aside>

      {/* Chat Window - Center/Right Col */}
      <main className={`flex-1 flex flex-col card p-0 border-t-4 border-t-brand/50 ${!selectedUserId ? 'hidden lg:flex opacity-50 grayscale' : 'flex'}`}>
         {!selectedUserId ? (
            <div className="m-auto text-center space-y-6 max-w-sm px-6 animate-pulse-subtle">
               <div className="w-20 h-20 rounded-full bg-gray-50 border border-border-subtle flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-xl font-display font-black text-slate-400 capitalize italic mb-0">Select a message</h3>
               <p className="text-slate-400 font-medium tracking-tight">to begin your peer-to-peer transmission protocol.</p>
            </div>
         ) : (
            <>
               {/* Chat Header */}
               <div className="p-4 border-b border-border-subtle flex items-center justify-between sticky top-0 z-10 bg-white">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setSearchParams({})} className="lg:hidden p-2 text-text-secondary hover:text-brand transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                     </button>
                     <div className="w-12 h-12 rounded-full bg-gray-100 border border-border-subtle overflow-hidden pointer-events-none select-none shadow-sm">
                        {selectedUser?.avatar_url ? (
                           <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-slate-300" />
                           </div>
                        )}
                     </div>
                     <div className="min-w-0">
                        <Link to={`/profile/${selectedUser?.username}`} className="block">
                           <h4 className="text-sm font-semibold text-text-main line-clamp-1 hover:text-brand hover:underline">{selectedUser?.full_name}</h4>
                        </Link>
                        <div className="flex items-center gap-1.5 opacity-80">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Connection Active</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-text-secondary hover:text-brand transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
               </div>

               {/* Chat Body */}
               <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-gray-50/20 divide-y divide-border-subtle/40">
                  {messages.length > 0 ? (
                     messages.map((msg, i) => (
                        <div key={msg.id} className="pt-8 first:pt-4 group relative flex gap-3 animate-fade-in transition-all">
                           <div className="w-12 h-12 rounded-full border border-border-subtle overflow-hidden shrink-0 bg-white shadow-sm pointer-events-none select-none">
                              {msg.sender_id === myProfile.id ? (
                                 <img src={myProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                 <img src={selectedUser?.avatar_url} alt="" className="w-full h-full object-cover" />
                              )}
                           </div>
                           <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-semibold text-text-main truncate group-hover:text-brand transition-colors">
                                    {msg.sender_id === myProfile.id ? myProfile.full_name : selectedUser?.full_name}
                                 </span>
                                 <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-tighter shrink-0">•</span>
                                 <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tight shrink-0">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20 animate-fade-in grayscale">
                        <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest leading-none">Establishing Transmission Layer...</p>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               {/* Chat Input */}
               <div className="p-4 border-t border-border-subtle bg-white mt-auto sticky bottom-0 z-10 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
                  <form onSubmit={handleSendMessage} className="space-y-4">
                     <div className="relative group overflow-hidden">
                        <textarea
                          placeholder="Write a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="w-full border-2 border-border-subtle rounded-xl px-4 py-3 pb-12 text-sm text-text-main focus:outline-none focus:border-brand/40 transition-all resize-none min-h-[100px] bg-gray-50/50 focus:bg-white"
                        />
                        <div className="absolute left-4 bottom-3 flex items-center gap-5 pr-2 pt-2 border-t border-border-subtle/10 w-[calc(100%-32px)]">
                           <button type="button" className="text-text-secondary hover:text-brand transition-colors"><ImageIcon size={18} /></button>
                           <button type="button" className="text-text-secondary hover:text-brand transition-colors"><Paperclip size={18} /></button>
                           <button type="button" className="text-text-secondary hover:text-brand transition-colors"><Smile size={18} /></button>
                        </div>
                     </div>
                     <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="btn-primary min-w-[100px] h-9 shadow-md shadow-brand/10 disabled:grayscale disabled:opacity-50"
                        >
                           {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmission'}
                        </button>
                     </div>
                  </form>
               </div>
            </>
         )}
      </main>
    </div>
  )
}
