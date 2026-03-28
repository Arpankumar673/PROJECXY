import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Building, 
  GraduationCap, 
  Filter,
  RefreshCw
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface UserProfile {
  id: string
  full_name: string | null
  username: string | null
  role: 'student' | 'department'
  department?: string
  avatar_url?: string
  skills?: string[]
}

export default function DiscoverPeople() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  // 1. Fetch initial users or search results
  useEffect(() => {
    const fetchUsers = async () => {
      setSearching(true)
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .limit(20)

      if (searchTerm.trim()) {
        query = query.or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (!error && data) {
        setUsers(data as UserProfile[])
      }
      setLoading(false)
      setSearching(false)
    }

    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, user])

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-12">
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-[#EBEBEB] pt-12 pb-16">
        <div className="max-w-[1128px] mx-auto px-4 lg:px-0 text-center space-y-6">
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Discover People</h1>
              <p className="text-gray-500 font-bold text-lg max-w-lg mx-auto leading-tight uppercase tracking-widest">Find students and connect across campus</p>
           </div>
           
           {/* SEARCH BAR */}
           <div className="max-w-2xl mx-auto relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A66C2] transition-colors">
                 <Search size={22} />
              </div>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or username..."
                className="w-full h-16 pl-14 pr-6 bg-[#F3F2EF] border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-800 text-lg shadow-sm"
              />
              {searching && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                   <RefreshCw className="h-5 w-5 text-[#0A66C2] animate-spin" />
                </div>
              )}
           </div>
        </div>
      </section>

      {/* RESULTS GRID */}
      <main className="max-w-[1128px] mx-auto px-4 lg:px-0 mt-10">
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-sm italic">Institutional Registry</h2>
           <div className="flex items-center gap-2 text-[#666666] font-bold text-sm">
              <Filter size={16} /> Filters
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-2xl border border-[#EBEBEB] animate-pulse" />
             ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
               {users.map((u) => (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={u.id} 
                    className="bg-white rounded-2xl border border-[#EBEBEB] p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex flex-col relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-4">
                       <span className={clsx(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                         u.role === 'department' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"
                       )}>
                          {u.role}
                       </span>
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                       <div className="h-16 w-16 rounded-2xl bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] font-black text-2xl uppercase border-2 border-white shadow-sm shrink-0">
                          {u.full_name?.charAt(0)}
                       </div>
                       <div className="min-w-0">
                          <h3 className="font-black text-gray-900 text-lg leading-tight truncate group-hover:text-[#0A66C2] transition-colors">{u.full_name}</h3>
                          <p className="text-sm text-gray-400 font-bold truncate">@{u.username}</p>
                       </div>
                    </div>

                    <div className="space-y-3 mb-8 flex-grow">
                       <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-tighter">
                          {u.role === 'department' ? <Building size={14} /> : <GraduationCap size={14} />}
                          <span className="truncate">{u.department || 'General Account'}</span>
                       </div>
                       {u.skills && u.skills.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 opacity-60">
                            {u.skills.slice(0, 3).map((skill, ridx) => (
                               <span key={ridx} className="px-2 py-0.5 bg-[#F3F2EF] rounded-md text-[9px] font-black text-gray-500 uppercase">{skill}</span>
                            ))}
                         </div>
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                       <Link 
                         to={`/profile/${u.id}`}
                         className="flex items-center justify-center gap-2 h-11 bg-[#F3F2EF] text-[#666666] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#EBEBEB] transition-colors"
                       >
                          View Profile
                       </Link>
                       <button 
                         onClick={() => navigate('/messages')}
                         className="flex items-center justify-center gap-2 h-11 bg-[#0A66C2] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#004182] transition-colors shadow-lg shadow-blue-500/10"
                       >
                          Message
                       </button>
                    </div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#EBEBEB] space-y-4">
             <div className="h-20 w-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-gray-300">
                <Search size={40} />
             </div>
             <div>
                <p className="text-xl font-black text-gray-900 uppercase italic">No users found</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Try searching with a different name or @username</p>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
