import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-neutral-600 mb-2">
        <span className="font-medium">
          {current} of {total} questions answered
        </span>
        <span className="font-semibold text-primary-600">{percentage.toFixed(0)}% complete</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-3 rounded-full transition-all duration-500 ease-out',
            'gradient-primary-horizontal progress-shimmer'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
