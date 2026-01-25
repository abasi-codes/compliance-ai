'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { ControlMapping, PolicyMapping } from '@/lib/types';

interface MappingCardProps {
  mapping: ControlMapping | PolicyMapping;
  type: 'control' | 'policy';
  onApprove: (approved: boolean) => Promise<void>;
}

export function MappingCard({ mapping, type, onApprove }: MappingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (approved: boolean) => {
    setLoading(true);
    try {
      await onApprove(approved);
    } finally {
      setLoading(false);
    }
  };

  const name = type === 'control'
    ? (mapping as ControlMapping).control_name
    : (mapping as PolicyMapping).policy_name;

  const confidencePercent = mapping.confidence_score
    ? Math.round(mapping.confidence_score * 100)
    : 0;

  const confidenceColor =
    confidencePercent >= 80
      ? 'bg-green-100 text-green-800'
      : confidencePercent >= 60
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  return (
    <Card className={mapping.is_approved ? 'border-green-200 bg-green-50' : ''}>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  type === 'control' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {type}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${confidenceColor}`}>
                {confidencePercent}% confidence
              </span>
            </div>
            <h4 className="mt-2 font-medium text-gray-900">{name || 'Unknown'}</h4>
            <p className="mt-1 text-sm text-gray-600">
              Maps to: <span className="font-medium">{mapping.subcategory_code}</span>
            </p>
          </div>

          {!mapping.is_approved && (
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleAction(true)}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction(false)}
                disabled={loading}
              >
                Reject
              </Button>
            </div>
          )}

          {mapping.is_approved && (
            <span className="text-sm text-green-600 font-medium">Approved</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
