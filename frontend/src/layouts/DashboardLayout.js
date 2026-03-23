import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Rocket, LayoutDashboard, Briefcase, MessageSquare, Bell, User, LogOut, 
  Menu, X, Settings, ChevronRight, GraduationCap, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../components/ui';
import { BottomNav } from '../components/layout/BottomNav';

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [isMobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Campus Feed', path: '/feed', icon: Briefcase },
    { name: 'Inbox', path: '/inbox', icon: MessageSquare, badge: 3 },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  const NavItem = ({ item }) => (
    <NavLink 
      to={item.path}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group mb-1",
        isActive 
          ? "bg-blue-50 text-projecxy-blue shadow-soft" 
          : "text-gray-500 hover:bg-gray-50 hover:text-projecxy-text"
      )}
    >
      <div className="flex items-center gap-3.5">
         <item.icon className={cn(
            "w-5 h-5 transition-colors",
            location.pathname === item.path ? "text-projecxy-blue" : "text-gray-400 group-hover:text-projecxy-blue"
         )} />
         <span className={cn(
            "text-xs font-bold uppercase tracking-widest transition-colors",
            location.pathname === item.path ? "text-projecxy-blue" : "text-gray-500 group-hover:text-projecxy-text"
         )}>{item.name}</span>
      </div>
      {item.badge && (
         <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>
      )}
      {location.pathname === item.path && (
         <ChevronRight className="w-4 h-4 text-projecxy-blue/40" />
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-projecxy-bg flex flex-col lg:flex-row">
      
      {/* 📱 MOBILE OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] bg-projecxy-text/20 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* 🏙️ THE NAV-COMMAND CENTER (SIDEBAR) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[110] w-[280px] bg-white border-r border-gray-100 shadow-soft transition-transform duration-500 ease-out lg:translate-x-0 lg:static lg:block",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          
          <div className="flex items-center justify-between mb-10 pl-2">
             <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-projecxy-blue rounded-2xl flex items-center justify-center text-white shadow-soft">
                   <Rocket className="w-6 h-6 fill-white" />
                </div>
                <div>
                   <h1 className="text-xl font-black text-projecxy-text tracking-tighter leading-none">Projecxy</h1>
                   <p className="text-[9px] text-projecxy-blue font-black uppercase tracking-widest mt-1">Campus OS</p>
                </div>
             </div>
             <button className="lg:hidden p-2 text-gray-400 hover:text-black" onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
             </button>
          </div>

          <nav className="flex-1">
             <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-[0.25em] mb-4 pl-4">Platform</p>
             {navItems.map((item) => <NavItem key={item.name} item={item} />)}

             <div className="mt-8">
                <p className="text-[10px] text-projecxy-secondary font-bold uppercase tracking-[0.25em] mb-4 pl-4">Institutional Hub</p>
                <NavLink 
                  to="/achievements"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group mb-1",
                    isActive 
                      ? "bg-blue-50 text-projecxy-blue shadow-soft" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-projecxy-text"
                  )}
                >
                   <GraduationCap className={cn("w-5 h-5 transition-colors", location.pathname === '/achievements' ? "text-projecxy-blue" : "text-gray-400 group-hover:text-projecxy-blue")} />
                   <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", location.pathname === '/achievements' ? "text-projecxy-blue" : "text-gray-500 group-hover:text-projecxy-text")}>Achievements</span>
                </NavLink>
             </div>
          </nav>

          <div className="mt-auto">
             <div className="bg-gray-50/50 rounded-3xl p-4 border border-gray-100 mb-4 group hover:bg-white hover:shadow-soft transition-all cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="flex items-center gap-3 min-w-0">
                   <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                      className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex-shrink-0" 
                      alt="avatar"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}`}
                   />
                   <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-projecxy-text truncate capitalize">{profile?.full_name || 'Innovator'}</p>
                      <p className="text-[10px] text-projecxy-blue font-bold uppercase tracking-tighter truncate flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified Pilot</p>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); navigate('/settings'); }} className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                      <Settings className="w-4 h-4 text-gray-300 group-hover:text-projecxy-blue transition-colors" />
                   </button>
                </div>
             </div>

             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
             >
                <LogOut className="w-4 h-4" />
                Log out
             </button>
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN STAGE CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 transition-shadow">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-projecxy-blue rounded-xl flex items-center justify-center text-white shadow-soft"><Zap className="w-5 h-5 fill-white" /></div>
              <span className="font-bold text-projecxy-text uppercase tracking-tighter">Projecxy</span>
           </div>
           <button className="p-2 bg-gray-50 rounded-xl text-projecxy-blue" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6" />
           </button>
        </div>

        {/* COMPONENT STREAM */}
        <div className="flex-1 overflow-x-hidden p-6 md:p-8 lg:p-12 pb-24 lg:pb-12">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>

        {/* 📱 DYNAMIC MOBILE TOOLBAR */}
        <BottomNav />
      </main>
    </div>
  );
};
