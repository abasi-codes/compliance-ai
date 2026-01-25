'use client';

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

const severityOptions = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const statusOptions = ['', 'OPEN', 'IN_REMEDIATION', 'RESOLVED', 'ACCEPTED'];

export function DeviationFilters({
  severity,
  status,
  onSeverityChange,
  onStatusChange,
  counts,
}: DeviationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
        <div className="flex gap-1">
          {severityOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSeverityChange(option)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                severity === option
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option || 'All'}
              {option && counts.by_severity[option] !== undefined && (
                <span className="ml-1 text-xs">({counts.by_severity[option]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div className="flex gap-1">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => onStatusChange(option)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                status === option
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option ? option.replace('_', ' ') : 'All'}
              {option && counts.by_status[option] !== undefined && (
                <span className="ml-1 text-xs">({counts.by_status[option]})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
