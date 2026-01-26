'use client';

import { cn } from '@/lib/utils';

interface DeviationFiltersProps {
  severity: string;
  status: string;
  onSeverityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  counts: {
    by_severity: Record<string, number>;
    by_status: Record<string, number>;
  };
}

const severityOptions = [
  { value: '', label: 'All' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_REMEDIATION', label: 'In Remediation' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'ACCEPTED', label: 'Accepted' },
];

export function DeviationFilters({
  severity,
  status,
  onSeverityChange,
  onStatusChange,
  counts,
}: DeviationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Severity</label>
        <div className="flex gap-1.5 flex-wrap">
          {severityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSeverityChange(option.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                severity === option.value
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:shadow-sm'
              )}
            >
              {option.label}
              {option.value && counts.by_severity[option.value] !== undefined && (
                <span className={cn(
                  'ml-1.5 text-xs',
                  severity === option.value ? 'opacity-80' : 'opacity-60'
                )}>
                  ({counts.by_severity[option.value]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Status</label>
        <div className="flex gap-1.5 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                status === option.value
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:shadow-sm'
              )}
            >
              {option.label}
              {option.value && counts.by_status[option.value] !== undefined && (
                <span className={cn(
                  'ml-1.5 text-xs',
                  status === option.value ? 'opacity-80' : 'opacity-60'
                )}>
                  ({counts.by_status[option.value]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
