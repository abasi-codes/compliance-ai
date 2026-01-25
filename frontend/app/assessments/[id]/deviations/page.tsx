'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/ui';
import { DeviationCard, DeviationFilters } from '@/components/deviations';
import { detectDeviations, listDeviations, updateDeviation } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { DeviationListResponse } from '@/lib/types';

interface DeviationsPageProps {
  params: Promise<{ id: string }>;
}

export default function DeviationsPage({ params }: DeviationsPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [data, setData] = useState<DeviationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDeviations = async () => {
    if (!userId) return;

    try {
      const result = await listDeviations(
        id,
        { severity: severityFilter || undefined, status: statusFilter || undefined },
        userId
      );
      setData(result);
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDeviations();
    }
  }, [id, userId, severityFilter, statusFilter]);

  const handleDetect = async () => {
    if (!userId) return;

    setDetecting(true);
    setError(null);

    try {
      const result = await detectDeviations(id, userId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect deviations');
    } finally {
      setDetecting(false);
    }
  };

  const handleUpdateStatus = async (deviationId: string, status: string, notes?: string) => {
    if (!userId || !data) return;

    await updateDeviation(deviationId, { status, remediation_notes: notes }, userId);
    setData({
      ...data,
      items: data.items.map((d) =>
        d.id === deviationId ? { ...d, status, remediation_notes: notes || d.remediation_notes } : d
      ),
    });
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
            <CardTitle>Deviations & Risk</CardTitle>
            <Button onClick={handleDetect} loading={detecting}>
              {data && data.total > 0 ? 'Re-detect Deviations' : 'Detect Deviations'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Deviations identify gaps between your current security posture and NIST CSF 2.0
            requirements. Each deviation is risk-ranked based on impact and likelihood.
          </p>
          {error && <ErrorMessage message={error} className="mt-4" />}
        </CardContent>
      </Card>

      {data && data.total > 0 && (
        <>
          <Card>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{data.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{data.by_severity.CRITICAL || 0}</p>
                  <p className="text-sm text-gray-500">Critical</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{data.by_severity.HIGH || 0}</p>
                  <p className="text-sm text-gray-500">High</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{data.by_severity.MEDIUM || 0}</p>
                  <p className="text-sm text-gray-500">Medium</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{data.by_severity.LOW || 0}</p>
                  <p className="text-sm text-gray-500">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <DeviationFilters
                severity={severityFilter}
                status={statusFilter}
                onSeverityChange={setSeverityFilter}
                onStatusChange={setStatusFilter}
                counts={{ by_severity: data.by_severity, by_status: data.by_status }}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {data.items.map((deviation) => (
              <DeviationCard
                key={deviation.id}
                deviation={deviation}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </>
      )}

      {(!data || data.total === 0) && (
        <EmptyState
          title="No deviations detected"
          description="Run deviation detection to identify gaps in your security posture"
          action={{
            label: 'Detect Deviations',
            onClick: handleDetect,
          }}
        />
      )}
    </div>
  );
}
