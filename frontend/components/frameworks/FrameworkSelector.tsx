'use client';

import { useState, useEffect } from 'react';
import { Check, Layers } from 'lucide-react';
import { listFrameworks } from '@/lib/api';
import { Framework } from '@/lib/types';
import { cn } from '@/lib/utils';

const frameworkTypeColors: Record<string, string> = {
  nist_csf: 'border-blue-500 bg-blue-50',
  iso_27001: 'border-green-500 bg-green-50',
  soc2_tsc: 'border-purple-500 bg-purple-50',
  custom: 'border-orange-500 bg-orange-50',
};

const frameworkTypeLabels: Record<string, string> = {
  nist_csf: 'NIST CSF',
  iso_27001: 'ISO 27001',
  soc2_tsc: 'SOC 2',
  custom: 'Custom',
};

interface FrameworkSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export function FrameworkSelector({
  selectedIds,
  onChange,
  multiple = true,
  disabled = false,
}: FrameworkSelectorProps) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const data = await listFrameworks();
        setFrameworks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  const handleToggle = (frameworkId: string) => {
    if (disabled) return;

    if (multiple) {
      if (selectedIds.includes(frameworkId)) {
        onChange(selectedIds.filter((id) => id !== frameworkId));
      } else {
        onChange([...selectedIds, frameworkId]);
      }
    } else {
      onChange(selectedIds.includes(frameworkId) ? [] : [frameworkId]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <Layers className="w-5 h-5 animate-pulse mr-2" />
        Loading frameworks...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {frameworks.map((framework) => {
        const isSelected = selectedIds.includes(framework.id);
        return (
          <div
            key={framework.id}
            onClick={() => handleToggle(framework.id)}
            className={cn(
              'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
              isSelected
                ? frameworkTypeColors[framework.framework_type] || frameworkTypeColors.custom
                : 'border-slate-200 hover:border-slate-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'px-2 py-0.5 text-xs font-semibold rounded',
                  isSelected ? 'bg-white/50 text-slate-700' : 'bg-slate-100 text-slate-600'
                )}
              >
                {frameworkTypeLabels[framework.framework_type] || 'Custom'}
              </span>
            </div>
            <h3 className="font-medium text-slate-900">{framework.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Version {framework.version}</p>
            {framework.description && (
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{framework.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
