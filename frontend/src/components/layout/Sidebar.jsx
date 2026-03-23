import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Rocket, Plus, Briefcase, 
  Layers, BarChart3, Trophy, User, Settings, 
  ChevronDown, Bell, LogOut, Search, Activity,
  MessageSquare, Globe, Lock, Shield
} from 'lucide-react';
import { cn } from '../ui';
import { useAuth } from '../../hooks/useAuth';

const SidebarItem = ({ item, isActive, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="mb-1">
      <NavLink
        to={item.path}
        onClick={(e) => {
          if (hasSubItems) {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-white/[0.08] text-projecxy-blue shadow-linear border border-white/[0.05]" 
            : "text-projecxy-secondary hover:bg-white/[0.04] hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-lg transition-colors",
            isActive ? "bg-projecxy-blue/10 text-projecxy-blue" : "group-hover:text-projecxy-blue"
          )}>
            <item.icon className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <span className="text-[13px] font-bold tracking-tight whitespace-nowrap uppercase">{item.name}</span>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="bg-projecxy-blue text-[9px] font-black px-1.5 py-0.5 rounded-md text-white">
                {item.badge}
              </span>
            )}
            {hasSubItems && (
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="w-3 h-3 opacity-40" />
              </motion.div>
            )}
          </div>
        )}
      </NavLink>

      <AnimatePresence>
        {!isCollapsed && hasSubItems && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-11 mt-1 space-y-1"
          >
            {item.subItems.map((sub, idx) => (
              <NavLink
                key={idx}
                to={sub.path}
                className={({ isActive }) => cn(
                  "block py-2 text-[11px] font-black uppercase tracking-widest transition-colors",
                  isActive ? "text-projecxy-blue" : "text-projecxy-secondary/60 hover:text-white"
                )}
              >
                {sub.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const avatar = profile?.avatar_url 
    ? profile.avatar_url 
    : `https://ui-avatars.com/api/?name=${profile?.full_name || "Innovator"}&background=0A84FF&color=fff`;

  const menuGroups = [
    {
      label: 'Campus Hub',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore Hub', path: '/feed', icon: Rocket, badge: 'LIVE' },
        { name: 'Inbound', path: '/inbox', icon: MessageSquare, badge: 12 },
        { name: 'Status Center', path: '/alerts', icon: Bell },
      ]
    },
    {
      label: 'Workspace',
      items: [
        { name: 'Initiate', path: '/projects/new', icon: Plus },
        { name: 'Active Stack', path: '/workspace', icon: Layers },
        { name: 'Achievements', path: '/achievements', icon: Trophy },
      ]
    },
    {
      label: 'Security',
      items: [
        { name: 'Pilot Profile', path: '/profile', icon: User },
        { name: 'Terminal Matrix', path: '/settings', icon: Settings },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout transmission interrupt:", err);
    }
  };

  return (
    <aside className={cn(
      "h-full flex flex-col bg-projecxy-dark border-r border-projecxy-border transition-all duration-500 ease-in-out relative group/sidebar",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* 🚀 BRANDING */}
      <div className="p-6 mb-4 flex items-center gap-3">
         <div className="w-9 h-9 rounded-xl bg-projecxy-blue flex items-center justify-center shadow-lg shadow-projecxy-blue/20 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Rocket className="w-5 h-5 text-white fill-current" />
         </div>
         {!isCollapsed && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <h1 className="text-[18px] font-black tracking-tighter text-white">PROJECXY</h1>
              <p className="text-[9px] font-bold text-projecxy-blue tracking-[0.2em] -mt-1 uppercase">Central Hub</p>
           </motion.div>
         )}
      </div>

      {/* 🧭 NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide pb-20 pt-4">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
             {!isCollapsed && (
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary/30 pl-3">
                 {group.label}
               </p>
             )}
             {group.items.map((item) => (
               <SidebarItem 
                 key={item.name} 
                 item={item} 
                 isActive={location.pathname === item.path}
                 isCollapsed={isCollapsed}
               />
             ))}
          </div>
        ))}
      </div>

      {/* 👤 BOTTOM IDENTITY */}
      <div className="mt-auto p-4 border-t border-projecxy-border bg-white/[0.01]">
         {!isCollapsed ? (
           <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06] flex items-center gap-3">
              <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
                 <img 
                    src={avatar} 
                    className="w-10 h-10 rounded-xl border border-white/10 object-cover" 
                    alt="avatar" 
                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${profile?.full_name || "ID"}`}
                 />
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-projecxy-dark rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="text-[13px] font-black text-white truncate">{profile?.full_name || 'Innovator'}</h4>
                 <p className="text-[9px] text-projecxy-secondary font-bold tracking-widest uppercase truncate">{profile?.department || 'Guest'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-projecxy-secondary hover:text-red-400 transition-colors"
                title="Secure Logout"
              >
                 <LogOut className="w-4 h-4" />
              </button>
           </div>
         ) : (
           <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="relative"
            >
              <img src={avatar} className="w-10 h-10 rounded-xl border border-white/10" alt="avatar" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-projecxy-dark rounded-full" />
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex justify-center p-3 text-projecxy-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
            </button>
           </div>
         )}
      </div>
    </aside>
  );
};
