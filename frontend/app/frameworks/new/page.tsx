'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Layers, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createFramework } from '@/lib/api';
import { FrameworkUploader } from '@/components/frameworks';
import { cn } from '@/lib/utils';

export default function NewFrameworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('upload');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    version: '1.0',
    description: '',
    hierarchy_levels: 3,
    hierarchy_labels: ['Category', 'Subcategory', 'Control'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.code.trim()) {
      setError('Framework code is required');
      return;
    }
    if (!formData.name.trim()) {
      setError('Framework name is required');
      return;
    }

    try {
      setLoading(true);
      await createFramework({
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        version: formData.version.trim(),
        description: formData.description.trim() || undefined,
        hierarchy_levels: formData.hierarchy_levels,
        hierarchy_labels: formData.hierarchy_labels.filter(l => l.trim()),
      });
      router.push('/frameworks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create framework');
    } finally {
      setLoading(false);
    }
  };

  const updateHierarchyLevel = (index: number, value: string) => {
    const newLabels = [...formData.hierarchy_labels];
    newLabels[index] = value;
    setFormData({ ...formData, hierarchy_labels: newLabels });
  };

  const handleLevelCountChange = (count: number) => {
    const newLabels = [...formData.hierarchy_labels];
    while (newLabels.length < count) {
      newLabels.push(`Level ${newLabels.length + 1}`);
    }
    while (newLabels.length > count) {
      newLabels.pop();
    }
    setFormData({
      ...formData,
      hierarchy_levels: count,
      hierarchy_labels: newLabels,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/frameworks"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Frameworks
        </Link>
      </div>

      <PageHeader
        title="Create Custom Framework"
        description="Define a new compliance framework for your organization"
        icon={Layers}
      />

      {/* Tab Navigation */}
      <div className="mt-6 border-b border-neutral-200">
        <nav className="-mb-px flex space-x-4">
          {[
            { id: 'upload' as const, label: 'Upload Document', icon: Upload },
            { id: 'manual' as const, label: 'Manual Setup', icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upload Framework Document</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500 mb-4">
              Upload a spreadsheet (XLSX, CSV) or document (PDF, DOCX) containing your framework
              requirements. We'll parse the content and create a structured framework.
            </p>
            <FrameworkUploader
              onComplete={(frameworkId) => router.push(`/frameworks/${frameworkId}`)}
            />
          </CardContent>
        </Card>
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Framework Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Framework Code *
                </label>
                <Input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CUSTOM-SEC"
                  className="uppercase"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  A unique identifier for this framework
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Version *
                </label>
                <Input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g., 1.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Framework Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Custom Security Framework"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose and scope of this framework..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Hierarchy Levels
              </label>
              <select
                value={formData.hierarchy_levels}
                onChange={(e) => handleLevelCountChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} level{n !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                How many levels deep your requirements hierarchy goes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Hierarchy Labels
              </label>
              <div className="space-y-2">
                {formData.hierarchy_labels.map((label, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-20">Level {index + 1}:</span>
                    <Input
                      type="text"
                      value={label}
                      onChange={(e) => updateHierarchyLevel(index, e.target.value)}
                      placeholder={`Label for level ${index + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Names for each level (e.g., Domain, Category, Control)
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Link href="/frameworks">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Framework'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
