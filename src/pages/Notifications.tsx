import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, Inbox, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  read: boolean
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
      .update({ read: true })
      .eq('id', id)
    
    if (error) console.error('Error marking as read:', error)
  }

  const markAllAsRead = async () => {
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
    
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
          <h1 className="text-3xl font-black text-black tracking-tight uppercase italic">Live Console</h1>
          <p className="text-sm text-[#666666] font-medium uppercase tracking-widest text-[10px]">Transmission Hub</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.read)}
            className="h-10 px-4 bg-[#F3F6F9] text-[#666666] font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-[#EBEBEB] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Mark all Read
          </button>
          <button 
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="h-10 px-4 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} /> Purge Hub
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
                  "li-card p-6 transition-all relative group flex items-start gap-4 cursor-pointer rounded-2xl border-l-[6px]",
                  !n.read ? "bg-[#F0F7FF] border-[#0A66C2]" : "bg-white border-gray-100",
                  n.type === 'success' && !n.read && "border-emerald-500 bg-emerald-50/30"
                )}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div className={clsx(
                   "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                   n.type === 'success' ? "bg-emerald-500 text-white" : "bg-[#0A66C2] text-white"
                )}>
                   {n.type === 'success' ? <CheckCircle2 size={24} /> : <Bell size={24} />}
                </div>

                <div className="flex-grow space-y-1">
                   <div className="flex justify-between items-center">
                     <p className={clsx(
                       "text-sm uppercase font-black tracking-tighter italic",
                       !n.read ? "text-black" : "text-[#666666]"
                     )}>
                       {n.title}
                     </p>
                     <span className="text-[9px] font-black text-gray-400">{formatTime(n.created_at)}</span>
                   </div>
                   <p className="text-sm font-medium text-[#666666] leading-relaxed">
                     {n.message}
                   </p>
                </div>

                {!n.read && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-full transition-all text-[#0A66C2] shadow-sm"
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
