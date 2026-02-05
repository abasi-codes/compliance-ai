'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ComplianceOverviewProps {
  score: number | null;
  trend: number | null;
}

export function ComplianceOverview({ score, trend }: ComplianceOverviewProps) {
  const displayScore = score ?? 0;
  const percentage = (displayScore / 4) * 100;

  // Determine color based on score (0-4 scale)
  const getScoreColor = (s: number) => {
    if (s >= 3) return 'text-success-600';
    if (s >= 2) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getProgressColor = (s: number) => {
    if (s >= 3) return 'bg-success-500';
    if (s >= 2) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <Card glow className="h-full">
      <CardHeader variant="gradient">
        <CardTitle>Overall Maturity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          {/* Circular gauge */}
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-neutral-200"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 4.4} 440`}
                className={getProgressColor(displayScore)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(displayScore)}`}>
                {score !== null ? displayScore.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-neutral-500">out of 4.0</span>
            </div>
          </div>

          {/* Trend indicator */}
          {trend !== null && (
            <div className="flex items-center gap-2 text-sm">
              {trend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-success-600" />
                  <span className="text-success-600">+{trend.toFixed(1)} from last period</span>
                </>
              ) : trend < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-danger-600" />
                  <span className="text-danger-600">{trend.toFixed(1)} from last period</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-neutral-500" />
                  <span className="text-neutral-500">No change from last period</span>
                </>
              )}
            </div>
          )}

          {score === null && (
            <p className="text-sm text-neutral-500 text-center">
              Complete an assessment to see your maturity score
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
