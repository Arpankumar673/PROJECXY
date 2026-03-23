import React from 'react';
import { 
  Search, SlidersHorizontal, Activity, 
  Building2, Zap, Rocket, Globe,
  ShieldCheck, Loader2
} from 'lucide-react';
import { Card, Input, cn } from '../ui';

export const StudentSearch = ({ onSearch, onFilter, filters, loading }) => {
  return (
    <Card className="p-8 md:p-12 mb-10 rounded-[48px] border-none shadow-soft transition-all bg-white relative overflow-hidden group">
      {/* Dynamic Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-transparent -z-10 group-hover:scale-110 transition-transform duration-1000" />
      
      <div className="space-y-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-4">
            <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-projecxy-text tracking-tighter uppercase leading-none">Identity Discovery</h2>
                <div className="flex items-center gap-3">
                   <div className="h-1.5 w-12 bg-projecxy-blue rounded-full group-hover:w-24 transition-all duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-projecxy-blue/50 pl-px leading-none">Universal Student Indexing</p>
                </div>
            </div>
            
            <div className="flex bg-gray-50 p-2 rounded-[32px] border border-gray-100 gap-2 shadow-inner overflow-x-auto no-scrollbar">
                {['All Pilot Units', 'Research Hub', 'Innovation Core'].map(t => (
                    <button 
                        key={t}
                        className={cn(
                            "px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap",
                            t === 'All Pilot Units' ? "bg-white text-projecxy-blue shadow-soft" : "text-gray-400 hover:text-projecxy-text"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2 relative group/search">
                <Input 
                    placeholder="Search Innovators (Name, Skills, ID)..."
                    className="h-18 px-14 rounded-3xl text-sm font-bold uppercase tracking-widest placeholder:text-gray-300 shadow-soft focus:shadow-xl focus:-translate-y-1 transition-all border-transparent"
                    onChange={(e) => onSearch(e.target.value)}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-projecxy-blue transition-colors">
                    <Search className="w-5 h-5" />
                </div>
                {loading && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-projecxy-blue" />
                    </div>
                )}
            </div>

            <div className="relative group/filter">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within/filter:text-projecxy-blue transition-colors pointer-events-none z-10" />
                <select 
                    className="w-full h-18 bg-gray-50 border border-transparent rounded-[24px] pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.2em] text-projecxy-text focus:bg-white focus:border-projecxy-blue focus:ring-4 focus:ring-blue-50 outline-none shadow-soft transition-all appearance-none cursor-pointer"
                    onChange={(e) => onFilter('department', e.target.value)}
                    value={filters.department}
                >
                    <option value="">Sector Hub (All)</option>
                    {['Computer Science', 'IT', 'Mechanical', 'Civil', 'Biotech', 'Agriculture'].map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            <div className="relative group/skill">
                <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within/skill:text-projecxy-blue transition-colors pointer-events-none z-10" />
                <select 
                    className="w-full h-18 bg-gray-50 border border-transparent rounded-[24px] pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.2em] text-projecxy-text focus:bg-white focus:border-projecxy-blue focus:ring-4 focus:ring-blue-50 outline-none shadow-soft transition-all appearance-none cursor-pointer"
                    onChange={(e) => onFilter('skill', e.target.value)}
                    value={filters.skill}
                >
                    <option value="">Legacy Skills (All)</option>
                    {['React', 'Python', 'AI', 'ML', 'Blockchain', 'Cloud', 'Cybersecurity'].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 px-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-projecxy-blue opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hub Discovery Latency: <span className="text-projecxy-blue">Verified 12ms</span></p>
            </div>
            <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4 text-emerald-500 opacity-40 ml-4 border-l border-gray-100 pl-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Innovation Partners Indexed: <span className="text-emerald-500">1,248</span></p>
            </div>
        </div>
      </div>
    </Card>
  );
};
