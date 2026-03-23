import React from 'react';
import { 
  Bell, MessageSquare, Rocket, 
  UserPlus, Mail, ShieldAlert,
  Calendar, CheckCircle2, Info,
  ExternalLink, Trash2, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, cn } from '../ui';

const AlertTypeConfig = {
    project_join: {
        icon: UserPlus,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    message: {
        icon: MessageSquare,
        color: "text-projecxy-blue",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    system: {
        icon: ShieldAlert,
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-100"
    },
    recommendation: {
        icon: Rocket,
        color: "text-purple-500",
        bg: "bg-purple-50",
        border: "border-purple-100"
    },
    default: {
        icon: Bell,
        color: "text-gray-400",
        bg: "bg-gray-50",
        border: "border-gray-100"
    }
};

export const AlertItem = ({ alert, onRead, onDelete }) => {
  const config = AlertTypeConfig[alert.type] || AlertTypeConfig.default;
  const time = new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group"
    >
      <Card 
        onClick={() => !alert.is_read && onRead(alert.id)}
        className={cn(
          "p-6 md:p-8 border-none shadow-soft transition-all duration-300 cursor-pointer rounded-[32px] flex items-start gap-6 relative group",
          alert.is_read ? "bg-white opacity-60" : "bg-white scale-[1.01] shadow-xl"
        )}
      >
        {!alert.is_read && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-projecxy-blue rounded-full shadow-glow shadow-blue-500/50" />
        )}

        <div className={cn(
            "w-12 h-12 md:w-16 md:h-16 rounded-[22px] md:rounded-[28px] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
            config.bg, config.color
        )}>
           <config.icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
           <div className="flex items-start justify-between">
              <div className="space-y-1">
                 <h4 className={cn("text-base md:text-lg font-black tracking-tighter uppercase leading-none", alert.is_read ? "text-projecxy-text/60" : "text-projecxy-text")}>
                    {alert.title}
                 </h4>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-projecxy-blue opacity-50">{alert.type?.replace('_', ' ')}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                       <Clock className="w-3 h-3" /> {time}
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(alert.id); }}
                  className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                >
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>
           </div>
           
           <p className="text-projecxy-secondary text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
              {alert.message}
           </p>

           {alert.link && (
             <a 
               href={alert.link} 
               className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-projecxy-blue mt-4 hover:gap-3 transition-all"
             >
                Resolve Transmission <ExternalLink className="w-3.5 h-3.5" />
             </a>
           )}
        </div>
      </Card>
    </motion.div>
  );
};
