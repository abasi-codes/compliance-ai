'use client';

import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/assessments/StatusBadge';
import type { RecentAssessment } from '@/lib/api/dashboard';

interface RecentAssessmentsProps {
  assessments: RecentAssessment[];
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Assessments</CardTitle>
        <Link
          href="/assessments"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">
            No assessments yet
          </p>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900 truncate group-hover:text-primary-600">
                    {assessment.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{assessment.organization_name}</span>
                    <span className="text-neutral-300">·</span>
                    <span>{formatDate(assessment.updated_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  {assessment.maturity_score !== null && (
                    <span className="text-sm font-medium text-neutral-700">
                      {assessment.maturity_score.toFixed(1)}
                    </span>
                  )}
                  <StatusBadge status={assessment.status as 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
