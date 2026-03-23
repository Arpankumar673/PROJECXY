import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Briefcase, 
  ChevronRight, MessageSquare, Star, 
  ShieldCheck, Activity, Rocket
} from 'lucide-react';
import { Card, Button, cn } from '../ui';

export const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  const avatar = student?.avatar_url 
    ? student.avatar_url 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.full_name || "Innovator"}&background=0A84FF&color=fff`;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      layout
    >
      <Card className="p-8 md:p-10 text-center flex flex-col items-center gap-6 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 rounded-[48px] border-none bg-white relative overflow-hidden h-full">
        {/* Decorative Gradient Background */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 group-hover:from-blue-100/50 transition-colors" />

        {/* 👤 AVATAR IDENTITY */}
        <div className="relative group/avatar">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover/avatar:opacity-20 transition-opacity duration-1000 rounded-full" />
            <img 
                src={avatar} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[44px] border-4 border-white shadow-soft relative z-10 hover:scale-105 transition-transform duration-500 object-cover bg-white" 
                alt={student.full_name}
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${student.full_name}`}
            />
            {student.onboarding_completed && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20">
                    <ShieldCheck className="w-4 h-4" />
                </div>
            )}
        </div>

        {/* 📄 IDENTITY SYNC */}
        <div className="space-y-2 flex-1 flex flex-col justify-center">
            <h4 className="text-xl md:text-2xl font-black text-projecxy-text tracking-tighter uppercase leading-none group-hover:text-projecxy-blue transition-colors">{student.full_name}</h4>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-projecxy-secondary opacity-60 leading-tight">
                    {student.department || 'Main Hub Sector'}
                </p>
                {student.branch && (
                    <p className="text-[9px] font-bold uppercase tracking-widest text-projecxy-blue opacity-40">
                        {student.branch} Core
                    </p>
                )}
            </div>
            
            {/* 🛠️ TECHNICAL MATRIX (SKILLS) */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
               {(student.skills || []).slice(0, 3).map(skill => (
                   <span key={skill} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-white group-hover:border-blue-100 group-hover:text-projecxy-blue transition-all">
                       {skill}
                   </span>
               ))}
               {(student.skills?.length || 0) > 3 && (
                   <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-gray-300">
                       +{(student.skills?.length || 0) - 3}
                   </span>
               )}
            </div>
        </div>

        {/* 🎯 CALL TO ACTION */}
        <div className="w-full pt-4 flex gap-3">
            <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-soft hover:bg-gray-50 group/msg"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/${student.id}?action=message`);
                }}
            >
                <MessageSquare className="w-4 h-4 transition-transform group-hover/msg:-rotate-12" />
            </Button>
            <Button 
                className="flex-[2] h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-1 transition-all"
                onClick={() => navigate(`/student/${student.id}`)}
            >
                Synchronize Hub
            </Button>
        </div>
      </Card>
    </motion.div>
  );
};
