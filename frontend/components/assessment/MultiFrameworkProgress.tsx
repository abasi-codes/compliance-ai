'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, BarChart3, ArrowRight } from 'lucide-react';
import {
  getAssessmentScope,
  listFrameworks,
  getFrameworkStats,
} from '@/lib/api';
import { Framework, AssessmentScope, FrameworkStats } from '@/lib/types';
import { cn } from '@/lib/utils';

const frameworkTypeColors: Record<string, string> = {
  nist_csf: 'bg-blue-500',
  iso_27001: 'bg-green-500',
  soc2_tsc: 'bg-purple-500',
  custom: 'bg-orange-500',
};

interface MultiFrameworkProgressProps {
  assessmentId: string;
  scores?: Record<string, number | null>; // framework_id -> score
}

interface FrameworkProgressItem {
  framework: Framework;
  stats?: FrameworkStats;
  score?: number | null;
}

export function MultiFrameworkProgress({
  assessmentId,
  scores = {},
}: MultiFrameworkProgressProps) {
  const [items, setItems] = useState<FrameworkProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scope, allFrameworks] = await Promise.all([
          getAssessmentScope(assessmentId),
          listFrameworks(),
        ]);

        const frameworkIds = scope.map((s) => s.framework_id);
        const scopedFrameworks = allFrameworks.filter((f) =>
          frameworkIds.includes(f.id)
        );

        // Fetch stats for each framework
        const statsPromises = scopedFrameworks.map((f) =>
          getFrameworkStats(f.id).catch(() => null)
        );
        const allStats = await Promise.all(statsPromises);

        const progressItems: FrameworkProgressItem[] = scopedFrameworks.map(
          (framework, index) => ({
            framework,
            stats: allStats[index] || undefined,
            score: scores[framework.id],
          })
        );

        setItems(progressItems);
      } catch (err) {
        console.error('Failed to load framework progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, scores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-neutral-400">
        <Layers className="w-5 h-5 animate-pulse mr-2" />
        Loading framework progress...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-500">No frameworks in scope</p>
        <Link
          href={`/assessments/${assessmentId}/scope`}
          className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-flex items-center gap-1"
        >
          Configure scope <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const scorePercent = item.score !== null && item.score !== undefined
          ? (item.score / 4) * 100
          : 0;

        return (
          <div
            key={item.framework.id}
            className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    frameworkTypeColors[item.framework.framework_type] || 'bg-neutral-500'
                  )}
                />
                <span className="font-medium text-neutral-900">
                  {item.framework.name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {item.stats && (
                  <span className="text-neutral-500">
                    {item.stats.assessable_requirements} requirements
                  </span>
                )}
                {item.score !== null && item.score !== undefined && (
                  <span className="font-semibold text-neutral-900">
                    {item.score.toFixed(1)}/4.0
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  frameworkTypeColors[item.framework.framework_type] || 'bg-neutral-500',
                  item.score === null || item.score === undefined ? 'opacity-30' : ''
                )}
                style={{
                  width: item.score !== null && item.score !== undefined
                    ? `${scorePercent}%`
                    : '0%',
                }}
              />
            </div>

            {item.score === null || item.score === undefined ? (
              <p className="text-xs text-neutral-400 mt-2">Score not yet calculated</p>
            ) : (
              <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
                <span>
                  {scorePercent < 25
                    ? 'Initial'
                    : scorePercent < 50
                      ? 'Developing'
                      : scorePercent < 75
                        ? 'Defined'
                        : scorePercent < 90
                          ? 'Managed'
                          : 'Optimized'}
                </span>
                <span>{Math.round(scorePercent)}% maturity</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
