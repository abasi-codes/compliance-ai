'use client';

import { useState } from 'react';
import { FileText, BarChart3, Wrench, AlertTriangle, ClipboardCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { generateReport } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Report } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  assessmentId: string;
  onGenerate: (report: Report) => void;
}

const reportTypes = [
  {
    value: 'EXECUTIVE',
    label: 'Executive Summary',
    description: 'High-level overview with key findings and recommendations',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    value: 'DETAILED',
    label: 'Full Assessment',
    description: 'Comprehensive report with all scores, gaps, and details',
    icon: ClipboardCheck,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
  },
  {
    value: 'TECHNICAL',
    label: 'Technical Report',
    description: 'Technical details including control mappings and evidence',
    icon: Wrench,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    value: 'MATURITY',
    label: 'Maturity Summary',
    description: 'Maturity scores organized by function and category',
    icon: BarChart3,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    value: 'GAP_ANALYSIS',
    label: 'Gap Analysis',
    description: 'Coverage gaps and missing evidence by requirement',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    value: 'REMEDIATION',
    label: 'Remediation Plan',
    description: 'Prioritized action items to address identified gaps',
    icon: Shield,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
];

export function GenerateButton({ assessmentId, onGenerate }: GenerateButtonProps) {
  const userId = useUserId();
  const [selectedType, setSelectedType] = useState('EXECUTIVE');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: string) => {
    if (!userId) return;

    setGenerating(true);
    setSelectedType(type);
    setError(null);

    try {
      const report = await generateReport(assessmentId, type, userId);
      onGenerate(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              disabled={generating}
              onClick={() => handleGenerate(type.value)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                'hover:shadow-md',
                isSelected && generating
                  ? `${type.border} ${type.bg} opacity-70`
                  : `border-neutral-100 bg-white hover:${type.border} hover:${type.bg}`,
                generating && 'cursor-wait'
              )}
            >
              <div className={cn('p-2 rounded-lg', type.bg)}>
                <Icon className={cn('w-4 h-4', type.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{type.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{type.description}</p>
              </div>
              {isSelected && generating && (
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
