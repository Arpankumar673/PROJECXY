import { useState } from 'react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Home, 
  Search, 
  MessageSquare, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Code2, 
  LayoutGrid,
  Sparkles,
  TrendingUp,
  Globe,
  Settings,
  Plus,
  ShieldCheck,
  Zap
} from 'lucide-react'

export default function Layout({ profile, fetchProfile }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Network', icon: Globe, path: '/search' },
    { label: 'Messaging', icon: MessageSquare, path: '/messages' },
    { label: 'Research', icon: LayoutGrid, path: `/profile/${profile?.username || ''}` },
  ]

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-brand/10 antialiased overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-white border-b border-border-subtle z-50 h-14 select-none">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center shrink-0">
                <Code2 className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">Projecxy</span>
            </Link>
            
            <div className="hidden sm:flex relative items-center flex-1 max-w-sm ml-4 group">
              <Search className="absolute left-3 w-4 h-4 text-text-secondary group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search Identity Hub..." 
                className="w-full bg-[#EEF3F8] border-none rounded-sm h-8 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-brand focus:bg-white transition-all"
              />
            </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-4 lg:gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center gap-0.5 px-2 md:px-4 py-1 transition-all group relative ${
                  location.pathname === item.path ? 'text-text-main border-b-2 border-text-main' : 'text-text-secondary hover:text-text-main'
                }`}
              >
                <item.icon size={22} className={location.pathname === item.path ? 'fill-text-main/5' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-tighter hidden md:block">{item.label}</span>
              </Link>
            ))}
            
            <div className="h-8 w-px bg-border-subtle mx-2 hidden sm:block" />
            
            <button 
              onClick={handleSignOut}
              className="p-2 text-text-secondary hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </nav>

          <button className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="max-w-[1200px] mx-auto pt-18 lg:pt-20 px-4 grid grid-cols-12 gap-6 relative">
        
        {/* Left Sidebar: Profile Summary */}
        <aside className={`${isSidebarOpen ? 'fixed inset-0 z-40 bg-white pt-20 p-6' : 'hidden'} md:static md:block col-span-12 md:col-span-3 space-y-4 h-fit`}>
           <div className="card overflow-hidden">
              <div className="h-14 bg-brand/10 border-b border-border-subtle"></div>
              <div className="px-4 pb-4 -mt-8 text-center border-b border-border-subtle">
                 <Link to={`/profile/${profile?.username}`} className="inline-block relative group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white overflow-hidden bg-white shadow-xl group-hover:ring-2 group-hover:ring-brand/20 transition-all">
                       {profile?.avatar_url ? (
                         <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gray-50 text-slate-300">
                            <User size={32} />
                         </div>
                       )}
                    </div>
                 </Link>
                 <Link to={`/profile/${profile?.username}`} className="block mt-2 group">
                    <h2 className="text-base font-bold text-text-main group-hover:underline">{profile?.full_name || 'Innovator'}</h2>
                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[2px] mt-1">@{profile?.username || 'user'}</p>
                 </Link>
                 <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand/5 border border-brand/10 text-[9px] font-black uppercase text-brand tracking-widest">
                   {profile?.role === 'admin' ? <ShieldCheck size={10} /> : <Zap size={10} />}
                   {profile?.role || 'student'}
                 </div>
              </div>
              <div className="p-4 space-y-3">
                 <div className="flex justify-between items-center group cursor-pointer">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest group-hover:text-brand transition-colors">Profile views</span>
                    <span className="text-xs font-black text-brand">142</span>
                 </div>
                 <div className="flex justify-between items-center group cursor-pointer">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest group-hover:text-brand transition-colors">Appearances</span>
                    <span className="text-xs font-black text-brand">28</span>
                 </div>
              </div>
              <Link to={`/profile/${profile?.username}`} className="p-3 bg-gray-50 border-t border-border-subtle flex items-center justify-center gap-2 group">
                 <Settings size={14} className="text-text-secondary group-hover:rotate-90 transition-transform" />
                 <span className="text-[10px] font-bold text-text-secondary group-hover:text-brand uppercase tracking-widest">Manage Preferences</span>
              </Link>
           </div>
        </aside>

        {/* Center: Content Feed */}
        <main className="col-span-12 md:col-span-9 lg:col-span-6 min-h-[calc(100vh-80px)]">
          <Outlet context={{ profile, fetchProfile }} />
        </main>

        {/* Right Sidebar: Suggestions */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 h-fit sticky top-20">
           <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-text-main">Top Collaborators</h3>
                 <Sparkles className="text-brand w-4 h-4" />
              </div>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className="w-10 h-10 rounded-full border border-border-subtle bg-gray-50 overflow-hidden shadow-sm shrink-0">
                          <User className="w-full h-full p-2 text-slate-300" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-main truncate group-hover:text-brand">Researcher_{i}</p>
                          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Machine Learning Lab</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  )
}
