import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-300',
  secondary: 'bg-primary-900 text-white hover:bg-primary-800 disabled:bg-primary-400',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-300',
  ghost: 'bg-transparent text-primary-900 border border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 disabled:text-neutral-400 disabled:border-neutral-200',
  gradient: 'bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-300', // Backward compat
  outline: 'bg-transparent text-primary-900 border border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 disabled:text-neutral-400 disabled:border-neutral-200', // Backward compat - maps to ghost
  destructive: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-300', // Backward compat - maps to danger
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-md',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500',
          'disabled:cursor-not-allowed',
          'stamp-hover',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
