interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          {current} of {total} questions answered
        </span>
        <span>{percentage.toFixed(0)}% complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 rounded-full h-3 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
