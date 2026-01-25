'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentTabs } from '@/components/layout';
import { LoadingPage, ErrorMessage } from '@/components/ui';
import { StatusBadge } from '@/components/assessments';
import { getAssessment } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Assessment } from '@/lib/types';

interface AssessmentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function AssessmentLayout({ children, params }: AssessmentLayoutProps) {
  const { id } = use(params);
  const userId = useUserId();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAssessment = async () => {
      try {
        const data = await getAssessment(id, userId);
        setAssessment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, userId]);

  if (!userId || loading) {
    return <LoadingPage message="Loading assessment..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage
          message={error}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Assessment not found" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment.name}</h1>
            <p className="mt-1 text-sm text-gray-600">{assessment.organization_name}</p>
          </div>
          <StatusBadge status={assessment.status} />
        </div>
      </div>

      <AssessmentTabs assessmentId={id} />

      <div className="mt-6">{children}</div>
    </div>
  );
}
