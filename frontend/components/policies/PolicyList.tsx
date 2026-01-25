'use client';

import { Policy } from '@/lib/types';
import { Card, CardContent } from '@/components/ui';

interface PolicyListProps {
  policies: Policy[];
  onDelete?: (policyId: string) => void;
}

export function PolicyList({ policies, onDelete }: PolicyListProps) {
  if (policies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No policies uploaded yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {policies.map((policy) => (
        <Card key={policy.id}>
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {policy.name}
                </h3>
                {policy.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {policy.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                  {policy.version && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      v{policy.version}
                    </span>
                  )}
                  {policy.owner && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {policy.owner}
                    </span>
                  )}
                  {policy.content_text && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Text extracted
                    </span>
                  )}
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(policy.id)}
                  className="ml-4 text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
