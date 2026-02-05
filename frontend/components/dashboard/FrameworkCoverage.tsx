'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { FrameworkCoverage as FrameworkCoverageType } from '@/lib/api/dashboard';

interface FrameworkCoverageProps {
  frameworks: FrameworkCoverageType[];
}

export function FrameworkCoverage({ frameworks }: FrameworkCoverageProps) {
  if (frameworks.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Framework Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500 text-center py-8">
            No frameworks configured yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Framework Coverage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {frameworks.map((framework) => (
          <div key={framework.framework_id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700">
                {framework.framework_code}
              </span>
              <span className="text-sm text-neutral-500">
                {framework.coverage_percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${framework.coverage_percentage}%` }}
              />
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {framework.assessed_requirements} / {framework.total_requirements} requirements
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
