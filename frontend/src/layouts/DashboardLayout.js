import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Rocket, LayoutDashboard, Briefcase, MessageSquare, Bell, User, LogOut, 
  Menu, X, Settings, ChevronRight, GraduationCap, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../components/ui';

export const DashboardLayout = ({ children, role = 'student' }) => {
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
    { name: 'Projects', path: '/dashboard', icon: Briefcase },
    { name: 'Messaging', path: '/dashboard', icon: MessageSquare, badge: 3 },
    { name: 'Alerts', path: '/dashboard', icon: Bell },
  ];

  const NavItem = ({ item }) => (
    <NavLink 
      to={item.path}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group mb-1",
        isActive 
          ? "bg-blue-50 text-linkedin-blue shadow-sm border border-blue-100" 
          : "text-gray-500 hover:bg-gray-50 hover:text-linkedin-text"
      )}
    >
      <div className="flex items-center gap-3.5">
         <div className={cn(
            "p-2 rounded-xl transition-colors",
            location.pathname === item.path ? "bg-white text-linkedin-blue shadow-sm" : "bg-transparent group-hover:bg-white"
         )}>
            <item.icon className="w-5 h-5" />
         </div>
         <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
      </div>
      {item.badge && (
         <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>
      )}
      {location.pathname === item.path && (
         <ChevronRight className="w-4 h-4 text-linkedin-blue/40" />
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-[#F3F6F8] flex">
      
      {/* 📱 MOBILE OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] bg-linkedin-text/40 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* 🏢 THE SIDEBAR COMMAND CENTER */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[110] w-[280px] bg-white border-r border-gray-100 shadow-2xl transition-transform duration-500 ease-out lg:translate-x-0 lg:static lg:block",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          
          {/* BRANDING NODE */}
          <div className="flex items-center justify-between mb-12 pl-2">
             <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-linkedin-blue rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                   <Rocket className="w-6 h-6 fill-white" />
                </div>
                <div>
                   <h1 className="text-xl font-black text-linkedin-text tracking-tighter leading-none">Projecxy</h1>
                   <p className="text-[9px] text-linkedin-blue font-black uppercase tracking-widest mt-1 underline decoration-2 decoration-blue-100">Institutional OS</p>
                </div>
             </div>
             <button className="lg:hidden p-2 text-gray-400 hover:text-black" onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
             </button>
          </div>

          {/* ACADEMIC NAV-ENGINE */}
          <nav className="flex-1">
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mb-6 pl-4">Innovation Modules</p>
             {navItems.map((item) => <NavItem key={item.name} item={item} />)}

             <div className="mt-12">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mb-6 pl-4">Legacy Assets</p>
                <button className="w-full flex items-center gap-3.5 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-linkedin-text rounded-2xl transition-all group">
                   <div className="p-2 bg-transparent group-hover:bg-white rounded-xl transition-colors"><GraduationCap className="w-5 h-5" /></div>
                   <span className="text-sm font-black uppercase tracking-widest">Achievements</span>
                </button>
             </div>
          </nav>

          {/* IDENTITY NODE (PROFILE) */}
          <div className="mt-auto pt-8 border-t border-gray-100">
             <div className="bg-gray-50/50 rounded-[28px] p-4 border border-gray-100 mb-4 group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                   <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                      className="w-12 h-12 rounded-[20px] border-2 border-white shadow-md flex-shrink-0" 
                      alt="avatar"
                   />
                   <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-linkedin-text truncate capitalize">{profile?.full_name || 'Innovator'}</p>
                      <p className="text-[10px] text-linkedin-blue font-black uppercase tracking-tighter truncate flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-linkedin-blue" /> Verified Pilot</p>
                   </div>
                   <Settings className="w-4 h-4 text-gray-300 group-hover:text-linkedin-blue transition-colors" />
                </div>
             </div>

             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-red-400 font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-sm"
             >
                <LogOut className="w-4 h-4" />
                End Session
             </button>
          </div>
        </div>
      </aside>

      {/* 🚢 MAIN MARATHON CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* MOBILE TOP BAR (DRAWER TRIGGER) */}
        <div className="lg:hidden h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/80">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linkedin-blue rounded-lg flex items-center justify-center text-white"><Rocket className="w-5 h-5 fill-white" /></div>
              <span className="font-black text-linkedin-text uppercase tracking-tighter">Projecxy</span>
           </div>
           <button className="p-2.5 bg-gray-50 rounded-xl text-linkedin-blue shadow-sm" onClick={() => setMobileOpen(true)}>
              <Menu className="w-6 h-6" />
           </button>
        </div>

        {/* PAGE DUMP */}
        <div className="flex-1 overflow-x-hidden p-6 md:p-10 lg:p-14">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>

        {/* Institutional Footer */}
        <footer className="p-10 bg-white border-t border-gray-100 mt-20">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 opacity-30 grayscale cursor-pointer hover:grayscale-0 hover:opacity-100 transition-all">
                 <Rocket className="w-5 h-5 fill-linkedin-blue" />
                 <span className="font-black text-sm uppercase tracking-tighter">Projecxy</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2026 Academic Innovation Protocol. All assets verified.</p>
              <div className="flex gap-6">
                 {['Registry', 'Privacy', 'Support'].map(f => <span key={f} className="text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-linkedin-blue cursor-pointer">{f}</span>)}
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};
