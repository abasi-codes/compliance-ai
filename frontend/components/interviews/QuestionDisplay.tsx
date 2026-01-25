import { InterviewQuestion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';

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
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            {question.subcategory_code}
          </span>
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        <h2 className="text-lg font-medium text-gray-900">{question.question_text}</h2>

        <div className="mt-4 flex gap-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">
            Type: {question.question_type}
          </span>
          {question.target_roles && question.target_roles.length > 0 && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              For: {question.target_roles.join(', ')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
