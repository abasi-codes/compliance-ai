'use client';

import { useState, useEffect } from 'react';
import { Boxes, MessageSquare, Loader2, X } from 'lucide-react';
import { getRequirementCluster, getClusterMembers } from '@/lib/api';
import { ClusterMember, ClusterType } from '@/lib/types';
import { cn } from '@/lib/utils';

const clusterTypeColors: Record<ClusterType, string> = {
  semantic: 'bg-blue-100 text-blue-700',
  topic: 'bg-purple-100 text-purple-700',
  interview: 'bg-green-100 text-green-700',
};

interface ClusterViewerProps {
  requirementId: string;
  requirementCode: string;
  onClose?: () => void;
}

export function ClusterViewer({
  requirementId,
  requirementCode,
  onClose,
}: ClusterViewerProps) {
  const [cluster, setCluster] = useState<{
    id: string;
    name: string;
    description: string | null;
    cluster_type: string;
    interview_question: string | null;
  } | null>(null);
  const [members, setMembers] = useState<ClusterMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getRequirementCluster(requirementId);

        if (result.cluster) {
          setCluster(result.cluster);
          const memberData = await getClusterMembers(result.cluster.id);
          setMembers(memberData);
        } else {
          setCluster(null);
          setMembers([]);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cluster');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requirementId]);

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

  if (!cluster) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-neutral-400" />
            <h3 className="font-medium text-neutral-900">
              Cluster for {requirementCode}
            </h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-center text-neutral-500 py-4">
          This requirement is not part of any cluster.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-primary-500" />
          <h3 className="font-medium text-neutral-900">{cluster.name}</h3>
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded',
              clusterTypeColors[cluster.cluster_type as ClusterType] ||
                'bg-neutral-100 text-neutral-600'
            )}
          >
            {cluster.cluster_type}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {cluster.description && (
        <p className="text-sm text-neutral-600 mb-4">{cluster.description}</p>
      )}

      {cluster.interview_question && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <p className="text-xs font-medium text-green-700">Unified Interview Question</p>
          </div>
          <p className="text-sm text-green-900">{cluster.interview_question}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-neutral-500 mb-2">
          Cluster Members ({members.length})
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.requirement_id}
              className={cn(
                'p-2 rounded border text-sm',
                member.requirement_id === requirementId
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-white border-neutral-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'font-mono text-xs px-1.5 py-0.5 rounded',
                    member.requirement_id === requirementId
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {member.requirement_code}
                </span>
                <span className="text-xs text-neutral-400">
                  {Math.round(member.similarity_score * 100)}%
                </span>
              </div>
              <p className="text-neutral-600 mt-1">{member.requirement_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
