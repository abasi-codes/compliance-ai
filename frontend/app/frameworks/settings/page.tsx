'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ChevronLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, PageHeader } from '@/components/ui';
import { LoadingPage, ErrorMessage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
  listFrameworks,
  getCompanyFrameworks,
  addCompanyFramework,
  removeCompanyFramework,
} from '@/lib/api';
import { Framework, CompanyFramework } from '@/lib/types';
import { cn } from '@/lib/utils';

const frameworkTypeColors: Record<string, string> = {
  nist_csf: 'from-blue-500 to-blue-600',
  iso_27001: 'from-green-500 to-green-600',
  soc2_tsc: 'from-purple-500 to-purple-600',
  custom: 'from-orange-500 to-orange-600',
};

const frameworkTypeLabels: Record<string, string> = {
  nist_csf: 'NIST CSF',
  iso_27001: 'ISO 27001',
  soc2_tsc: 'SOC 2',
  custom: 'Custom',
};

// For demo purposes, using a fixed organization name
const ORGANIZATION_NAME = 'default';

export default function FrameworkSettingsPage() {
  const [allFrameworks, setAllFrameworks] = useState<Framework[]>([]);
  const [companyFrameworks, setCompanyFrameworks] = useState<CompanyFramework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [frameworksData, companyData] = await Promise.all([
        listFrameworks(),
        getCompanyFrameworks(ORGANIZATION_NAME),
      ]);
      setAllFrameworks(frameworksData);
      setCompanyFrameworks(companyData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFramework = async () => {
    if (!selectedFrameworkId) return;

    try {
      setAdding(true);
      await addCompanyFramework(ORGANIZATION_NAME, {
        framework_id: selectedFrameworkId,
        priority: companyFrameworks.length,
      });
      setSelectedFrameworkId('');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add framework');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveFramework = async (frameworkId: string) => {
    if (!confirm('Are you sure you want to remove this framework from your selection?')) {
      return;
    }

    try {
      await removeCompanyFramework(ORGANIZATION_NAME, frameworkId);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove framework');
    }
  };

  // Get frameworks not yet selected
  const availableFrameworks = allFrameworks.filter(
    (f) => !companyFrameworks.some((cf) => cf.framework_id === f.id)
  );

  // Get full framework details for selected frameworks
  const selectedFrameworksWithDetails = companyFrameworks
    .sort((a, b) => a.priority - b.priority)
    .map((cf) => ({
      ...cf,
      framework: allFrameworks.find((f) => f.id === cf.framework_id),
    }));

  if (loading) {
    return <LoadingPage message="Loading framework settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/frameworks"
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Frameworks
        </Link>
      </div>

      <PageHeader
        title="Company Frameworks"
        description="Configure which compliance frameworks your organization uses for assessments"
        icon={Settings}
      />

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Add Framework */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <select
                value={selectedFrameworkId}
                onChange={(e) => setSelectedFrameworkId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={availableFrameworks.length === 0}
              >
                <option value="">
                  {availableFrameworks.length === 0
                    ? 'All frameworks already selected'
                    : 'Select a framework to add...'}
                </option>
                {availableFrameworks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({frameworkTypeLabels[f.framework_type] || 'Custom'})
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAddFramework} disabled={adding || !selectedFrameworkId}>
              <Plus className="w-4 h-4 mr-2" />
              {adding ? 'Adding...' : 'Add Framework'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Frameworks */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Frameworks ({companyFrameworks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {companyFrameworks.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No frameworks selected. Add frameworks above to get started with multi-framework
              assessments.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedFrameworksWithDetails.map((cf, index) => (
                <div
                  key={cf.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all animate-slideInUp opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {cf.framework && (
                        <span
                          className={cn(
                            'px-2 py-1 text-white text-xs font-semibold rounded bg-gradient-to-r',
                            frameworkTypeColors[cf.framework.framework_type] ||
                              frameworkTypeColors.custom
                          )}
                        >
                          {frameworkTypeLabels[cf.framework.framework_type] || 'Custom'}
                        </span>
                      )}
                      <span className="font-medium text-slate-900">
                        {cf.framework_name || cf.framework?.name || 'Unknown Framework'}
                      </span>
                    </div>
                    {cf.notes && <p className="text-sm text-slate-500 mt-1">{cf.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 text-xs rounded',
                        cf.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {cf.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFramework(cf.framework_id)}
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">About Multi-Framework Assessments</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              - Selected frameworks will be available when creating new assessments
            </li>
            <li>
              - AI-powered clustering groups similar requirements across frameworks to reduce
              interview burden
            </li>
            <li>
              - Cross-framework mappings help you understand equivalencies between different
              standards
            </li>
            <li>- Framework priority affects display order in assessments and reports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
