import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Clock, CheckCircle2, XCircle, ChevronRight, Briefcase, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { clsx } from 'clsx'

interface Project {
  title: string
}

interface Application {
  id: string
  project_id: string
  role_name: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  projects?: Project
}

export default function Applications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return
      setLoading(true)
      
      try {
        const { data, error } = await supabase
          .from('join_requests')
          .select(`
            id,
            project_id,
            role_name,
            status,
            created_at,
            projects (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setApplications(data as any)
        } else if (error) {
          console.error('Error fetching applications:', error)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  const filteredApps = applications.filter(app => 
    activeFilter === 'all' || app.status === activeFilter
  )

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200 shadow-green-100/50'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200 shadow-red-100/50'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-yellow-100/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={13} strokeWidth={2.5} />
      case 'rejected': return <XCircle size={13} strokeWidth={2.5} />
      default: return <Clock size={13} strokeWidth={2.5} />
    }
  }

  if (loading) {
     return (
       <div className="min-h-[60vh] flex items-center justify-center">
         <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin shadow-sm" />
       </div>
     )
  }

  return (
    <div className="max-w-[1128px] mx-auto px-4 lg:px-0 py-8 space-y-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-black tracking-tight tracking-tight uppercase">My Applications</h1>
        <p className="text-[#666666] text-lg font-medium max-w-xl mx-auto">Track your journey through campus projects.</p>
      </section>

      {/* Filter Tabs */}
      <div className="flex justify-center border-b border-[#D9E2ED] gap-8 overflow-x-auto scrollbar-hide">
        {['all', 'pending', 'accepted', 'rejected'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={clsx(
              "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
              activeFilter === filter 
                ? "text-[#0A66C2]" 
                : "text-[#666666] hover:text-black"
            )}
          >
            {filter}
            {activeFilter === filter && (
              <motion.div layoutId="app-filter-id" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A66C2] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <main className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {filteredApps.map((app) => (
                 <motion.div 
                   key={app.id} 
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="li-card p-6 bg-white border-[#D9E2ED] shadow-sm hover:shadow-lg transition-all group overflow-hidden"
                 >
                   <div className="flex items-start justify-between gap-4">
                      <div className="space-y-4 flex-grow">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] border border-[#0A66C2]/10 transition-transform group-hover:scale-110">
                               <Briefcase size={22} />
                            </div>
                            <div>
                               <h3 className="text-[18px] font-extrabold text-black group-hover:text-[#0A66C2] transition-colors leading-tight mb-1">{app.projects?.title || 'Unknown Project'}</h3>
                               <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest bg-[#F3F2EF] px-2 py-0.5 rounded inline-block">Role: {app.role_name}</p>
                            </div>
                         </div>
                         
                         <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#666666]">
                               <Calendar size={13} className="text-[#0A66C2]" /> 
                               {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className={clsx(
                               "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] shadow-sm w-fit",
                               getStatusStyles(app.status)
                            )}>
                               {getStatusIcon(app.status)}
                               {app.status}
                            </div>
                         </div>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center text-[#D9E2ED] group-hover:text-[#0A66C2] group-hover:bg-[#EDF3F8] rounded-full transition-all">
                        <ChevronRight size={24} />
                      </div>
                   </div>
                 </motion.div>
               ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-[#D9E2ED] shadow-inner"
            >
              <div className="h-24 w-24 bg-[#EDF3F8] rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <FileText size={40} className="text-[#D9E2ED]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">No Tracked History</h3>
                <p className="text-sm text-[#666666] font-medium max-w-xs mx-auto">It looks like you haven't ventured into these projects yet.</p>
              </div>
              <button 
                onClick={() => setActiveFilter('all')}
                className="li-button-primary h-12 px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0A66C2]/20 rounded-full"
              >
                 Find Innovation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  )
}
