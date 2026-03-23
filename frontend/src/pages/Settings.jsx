import React, { useState } from 'react';
import { 
  User, Mail, Shield, Bell, 
  Globe, Moon, Sun, Monitor, 
  LogOut, Trash2, Key, ChevronRight,
  Database, Zap, CreditCard, HelpCircle,
  Eye, EyeOff, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button, Card, Input, cn } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const SettingItem = ({ icon: Icon, title, desc, action, danger }) => (
    <div className="flex items-center justify-between p-8 hover:bg-gray-50/50 transition-all rounded-[32px] group relative overflow-hidden border border-transparent hover:border-gray-50 border-b-gray-50 last:border-b-transparent">
        <div className="flex items-center gap-6">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110",
                danger ? "bg-red-50 border-red-100 text-red-500" : "bg-blue-50 border-blue-100 text-projecxy-blue"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <h4 className="text-lg font-black text-projecxy-text tracking-tighter uppercase leading-none">{title}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60 leading-tight">{desc}</p>
            </div>
        </div>
        {action ? action : <button className="p-3 text-gray-200 group-hover:text-projecxy-blue transition-colors group-hover:translate-x-1 duration-300"><ChevronRight className="w-6 h-6" /></button>}
    </div>
);

export const SettingsPage = () => {
    const { user, profile, logout } = useAuth();
    const [theme, setTheme] = useState('System');
    const [notifications, setNotifications] = useState(true);

    const sections = [
        {
            title: 'Authorization Hub',
            desc: 'Secure your institutional gateway',
            items: [
                { icon: User, title: 'Identity Matrix', desc: 'Sync your professional campus profile' },
                { icon: Key, title: 'Authentication Key', desc: 'Adjust protocol security layers' },
                { icon: Shield, title: 'Originality Guard', desc: 'Configure semantic AI protection' }
            ]
        },
        {
            title: 'Transmission Protocol',
            desc: 'Configure alert and sync settings',
            items: [
                { 
                    icon: Bell, 
                    title: 'Alert Stream', 
                    desc: 'Manage incoming data transmissions',
                    action: (
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={cn(
                                "w-14 h-8 rounded-full transition-all flex items-center p-1 px-1.5",
                                notifications ? "bg-projecxy-blue" : "bg-gray-200"
                            )}
                        >
                            <div className={cn("w-5 h-5 bg-white rounded-full transition-all", notifications ? "ml-auto" : "ml-0 shadow-soft")} />
                        </button>
                    )
                },
                { icon: Database, title: 'Institutional Sync', desc: 'Configure university DB handshake' }
            ]
        },
        {
            title: 'Visual Engine',
            desc: 'Personalize your innovation terminal',
            items: [
                { 
                    icon: Monitor, 
                    title: 'Rendering Core', 
                    desc: 'Adjust platform theme and contrast',
                    action: (
                        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 border border-gray-200">
                            {['Light', 'Dark', 'System'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-none",
                                        theme === t ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-400 hover:text-projecxy-text"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )
                }
            ]
        },
        {
            title: 'Critical Protocol',
            desc: 'Emergency shutdown and reset actions',
            items: [
                { 
                    icon: LogOut, 
                    title: 'Abandon Session', 
                    desc: 'Safe logout from the innovation hub',
                    danger: true,
                    action: (
                        <button 
                            onClick={() => logout()}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-soft"
                        >
                            Execute Logout
                        </button>
                    )
                },
                { icon: Trash2, title: 'Purge Identity', desc: 'Permanent deletion of professional matrix', danger: true }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
            
            <div className="space-y-1">
                <h2 className="text-4xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Terminal Matrix</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-projecxy-secondary opacity-50 pl-1">Configuration Protocol Ready</p>
            </div>

            <div className="space-y-12 pb-32">
                {sections.map((section, idx) => (
                    <section key={idx} className="space-y-6">
                        <div className="px-6 space-y-1">
                            <h3 className="text-lg font-black text-projecxy-text tracking-tight uppercase leading-none">{section.title}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60 px-1 leading-tight">{section.desc}</p>
                        </div>
                        <Card className="rounded-[48px] divide-y divide-gray-50 border border-gray-100 shadow-soft overflow-hidden">
                            {section.items.map((item, i) => (
                                <SettingItem key={i} {...item} />
                            ))}
                        </Card>
                    </section>
                ))}
            </div>

            <div className="text-center pt-10 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Settings Protocol Synchronized &copy; 2026</p>
            </div>
        </div>
    );
};
