import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, Trash2, 
  AlertCircle, LayoutGrid, List,
  Loader2, Rocket, Search, Activity,
  Filter, Hash, SlidersHorizontal, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { AlertsList } from '../components/alerts/AlertsList';

export const AlertsPage = () => {
    const { user } = useAuth();
    const { 
        notifications, 
        unreadCount, 
        loading, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification,
        refetch
    } = useNotifications(user?.id);

    const [filter, setFilter] = useState('all'); // all, unread, project, message

    const filteredAlerts = (notifications || []).filter(alert => {
        if (filter === 'unread') return !alert.is_read;
        if (filter === 'project') return alert.type === 'project_join';
        if (filter === 'message') return alert.type === 'message';
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* 🎯 HUB HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[48px] border border-gray-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-projecxy-blue/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
                <div className="space-y-3 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Status Center</h1>
                    <p className="text-sm md:text-lg text-projecxy-secondary font-bold uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-projecxy-blue" /> Alert Ledger Synchronized
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <Button 
                      variant="outline" 
                      onClick={() => { refetch(); Notification.requestPermission(); }}
                      className="h-16 px-8 rounded-[28px] uppercase tracking-[0.3em] text-[10px] font-black border-gray-100 bg-white shadow-soft transition-all hover:shadow-xl"
                    >
                        <SlidersHorizontal className="w-5 h-5 mr-3" /> Hardware Protocol
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => markAllAsRead()}
                      disabled={unreadCount === 0}
                      className="h-16 px-10 rounded-[28px] uppercase tracking-[0.3em] text-[10px] font-black group shadow-lg shadow-blue-100 disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                    >
                        <CheckCircle2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Clear All Pulses
                    </Button>
                </div>
            </header>

            {/* 🧬 DISCOVERY FILTERS */}
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-50 pb-px">
                {[
                    { id: 'all', label: 'All Inbound Alerts', icon: LayoutGrid },
                    { id: 'unread', label: 'Unprocessed Inbound', icon: Bell, count: unreadCount },
                    { id: 'project', label: 'Institutional Joins', icon: UserPlus },
                    { id: 'message', label: 'Digital Pulses', icon: MessageSquare }
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={cn(
                            "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative px-2 flex items-center gap-2",
                            filter === item.id ? "text-projecxy-blue" : "text-gray-400 hover:text-projecxy-text"
                        )}
                    >
                        {item.label}
                        {item.count > 0 && (
                            <span className="w-5 h-5 bg-projecxy-blue text-white rounded-lg flex items-center justify-center text-[9px] font-black shadow-lg shadow-blue-100">{item.count}</span>
                        )}
                        {filter === item.id && <motion.span layoutId="activeAlertTab" className="absolute bottom-0 left-0 right-0 h-1 bg-projecxy-blue rounded-full" />}
                    </button>
                ))}
            </div>

            {/* 🛰️ HUB REPOSITORY */}
            <AlertsList 
              alerts={filteredAlerts}
              onRead={markAsRead}
              onDelete={deleteNotification}
              onMarkAllRead={markAllAsRead}
              loading={loading}
            />

        </div>
    );
};

// Helper for dynamic imports
const UserPlus = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);
const MessageSquare = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);
