'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Check, X, Loader2 } from 'lucide-react';
import { getRequirementCrosswalks, approveCrosswalk, rejectCrosswalk } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { MappingType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CrosswalkMapping {
  id: string;
  source_requirement_id: string;
  source_requirement_code: string | null;
  target_requirement_id: string;
  target_requirement_code: string | null;
  mapping_type: string;
  confidence_score: number;
  is_approved: boolean;
  direction: 'source' | 'target';
}

const mappingTypeColors: Record<MappingType, string> = {
  equivalent: 'bg-green-100 text-green-700',
  partial: 'bg-yellow-100 text-yellow-700',
  related: 'bg-blue-100 text-blue-700',
};

interface CrosswalkViewerProps {
  requirementId: string;
  requirementCode: string;
  onClose?: () => void;
}

export function CrosswalkViewer({
  requirementId,
  requirementCode,
  onClose,
}: CrosswalkViewerProps) {
  const userId = useUserId();
  const [mappings, setMappings] = useState<CrosswalkMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const data = await getRequirementCrosswalks(requirementId);
      setMappings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mappings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, [requirementId]);

  const handleApprove = async (mappingId: string) => {
    if (!userId) return;
    try {
      await approveCrosswalk(mappingId, userId);
      await fetchMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (mappingId: string) => {
    try {
      await rejectCrosswalk(mappingId);
      await fetchMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-sm">{error}</div>;
  }

  const sourceOf = mappings.filter((m) => m.direction === 'source');
  const targetOf = mappings.filter((m) => m.direction === 'target');

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-primary-500" />
          <h3 className="font-medium text-slate-900">
            Cross-Framework Mappings for {requirementCode}
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {mappings.length === 0 ? (
        <p className="text-center text-slate-500 py-4">
          No cross-framework mappings found for this requirement.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Maps to other requirements */}
          {sourceOf.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Maps to ({sourceOf.length})
              </p>
              <div className="space-y-2">
                {sourceOf.map((mapping) => (
                  <MappingRow
                    key={mapping.id}
                    mapping={mapping}
                    targetCode={mapping.target_requirement_code}
                    onApprove={() => handleApprove(mapping.id)}
                    onReject={() => handleReject(mapping.id)}
                    showActions={!mapping.is_approved && !!userId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mapped from other requirements */}
          {targetOf.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Mapped from ({targetOf.length})
              </p>
              <div className="space-y-2">
                {targetOf.map((mapping) => (
                  <MappingRow
                    key={mapping.id}
                    mapping={mapping}
                    targetCode={mapping.source_requirement_code}
                    onApprove={() => handleApprove(mapping.id)}
                    onReject={() => handleReject(mapping.id)}
                    showActions={!mapping.is_approved && !!userId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MappingRowProps {
  mapping: CrosswalkMapping;
  targetCode: string | null;
  onApprove: () => void;
  onReject: () => void;
  showActions: boolean;
}

function MappingRow({
  mapping,
  targetCode,
  onApprove,
  onReject,
  showActions,
}: MappingRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 rounded border',
        mapping.is_approved ? 'bg-white border-slate-200' : 'bg-yellow-50 border-yellow-200'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-sm font-mono rounded">
          {targetCode || 'Unknown'}
        </span>
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded',
            mappingTypeColors[mapping.mapping_type as MappingType] ||
              'bg-slate-100 text-slate-600'
          )}
        >
          {mapping.mapping_type}
        </span>
        <span className="text-xs text-slate-400">
          {Math.round(mapping.confidence_score * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        {mapping.is_approved ? (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
            <Check className="w-3 h-3" />
            Approved
          </span>
        ) : showActions ? (
          <>
            <button
              onClick={onApprove}
              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onReject}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Reject"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
            Pending
          </span>
        )}
      </div>
    </div>
  );
}
