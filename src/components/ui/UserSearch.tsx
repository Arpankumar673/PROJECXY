import { useState, useEffect, useRef } from 'react'
import { Search, User as UserIcon, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Profile {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
}

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    async function searchUsers() {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(8)

      if (!error && data) {
        setResults(data)
        setIsOpen(true)
      }
      setLoading(false)
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#666666] group-focus-within:text-[#0A66C2] transition-colors">
          <Search className="h-5 w-5" strokeWidth={2.4} />
        </div>
        <input
          type="text"
          placeholder="Search by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full h-12 bg-[#EDF3F8] border-[1.5px] border-transparent rounded-lg pl-12 pr-10 focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] focus:shadow-[0_0_0_4px_rgba(10,102,194,0.1)] outline-none hover:bg-[#EBEBEB] transition-all duration-300 font-semibold text-[15px]"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full text-[#666666]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-14 left-0 right-0 bg-white border border-[#EBEBEB] shadow-2xl rounded-xl overflow-hidden z-[100]"
          >
            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <div className="h-6 w-6 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#666666] uppercase tracking-widest">Searching Profiles...</p>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-black text-[#666666] tracking-widest uppercase border-b border-[#F3F2EF]">
                  Network Suggestions
                </div>
                {results.map((profile) => (
                  <Link
                    key={profile.id}
                    to={`/profile?id=${profile.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F3F2EF] transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-100 border border-[#EBEBEB] group-hover:border-[#0A66C2]/30 transition-colors">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[#666666] font-bold">
                          {profile.full_name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black group-hover:text-[#0A66C2] transition-colors">{profile.full_name}</span>
                      <span className="text-xs text-[#666666]">@{profile.username}</span>
                    </div>
                    <UserIcon size={14} className="ml-auto text-[#666666] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
