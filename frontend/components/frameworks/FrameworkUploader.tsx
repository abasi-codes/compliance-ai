'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, FileText, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { uploadFrameworkPreview, confirmFrameworkUpload } from '@/lib/api';
import { cn } from '@/lib/utils';

interface FrameworkUploaderProps {
  onComplete: (frameworkId: string) => void;
}

type Step = 'upload' | 'mapping' | 'preview' | 'metadata';

interface ParsedRequirement {
  code: string;
  name: string;
  description: string;
  parent: string;
  guidance: string;
}

export function FrameworkUploader({ onComplete }: FrameworkUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Upload result
  const [headers, setHeaders] = useState<string[]>([]);
  const [suggestedMapping, setSuggestedMapping] = useState<Record<string, string>>({});
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [requirements, setRequirements] = useState<ParsedRequirement[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [fileType, setFileType] = useState<string>('');

  // Metadata
  const [frameworkCode, setFrameworkCode] = useState('');
  const [frameworkName, setFrameworkName] = useState('');
  const [frameworkVersion, setFrameworkVersion] = useState('1.0');
  const [frameworkDescription, setFrameworkDescription] = useState('');

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setUploading(true);

    try {
      const result = await uploadFrameworkPreview(selectedFile);
      setHeaders(result.headers);
      setSuggestedMapping(result.suggested_mapping);
      setColumnMapping(result.suggested_mapping);
      setRequirements(result.requirements);
      setTotalAvailable(result.total_available);
      setFileType(result.file_type);

      // Auto-generate metadata from filename
      const nameWithoutExt = selectedFile.name.replace(/\.[^.]+$/, '');
      setFrameworkCode(nameWithoutExt.toUpperCase().replace(/\s+/g, '-').substring(0, 50));
      setFrameworkName(nameWithoutExt.replace(/[-_]/g, ' '));

      if (result.file_type === 'spreadsheet' && result.headers.length > 0) {
        setStep('mapping');
      } else {
        setStep('preview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemapColumns = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const result = await uploadFrameworkPreview(file, columnMapping);
      setRequirements(result.requirements);
      setTotalAvailable(result.total_available);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-parse with mapping');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError(null);

    try {
      const framework = await confirmFrameworkUpload({
        code: frameworkCode,
        name: frameworkName,
        version: frameworkVersion,
        description: frameworkDescription || undefined,
        requirements,
      });
      onComplete(framework.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create framework');
    } finally {
      setSaving(false);
    }
  };

  const mappingFields = ['code', 'name', 'description', 'parent', 'guidance'];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: File Upload */}
      {step === 'upload' && (
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
            'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls,.pdf,.docx,.doc,.txt,.md"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
          {uploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
                <Upload className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm text-neutral-600">Parsing document...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Supports XLSX, CSV, PDF, DOCX, TXT, MD
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <FileSpreadsheet className="w-4 h-4" />
                  Spreadsheets
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <FileText className="w-4 h-4" />
                  Documents
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Column Mapping (spreadsheets only) */}
      {step === 'mapping' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-neutral-900 mb-1">Column Mapping</h3>
            <p className="text-sm text-neutral-500">
              Map your spreadsheet columns to requirement fields. We've auto-detected what we could.
            </p>
          </div>

          <div className="grid gap-3">
            {mappingFields.map((field) => (
              <div key={field} className="flex items-center gap-3">
                <label className="text-sm font-medium text-neutral-700 w-24 capitalize">
                  {field}
                </label>
                <div className="relative flex-1">
                  <select
                    value={columnMapping[field] || ''}
                    onChange={(e) =>
                      setColumnMapping({ ...columnMapping, [field]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm appearance-none"
                  >
                    <option value="">-- Not mapped --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStep('upload')}>
              Back
            </Button>
            <Button onClick={handleRemapColumns} loading={uploading}>
              Apply Mapping
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-neutral-900 mb-1">Requirements Preview</h3>
              <p className="text-sm text-neutral-500">
                {totalAvailable} requirements parsed from {file?.name}
              </p>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border border-neutral-200 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600">Code</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600">Parent</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {requirements.slice(0, 50).map((req, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 font-mono text-xs text-primary-600">
                      {req.code || '-'}
                    </td>
                    <td className="px-3 py-2 text-neutral-900">{req.name || '-'}</td>
                    <td className="px-3 py-2 text-neutral-500 font-mono text-xs">
                      {req.parent || '-'}
                    </td>
                    <td className="px-3 py-2 text-neutral-500 max-w-xs truncate">
                      {req.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requirements.length > 50 && (
              <p className="text-xs text-neutral-500 text-center py-2 bg-neutral-50">
                Showing 50 of {totalAvailable} requirements
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setStep(fileType === 'spreadsheet' ? 'mapping' : 'upload')}
            >
              Back
            </Button>
            <Button onClick={() => setStep('metadata')}>
              Continue
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Framework Metadata */}
      {step === 'metadata' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-neutral-900 mb-1">Framework Details</h3>
            <p className="text-sm text-neutral-500">
              Name and configure the new framework before saving.
            </p>
          </div>

          <Input
            label="Framework Code"
            required
            value={frameworkCode}
            onChange={(e) => setFrameworkCode(e.target.value)}
            placeholder="e.g., CUSTOM-SOX-2024"
          />

          <Input
            label="Framework Name"
            required
            value={frameworkName}
            onChange={(e) => setFrameworkName(e.target.value)}
            placeholder="e.g., SOX Compliance Framework"
          />

          <Input
            label="Version"
            value={frameworkVersion}
            onChange={(e) => setFrameworkVersion(e.target.value)}
            placeholder="1.0"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={frameworkDescription}
              onChange={(e) => setFrameworkDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Brief description of this framework..."
            />
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600">
              <span className="font-medium">{totalAvailable}</span> requirements will be imported from{' '}
              <span className="font-medium">{file?.name}</span>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStep('preview')}>
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              loading={saving}
              disabled={!frameworkCode || !frameworkName}
            >
              <Check className="w-4 h-4 mr-1" />
              Create Framework
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
