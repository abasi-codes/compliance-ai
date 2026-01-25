import Link from 'next/link';
import { InterviewSession } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';

interface SessionCardProps {
  session: InterviewSession;
  assessmentId: string;
}

const statusColors: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
};

export function SessionCard({ session, assessmentId }: SessionCardProps) {
  const progress = session.total_questions > 0
    ? Math.round((session.current_question_index / session.total_questions) * 100)
    : 0;

  return (
    <Link href={`/assessments/${assessmentId}/interviews/${session.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {session.interviewee_name || 'Unnamed Session'}
              </h3>
              {session.interviewee_role && (
                <p className="text-sm text-gray-500">{session.interviewee_role}</p>
              )}
            </div>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                statusColors[session.status] || statusColors.NOT_STARTED
              }`}
            >
              {session.status.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {session.current_question_index} / {session.total_questions} questions
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Created {new Date(session.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
