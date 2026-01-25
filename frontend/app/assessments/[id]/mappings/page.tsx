'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { MappingsList, GapsList } from '@/components/mappings';
import {
  generateMappings,
  listControlMappings,
  listPolicyMappings,
  approveMapping,
  rejectMapping,
  getGaps,
} from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { ControlMapping, PolicyMapping, GapListResponse } from '@/lib/types';

interface MappingsPageProps {
  params: Promise<{ id: string }>;
}

export default function MappingsPage({ params }: MappingsPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [controlMappings, setControlMappings] = useState<ControlMapping[]>([]);
  const [policyMappings, setPolicyMappings] = useState<PolicyMapping[]>([]);
  const [gapData, setGapData] = useState<GapListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mappings' | 'gaps'>('mappings');

  const fetchData = async () => {
    if (!userId) return;

    try {
      const [controls, policies, gaps] = await Promise.all([
        listControlMappings(id, userId).catch(() => []),
        listPolicyMappings(id, userId).catch(() => []),
        getGaps(id, userId).catch(() => null),
      ]);
      setControlMappings(controls);
      setPolicyMappings(policies);
      setGapData(gaps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mappings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [id, userId]);

  const handleGenerate = async () => {
    if (!userId) return;

    setGenerating(true);
    setError(null);

    try {
      await generateMappings(id, {}, userId);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate mappings');
    } finally {
      setGenerating(false);
    }
  };

  const handleApproveControl = async (mappingId: string, approved: boolean) => {
    if (!userId) return;

    if (approved) {
      await approveMapping(mappingId, userId);
    } else {
      await rejectMapping(mappingId, userId);
    }
    setControlMappings(
      controlMappings.map((m) =>
        m.id === mappingId ? { ...m, is_approved: approved } : m
      )
    );
  };

  const handleApprovePolicy = async (mappingId: string, approved: boolean) => {
    if (!userId) return;

    if (approved) {
      await approveMapping(mappingId, userId);
    } else {
      await rejectMapping(mappingId, userId);
    }
    setPolicyMappings(
      policyMappings.map((m) =>
        m.id === mappingId ? { ...m, is_approved: approved } : m
      )
    );
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
          <div className="flex justify-between items-center">
            <CardTitle>AI Mapping Generation</CardTitle>
            <Button onClick={handleGenerate} loading={generating}>
              {controlMappings.length + policyMappings.length > 0
                ? 'Regenerate Mappings'
                : 'Generate Mappings'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Generate AI-powered mappings between your controls/policies and NIST CSF 2.0
            subcategories. Review and approve each suggestion to confirm the mappings.
          </p>
          {error && <ErrorMessage message={error} className="mt-4" />}
        </CardContent>
      </Card>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mappings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mappings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mappings ({controlMappings.length + policyMappings.length})
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'gaps'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Coverage Gaps {gapData && `(${gapData.total_gaps})`}
          </button>
        </nav>
      </div>

      {activeTab === 'mappings' ? (
        <Card>
          <CardContent>
            <MappingsList
              controlMappings={controlMappings}
              policyMappings={policyMappings}
              onApproveControl={handleApproveControl}
              onApprovePolicy={handleApprovePolicy}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            {gapData ? (
              <GapsList gapData={gapData} />
            ) : (
              <p className="text-center py-8 text-gray-500">
                Generate mappings first to analyze coverage gaps.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
