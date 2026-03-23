import React, { useState } from 'react';
import { 
  Users, Rocket, ArrowRight, 
  CheckCircle2, Loader2, AlertCircle,
  Hash, Shield, Calendar, User,
  Heart, Bookmark, Share2
} from 'lucide-react';
import { Card, Button, cn } from '../ui';
import { supabase } from '../../services/supabase';

export const ProjectCard = ({ project, userId, onAction }) => {
  const [loading, setLoading] = useState(false);
  const isMember = project.members?.some(m => m.user_id === userId);
  const isOwner = project.created_by === userId;
  const memberCount = project.members?.length || 0;
  const isFull = memberCount >= (project.max_members || 5);

  const handleJoin = async (e) => {
    e.stopPropagation();
    if (isMember || isOwner || isFull) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_members')
        .insert([{ project_id: project.id, user_id: userId }]);

      if (error) throw error;
      onAction?.();
    } catch (err) {
      console.error("Transmission Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    open: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ongoing: "bg-amber-50 text-amber-500 border-amber-100",
    completed: "bg-blue-50 text-projecxy-blue border-blue-100"
  };

  const statusIcons = {
    open: <CheckCircle2 className="w-3 h-3" />,
    ongoing: <Loader2 className="w-3 h-3 animate-spin" />,
    completed: <Shield className="w-3 h-3" />
  };

  return (
    <Card 
      className="p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border-none bg-white rounded-[32px] group relative overflow-hidden flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        {/* 🎫 HEADER & STATUS */}
        <div className="flex items-start justify-between">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm",
            statusColors[project.status] || statusColors.open
          )}>
            {statusIcons[project.status] || statusIcons.open}
            {project.status || 'Open'}
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-300 hover:text-red-400 transition-colors"><Heart className="w-4 h-4" /></button>
            <button className="p-2 text-gray-300 hover:text-amber-400 transition-colors"><Bookmark className="w-4 h-4" /></button>
          </div>
        </div>

        {/* 📚 CONTENT */}
        <div className="space-y-3">
          <h3 className="text-xl font-black text-projecxy-text tracking-tighter leading-tight group-hover:text-projecxy-blue transition-colors">
            {project.title}
          </h3>
          <p className="text-projecxy-secondary text-sm leading-relaxed line-clamp-2 font-medium">
            {project.description || "The central hub for academic product development. Recruit teammates and protect your professional legacy."}
          </p>
        </div>

        {/* 🛠️ TECH STACK */}
        <div className="flex flex-wrap gap-2">
          {(project.tech_stack || ['React', 'Supabase']).slice(0, 3).map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-projecxy-secondary">
              {tag}
            </span>
          ))}
          {(project.tech_stack?.length > 3) && (
            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>

        {/* 👥 TEAM & OWNER */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-3">
             <div className="relative">
                <img 
                  src={project.owner?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.full_name || 'Owner'}`} 
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-soft" 
                  alt="Owner" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
             </div>
             <div>
                <p className="text-[10px] font-black text-projecxy-text uppercase leading-none">{project.owner?.full_name || 'Innovator'}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{project.department || 'Computer Science'}</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-[14px] font-black text-projecxy-text leading-none">{memberCount}<span className="text-gray-300 mx-0.5">/</span>{project.max_members || 5}</div>
             <p className="text-[9px] font-bold text-projecxy-blue uppercase tracking-widest mt-1">Personnel</p>
          </div>
        </div>
      </div>

      {/* 🌪️ ACTIONS */}
      <div className="pt-8 flex gap-3">
        {isOwner ? (
            <Button variant="outline" className="flex-1 h-12 rounded-2xl text-[10px] uppercase tracking-widest font-black border-projecxy-blue text-projecxy-blue">
                Manage Hub
            </Button>
        ) : (
            <Button 
                disabled={isMember || isFull || loading}
                onClick={handleJoin}
                className={cn(
                    "flex-1 h-12 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all",
                    isMember ? "bg-emerald-50 text-emerald-500 border-none shadow-none" : "shadow-lg shadow-blue-100"
                )}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 
                 isMember ? "Enrolled Access" : 
                 isFull ? "Full Protocol" : "Join Initiation"}
            </Button>
        )}
        <Button variant="ghost" className="w-12 h-12 rounded-2xl p-0 hover:bg-gray-50 transition-all">
           <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-projecxy-blue rotate-[-45deg] group-hover:rotate-0 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};
