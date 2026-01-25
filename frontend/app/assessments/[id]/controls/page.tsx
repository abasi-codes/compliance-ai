'use client';

import { useState, useEffect, use } from 'react';
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlUploader assessmentId={id} onUploadComplete={handleUploadComplete} />

          {uploadResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Upload Result</h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>Total rows: {uploadResult.total_rows}</p>
                <p className="text-green-600">Successful: {uploadResult.successful}</p>
                {uploadResult.failed > 0 && (
                  <p className="text-red-600">Failed: {uploadResult.failed}</p>
                )}
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-600">Errors:</p>
                  <ul className="mt-1 text-sm text-red-500">
                    {uploadResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>
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

      <Card>
        <CardHeader>
          <CardTitle>Controls ({controls.length})</CardTitle>
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
