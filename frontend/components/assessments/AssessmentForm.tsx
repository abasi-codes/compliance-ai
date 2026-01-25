'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@/components/ui';
import { createAssessment } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';

export function AssessmentForm() {
  const router = useRouter();
  const userId = useUserId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const assessment = await createAssessment(formData, userId);
      router.push(`/assessments/${assessment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Input
        label="Assessment Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Q1 2024 Security Assessment"
      />

      <Input
        label="Organization Name"
        required
        value={formData.organization_name}
        onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
        placeholder="Acme Corporation"
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of the assessment scope and objectives..."
        rows={4}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={!userId}>
          Create Assessment
        </Button>
      </div>
    </form>
  );
}
