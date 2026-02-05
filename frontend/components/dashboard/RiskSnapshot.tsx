'use client';

import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { DeviationSummary } from '@/lib/api/dashboard';

interface RiskSnapshotProps {
  summary: DeviationSummary;
}

export function RiskSnapshot({ summary }: RiskSnapshotProps) {
  const severities = [
    {
      label: 'Critical',
      count: summary.critical,
      icon: AlertOctagon,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
    },
    {
      label: 'High',
      count: summary.high,
      icon: AlertTriangle,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      label: 'Medium',
      count: summary.medium,
      icon: AlertCircle,
      color: 'text-info-600',
      bgColor: 'bg-info-50',
    },
    {
      label: 'Low',
      count: summary.low,
      icon: Info,
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-50',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        {summary.total === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">
            No open deviations
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {severities.map(({ label, count, icon: Icon, color, bgColor }) => (
              <div
                key={label}
                className={`${bgColor} rounded-lg p-3 flex items-center gap-3`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <div>
                  <div className={`text-xl font-bold ${color}`}>{count}</div>
                  <div className="text-xs text-neutral-600">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
