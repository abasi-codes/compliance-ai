'use client';

import { useState, useEffect, use } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PolicyUploader, PolicyList } from '@/components/policies';
import { listPolicies, deletePolicy } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Policy, PolicyUploadResponse } from '@/lib/types';

interface PoliciesPageProps {
  params: Promise<{ id: string }>;
}

export default function PoliciesPage({ params }: PoliciesPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<PolicyUploadResponse | null>(null);

  const fetchPolicies = async () => {
    if (!userId) return;

    try {
      const data = await listPolicies(id, userId);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPolicies();
    }
  }, [id, userId]);

  const handleUploadComplete = (response: PolicyUploadResponse) => {
    setUploadResult(response);
    setPolicies([response.policy, ...policies]);
  };

  const handleDelete = async (policyId: string) => {
    if (!userId) return;

    try {
      await deletePolicy(policyId, userId);
      setPolicies(policies.filter((p) => p.id !== policyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete policy');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<Upload className="h-5 w-5" />}>Upload Policy Document</CardTitle>
        </CardHeader>
        <CardContent>
          <PolicyUploader assessmentId={id} onUploadComplete={handleUploadComplete} />

          {uploadResult && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent-500" />
                Upload Result
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-neutral-700">
                  <span className="font-medium">Policy:</span> {uploadResult.policy.name}
                </p>
                {uploadResult.text_extracted ? (
                  <p className="text-accent-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Text extracted ({uploadResult.text_length?.toLocaleString()} characters)
                  </p>
                ) : (
                  <p className="text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Text extraction failed: {uploadResult.extraction_error}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<FileText className="h-5 w-5" />}>
            Policies ({policies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorMessage message={error} onRetry={fetchPolicies} />
          ) : (
            <PolicyList policies={policies} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
