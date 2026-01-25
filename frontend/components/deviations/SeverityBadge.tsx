import { AlertOctagon, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

const severityConfig: Record<string, {
  styles: string;
  icon: typeof AlertCircle;
  pulse?: boolean;
}> = {
  CRITICAL: {
    styles: 'bg-red-600 text-white',
    icon: AlertOctagon,
    pulse: true,
  },
  HIGH: {
    styles: 'bg-orange-500 text-white',
    icon: AlertTriangle,
  },
  MEDIUM: {
    styles: 'bg-amber-500 text-white',
    icon: AlertCircle,
  },
  LOW: {
    styles: 'bg-green-500 text-white',
    icon: Info,
  },
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const config = severityConfig[severity] || {
    styles: 'bg-slate-500 text-white',
    icon: Info,
  };
  const Icon = config.icon;
  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-2.5 py-1 text-sm gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-semibold shadow-sm',
        config.styles,
        sizeClass,
        config.pulse && 'animate-pulse-soft'
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {severity}
    </span>
  );
}
