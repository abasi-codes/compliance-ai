'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2, XCircle, Save } from 'lucide-react';
import { Deviation } from '@/lib/types';
import { Card, CardContent, Button, Textarea } from '@/components/ui';
import { SeverityBadge } from './SeverityBadge';
import { cn } from '@/lib/utils';

interface DeviationCardProps {
  deviation: Deviation;
  onUpdateStatus: (deviationId: string, status: string, notes?: string) => Promise<void>;
}

const statusOptions = [
  { value: 'OPEN', label: 'Open', styles: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'IN_REMEDIATION', label: 'In Remediation', styles: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'RESOLVED', label: 'Resolved', styles: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'ACCEPTED', label: 'Risk Accepted', styles: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
];

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return 'border-l-red-600';
    case 'HIGH': return 'border-l-orange-500';
    case 'MEDIUM': return 'border-l-amber-500';
    case 'LOW': return 'border-l-green-500';
    default: return 'border-l-slate-400';
  }
}

function getStatusStyle(status: string): string {
  switch (status) {
    case 'OPEN': return 'bg-red-100 text-red-800';
    case 'IN_REMEDIATION': return 'bg-amber-100 text-amber-800';
    case 'RESOLVED': return 'bg-green-100 text-green-800';
    case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
    default: return 'bg-slate-100 text-slate-800';
  }
}

export function DeviationCard({ deviation, onUpdateStatus }: DeviationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(deviation.remediation_notes || '');
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    try {
      await onUpdateStatus(deviation.id, newStatus, notes);
    } finally {
      setSaving(false);
    }
  };

  const riskScorePercent = (deviation.risk_score / 25) * 100;

  return (
    <Card className={cn('border-l-4 overflow-hidden', getSeverityColor(deviation.severity))}>
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <SeverityBadge severity={deviation.severity} size="sm" />
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700">
                  Risk Score: <span className="ml-1 font-bold">{deviation.risk_score}</span>
                </span>
                <span className={cn('px-2.5 py-1 text-xs font-medium rounded-lg', getStatusStyle(deviation.status))}>
                  {deviation.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">{deviation.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{deviation.subcategory_code}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {expanded ? 'Less' : 'More'}
              <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
            </button>
          </div>

          {/* Risk score visualization */}
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  deviation.severity === 'CRITICAL' ? 'bg-red-500' :
                  deviation.severity === 'HIGH' ? 'bg-orange-500' :
                  deviation.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'
                )}
                style={{ width: `${riskScorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-5 animate-slideInUp">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
              <p className="text-sm text-slate-600">{deviation.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Impact</h4>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors',
                        n <= deviation.impact_score
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      )}
                    >
                      {n}
                    </div>
                  ))}
                  <span className="text-sm text-slate-600 ml-2 font-medium">{deviation.impact_score}/5</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Likelihood</h4>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors',
                        n <= deviation.likelihood_score
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      )}
                    >
                      {n}
                    </div>
                  ))}
                  <span className="text-sm text-slate-600 ml-2 font-medium">{deviation.likelihood_score}/5</span>
                </div>
              </div>
            </div>

            {deviation.recommended_remediation && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Recommended Remediation</h4>
                <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  {deviation.recommended_remediation}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h4>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={saving || deviation.status === option.value}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      deviation.status === option.value
                        ? 'bg-slate-200 text-slate-500 cursor-default'
                        : option.styles
                    )}
                  >
                    {deviation.status === option.value ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : null}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Textarea
                label="Remediation Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document remediation actions taken..."
                rows={3}
              />
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(deviation.status)}
                  loading={saving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
