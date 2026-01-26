import { HelpCircle, Tag, Users } from 'lucide-react';
import { InterviewQuestion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  return (
    <Card animated className="overflow-hidden">
      {/* Question Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary-50 via-primary-50/50 to-transparent border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-lg">
              {question.subcategory_code}
            </span>
            <span className="text-sm text-neutral-500">
              Question <span className="font-semibold text-neutral-700">{questionNumber}</span> of {totalQuestions}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary-600" />
          </div>
        </div>
      </div>

      <CardContent className="pt-6">
        {/* Question Text */}
        <h2 className="text-xl font-semibold text-neutral-900 leading-relaxed">
          {question.question_text}
        </h2>

        {/* Question Metadata */}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full',
            'bg-neutral-100 text-neutral-700'
          )}>
            <Tag className="h-3.5 w-3.5" />
            Type: {question.question_type.replace('_', ' ')}
          </span>
          {question.target_roles && question.target_roles.length > 0 && (
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full',
              'bg-primary-50 text-primary-700'
            )}>
              <Users className="h-3.5 w-3.5" />
              For: {question.target_roles.join(', ')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
