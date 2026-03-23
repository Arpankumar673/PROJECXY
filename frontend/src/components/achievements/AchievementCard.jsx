import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Star, Target,
  Zap, Award, Users, Rocket,
  ShieldCheck, Lock, CheckCircle2
} from 'lucide-react';
import { Card, cn } from '../ui';

const IconMap = {
  rocket: Rocket,
  users: Users,
  shield: ShieldCheck,
  medal: Medal,
  trophy: Trophy,
  award: Award,
  zap: Zap,
  star: Star,
  target: Target
};

export const AchievementCard = ({ achievement, unlocked = false, earnedAt }) => {
  const Icon = IconMap[achievement.icon] || Award;
  const levelColors = {
    bronze: "from-amber-700 to-amber-500",
    silver: "from-slate-400 to-slate-300",
    gold: "from-yellow-500 to-yellow-300"
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group h-full"
    >
      <Card className={cn(
        "p-8 md:p-10 text-center flex flex-col items-center gap-8 h-full rounded-[48px] border-none transition-all duration-700 overflow-hidden relative isolate",
        unlocked ? "bg-white shadow-xl shadow-blue-500/5" : "bg-gray-50/50 grayscale opacity-40 shadow-none border border-gray-100"
      )}>
        {/* Glow Effects */}
        {unlocked && (
            <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br blur-[60px] opacity-20 -z-10",
                levelColors[achievement.level] || levelColors.bronze
            )} />
        )}

        <div className="relative isolate">
          <div className={cn(
             "w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[44px] flex items-center justify-center relative z-10 transition-transform duration-700 group-hover:scale-110 shadow-soft",
             unlocked ? `bg-gradient-to-br ${levelColors[achievement.level]} text-white border-none shadow-lg` : "bg-white border-2 border-gray-100 text-gray-200"
          )}>
             <Icon className="w-10 h-10 md:w-16 md:h-16" />
             {!unlocked && <Lock className="absolute -bottom-2 -right-2 w-6 h-6 bg-white p-1 text-gray-300 rounded-lg border border-gray-100 group-hover:text-projecxy-blue transition-colors" />}
          </div>
          
          {unlocked && (
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20"
            >
               <CheckCircle2 className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center">
            <div className="space-y-1">
                <h4 className={cn(
                    "text-xl md:text-2xl font-black tracking-tighter uppercase leading-none",
                    unlocked ? "text-projecxy-text" : "text-gray-300"
                )}>{achievement.title}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-projecxy-blue opacity-50">{achievement.level} tier</p>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-projecxy-secondary opacity-60 px-4 leading-relaxed">
                {achievement.description}
            </p>
        </div>

        {unlocked && earnedAt && (
           <div className="pt-4 border-t border-gray-50 w-full mt-auto">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Synchronized: {new Date(earnedAt).toLocaleDateString()}</p>
           </div>
        )}
      </Card>

      {/* Hover Background Shine */}
      <div className="absolute inset-x-0 h-1 bottom-0 bg-gradient-to-r from-transparent via-projecxy-blue/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
};
