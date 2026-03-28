import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, Clock, Inbox, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'

interface Notification {
  id: string
  content: string
  is_read: boolean
  created_at: string
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      
      if (!error && data) setNotifications(data)
      setLoading(false)
    }

    fetchNotifications()

    // Real-time subscription
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new as Notification, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) => 
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            )
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) => prev.filter(n => n.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    if (error) console.error('Error marking as read:', error)
  }

  const markAllAsRead = async () => {
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    if (error) console.error('Error marking all as read:', error)
  }

  const clearAll = async () => {
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
    
    if (!error) setNotifications([])
    else console.error('Error clearing notifications:', error)
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E2ED] pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Notifications</h1>
          <p className="text-sm text-[#666666] font-medium">Stay updated with your latest project activity.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.is_read)}
            className="h-10 px-4 bg-[#F3F6F9] text-[#666666] font-bold text-xs rounded-lg hover:bg-[#EBEBEB] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Mark all Read
          </button>
          <button 
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="h-10 px-4 text-red-600 font-bold text-xs rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <main className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={clsx(
                  "li-card p-4 transition-all relative group flex items-start gap-4 cursor-pointer",
                  !n.is_read ? "bg-[#EDF3F8] border-[#0A66C2]/20" : "bg-white border-[#D9E2ED]/60"
                )}
                onClick={() => !n.is_read && markAsRead(n.id)}
              >
                {!n.is_read && (
                   <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0A66C2] rounded-full" />
                )}
                
                <div className={clsx(
                   "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                   !n.is_read ? "bg-[#0A66C2] text-white" : "bg-[#F3F6F9] text-[#666666]"
                )}>
                   <Bell size={20} />
                </div>

                <div className="flex-grow space-y-1 py-0.5">
                   <p className={clsx(
                     "text-sm leading-relaxed",
                     !n.is_read ? "text-black font-extrabold" : "text-[#666666] font-medium"
                   )}>
                     {n.content}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] font-black text-[#666666]/60 uppercase tracking-widest">
                      <Clock size={12} /> {formatTime(n.created_at)}
                      {!n.is_read && <span className="text-[#0A66C2]">∙ NEW</span>}
                   </div>
                </div>

                {!n.is_read && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#D9E2ED] rounded-full transition-all text-[#0A66C2]"
                  >
                    <Check size={18} />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-[#D9E2ED]"
            >
               <div className="h-20 w-20 bg-[#F3F6F9] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Inbox size={32} className="text-[#D9E2ED]" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-lg font-black text-black uppercase tracking-tight">No notifications yet</h3>
                 <p className="text-sm text-[#666666] font-medium max-w-xs mx-auto">We'll let you know when something important happens in your project network.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  )
}
