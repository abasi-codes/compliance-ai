'use client';

import { useState } from 'react';
import { Button, Select } from '@/components/ui';
import { generateReport } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Report } from '@/lib/types';

interface GenerateButtonProps {
  assessmentId: string;
  onGenerate: (report: Report) => void;
}

const reportTypes = [
  { value: 'EXECUTIVE', label: 'Executive Summary' },
  { value: 'DETAILED', label: 'Detailed Report' },
  { value: 'TECHNICAL', label: 'Technical Report' },
];

export function GenerateButton({ assessmentId, onGenerate }: GenerateButtonProps) {
  const userId = useUserId();
  const [reportType, setReportType] = useState('EXECUTIVE');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!userId) return;

    setGenerating(true);
    setError(null);

    try {
      const report = await generateReport(assessmentId, reportType, userId);
      onGenerate(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1 max-w-xs">
        <Select
          label="Report Type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          options={reportTypes}
        />
      </div>
      <Button onClick={handleGenerate} loading={generating}>
        Generate Report
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
