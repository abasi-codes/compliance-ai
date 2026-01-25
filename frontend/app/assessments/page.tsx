'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { LoadingPage, ErrorMessage, EmptyState } from '@/components/ui';
import { AssessmentCard } from '@/components/assessments';
import { listAssessments } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Assessment } from '@/lib/types';

const statusFilters: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function AssessmentsPage() {
  const userId = useUserId();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAssessments = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await listAssessments(
        { status: statusFilter || undefined },
        userId
      );
      setAssessments(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAssessments();
    }
  }, [userId, statusFilter]);

  if (!userId) {
    return <LoadingPage message="Initializing..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
        <Link href="/assessments/new">
          <Button>New Assessment</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  statusFilter === filter.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingPage message="Loading assessments..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAssessments} />
      ) : assessments.length === 0 ? (
        <EmptyState
          title="No assessments found"
          description={
            statusFilter
              ? `No assessments with status "${statusFilter.toLowerCase().replace('_', ' ')}"`
              : 'Get started by creating your first assessment'
          }
          action={
            !statusFilter
              ? {
                  label: 'Create Assessment',
                  onClick: () => (window.location.href = '/assessments/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}
    </div>
  );
}
