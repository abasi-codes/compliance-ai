'use client';

import { Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { ActivityEntry } from '@/lib/api/dashboard';

interface ActivityFeedProps {
  activities: ActivityEntry[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAction = (action: string, entityType: string) => {
    const actionMap: Record<string, string> = {
      create: 'created',
      update: 'updated',
      delete: 'deleted',
      approve: 'approved',
      reject: 'rejected',
    };
    const actionText = actionMap[action.toLowerCase()] || action;
    return `${actionText} ${entityType.replace(/_/g, ' ')}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-neutral-500" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-neutral-200" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-sm">
                    <span className="font-medium text-neutral-900">
                      {activity.user_name || 'System'}
                    </span>{' '}
                    <span className="text-neutral-600">
                      {formatAction(activity.action, activity.entity_type)}
                    </span>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {activity.details}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
