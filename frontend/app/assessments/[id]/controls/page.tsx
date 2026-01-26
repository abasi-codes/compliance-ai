'use client';

import { useState, useEffect, use } from 'react';
import { Settings, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { ControlUploader, ControlTable } from '@/components/controls';
import { listControls, deleteControl } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Control, ControlUploadResponse } from '@/lib/types';

interface ControlsPageProps {
  params: Promise<{ id: string }>;
}

export default function ControlsPage({ params }: ControlsPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<ControlUploadResponse | null>(null);

  const fetchControls = async () => {
    if (!userId) return;

    try {
      const data = await listControls(id, userId);
      setControls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load controls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchControls();
    }
  }, [id, userId]);

  const handleUploadComplete = (response: ControlUploadResponse) => {
    setUploadResult(response);
    setControls([...response.controls, ...controls]);
  };

  const handleDelete = async (controlId: string) => {
    if (!userId) return;

    try {
      await deleteControl(controlId, userId);
      setControls(controls.filter((c) => c.id !== controlId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete control');
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
          <CardTitle icon={<Upload className="h-5 w-5" />}>Upload Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlUploader assessmentId={id} onUploadComplete={handleUploadComplete} />

          {uploadResult && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent-500" />
                Upload Result
              </h4>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <p className="text-neutral-500">Total rows</p>
                  <p className="text-xl font-semibold text-neutral-900">{uploadResult.total_rows}</p>
                </div>
                <div className="p-3 bg-accent-50 rounded-lg border border-accent-200">
                  <p className="text-accent-600">Successful</p>
                  <p className="text-xl font-semibold text-accent-700">{uploadResult.successful}</p>
                </div>
                {uploadResult.failed > 0 && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600">Failed</p>
                    <p className="text-xl font-semibold text-red-700">{uploadResult.failed}</p>
                  </div>
                )}
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Errors:
                  </p>
                  <ul className="mt-2 text-sm text-red-600 space-y-1">
                    {uploadResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i} className="pl-4">
                        Row {err.row}: {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<Settings className="h-5 w-5" />}>
            Controls ({controls.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorMessage message={error} onRetry={fetchControls} />
          ) : (
            <ControlTable controls={controls} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
