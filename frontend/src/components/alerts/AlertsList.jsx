import React from 'react';
import { 
  Bell, CheckCircle2, Trash2, 
  AlertCircle, LayoutGrid, List,
  Loader2, Rocket, Search, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, cn } from '../ui';
import { AlertItem } from './AlertItem';

export const AlertsList = ({ alerts = [], onRead, onDelete, onMarkAllRead, loading = false }) => {
  const unreadCount = alerts.filter(a => !a.is_read).length;

  if (loading && alerts.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 md:h-48 bg-gray-100 rounded-[32px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="py-24 md:py-40 text-center space-y-10 group overflow-hidden">
        <div className="relative isolate inline-block">
          <div className="absolute inset-0 bg-projecxy-blue blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity" />
          <div className="w-24 h-24 md:w-32 md:h-32 bg-projecxy-blue text-white rounded-[40px] md:rounded-[56px] flex items-center justify-center shadow-lg shadow-blue-100 relative z-10 animate-bounce">
            <Bell className="w-10 h-10 md:w-16 md:h-16 fill-current" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Status Nominal</h2>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-projecxy-blue opacity-50 flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" /> Alert Buffer Empty
          </p>
        </div>
        <p className="text-xs md:text-sm text-projecxy-secondary font-bold uppercase tracking-widest opacity-60 max-w-[300px] leading-relaxed mx-auto">Zero inbound institutional alerts detected on your current sector.</p>
        <button className="px-10 py-4 bg-projecxy-blue text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">Synchronize Hub</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 🌪️ HEADER ACTIONS */}
      {unreadCount > 0 && (
         <div className="flex items-center justify-between px-6 py-4 bg-blue-50/50 rounded-[28px] border border-blue-100/50">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-projecxy-blue text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-300">
                  {unreadCount}
               </div>
               <p className="text-[11px] font-black uppercase tracking-widest text-projecxy-blue">Pending Inbound Pulse Transmission</p>
            </div>
            <button 
              onClick={onMarkAllRead}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-projecxy-blue hover:text-projecxy-text transition-all bg-white px-6 py-2 rounded-full border border-blue-100 shadow-soft"
            >
               Synchronize All Hubs
            </button>
         </div>
      )}

      {/* 🔔 ALERTS GRID */}
      <div className="flex flex-col gap-6 md:gap-8 min-h-[60vh] pb-32">
        <AnimatePresence mode='popLayout'>
          {alerts.map(alert => (
            <AlertItem 
              key={alert.id}
              alert={alert}
              onRead={onRead}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center pt-20 pb-32 opacity-20 group-hover:opacity-40 transition-opacity">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Ledger Verified @ 2026</p>
      </div>
    </div>
  );
};
