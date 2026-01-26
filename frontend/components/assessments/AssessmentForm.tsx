'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { FrameworkSelector } from '@/components/frameworks';
import { createAssessment, setAssessmentScope } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';

export function AssessmentForm() {
  const router = useRouter();
  const userId = useUserId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (selectedFrameworks.length === 0) {
      setError('Please select at least one compliance framework');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const assessment = await createAssessment(formData, userId);

      // Set up framework scope for the assessment
      for (const frameworkId of selectedFrameworks) {
        await setAssessmentScope(assessment.id, {
          framework_id: frameworkId,
          include_all: true,
        });
      }

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

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
          <Layers className="w-4 h-4" />
          Compliance Frameworks
          <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-neutral-500 mb-4">
          Select the compliance frameworks to include in this assessment. You can select multiple
          frameworks for a comprehensive multi-framework assessment.
        </p>
        <FrameworkSelector
          selectedIds={selectedFrameworks}
          onChange={setSelectedFrameworks}
          multiple={true}
        />
        {selectedFrameworks.length > 0 && (
          <p className="text-sm text-accent-600 mt-3">
            {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={!userId || selectedFrameworks.length === 0}
        >
          Create Assessment
        </Button>
      </div>
    </form>
  );
}
