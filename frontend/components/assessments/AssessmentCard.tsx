import Link from 'next/link';
import { Building2, Calendar } from 'lucide-react';
import { Assessment } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface AssessmentCardProps {
  assessment: Assessment;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const formattedDate = new Date(assessment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/assessments/${assessment.id}`}>
      <Card hover glow className="h-full">
        <CardContent>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                {assessment.name}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                <Building2 className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="truncate">{assessment.organization_name}</span>
              </div>
              {assessment.description && (
                <p className="mt-3 text-sm text-neutral-500 line-clamp-2">
                  {assessment.description}
                </p>
              )}
            </div>
            <StatusBadge status={assessment.status} size="sm" />
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center text-sm text-neutral-500">
            <Calendar className="h-4 w-4 mr-1.5 text-neutral-400" />
            <span>Created {formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
