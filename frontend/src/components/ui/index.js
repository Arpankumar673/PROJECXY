import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Button Component
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-projecxy-blue text-white hover:opacity-90 shadow-soft',
    secondary: 'bg-white text-projecxy-blue border border-projecxy-blue hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 text-projecxy-text',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-widest font-bold',
    md: 'px-6 py-3 text-sm font-bold',
    lg: 'px-8 py-4 text-sm font-black uppercase tracking-widest',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

// Card Component
export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Input Component
export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold uppercase tracking-widest text-projecxy-secondary mb-2 pl-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-projecxy-blue outline-none transition-all shadow-soft placeholder:text-gray-300 text-projecxy-text font-medium',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase px-1">{error}</p>}
    </div>
  );
});
