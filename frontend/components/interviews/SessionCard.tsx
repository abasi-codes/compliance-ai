import Link from 'next/link';
import { Play, Pause, CheckCircle2, Circle, User } from 'lucide-react';
import { InterviewSession } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: InterviewSession;
  assessmentId: string;
}

const statusConfig: Record<string, {
  styles: string;
  icon: typeof Circle;
  label: string;
}> = {
  NOT_STARTED: {
    styles: 'bg-slate-100 text-slate-700',
    icon: Circle,
    label: 'Not Started',
  },
  IN_PROGRESS: {
    styles: 'bg-primary-100 text-primary-700',
    icon: Play,
    label: 'In Progress',
  },
  COMPLETED: {
    styles: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
    label: 'Completed',
  },
  PAUSED: {
    styles: 'bg-amber-100 text-amber-700',
    icon: Pause,
    label: 'Paused',
  },
};

export function SessionCard({ session, assessmentId }: SessionCardProps) {
  const progress = session.total_questions > 0
    ? Math.round((session.current_question_index / session.total_questions) * 100)
    : 0;

  const config = statusConfig[session.status] || statusConfig.NOT_STARTED;
  const StatusIcon = config.icon;

  return (
    <Link href={`/assessments/${assessmentId}/interviews/${session.id}`}>
      <Card hover className="h-full">
        <CardContent>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {session.interviewee_name || 'Unnamed Session'}
                  </h3>
                  {session.interviewee_role && (
                    <p className="text-sm text-slate-500">{session.interviewee_role}</p>
                  )}
                </div>
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full',
                config.styles
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </span>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Progress</span>
              <span className="font-medium">
                {session.current_question_index} / {session.total_questions} questions
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-300 gradient-primary-horizontal"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Created {new Date(session.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
