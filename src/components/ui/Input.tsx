import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from "../../lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full group relative transition-all duration-300">
        {label && (
          <label className="text-[10px] font-black text-[#666666] tracking-widest uppercase ml-0.5 transition-colors group-focus-within:text-[#0A66C2]">
            {label}
          </label>
        )}
        <div className="relative isolate">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#666666] group-focus-within:text-[#0A66C2] transition-all duration-300 pointer-events-none z-10 group-hover:scale-110">
              <Icon className="h-4.5 w-4.5" strokeWidth={2.4} />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            className={cn(
              "w-full h-12 bg-[#F3F6F9] border-[1.5px] border-transparent rounded-lg transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]",
              "placeholder:font-medium placeholder:text-[#888888] text-[#000000e6] font-semibold text-[15px]",
              "focus:bg-white focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] focus:shadow-[0_0_0_4px_rgba(10,102,194,0.1)] outline-none",
              "hover:bg-[#EBEBEB] hover:border-[#D9E2ED]",
              Icon ? "pl-12 pr-4" : "px-4",
              error && "border-red-500 bg-red-50/10 hover:border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
          />
          {/* Subtle Focus Glow Backlight */}
          <div className="absolute inset-0 -z-10 rounded-lg opacity-0 blur-sm group-focus-within:opacity-10 transition-opacity duration-300 bg-[#0A66C2]" />
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -4 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[11px] text-red-600 font-bold mt-1 px-1 flex items-center"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

import { motion } from 'framer-motion'
export default Input
