interface SeverityBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

const severityStyles: Record<string, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-white',
  LOW: 'bg-green-500 text-white',
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const styles = severityStyles[severity] || 'bg-gray-500 text-white';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded font-medium ${styles} ${sizeClass}`}>
      {severity}
    </span>
  );
}
