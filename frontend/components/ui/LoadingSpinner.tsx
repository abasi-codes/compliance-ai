import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className, pulse = false }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary-600',
        sizeClasses[size],
        pulse && 'animate-pulse-soft',
        className
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary-200 animate-ping opacity-25" />
        <LoadingSpinner size="lg" />
      </div>
      <p className="mt-6 text-neutral-600 font-medium">{message}</p>
    </div>
  );
}
