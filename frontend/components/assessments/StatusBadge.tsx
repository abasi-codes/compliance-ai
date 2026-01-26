import { Circle, Clock, CheckCircle2, Archive } from 'lucide-react';
import { AssessmentStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AssessmentStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, {
  label: string;
  styles: string;
  icon: typeof Circle;
  dotColor: string;
}> = {
  DRAFT: {
    label: 'Draft',
    styles: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: Circle,
    dotColor: 'bg-neutral-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    styles: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: Clock,
    dotColor: 'bg-primary-500',
  },
  COMPLETED: {
    label: 'Completed',
    styles: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle2,
    dotColor: 'bg-green-500',
  },
  ARCHIVED: {
    label: 'Archived',
    styles: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    icon: Archive,
    dotColor: 'bg-neutral-400',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.DRAFT;
  const Icon = config.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-sm gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        config.styles,
        sizeClass
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
