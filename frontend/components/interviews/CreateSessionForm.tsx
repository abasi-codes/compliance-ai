'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@/components/ui';
import { createSession } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';

interface CreateSessionFormProps {
  assessmentId: string;
  onCancel: () => void;
}

export function CreateSessionForm({ assessmentId, onCancel }: CreateSessionFormProps) {
  const router = useRouter();
  const userId = useUserId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    interviewee_name: '',
    interviewee_role: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const session = await createSession(assessmentId, formData, userId);
      router.push(`/assessments/${assessmentId}/interviews/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <Input
        label="Interviewee Name"
        value={formData.interviewee_name}
        onChange={(e) => setFormData({ ...formData, interviewee_name: e.target.value })}
        placeholder="John Doe"
      />

      <Input
        label="Role"
        value={formData.interviewee_role}
        onChange={(e) => setFormData({ ...formData, interviewee_role: e.target.value })}
        placeholder="CISO, Security Manager, etc."
      />

      <Textarea
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Any additional context about this interview..."
        rows={3}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Start Interview
        </Button>
      </div>
    </form>
  );
}
