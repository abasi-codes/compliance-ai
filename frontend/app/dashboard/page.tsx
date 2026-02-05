'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Layers } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  ComplianceOverview,
  FrameworkCoverage,
  RiskSnapshot,
  RecentAssessments,
  ActionItems,
  ActivityFeed,
} from '@/components/dashboard';
import { getDashboardSummary, type DashboardSummary } from '@/lib/api/dashboard';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadDashboard();
    }
  }, [authLoading, isAuthenticated]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const summary = await getDashboardSummary();
      setData(summary);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-neutral-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-neutral-200 rounded-xl" />
            <div className="h-64 bg-neutral-200 rounded-xl" />
            <div className="h-64 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-6 text-center">
          <p className="text-danger-700">{error}</p>
          <Button onClick={loadDashboard} variant="secondary" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your compliance posture across all frameworks"
        icon={Layers}
        actions={
          <Link href="/assessments/new">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              New Assessment
            </Button>
          </Link>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-neutral-500 mb-1">Total Assessments</div>
            <div className="text-3xl font-bold text-neutral-900">
              {data.total_assessments}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-neutral-500 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-primary-600">
              {data.assessments_by_status.in_progress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-neutral-500 mb-1">Open Deviations</div>
            <div className="text-3xl font-bold text-warning-600">
              {data.open_deviations}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-neutral-500 mb-1">Pending Approvals</div>
            <div className="text-3xl font-bold text-accent-600">
              {data.pending_approvals}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column - 1/3 */}
        <div className="space-y-6">
          <ComplianceOverview
            score={data.overall_maturity_score}
            trend={data.overall_maturity_trend}
          />
          <RiskSnapshot summary={data.deviation_summary} />
        </div>

        {/* Middle column - 1/3 */}
        <div className="space-y-6">
          <FrameworkCoverage frameworks={data.framework_coverage} />
          <ActionItems
            items={data.action_items}
            pendingCount={data.pending_approvals}
          />
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">
          <RecentAssessments assessments={data.recent_assessments} />
          <ActivityFeed activities={data.recent_activity} />
        </div>
      </div>

      {/* Empty state for new users */}
      {data.total_assessments === 0 && (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Get started with your first assessment
            </h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              Create a compliance assessment to evaluate your organization against
              NIST CSF, ISO 27001, SOC 2, or custom frameworks.
            </p>
            <Link href="/assessments/new">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Create Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
