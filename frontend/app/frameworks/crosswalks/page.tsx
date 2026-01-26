'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, ChevronLeft, Check, X, RefreshCw, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, PageHeader } from '@/components/ui';
import { LoadingPage, ErrorMessage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
  listCrosswalks,
  getCrosswalkStats,
  generateCrosswalks,
  approveCrosswalk,
  rejectCrosswalk,
  listFrameworks,
} from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Crosswalk, CrosswalkStats, Framework, MappingType } from '@/lib/types';
import { cn } from '@/lib/utils';

const mappingTypeColors: Record<MappingType, string> = {
  equivalent: 'bg-green-100 text-green-700',
  partial: 'bg-yellow-100 text-yellow-700',
  related: 'bg-blue-100 text-blue-700',
};

const mappingTypeLabels: Record<MappingType, string> = {
  equivalent: 'Equivalent',
  partial: 'Partial',
  related: 'Related',
};

export default function CrosswalksPage() {
  const userId = useUserId();
  const [crosswalks, setCrosswalks] = useState<Crosswalk[]>([]);
  const [stats, setStats] = useState<CrosswalkStats | null>(null);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [sourceFrameworkId, setSourceFrameworkId] = useState<string>('');
  const [targetFrameworkId, setTargetFrameworkId] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [crosswalksData, statsData, frameworksData] = await Promise.all([
        listCrosswalks({
          sourceFrameworkId: sourceFrameworkId || undefined,
          targetFrameworkId: targetFrameworkId || undefined,
          isApproved: approvalFilter === 'approved' ? true : approvalFilter === 'pending' ? false : undefined,
          mappingType: typeFilter ? (typeFilter as MappingType) : undefined,
        }),
        getCrosswalkStats(),
        listFrameworks(),
      ]);
      setCrosswalks(crosswalksData);
      setStats(statsData);
      setFrameworks(frameworksData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load crosswalks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sourceFrameworkId, targetFrameworkId, approvalFilter, typeFilter]);

  const handleGenerate = async () => {
    if (!sourceFrameworkId || !targetFrameworkId) {
      setError('Please select source and target frameworks');
      return;
    }

    try {
      setGenerating(true);
      await generateCrosswalks(
        {
          source_framework_id: sourceFrameworkId,
          target_framework_id: targetFrameworkId,
        },
        userId ?? undefined
      );
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate crosswalks');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (crosswalkId: string) => {
    if (!userId) return;
    try {
      await approveCrosswalk(crosswalkId, userId);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve crosswalk');
    }
  };

  const handleReject = async (crosswalkId: string) => {
    if (!confirm('Are you sure you want to reject this mapping?')) return;
    try {
      await rejectCrosswalk(crosswalkId);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject crosswalk');
    }
  };

  if (loading) {
    return <LoadingPage message="Loading cross-framework mappings..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/frameworks"
          className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Frameworks
        </Link>
      </div>

      <PageHeader
        title="Cross-Framework Mappings"
        description="AI-powered requirement mappings between compliance frameworks"
        icon={ArrowRightLeft}
      />

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Stats */}
      {stats && (
        <Card className="mb-6 animate-fadeIn">
          <CardContent>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                <p className="text-3xl font-bold gradient-text">{stats.total_crosswalks}</p>
                <p className="text-sm text-neutral-600 mt-1">Total Mappings</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-neutral-600 mt-1">Approved</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                <p className="text-3xl font-bold text-yellow-600">{stats.pending_review}</p>
                <p className="text-sm text-neutral-600 mt-1">Pending Review</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(stats.average_confidence * 100)}%
                </p>
                <p className="text-sm text-neutral-600 mt-1">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Crosswalks */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Source Framework
              </label>
              <select
                value={sourceFrameworkId}
                onChange={(e) => setSourceFrameworkId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select framework...</option>
                {frameworks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Target Framework
              </label>
              <select
                value={targetFrameworkId}
                onChange={(e) => setTargetFrameworkId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select framework...</option>
                {frameworks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={generating || !sourceFrameworkId || !targetFrameworkId}>
              <RefreshCw className={cn('w-4 h-4 mr-2', generating && 'animate-spin')} />
              {generating ? 'Generating...' : 'Generate Mappings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Mapping Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">All</option>
                <option value="equivalent">Equivalent</option>
                <option value="partial">Partial</option>
                <option value="related">Related</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crosswalks List */}
      <Card>
        <CardHeader>
          <CardTitle>Mappings ({crosswalks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {crosswalks.length === 0 ? (
            <p className="text-center text-neutral-500 py-8">
              No crosswalks found. Generate mappings between frameworks to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {crosswalks.map((crosswalk, index) => (
                <div
                  key={crosswalk.id}
                  className={cn(
                    'p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all animate-slideInUp opacity-0',
                    !crosswalk.is_approved && 'border-l-4 border-l-yellow-400'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-sm font-mono rounded">
                        {crosswalk.source_requirement_code}
                      </span>
                      <ArrowRightLeft className="w-4 h-4 text-neutral-400" />
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-sm font-mono rounded">
                        {crosswalk.target_requirement_code}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded',
                          mappingTypeColors[crosswalk.mapping_type]
                        )}
                      >
                        {mappingTypeLabels[crosswalk.mapping_type]}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {Math.round(crosswalk.confidence_score * 100)}% confidence
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {crosswalk.is_approved ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(crosswalk.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(crosswalk.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {crosswalk.reasoning && (
                    <p className="text-sm text-neutral-500 mt-2 pl-2 border-l-2 border-neutral-200">
                      {crosswalk.reasoning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
