'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { FrameworkRequirement } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RequirementCardProps {
  requirement: FrameworkRequirement;
  onViewCrosswalks?: (requirementId: string) => void;
  showCrosswalkButton?: boolean;
  depth?: number;
}

const depthColors = [
  'bg-gradient-to-r from-primary-500 to-primary-600',
  'bg-gradient-to-r from-accent-500 to-accent-600',
  'bg-gradient-to-r from-purple-500 to-purple-600',
  'bg-gradient-to-r from-blue-500 to-blue-600',
];

export function RequirementCard({
  requirement,
  onViewCrosswalks,
  showCrosswalkButton = false,
  depth = 0,
}: RequirementCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'p-3 bg-white rounded-lg border border-slate-200 transition-all hover:border-slate-300',
        depth > 0 && 'ml-4 border-l-2 border-l-slate-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'px-2 py-1 text-white text-xs font-medium rounded shrink-0',
              depthColors[depth % depthColors.length]
            )}
          >
            {requirement.code}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900">{requirement.name}</h4>
            {requirement.description && (
              <p className="text-sm text-slate-500 mt-1">{requirement.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {requirement.is_assessable && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
              Assessable
            </span>
          )}
          {showCrosswalkButton && onViewCrosswalks && (
            <button
              onClick={() => onViewCrosswalks(requirement.id)}
              className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
              title="View cross-framework mappings"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          )}
          {requirement.guidance && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronDown
                className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
              />
            </button>
          )}
        </div>
      </div>

      {expanded && requirement.guidance && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-1">Implementation Guidance</p>
          <p className="text-sm text-blue-900">{requirement.guidance}</p>
        </div>
      )}
    </div>
  );
}
