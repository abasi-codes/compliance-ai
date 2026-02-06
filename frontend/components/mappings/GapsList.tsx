'use client';

import Link from 'next/link';
import { CheckCircle, AlertCircle, FileText, Settings, MessageSquare, ArrowRight } from 'lucide-react';
import { GapListResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface GapsListProps {
  gapData: GapListResponse;
  assessmentId?: string;
}

const gapTypeLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  unmapped_subcategory: {
    label: 'No Coverage',
    bg: 'bg-gradient-to-r from-red-50 to-red-100',
    text: 'text-red-700',
    border: 'border-red-200'
  },
  policy_only: {
    label: 'Policy Only',
    bg: 'bg-gradient-to-r from-amber-50 to-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  control_only: {
    label: 'Control Only',
    bg: 'bg-gradient-to-r from-primary-50 to-primary-100',
    text: 'text-primary-700',
    border: 'border-primary-200'
  },
};

export function GapsList({ gapData, assessmentId }: GapsListProps) {
  if (gapData.gaps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center animate-scaleIn">
          <CheckCircle className="h-10 w-10 text-accent-600" />
        </div>
        <h3 className="text-xl font-semibold gradient-text mb-2">Full Coverage Achieved!</h3>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          All subcategories have both policy and control mappings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-neutral-200">
        <div className="text-center">
          <p className="text-sm text-neutral-500">Total Gaps</p>
          <p className="text-3xl font-bold gradient-text">{gapData.total_gaps}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-500">No Coverage</p>
          <p className="text-3xl font-bold text-red-600">
            {gapData.unmapped_subcategories}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-500">Policy Only</p>
          <p className="text-3xl font-bold text-amber-600">{gapData.policy_only_count}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-500">Control Only</p>
          <p className="text-3xl font-bold text-primary-600">{gapData.control_only_count}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-neutral-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-600 progress-shimmer transition-all duration-500"
            style={{ width: `${gapData.coverage_percentage}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-neutral-700 min-w-[80px] text-right">
          {gapData.coverage_percentage.toFixed(1)}% coverage
        </span>
      </div>

      {/* Gap Cards */}
      <div className="grid gap-3">
        {gapData.gaps.map((gap, index) => {
          const typeInfo = gapTypeLabels[gap.gap_type] || {
            label: gap.gap_type,
            bg: 'bg-neutral-100',
            text: 'text-neutral-700',
            border: 'border-neutral-200'
          };

          return (
            <Card
              key={gap.subcategory_id}
              hover
              className="animate-slideInUp opacity-0"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900">{gap.subcategory_code}</span>
                      <span className={cn(
                        'px-2.5 py-0.5 text-xs font-semibold rounded-full border',
                        typeInfo.bg,
                        typeInfo.text,
                        typeInfo.border
                      )}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">{gap.subcategory_description}</p>
                    <div className="mt-3 flex gap-4 text-xs">
                      <span className="text-neutral-500">
                        <span className="font-medium text-neutral-700">Function:</span> {gap.function_code}
                      </span>
                      <span className="text-neutral-500">
                        <span className="font-medium text-neutral-700">Category:</span> {gap.category_code}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {gap.has_policy && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                        Has Policy
                      </span>
                    )}
                    {gap.has_control && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                        Has Control
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {assessmentId && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap gap-2">
                    {!gap.has_policy && (
                      <Link href={`/assessments/${assessmentId}/policies`}>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Upload Policy
                        </Button>
                      </Link>
                    )}
                    {!gap.has_control && (
                      <Link href={`/assessments/${assessmentId}/controls`}>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-3.5 h-3.5 mr-1" />
                          Upload Control
                        </Button>
                      </Link>
                    )}
                    <Link href={`/assessments/${assessmentId}/interviews`}>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Add Interview
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
