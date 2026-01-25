import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { AssessmentForm } from '@/components/assessments';

export default function NewAssessmentPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
