'use client';

import { useState, useEffect, use } from 'react';
import { Sparkles, Save, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { getAssessment, updateAssessment } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Assessment, AIPromptOverrides } from '@/lib/types';

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function AssessmentSettingsPage({ params }: SettingsPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [mappingPrompt, setMappingPrompt] = useState('');
  const [analysisPrompt, setAnalysisPrompt] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const data = await getAssessment(id, userId);
        setAssessment(data);
        setMappingPrompt(data.ai_prompt_overrides?.mapping_prompt_suffix || '');
        setAnalysisPrompt(data.ai_prompt_overrides?.analysis_prompt_suffix || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const overrides: AIPromptOverrides = {};
      if (mappingPrompt.trim()) overrides.mapping_prompt_suffix = mappingPrompt.trim();
      if (analysisPrompt.trim()) overrides.analysis_prompt_suffix = analysisPrompt.trim();

      const updated = await updateAssessment(id, {
        ai_prompt_overrides: Object.keys(overrides).length > 0 ? overrides : undefined,
      }, userId);
      setAssessment(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {error && <ErrorMessage message={error} />}

      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<Sparkles className="h-5 w-5" />}>AI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Custom AI Prompts</p>
                  <p>
                    Add custom instructions that will be appended to the AI prompts used for
                    document analysis and requirement mapping. This allows you to guide the AI
                    based on your organization's specific context and terminology.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mapping Prompt Addition
              </label>
              <textarea
                value={mappingPrompt}
                onChange={(e) => setMappingPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="e.g., Our organization uses 'information security policy' to refer to data protection controls. Focus on financial regulatory requirements when mapping..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                This text is added to the prompt when mapping controls and policies to framework requirements.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Analysis Prompt Addition
              </label>
              <textarea
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="e.g., When analyzing cross-framework mappings, consider that our SOC 2 controls are primarily focused on cloud infrastructure..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                This text is added to the prompt when analyzing cross-framework mappings and generating crosswalks.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              {success && (
                <span className="text-sm text-green-600 font-medium">Settings saved</span>
              )}
              <Button onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4 mr-1" />
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assessment Info */}
      {assessment && (
        <Card animated>
          <CardHeader variant="gradient">
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Name</p>
                <p className="font-medium text-neutral-900">{assessment.name}</p>
              </div>
              <div>
                <p className="text-neutral-500">Organization</p>
                <p className="font-medium text-neutral-900">{assessment.organization_name}</p>
              </div>
              <div>
                <p className="text-neutral-500">Depth Level</p>
                <p className="font-medium text-neutral-900 capitalize">{assessment.depth_level}</p>
              </div>
              <div>
                <p className="text-neutral-500">Status</p>
                <p className="font-medium text-neutral-900 capitalize">{assessment.status.toLowerCase().replace('_', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
