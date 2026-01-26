import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean; // Backward compat - treated same as hover
  ledger?: boolean;
  animated?: boolean;
}

export function Card({ children, className, hover = false, glow = false, ledger = false, animated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-background rounded-lg border border-neutral-200',
        'transition-all duration-200',
        (hover || glow) && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-accent-300',
        ledger && 'border-l-3 border-l-accent-500 hover:border-l-accent-600 hover:translate-x-0.5',
        animated && 'animate-ledger',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderVariant = 'default' | 'accent' | 'ink' | 'gradient';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardHeaderVariant;
}

export function CardHeader({ children, className, variant = 'default', ...props }: CardHeaderProps) {
  const variantStyles: Record<CardHeaderVariant, string> = {
    default: '',
    accent: 'border-l-3 border-l-accent-500 pl-5',
    ink: 'border-l-3 border-l-primary-900 pl-5',
    gradient: 'border-l-3 border-l-accent-500 pl-5', // Backward compat - maps to accent
  };

  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-neutral-200',
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
  serif?: boolean;
}

export function CardTitle({ children, className, icon, serif = false, ...props }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-lg font-semibold flex items-center gap-3 text-primary-900',
      serif && 'font-display',
      className
    )} {...props}>
      {icon && (
        <span className="flex-shrink-0 w-8 h-8 rounded-md bg-accent-50 border border-accent-200 flex items-center justify-center">
          <span className="text-accent-600">{icon}</span>
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
    <div className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg', className)} {...props}>
      {children}
    </div>
  );
}
