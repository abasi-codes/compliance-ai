import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  serif?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  serif = true,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 animate-fadeIn', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-50 border border-accent-200 flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent-600" />
            </div>
          )}
          <div>
            <h1 className={cn(
              'text-3xl font-bold text-primary-900',
              serif && 'font-display'
            )}>
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-neutral-600">{description}</p>
            )}
            {/* Underline accent */}
            <div className="mt-3 w-16 h-0.5 bg-accent-500" />
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
