import Link from 'next/link';
import { Assessment } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';
import { StatusBadge } from './StatusBadge';

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
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {assessment.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{assessment.organization_name}</p>
              {assessment.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {assessment.description}
                </p>
              )}
            </div>
            <StatusBadge status={assessment.status} />
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Created {formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
