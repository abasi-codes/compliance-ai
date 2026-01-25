import { FilePlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, PageHeader } from '@/components/ui';
import { AssessmentForm } from '@/components/assessments';

export default function NewAssessmentPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Create Assessment"
        description="Start a new NIST CSF 2.0 compliance assessment"
        icon={FilePlus}
      />

      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
