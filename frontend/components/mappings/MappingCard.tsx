'use client';

import { useState } from 'react';
import { Link2, FileText, Check, X, Loader2 } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { ControlMapping, PolicyMapping } from '@/lib/types';
import { cn } from '@/lib/utils';

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

  const getConfidenceColor = (percent: number) => {
    if (percent >= 80) return {
      bar: 'bg-gradient-to-r from-green-400 to-green-600',
      text: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
    };
    if (percent >= 60) return {
      bar: 'bg-gradient-to-r from-amber-400 to-amber-600',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
    return {
      bar: 'bg-gradient-to-r from-red-400 to-red-600',
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
    };
  };

  const colors = getConfidenceColor(confidencePercent);
  const Icon = type === 'control' ? Link2 : FileText;

  return (
    <Card className={cn(
      'transition-all duration-200',
      mapping.is_approved && 'border-green-200 bg-green-50/50'
    )}>
      <CardContent>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Type and Confidence badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg',
                type === 'control'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              )}>
                <Icon className="h-3.5 w-3.5" />
                {type}
              </span>
            </div>

            {/* Mapping name */}
            <h4 className="font-semibold text-neutral-900">{name || 'Unknown'}</h4>
            <p className="mt-1.5 text-sm text-neutral-600">
              Maps to: <span className="font-medium text-primary-600">{mapping.subcategory_code}</span>
            </p>

            {/* Confidence meter */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-neutral-500">Confidence</span>
                <span className={cn('text-sm font-bold', colors.text)}>{confidencePercent}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className={cn('h-2 rounded-full transition-all duration-500', colors.bar)}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          {!mapping.is_approved ? (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleAction(true)}
                disabled={loading}
                leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction(false)}
                disabled={loading}
                leftIcon={<X className="h-4 w-4" />}
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
