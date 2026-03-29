import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, MessageSquare, Bell, User, Menu, Briefcase, GraduationCap, LogOut, ChevronDown, BarChart3, Users } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const studentNavItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Applications', path: '/applications', icon: FileText },
  { label: 'Projects', path: '/projects', icon: Briefcase },
  { label: 'Mentorship', path: '/mentorship', icon: GraduationCap },
  { label: 'People', path: '/people', icon: Users },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'Notifications', path: '/notifications', icon: Bell },
]

const departmentNavItems = [
  { label: 'Dashboard', path: '/dept-dashboard', icon: Home },
  { label: 'Projects', path: '/dept-projects', icon: Briefcase },
  { label: 'People', path: '/people', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
]




export default function Navbar() {
  const { profile } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Guard: Determine the navigation matrix based on strictly verified role
  const isDept = profile?.role === 'department'
  const isStudent = profile?.role === 'student'
  const navItems = isDept ? departmentNavItems : (isStudent ? studentNavItems : [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsProfileDropdownOpen(false)
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  // Do not show full nav if role is not identified or user isn't onboarded
  const hideNav = !profile?.is_onboarded || !profile?.role

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#EBEBEB] shadow-sm">
      <div className="max-w-[1128px] mx-auto px-4 lg:px-0 text-gray-900">
        <div className="flex h-14 items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-[#0A66C2] rounded-[3px] flex items-center justify-center group-hover:bg-[#004182] transition-colors shadow-sm">
                <span className="text-white font-black text-xl leading-none italic">P</span>
              </div>
              <span className="text-xl font-black text-black tracking-tighter uppercase hidden sm:block">Projecxy</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-0 lg:space-x-1 h-full">
            {!hideNav && navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center space-y-0.5 px-3 h-full min-w-[80px] relative transition-all duration-300 group',
                    isActive ? 'text-black' : 'text-[#666666] hover:text-black'
                  )}
                >
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <item.icon className={cn('h-6 w-6 transition-transform group-active:scale-90', isActive && 'text-black')} strokeWidth={1.5} />
                  </motion.div>
                  <span className="text-[12px] font-normal leading-none hidden lg:inline tracking-tight">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </Link>
              )
            })}
            
            <div className="h-full border-l border-[#EBEBEB] ml-2 pl-2 flex items-center relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={cn(
                  'flex flex-col items-center justify-center p-1 px-3 min-w-[80px] h-full text-[#666666] hover:text-black transition-all relative group',
                  location.pathname === '/profile' && 'text-black'
                )}
              >
                <div className="h-6 w-6 rounded-full bg-[#EDF3F8] overflow-hidden flex items-center justify-center border border-white transition-transform group-hover:scale-110 shadow-sm text-[#0A66C2]">
                  <User size={16} strokeWidth={2} />
                </div>
                <span className="text-[12px] font-normal leading-none flex items-center group-hover:text-black">
                  Me <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isProfileDropdownOpen && "rotate-180")} />
                </span>
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-14 right-0 w-64 bg-white border border-[#D9E2ED] shadow-xl rounded-xl overflow-hidden z-[100]"
                  >
                    <div className="p-4 border-b border-[#F3F2EF]">
                       <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 group">
                          <div className="h-12 w-12 rounded-full bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2]">
                             <User size={24} />
                          </div>
                          <div>
                             <p className="font-bold text-[15px] group-hover:text-[#0A66C2] transition-colors leading-tight">
                               {profile?.full_name || 'Your Profile'}
                             </p>
                             <p className="text-xs text-[#666666] font-medium leading-tight uppercase tracking-widest">
                               {isDept ? 'Institution Admin' : 'Student Member'}
                             </p>
                          </div>
                       </Link>
                    </div>
                    <div className="p-2 space-y-1">
                       <button className="w-full text-left px-3 py-2 text-sm font-bold text-[#666666] hover:bg-[#F3F6F9] hover:text-black rounded-lg transition-colors flex items-center gap-2">
                          Settings & Privacy
                       </button>
                    </div>
                    <div className="p-2 bg-[#F3F6F9] border-t border-[#D9E2ED]">
                       <button 
                         onClick={handleSignOut}
                         className="w-full text-left px-3 py-2 text-sm font-black text-red-600 hover:bg-white rounded-lg transition-all flex items-center gap-2"
                       >
                          <LogOut size={16} /> Sign Out
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#666666] hover:bg-black/5 rounded-full z-[70]"
          >
            <Menu className={cn("h-6 w-6 transition-all duration-300", isMobileMenuOpen && "rotate-90 scale-110 text-black")} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar & Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[65] md:hidden flex flex-col pt-16 border-r border-[#F3F2EF]"
            >
              {/* 1. Minimal Profile Header (Now Clickable) */}
              <Link 
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-6 block hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#EDF3F8] flex items-center justify-center text-[#0A66C2] border border-[#F3F2EF] overflow-hidden flex-shrink-0 group-hover:border-[#0A66C2] transition-colors">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-[15px] text-black leading-tight truncate group-hover:text-[#0A66C2] transition-colors">{profile?.full_name || 'Alumni Developer'}</h3>
                    <p className="text-[10px] font-medium text-[#666666] tracking-wide mt-0.5">{isDept ? 'Institution Admin' : 'Student Member'}</p>
                  </div>
                </div>
              </Link>

              <div className="px-6 pb-4"><div className="h-px bg-[#F3F2EF]" /></div>

              {/* 2. Streamlined Navigation List */}
              <div className="flex-grow overflow-y-auto px-3 py-2 space-y-0.5">
                {!hideNav && navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                        isActive ? 'bg-[#F3F6F8] text-[#0A66C2]' : 'text-[#666666] hover:bg-gray-50 hover:text-black'
                      )}
                    >
                      <item.icon size={18} className={cn('transition-colors', isActive ? 'text-[#0A66C2]' : 'group-hover:text-black')} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={cn('text-[14px] font-medium tracking-tight', isActive ? 'font-bold' : 'font-medium')}>{item.label}</span>
                    </Link>
                  )
                })}

                <div className="pt-4 mt-2 border-t border-[#F3F2EF]">
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3.5 px-3 py-2.5 text-[#666666] hover:text-red-600 font-medium text-[14px] rounded-lg hover:bg-red-50 transition-all group"
                  >
                    <LogOut size={18} className="group-hover:text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
