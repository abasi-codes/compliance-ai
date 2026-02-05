'use client';

import Link from 'next/link';
import { CheckCircle, GitBranch, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { ActionItem } from '@/lib/api/dashboard';

interface ActionItemsProps {
  items: ActionItem[];
  pendingCount: number;
}

export function ActionItems({ items, pendingCount }: ActionItemsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getItemLink = (item: ActionItem): string => {
    if (item.type === 'mapping_approval') {
      return '/assessments';
    }
    return '/frameworks/crosswalks';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Action Items</CardTitle>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-100 text-accent-700">
              {pendingCount}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-10 w-10 text-success-500 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={getItemLink(item)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    item.type === 'mapping_approval'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-info-50 text-info-600'
                  }`}
                >
                  {item.type === 'mapping_approval' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <GitBranch className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 group-hover:text-primary-600">
                    {item.title}
                  </div>
                  {item.assessment_name && (
                    <div className="text-xs text-neutral-500 truncate">
                      {item.assessment_name}
                    </div>
                  )}
                </div>
                <div className="text-xs text-neutral-400">
                  {formatDate(item.created_at)}
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
