'use client';

import { GapListResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';

interface GapsListProps {
  gapData: GapListResponse;
}

const gapTypeLabels: Record<string, { label: string; color: string }> = {
  unmapped_subcategory: { label: 'No Coverage', color: 'bg-red-100 text-red-800' },
  policy_only: { label: 'Policy Only', color: 'bg-yellow-100 text-yellow-800' },
  control_only: { label: 'Control Only', color: 'bg-blue-100 text-blue-800' },
};

export function GapsList({ gapData }: GapsListProps) {
  if (gapData.gaps.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">&#x2713;</div>
        <p className="text-gray-600">Full coverage achieved!</p>
        <p className="text-sm text-gray-500">
          All subcategories have both policy and control mappings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Total Gaps</p>
          <p className="text-2xl font-semibold text-gray-900">{gapData.total_gaps}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">No Coverage</p>
          <p className="text-2xl font-semibold text-red-600">
            {gapData.unmapped_subcategories}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Policy Only</p>
          <p className="text-2xl font-semibold text-yellow-600">{gapData.policy_only_count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Control Only</p>
          <p className="text-2xl font-semibold text-blue-600">{gapData.control_only_count}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 rounded-full h-3"
            style={{ width: `${gapData.coverage_percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {gapData.coverage_percentage.toFixed(1)}% coverage
        </span>
      </div>

      <div className="grid gap-3">
        {gapData.gaps.map((gap) => {
          const typeInfo = gapTypeLabels[gap.gap_type] || {
            label: gap.gap_type,
            color: 'bg-gray-100 text-gray-800',
          };

          return (
            <Card key={gap.subcategory_id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{gap.subcategory_code}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{gap.subcategory_description}</p>
                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                      <span>Function: {gap.function_code}</span>
                      <span>Category: {gap.category_code}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {gap.has_policy && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        Has Policy
                      </span>
                    )}
                    {gap.has_control && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Has Control
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
