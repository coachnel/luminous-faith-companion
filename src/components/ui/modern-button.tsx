
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Slot } from '@radix-ui/react-slot';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const { theme } = useTheme();
    const Comp = asChild ? Slot : 'button';
    
    const variants = {
      primary: 'bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90',
      secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-default)]',
      ghost: 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]',
      outline: 'border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-xl',
    };
    
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
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
