'use client';

import { useState } from 'react';
import { Deviation } from '@/lib/types';
import { Card, CardContent, Button, Textarea } from '@/components/ui';
import { SeverityBadge } from './SeverityBadge';

interface DeviationCardProps {
  deviation: Deviation;
  onUpdateStatus: (deviationId: string, status: string, notes?: string) => Promise<void>;
}

const statusOptions = [
  { value: 'OPEN', label: 'Open', color: 'text-red-600' },
  { value: 'IN_REMEDIATION', label: 'In Remediation', color: 'text-yellow-600' },
  { value: 'RESOLVED', label: 'Resolved', color: 'text-green-600' },
  { value: 'ACCEPTED', label: 'Risk Accepted', color: 'text-blue-600' },
];

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

  return (
    <Card className="border-l-4" style={{ borderLeftColor: getSeverityColor(deviation.severity) }}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <SeverityBadge severity={deviation.severity} size="sm" />
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Risk Score: {deviation.risk_score}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${getStatusStyle(deviation.status)}`}>
                {deviation.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="font-medium text-gray-900">{deviation.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{deviation.subcategory_code}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Less' : 'More'}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="text-sm text-gray-600 mt-1">{deviation.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Impact</h4>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-4 h-4 rounded ${
                        n <= deviation.impact_score ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{deviation.impact_score}/5</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Likelihood</h4>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-4 h-4 rounded ${
                        n <= deviation.likelihood_score ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{deviation.likelihood_score}/5</span>
                </div>
              </div>
            </div>

            {deviation.recommended_remediation && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Recommended Remediation</h4>
                <p className="text-sm text-gray-600 mt-1">{deviation.recommended_remediation}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Update Status</h4>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={saving || deviation.status === option.value}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      deviation.status === option.value
                        ? 'bg-gray-200 text-gray-600 cursor-default'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
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
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(deviation.status)}
                  loading={saving}
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

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return '#dc2626';
    case 'HIGH':
      return '#f97316';
    case 'MEDIUM':
      return '#eab308';
    case 'LOW':
      return '#22c55e';
    default:
      return '#6b7280';
  }
}

function getStatusStyle(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'bg-red-100 text-red-800';
    case 'IN_REMEDIATION':
      return 'bg-yellow-100 text-yellow-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
