'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { QuestionDisplay, ResponseForm, ProgressBar } from '@/components/interviews';
import { getSession, getNextQuestion, submitResponse, completeSession } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import {
  InterviewSession,
  InterviewResponseCreate,
  NextQuestionResponse,
} from '@/lib/types';

interface InterviewSessionPageProps {
  params: Promise<{ id: string; sessionId: string }>;
}

export default function InterviewSessionPage({ params }: InterviewSessionPageProps) {
  const { id, sessionId } = use(params);
  const router = useRouter();
  const userId = useUserId();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questionData, setQuestionData] = useState<NextQuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) return;

    try {
      const [sessionData, nextQuestion] = await Promise.all([
        getSession(sessionId, userId),
        getNextQuestion(sessionId, userId),
      ]);
      setSession(sessionData);
      setQuestionData(nextQuestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [sessionId, userId]);

  const handleSubmitResponse = async (response: InterviewResponseCreate) => {
    if (!userId) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitResponse(sessionId, response, userId);
      const nextQuestion = await getNextQuestion(sessionId, userId);
      setQuestionData(nextQuestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!userId) return;

    try {
      await completeSession(sessionId, userId);
      router.push(`/assessments/${id}/interviews`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete session');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || !questionData) {
    return <ErrorMessage message="Interview session not found" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-medium text-gray-900">
                {session.interviewee_name || 'Interview Session'}
              </h2>
              {session.interviewee_role && (
                <p className="text-sm text-gray-500">{session.interviewee_role}</p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push(`/assessments/${id}/interviews`)}
            >
              Save & Exit
            </Button>
          </div>
          <ProgressBar
            current={questionData.question_number - 1}
            total={questionData.total_questions}
            percentage={questionData.progress_percentage}
          />
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      {questionData.is_complete ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">&#x2713;</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Interview Complete
            </h2>
            <p className="text-gray-600 mb-6">
              All questions have been answered. You can now complete this session.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => router.push(`/assessments/${id}/interviews`)}>
                Review Later
              </Button>
              <Button onClick={handleComplete}>
                Complete Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : questionData.question ? (
        <>
          <QuestionDisplay
            question={questionData.question}
            questionNumber={questionData.question_number}
            totalQuestions={questionData.total_questions}
          />

          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponseForm
                question={questionData.question}
                onSubmit={handleSubmitResponse}
                loading={submitting}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No more questions available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
