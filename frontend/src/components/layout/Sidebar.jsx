import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Rocket, Plus, Briefcase, 
  Layers, BarChart3, Trophy, User, Settings, 
  ChevronDown, Bell, LogOut, Search, Activity,
  MessageSquare, Globe, Lock
} from 'lucide-react';
import { cn } from '../ui';

const SidebarItem = ({ item, isActive, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="mb-1">
      <NavLink
        to={item.path}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group relative",
          isActive 
            ? "bg-white/[0.08] text-projecxy-blue shadow-linear" 
            : "text-projecxy-secondary hover:bg-white/[0.04] hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-md transition-colors",
            isActive ? "bg-projecxy-blue/10 text-projecxy-blue" : "group-hover:text-projecxy-blue"
          )}>
            <item.icon className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">{item.name}</span>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="bg-projecxy-blue text-[10px] font-black px-1.5 py-0.5 rounded-full text-white">
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

        {/* Desktop Tooltip */}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-black border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
             {item.name}
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
                  "block py-1.5 text-[12px] font-medium transition-colors",
                  isActive ? "text-projecxy-blue font-bold" : "text-projecxy-secondary hover:text-white"
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

  const menuGroups = [
    {
      label: 'Core',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, subItems: [
          { name: 'Overview', path: '/dashboard' },
          { name: 'Statistics', path: '/dashboard' }
        ]},
        { name: 'Explore Hub', path: '/dashboard', icon: Rocket, badge: 12 },
        { name: 'Create Initiative', path: '/projects/new', icon: Plus },
      ]
    },
    {
      label: 'Workspace',
      items: [
        { name: 'My Projects', path: '/dashboard', icon: Briefcase, subItems: [
          { name: 'Active', path: '/dashboard' },
          { name: 'Completed', path: '/dashboard' },
          { name: 'Drafts', path: '/dashboard' }
        ]},
        { name: 'Workstation', path: '/projects/workspace', icon: Layers },
        { name: 'Analytics', path: '/dashboard', icon: BarChart3 },
      ]
    },
    {
      label: 'Social',
      items: [
        { name: 'Reputation', path: '/dashboard', icon: Trophy },
        { name: 'Pilot Profile', path: '/onboarding', icon: User },
      ]
    }
  ];

  return (
    <aside className={cn(
      "h-full flex flex-col bg-projecxy-dark border-r border-projecxy-border transition-all duration-500 ease-in-out relative group/sidebar",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* 🚀 LOGO SECTION */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-projecxy-blue flex items-center justify-center shadow-lg shadow-projecxy-blue/20">
              <Rocket className="w-5 h-5 text-white fill-current" />
           </div>
           {!isCollapsed && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-[17px] font-black tracking-tighter text-white">PROJECXY</h1>
                <p className="text-[9px] font-bold text-projecxy-blue tracking-[0.2em] -mt-1 uppercase">Campus OS</p>
             </motion.div>
           )}
        </div>
      </div>

      {/* 🔎 SEARCH PLACEHOLDER */}
      {!isCollapsed && (
        <div className="px-6 mb-8">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06] text-projecxy-secondary hover:border-projecxy-blue/30 transition-all cursor-pointer">
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium tracking-tight">Quick Search...</span>
              <kbd className="ml-auto text-[10px] opacity-20 border border-white/20 px-1 rounded">⌘K</kbd>
           </div>
        </div>
      )}

      {/* 🧭 NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide pb-20">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
             {!isCollapsed && (
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-projecxy-secondary/40 pl-2">
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

      {/* 👤 COLLAPSED LOGOUT */}
      <div className="mt-auto p-4 border-t border-projecxy-border">
         {!isCollapsed ? (
           <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] group/user hover:border-projecxy-blue/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=pilot" className="w-10 h-10 rounded-lg border border-white/10" alt="avatar" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-projecxy-dark rounded-full" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-white truncate">Pilot Admin</h4>
                    <p className="text-[10px] text-projecxy-secondary font-medium tracking-tight truncate">PRO Member</p>
                 </div>
                 <Settings className="w-4 h-4 text-projecxy-secondary group-hover/user:text-projecxy-blue transition-colors" />
              </div>
           </div>
         ) : (
           <button className="w-full flex justify-center p-3 text-projecxy-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
              <LogOut className="w-5 h-5" />
           </button>
         )}
      </div>
    </aside>
  );
};
