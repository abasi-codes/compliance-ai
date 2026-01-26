import { AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ title = 'Error', message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn(
      'rounded-xl bg-red-50 border border-red-100 p-5',
      'animate-fadeIn',
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fadeIn">
      <div className="mx-auto h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="h-8 w-8 text-neutral-400" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
