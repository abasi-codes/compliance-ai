'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, RefreshCw, Eye, UserCheck } from 'lucide-react';
import { getFrameworkHierarchy, setAssessmentScope } from '@/lib/api';
import { FrameworkHierarchyNode, AssessmentScope } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrustServiceSelectorProps {
  frameworkId: string;
  assessmentId: string;
  currentScope: AssessmentScope;
  onScopeChange: () => void;
}

const categoryIcons: Record<string, typeof Shield> = {
  'CC': Shield,
  'A': RefreshCw,
  'PI': Eye,
  'C': Lock,
  'P': UserCheck,
};

const categoryMeta: Record<string, { color: string; bg: string; border: string; required?: boolean }> = {
  'CC': { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', required: true },
  'A': { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  'PI': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  'C': { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  'P': { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

function getCategoryKey(code: string): string {
  // Extract prefix from SOC 2 codes like "CC", "A", "PI", "C", "P"
  for (const key of ['CC', 'PI', 'A', 'C', 'P']) {
    if (code.startsWith(key)) return key;
  }
  return code;
}

export function TrustServiceSelector({
  frameworkId,
  assessmentId,
  currentScope,
  onScopeChange,
}: TrustServiceSelectorProps) {
  const [categories, setCategories] = useState<FrameworkHierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const hierarchy = await getFrameworkHierarchy(frameworkId, 0);
        setCategories(hierarchy);

        // Determine which categories are currently selected
        if (currentScope.include_all) {
          // All are selected
          setSelectedCategories(new Set(hierarchy.map((c) => c.id)));
        } else if (currentScope.included_requirement_ids && currentScope.included_requirement_ids.length > 0) {
          setSelectedCategories(new Set(currentScope.included_requirement_ids));
        } else {
          // include_all with exclusions
          const excluded = new Set(currentScope.excluded_requirement_ids || []);
          setSelectedCategories(new Set(hierarchy.filter((c) => !excluded.has(c.id)).map((c) => c.id)));
        }
      } catch {
        // Hierarchy unavailable
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, [frameworkId, currentScope]);

  const handleToggle = async (categoryId: string, categoryCode: string) => {
    // Security (CC) is always required
    const catKey = getCategoryKey(categoryCode);
    if (catKey === 'CC') return;

    setUpdating(true);

    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);

    try {
      const allIds = categories.map((c) => c.id);
      const isAll = newSelected.size === allIds.length;

      if (isAll) {
        await setAssessmentScope(assessmentId, {
          framework_id: frameworkId,
          include_all: true,
        });
      } else {
        await setAssessmentScope(assessmentId, {
          framework_id: frameworkId,
          include_all: false,
          included_requirement_ids: Array.from(newSelected),
        });
      }

      onScopeChange();
    } catch {
      // Revert on error
      setSelectedCategories(selectedCategories);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-3 pl-8 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="mt-3 pl-8">
      <p className="text-xs text-neutral-500 mb-2 font-medium">Trust Service Criteria</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map((category) => {
          const catKey = getCategoryKey(category.code);
          const meta = categoryMeta[catKey] || { color: 'text-neutral-700', bg: 'bg-neutral-50', border: 'border-neutral-200' };
          const Icon = categoryIcons[catKey] || Shield;
          const isSelected = selectedCategories.has(category.id);
          const isRequired = meta.required;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleToggle(category.id, category.code)}
              disabled={isRequired || updating}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all text-sm',
                isSelected
                  ? `${meta.border} ${meta.bg}`
                  : 'border-neutral-100 bg-white hover:border-neutral-200',
                isRequired && 'cursor-default opacity-90',
                updating && 'opacity-60'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0',
                isSelected ? meta.bg : 'bg-neutral-100'
              )}>
                <Icon className={cn(
                  'w-4 h-4',
                  isSelected ? meta.color : 'text-neutral-400'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-medium truncate',
                  isSelected ? meta.color : 'text-neutral-500'
                )}>
                  {category.name}
                </p>
                {isRequired && (
                  <p className="text-xs text-neutral-400">Required</p>
                )}
              </div>
              <div className={cn(
                'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                isSelected
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-neutral-300',
                isRequired && 'border-purple-400 bg-purple-400'
              )}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
