import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        glow && 'hover:border-primary-300 hover:shadow-[0_0_20px_-5px_var(--primary-500)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gradient?: boolean;
}

export function CardHeader({ children, className, gradient = false, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-slate-200',
        gradient && 'bg-gradient-to-r from-primary-50 to-transparent',
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
}

export function CardTitle({ children, className, icon, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900 flex items-center gap-2', className)} {...props}>
      {icon && <span className="text-primary-600">{icon}</span>}
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
