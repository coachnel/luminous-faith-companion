
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'lg', children, ...props }, ref) => {
    const { theme, tokens } = useTheme();
    
    const variants = {
      default: 'bg-[var(--bg-card)] border border-[var(--border-default)]',
      elevated: 'bg-[var(--bg-card)] shadow-lg border border-[var(--border-light)]',
      outlined: 'bg-transparent border-2 border-[var(--border-medium)]',
      glass: theme === 'dark' 
        ? 'bg-slate-800/50 backdrop-blur-md border border-slate-700/50'
        : 'bg-white/70 backdrop-blur-md border border-white/30'
    };
    
    const paddings = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModernCard.displayName = 'ModernCard';
