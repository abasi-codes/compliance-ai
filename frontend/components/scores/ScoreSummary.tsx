import { TrendingUp, Clock } from 'lucide-react';
import { ScoreSummary as ScoreSummaryType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ScoreSummaryProps {
  summary: ScoreSummaryType;
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return 'text-green-600';
  if (score >= 2.5) return 'text-emerald-600';
  if (score >= 1.5) return 'text-amber-600';
  if (score >= 0.5) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreGradient(score: number): string {
  if (score >= 3.5) return 'from-green-500 to-green-600';
  if (score >= 2.5) return 'from-emerald-500 to-emerald-600';
  if (score >= 1.5) return 'from-amber-500 to-amber-600';
  if (score >= 0.5) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

function getScoreLabel(score: number): string {
  if (score >= 3.5) return 'Excellent';
  if (score >= 2.5) return 'Good';
  if (score >= 1.5) return 'Fair';
  if (score >= 0.5) return 'Needs Improvement';
  return 'Critical';
}

export function ScoreSummary({ summary }: ScoreSummaryProps) {
  const scorePercent = (summary.overall_maturity / 4) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <p className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Overall Maturity Score
        </p>

        {/* Circular Score Display */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-neutral-200"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${scorePercent * 5.53} 553`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={cn('stop-color-[var(--primary-400)]')} style={{ stopColor: 'var(--primary-400)' }} />
                  <stop offset="100%" className={cn('stop-color-[var(--primary-600)]')} style={{ stopColor: 'var(--primary-600)' }} />
                </linearGradient>
              </defs>
            </svg>
            {/* Score text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-5xl font-bold', getScoreColor(summary.overall_maturity))}>
                {summary.overall_maturity.toFixed(1)}
              </span>
              <span className="text-neutral-500 text-sm mt-1">out of 4.0</span>
            </div>
          </div>

          {/* Score label */}
          <div className={cn(
            'mt-4 px-4 py-2 rounded-full text-sm font-semibold text-white',
            `bg-gradient-to-r ${getScoreGradient(summary.overall_maturity)}`
          )}>
            {getScoreLabel(summary.overall_maturity)}
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <Clock className="h-3.5 w-3.5" />
          <span>Calculated {new Date(summary.calculated_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
