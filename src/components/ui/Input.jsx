import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  error, 
  icon,
  label,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'w-full glass-input rounded-xl px-4 py-3 placeholder:text-gray-500 focus:ring-4 focus:ring-brand/20 transition-all text-white',
            icon ? 'pl-11' : '',
            error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 pl-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
