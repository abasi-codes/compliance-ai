import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  animated?: boolean;
}

export function Card({ children, className, hover = false, glow = false, animated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        'transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        glow && 'hover:border-primary-300 hover:shadow-[0_0_25px_-5px_var(--primary-500)]',
        animated && 'animate-slideInUp',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderVariant = 'default' | 'gradient' | 'accent';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gradient?: boolean;
  variant?: CardHeaderVariant;
}

export function CardHeader({ children, className, gradient = false, variant = 'default', ...props }: CardHeaderProps) {
  const variantStyles: Record<CardHeaderVariant, string> = {
    default: '',
    gradient: 'bg-gradient-to-r from-primary-50 via-primary-50/50 to-transparent border-l-4 border-l-primary-500',
    accent: 'bg-gradient-to-r from-accent-50 via-accent-50/50 to-transparent border-l-4 border-l-accent-500',
  };

  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-slate-200',
        gradient && 'bg-gradient-to-r from-primary-50 to-transparent',
        variant !== 'default' && variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  icon?: ReactNode;
  gradient?: boolean;
}

export function CardTitle({ children, className, icon, gradient = false, ...props }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-lg font-semibold flex items-center gap-2',
      gradient ? 'gradient-text' : 'text-slate-900',
      className
    )} {...props}>
      {icon && (
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-accent-50 flex items-center justify-center">
          <span className="text-primary-600">{icon}</span>
        </span>
      )}
      {children}
    </h3>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl', className)} {...props}>
      {children}
    </div>
  );
}
