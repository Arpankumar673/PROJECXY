import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Rocket, Bell, Search, User, LogOut, LayoutDashboard, Settings, ChevronDown, MessageSquare, Briefcase, Users, Home } from 'lucide-react';
import { Button } from './ui';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
     { name: 'Home', path: '/dashboard', icon: Home },
     { name: 'Projects', path: '/dashboard', icon: Briefcase },
     { name: 'Messaging', path: '/dashboard', icon: MessageSquare, badge: true },
     { name: 'Alerts', path: '/dashboard', icon: Bell },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full grid grid-cols-3 items-center">
        
        {/* LEFT: Branding */}
        <div className="flex items-center gap-2">
           <Link to="/" className="flex items-center gap-2.5 text-linkedin-blue font-black text-xl tracking-tighter group">
              <div className="bg-blue-50 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                 <Rocket className="w-6 h-6 fill-linkedin-blue" />
              </div>
              <span className="hidden sm:block">Projecxy</span>
           </Link>
        </div>

        {/* CENTER: Navigation Menu */}
        <div className="flex items-center justify-center">
           {user && (
             <div className="flex items-center gap-1 md:gap-4 lg:gap-8">
               {navLinks.map((link) => (
                 <NavLink 
                    key={link.name} 
                    to={link.path} 
                    className={({ isActive }) => `flex flex-col items-center gap-0.5 group relative transition-all pb-1 ${isActive ? 'text-linkedin-text' : 'text-gray-400 hover:text-linkedin-text'}`}
                 >
                    <div className="relative">
                       <link.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                       {link.badge && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                       )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{link.name}</span>
                    <div className={`absolute bottom-[-14px] left-0 right-0 h-0.5 rounded-full transition-all duration-300 ${window.location.pathname === link.path ? 'bg-linkedin-blue scale-x-100' : 'bg-linkedin-blue/0 scale-x-0 group-hover:scale-x-50'}`}></div>
                 </NavLink>
               ))}
             </div>
           )}
        </div>

        {/* RIGHT: Profile/Auth */}
        <div className="flex items-center justify-end gap-3 md:gap-6">
          {!user ? (
            <div className="flex items-center gap-4">
               <Link to="/login" className="text-gray-500 font-bold text-sm hover:text-linkedin-blue transition-colors uppercase tracking-widest">Sign in</Link>
               <Button onClick={() => navigate('/signup')} size="sm" className="hidden sm:inline-flex px-6 font-bold uppercase tracking-widest rounded-xl h-10 shadow-md hover:shadow-blue-200">Join Projecxy</Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
               <div className="relative group/user cursor-pointer">
                  <div className="flex items-center gap-2 group-hover/user:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors">
                     <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" 
                     />
                     <div className="hidden sm:flex items-center gap-1">
                        <span className="text-xs font-black text-linkedin-text uppercase tracking-widest">Me</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover/user:text-linkedin-blue transition-colors" />
                     </div>
                  </div>
                  
                  {/* Premium Dropdown */}
                  <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all py-4 z-[100] translate-y-2 group-hover/user:translate-y-0">
                     <div className="px-5 pb-4 mb-4 border-b border-gray-50 flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-10 h-10 rounded-full bg-blue-50" />
                        <div className="min-w-0">
                           <p className="font-bold text-sm text-linkedin-text truncate capitalize">{profile?.full_name || 'Innovator'}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase truncate tracking-tighter">Student Account</p>
                        </div>
                     </div>
                     <div className="px-2 space-y-1">
                        <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-2.5 text-left font-bold text-xs text-gray-500 hover:bg-gray-50 hover:text-linkedin-blue rounded-xl transition-all flex items-center gap-2.5"><Settings className="w-4 h-4" /> Account Management</button>
                        <div className="h-px bg-gray-50 mx-4 my-1"></div>
                        <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left font-bold text-xs text-red-400 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2.5"><LogOut className="w-4 h-4" /> End Session</button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
