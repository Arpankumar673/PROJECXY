import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../ui';

export const MessageBubble = ({ message, isMe }) => {
  const time = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={cn(
        "flex w-full mb-4",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] lg:max-w-[60%] flex flex-col",
        isMe ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl md:rounded-[24px] text-sm shadow-sm relative group",
          isMe 
            ? "bg-projecxy-blue text-white rounded-tr-none" 
            : "bg-white text-projecxy-text border border-gray-100 rounded-tl-none"
        )}>
          {message.content}
          
          <div className={cn(
            "absolute -bottom-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
            isMe ? "right-0" : "left-0"
          )}>
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
