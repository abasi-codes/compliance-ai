import { ScoreSummary as ScoreSummaryType } from '@/lib/types';

interface ScoreSummaryProps {
  summary: ScoreSummaryType;
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return 'text-green-600';
  if (score >= 2.5) return 'text-lime-600';
  if (score >= 1.5) return 'text-yellow-600';
  if (score >= 0.5) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 3.5) return 'bg-green-100';
  if (score >= 2.5) return 'bg-lime-100';
  if (score >= 1.5) return 'bg-yellow-100';
  if (score >= 0.5) return 'bg-orange-100';
  return 'bg-red-100';
}

export function ScoreSummary({ summary }: ScoreSummaryProps) {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-500 mb-2">Overall Maturity Score</p>
      <div className={`text-6xl font-bold ${getScoreColor(summary.overall_maturity)}`}>
        {summary.overall_maturity.toFixed(1)}
      </div>
      <p className="text-gray-500 mt-2">out of 4.0</p>
      <div className="mt-4 flex justify-center">
        <div className="w-64 bg-gray-200 rounded-full h-4">
          <div
            className={`${getScoreBgColor(summary.overall_maturity)} rounded-full h-4 transition-all`}
            style={{ width: `${(summary.overall_maturity / 4) * 100}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Calculated {new Date(summary.calculated_at).toLocaleString()}
      </p>
    </div>
  );
}
