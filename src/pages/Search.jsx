import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search as SearchIcon, Users, GraduationCap, ArrowRight, BookOpen, Hash, Filter, Sparkles, MessageSquare, User, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Search() {
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    try {
      setLoading(true)
      let { data } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
      
      setStudents(data || [])
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => {
    const matchesQuery = 
      s.full_name?.toLowerCase().includes(query.toLowerCase()) || 
      s.username?.toLowerCase().includes(query.toLowerCase()) || 
      s.branch?.toLowerCase().includes(query.toLowerCase()) ||
      s.skills?.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    
    const matchesDept = deptFilter === 'All Departments' || s.department === deptFilter
    return matchesQuery && matchesDept
  })

  const departments = ['All Departments', ...new Set(students.map(s => s.department).filter(Boolean))]

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      
      {/* Search Header/Filter Card */}
      <section className="card p-6 space-y-6 bg-[#EEF3F8]/50 border-brand/10">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-text-main flex items-center gap-2">
              Institutional Directory <Sparkles className="w-5 h-5 text-brand fill-brand/10" />
            </h1>
            <p className="text-sm text-text-secondary leading-tight">Identify researchers, mentors, and collaborators across the university ecosystem.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 relative w-full group">
             <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 group-focus-within:text-brand transition-colors" />
             <input
               type="text"
               placeholder="Search by @username, name, or skillset..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="input-professional pl-12 h-12 text-sm bg-white border border-border-subtle focus:border-brand transition-all"
             />
           </div>
           
           <div className="relative w-full md:w-64 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 group-focus-within:text-brand transition-colors" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="input-professional pl-12 h-12 bg-white border border-border-subtle appearance-none cursor-pointer focus:border-brand transition-all text-xs font-bold uppercase tracking-widest text-text-secondary pr-10"
              >
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-white text-text-main py-4 uppercase font-bold text-xs">{d}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-500 rotate-45 pointer-events-none group-focus-within:border-brand" />
           </div>
        </div>
      </section>

      {loading ? (
         <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary font-bold text-[10px] animate-pulse uppercase tracking-widest">Synchronizing directory...</p>
         </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 py-1">
             <div className="h-px flex-1 bg-border-subtle" />
             <span className="text-[10px] font-black text-text-secondary uppercase tracking-[3px] px-2">{filteredStudents.length} Innovator{filteredStudents.length !== 1 ? 's' : ''} Identified</span>
             <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <div key={s.id} className="card p-0 overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:border-brand/40 bg-white">
                  <div className="h-20 bg-gray-50 border-b border-border-subtle relative overflow-hidden group-hover:bg-[#EEF3F8] transition-colors">
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/5 rounded-full" />
                  </div>
                  
                  <div className="px-6 pb-6 relative z-10">
                     <Link to={`/profile/${s.username}`} className="block relative -mt-10 mb-4 inline-block group/avatar">
                        <div className="w-20 h-20 rounded-full bg-white border-2 border-white overflow-hidden shadow-2xl group-hover/avatar:ring-2 group-hover/avatar:ring-brand/20 transition-all">
                           {s.avatar_url ? (
                              <img src={s.avatar_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-border-subtle">
                                 <User className="w-10 h-10 text-slate-300" />
                              </div>
                           )}
                        </div>
                     </Link>

                     <div className="space-y-3">
                        <Link to={`/profile/${s.username}`} className="block space-y-0.5">
                           <h4 className="text-lg font-semibold text-text-main group-hover:text-brand transition-colors leading-none flex items-center gap-1.5 ">
                              {s.full_name} <CheckCircle2 className="w-3.5 h-3.5 text-brand fill-brand/10 shrink-0" />
                           </h4>
                           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[2px] block">@{s.username}</span>
                        </Link>

                        <div className="space-y-1.5 pt-1">
                           <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                              <BookOpen className="w-3.5 h-3.5 text-brand" />
                              <span className="truncate">{s.department || 'N/A'}</span>
                           </div>
                           <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                              <Hash className="w-3.5 h-3.5 text-brand" />
                              <span className="truncate">{s.branch || 'N/A'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-6 flex flex-col gap-2">
                        <Link to={`/messages?user=${s.id}`} className="btn-outline h-9 w-full uppercase text-[10px] font-black tracking-widest flex items-center justify-center gap-2">
                           Connect Request
                        </Link>
                        <Link to={`/profile/${s.username}`} className="btn-primary h-9 w-full uppercase text-[10px] font-black tracking-widest flex items-center justify-center gap-2">
                           View Profile <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 card text-center space-y-6 border-dashed border-2">
                 <Users size={40} className="mx-auto text-gray-200" />
                 <h3 className="text-lg font-semibold text-text-secondary">No professional identifiers found.</h3>
                 <button onClick={() => {setQuery(''); setDeptFilter('All Departments')}} className="text-brand font-bold hover:underline text-sm uppercase tracking-widest">Reset Discovery</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
