'use client';

import { useState } from 'react';
import { FileUpload, ErrorMessage } from '@/components/ui';
import { uploadControls } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { ControlUploadResponse } from '@/lib/types';

interface ControlUploaderProps {
  assessmentId: string;
  onUploadComplete: (response: ControlUploadResponse) => void;
}

export function ControlUploader({ assessmentId, onUploadComplete }: ControlUploaderProps) {
  const userId = useUserId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!userId) return;

    setUploading(true);
    setError(null);

    try {
      const response = await uploadControls(assessmentId, file, userId);
      onUploadComplete(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileUpload
        accept=".csv,.xlsx,.xls"
        onFileSelect={handleFileSelect}
        uploading={uploading}
        label="Upload Controls"
        helperText="CSV or Excel file with columns: identifier, name, description, owner, control_type, implementation_status"
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
