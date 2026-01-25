import { AssessmentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: AssessmentStatus | string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-slate-100 text-slate-800',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = statusStyles[status] || statusStyles.DRAFT;
  const label = statusLabels[status] || status;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${styles} ${sizeClass}`}
    >
      {label}
    </span>
  );
}
