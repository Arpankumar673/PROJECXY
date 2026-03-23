import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, 
  Clock, ArrowRight, TrendingUp,
  Mail, Settings, MoreVertical,
  Calendar, CheckCircle, Info, Rocket, 
  Trash2, Filter
} from 'lucide-react';
import { Button, Card, cn } from '../components/ui';

const NotificationCard = ({ notification, onRead }) => {
    const icons = {
        invite: <Rocket className="w-5 h-5 text-blue-500" />,
        deadline: <Clock className="w-5 h-5 text-amber-500" />,
        system: <Info className="w-5 h-5 text-indigo-500" />,
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        alert: <AlertCircle className="w-5 h-5 text-red-500" />
    };

    const colors = {
        invite: "bg-blue-50/50 border-blue-100",
        deadline: "bg-amber-50/50 border-amber-100",
        system: "bg-indigo-50/50 border-indigo-100",
        success: "bg-emerald-50/50 border-emerald-100",
        alert: "bg-red-50/50 border-red-100"
    };

    return (
        <Card className={cn(
            "p-6 md:p-8 flex items-start gap-6 group hover:translate-x-1 transition-all duration-300 border-none bg-white rounded-[32px] hover:shadow-xl",
            notification.unread && "shadow-soft border-l-[6px] border-l-projecxy-blue"
        )}>
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110",
                colors[notification.type] || colors.system
            )}>
                {icons[notification.type] || icons.system}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-black text-projecxy-text tracking-tighter uppercase leading-none mb-1.5">{notification.title}</h4>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap ml-4">{notification.time}</span>
                </div>
                <p className="text-sm md:text-base text-projecxy-secondary font-medium leading-relaxed mb-6">{notification.description}</p>
                <div className="flex items-center gap-4">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-projecxy-blue hover:opacity-70 transition-opacity flex items-center gap-2">
                        Execute Action <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {notification.unread && (
                        <button onClick={() => onRead(notification.id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-projecxy-text">
                           Dismiss Alert
                        </button>
                    )}
                </div>
            </div>
            <button className="p-2 text-gray-200 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-5 h-5" />
            </button>
        </Card>
    );
};

export const AlertsPage = () => {
    const [filter, setFilter] = useState('All');
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'invite', title: 'AgriBot Deployment', description: 'Arpan Kumar invited you to synchronize with the autonomous agricultural drone project.', time: '2 mins ago', unread: true },
        { id: 2, type: 'deadline', title: 'Milestone Warning', description: 'The "Neural Link API" final institutional presentation is scheduled for tomorrow at 2:00 PM.', time: '1 hour ago', unread: true },
        { id: 3, type: 'success', title: 'Repository Protected', description: 'Semantic AI engine confirmed your original logic in the "Institutional Data Mesh" documentation.', time: '3 hours ago', unread: false },
        { id: 4, type: 'system', title: 'Gateway Updated', description: 'Projecxy Core 2.0 deployment successful. New workspace modules are now live.', time: 'Yesterday', unread: false },
        { id: 5, type: 'alert', title: 'Security Protocol', description: 'An unauthorized login attempt was blocked from a new device in California, USA.', time: '2 days ago', unread: false },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Status Center</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary opacity-50 pl-1">Encryption Handshake Active</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-14 rounded-2xl px-6 border-gray-100 text-[10px] font-black uppercase tracking-[0.15em]">
                       Mark All Read
                    </Button>
                    <button className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-soft flex items-center justify-center text-projecxy-secondary hover:text-projecxy-blue transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {notifications.map(n => (
                    <NotificationCard key={n.id} notification={n} onRead={markAsRead} />
                ))}
            </div>

            <div className="text-center pt-10 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Hub Notifications Synchronized</p>
            </div>
        </div>
    );
};
