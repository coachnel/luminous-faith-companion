
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'lg', children, ...props }, ref) => {
    
    const variants = {
      default: 'bg-[var(--bg-card)] border border-[var(--border-default)]',
      elevated: 'bg-[var(--bg-card)] border border-[var(--border-default)] shadow-lg',
      glass: 'bg-[var(--bg-card)] backdrop-blur border border-[var(--border-default)] bg-opacity-80',
      outlined: 'bg-transparent border-2 border-[var(--border-default)]',
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
          'rounded-xl transition-all duration-200 modern-card',
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
