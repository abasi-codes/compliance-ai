'use client';

import { MappingCard } from './MappingCard';
import { ControlMapping, PolicyMapping } from '@/lib/types';

interface MappingsListProps {
  controlMappings: ControlMapping[];
  policyMappings: PolicyMapping[];
  onApproveControl: (mappingId: string, approved: boolean) => Promise<void>;
  onApprovePolicy: (mappingId: string, approved: boolean) => Promise<void>;
}

export function MappingsList({
  controlMappings,
  policyMappings,
  onApproveControl,
  onApprovePolicy,
}: MappingsListProps) {
  const allMappings = [
    ...controlMappings.map((m) => ({ ...m, _type: 'control' as const })),
    ...policyMappings.map((m) => ({ ...m, _type: 'policy' as const })),
  ].sort((a, b) => {
    // Sort by approval status (pending first), then by confidence
    if (a.is_approved !== b.is_approved) {
      return a.is_approved ? 1 : -1;
    }
    return (b.confidence_score || 0) - (a.confidence_score || 0);
  });

  if (allMappings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No mappings generated yet. Click &quot;Generate Mappings&quot; to analyze your controls and policies.
      </div>
    );
  }

  const pendingCount = allMappings.filter((m) => !m.is_approved).length;
  const approvedCount = allMappings.filter((m) => m.is_approved).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <span className="text-gray-600">
          Total: <span className="font-medium">{allMappings.length}</span>
        </span>
        <span className="text-yellow-600">
          Pending: <span className="font-medium">{pendingCount}</span>
        </span>
        <span className="text-green-600">
          Approved: <span className="font-medium">{approvedCount}</span>
        </span>
      </div>

      <div className="grid gap-3">
        {allMappings.map((mapping) => (
          <MappingCard
            key={mapping.id}
            mapping={mapping}
            type={mapping._type}
            onApprove={(approved) =>
              mapping._type === 'control'
                ? onApproveControl(mapping.id, approved)
                : onApprovePolicy(mapping.id, approved)
            }
          />
        ))}
      </div>
    </div>
  );
}
