
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
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600 shadow-sm',
      ghost: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
      outline: 'border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700',
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
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
