import React from 'react';
import { Search, Filter, Hash, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../ui';

export const FilterBar = ({ 
  search, 
  setSearch, 
  category, 
  setCategory, 
  status, 
  setStatus 
}) => {
  const departments = ['All Sectors', 'Computer Science', 'IT', 'Mechanical', 'Biotech', 'Electronics'];
  const statuses = ['All Status', 'Open', 'Ongoing', 'Completed'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      {/* 🔎 SEARCH MATRIX */}
      <div className="relative group flex-1 w-full">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-projecxy-blue transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search institutional hub (Innovation, Tech, Domain)..."
          className="w-full h-16 pl-16 pr-8 bg-white border border-gray-100 rounded-[28px] shadow-soft focus:ring-[6px] focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all placeholder:text-gray-300 text-sm font-semibold tracking-tight"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
           <Hash className="w-3.5 h-3.5 text-gray-300" />
           <span className="text-[10px] font-black uppercase text-gray-400">HUB-ID</span>
        </div>
      </div>

      {/* 🌪️ DYNAMIC FILTERS */}
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative group min-w-[180px]">
          <select 
            className="w-full h-16 pl-6 pr-12 bg-white border border-gray-100 rounded-[28px] shadow-soft focus:ring-[6px] focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none group-hover:text-projecxy-blue transition-colors" />
        </div>

        <div className="relative group min-w-[180px]">
          <select 
            className="w-full h-16 pl-6 pr-12 bg-white border border-gray-100 rounded-[28px] shadow-soft focus:ring-[6px] focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none group-hover:text-projecxy-blue transition-colors" />
        </div>
        
        <button className="w-16 h-16 bg-projecxy-blue text-white rounded-[28px] flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 transition-all">
           <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
