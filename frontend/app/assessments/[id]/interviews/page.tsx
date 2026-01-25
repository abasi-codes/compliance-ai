'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/ui';
import { SessionCard, CreateSessionForm } from '@/components/interviews';
import { listSessions } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { InterviewSession } from '@/lib/types';

interface InterviewsPageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewsPage({ params }: InterviewsPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchSessions = async () => {
    if (!userId) return;

    try {
      const data = await listSessions(id, userId);
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [id, userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Interview Sessions</CardTitle>
            {!showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)}>
                New Interview
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <CreateSessionForm
              assessmentId={id}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <p className="text-sm text-gray-600">
              Conduct structured interviews to gather information about your security
              practices and validate control implementations.
            </p>
          )}
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} onRetry={fetchSessions} />}

      {sessions.length === 0 && !showCreateForm ? (
        <EmptyState
          title="No interview sessions"
          description="Start an interview to gather security practice information"
          action={{
            label: 'Start Interview',
            onClick: () => setShowCreateForm(true),
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} assessmentId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
