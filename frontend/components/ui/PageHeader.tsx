import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  gradient?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  gradient = true,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 animate-fadeIn', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center border border-primary-100">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
          )}
          <div>
            <h1 className={cn(
              'text-3xl font-bold',
              gradient ? 'gradient-text' : 'text-slate-900'
            )}>
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-slate-500">{description}</p>
            )}
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
