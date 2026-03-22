import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Rocket, Plus, Briefcase, 
  User, Menu, X, Bell, Zap, Trophy, BarChart3, Settings
} from 'lucide-react';
import { cn } from '../ui';

export const MobileBottomNav = ({ onMenuClick, isMenuOpen }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Feed', path: '/dashboard', icon: Rocket },
        { name: 'Create', path: '/projects/new', icon: Zap, special: true },
        { name: 'Reputation', path: '/dashboard', icon: Trophy },
        { name: 'Menu', path: '#', icon: isMenuOpen ? X : Menu, onClick: onMenuClick },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#050505]/80 backdrop-blur-2xl border-t border-white/[0.06] px-6 py-4 flex items-center justify-between z-[200] lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
            <AnimatePresence>
                {navItems.map((item, idx) => (
                    <div key={idx} className="relative flex flex-col items-center justify-center">
                        <NavLink
                            to={item.path}
                            onClick={item.onClick}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group",
                                item.special 
                                    ? "bg-projecxy-blue text-white shadow-lg shadow-projecxy-blue/30 -mt-12 scale-110 h-14 w-14 rounded-2xl border-4 border-[#050505] relative z-20" 
                                    : (isActive && item.path !== '#') ? "text-projecxy-blue" : "text-projecxy-secondary hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", item.special && "w-6 h-6 animate-pulse")} />
                            {item.special && (
                                <motion.div 
                                    className="absolute -inset-1 rounded-2xl bg-projecxy-blue/20 blur-xl -z-10"
                                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </NavLink>
                        
                        {!item.special && location.pathname === item.path && item.path !== '#' && (
                            <motion.div 
                                layoutId="mobile-nav-pill"
                                className="absolute -bottom-4 w-1 h-1 rounded-full bg-projecxy-blue shadow-[0_0_8px_rgba(10,132,255,0.8)]"
                            />
                        )}
                        
                        {(item.name === 'Feed' || item.name === 'Menu') && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-projecxy-blue rounded-full ring-2 ring-[#050505] shadow-[0_0_4px_rgba(10,132,255,0.8)]" />
                        )}
                    </div>
                ))}
            </AnimatePresence>
        </nav>
    );
};
