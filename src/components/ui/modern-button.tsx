
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Slot } from '@radix-ui/react-slot';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'spiritual';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const { theme } = useTheme();
    const Comp = asChild ? Slot : 'button';
    
    const variants = {
      primary: theme === 'dark'
        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md',
      secondary: theme === 'dark'
        ? 'bg-slate-700 hover:bg-slate-600 text-slate-100'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      ghost: theme === 'dark'
        ? 'hover:bg-slate-800 text-slate-300 hover:text-slate-100'
        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
      outline: theme === 'dark'
        ? 'border border-slate-600 hover:bg-slate-800 text-slate-300'
        : 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      spiritual: 'bg-[var(--spiritual-primary)] hover:bg-[var(--spiritual-secondary)] text-white shadow-lg'
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-xl',
      xl: 'h-14 px-8 text-lg rounded-2xl'
    };
    
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
ModernButton.displayName = 'ModernButton';
