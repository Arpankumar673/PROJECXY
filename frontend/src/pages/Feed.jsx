import React, { useState } from 'react';
import { 
  Search, Filter, Heart, MessageSquare, 
  Share2, Bookmark, Plus, Rocket, 
  MapPin, Users, Loader2 
} from 'lucide-react';
import { Button, Card, cn } from '../components/ui';
import { useProjects } from '../hooks/useProjects';

const FeedCard = ({ project }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-500 border-none bg-white rounded-[32px] group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-projecxy-blue border border-blue-100 group-hover:scale-110 transition-transform">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-projecxy-text tracking-tighter leading-none mb-1.5">{project.title}</h3>
            <div className="flex items-center gap-2 text-projecxy-secondary text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.department || 'General'}</span>
              <span className="opacity-20">•</span>
              <span className="flex items-center gap-1 font-black text-projecxy-blue">2 Slots Open</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSaved(!saved)}
          className={cn("p-2 rounded-xl transition-all", saved ? "bg-amber-50 text-amber-500" : "text-gray-300 hover:text-amber-500")}
        >
          <Bookmark className={cn("w-5 h-5", saved && "fill-current")} />
        </button>
      </div>

      <p className="text-projecxy-secondary text-sm md:text-base leading-relaxed mb-6 font-medium">
        {project.description || "The central hub for academic product development. Recruit teammates, protect your originality, and showcase your professional legacy."}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {['React', 'Supabase', 'Framer', 'AI'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-projecxy-secondary rounded-lg border border-gray-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLiked(!liked)}
            className={cn("flex items-center gap-2 text-xs font-bold transition-all", liked ? "text-red-500" : "text-gray-400 hover:text-red-500")}
          >
            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
            <span>{liked ? 25 : 24}</span>
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-projecxy-blue transition-all">
            <MessageSquare className="w-5 h-5" />
            <span>12</span>
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-projecxy-blue transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <Button className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
           Apply to Join
        </Button>
      </div>
    </Card>
  );
};

export const FeedPage = () => {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Computer Science', 'IT', 'Mechanical', 'Biotech'];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 🧭 NAVIGATION & SEARCH */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <div className="relative flex-1 group">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-projecxy-blue transition-colors" />
           <input 
              className="w-full h-16 bg-white border border-gray-100 rounded-[24px] pl-14 pr-6 text-sm font-bold shadow-soft outline-none focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue transition-all"
              placeholder="Search innovation hub..."
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === cat 
                  ? "bg-projecxy-blue text-white shadow-lg shadow-blue-100" 
                  : "bg-white border border-gray-100 text-projecxy-secondary hover:border-projecxy-blue hover:text-projecxy-blue"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-projecxy-secondary opacity-50">
           <Loader2 className="w-10 h-10 animate-spin text-projecxy-blue" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Feed...</p>
        </div>
      ) : (
        <div className="space-y-8 pb-32">
          {projects.map(p => (
            <FeedCard key={p.id} project={p} />
          ))}
          
          <div className="text-center pt-10 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Innovation Stream Concluded</p>
          </div>
        </div>
      )}
    </div>
  );
};
