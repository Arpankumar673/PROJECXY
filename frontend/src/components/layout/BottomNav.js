import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Plus, Bell, User } from 'lucide-react';
import { cn } from '../ui';

export const BottomNav = () => {
    const navItems = [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Feed', path: '/dashboard', icon: Briefcase },
        { name: 'Plus', path: '/projects/new', icon: Plus, special: true },
        { name: 'Alerts', path: '/dashboard', icon: Bell },
        { name: 'Me', path: '/dashboard', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between z-50 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            {navItems.map((item, idx) => (
                <NavLink
                    key={idx}
                    to={item.path}
                    className={({ isActive }) => cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                        item.special 
                            ? "bg-projecxy-blue text-white shadow-soft -mt-8 h-14 w-14 rounded-2xl border-4 border-white" 
                            : isActive ? "text-projecxy-blue" : "text-gray-400"
                    )}
                >
                    <item.icon className={cn("w-6 h-6", item.special && "w-7 h-7")} />
                    {!item.special && <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.name}</span>}
                </NavLink>
            ))}
        </nav>
    );
};
