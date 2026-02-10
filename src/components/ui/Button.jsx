import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none';
  
  const variants = {
    primary: 'bg-asana-teal text-white hover:bg-[#1a9ba0] shadow-xl shadow-asana-teal/20 border-none',
    secondary: 'bg-[#F8FAFF] text-[#1A181E] hover:bg-gray-100 border border-gray-100 shadow-sm',
    outline: 'border-2 border-asana-teal text-asana-teal hover:bg-asana-teal/5',
    ghost: 'text-[#8E8E93] hover:text-[#1A181E] hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-lg shadow-red-500/10 border-none',
  };

  const sizes = {
    sm: 'h-10 px-4 text-[9px]',
    md: 'h-14 px-6 text-[11px]',
    lg: 'h-18 px-10 text-[13px]',
    icon: 'h-12 w-12 rounded-2xl',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="opacity-60">Wait...</span>
        </div>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
