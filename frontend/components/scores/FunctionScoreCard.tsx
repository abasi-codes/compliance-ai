'use client';

import { useState } from 'react';
import {
  Shield,
  Search,
  Lock,
  Eye,
  Zap,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { FunctionScore } from '@/lib/types';
import { Card, CardContent, Button } from '@/components/ui';
import { ScoreExplanation } from './ScoreExplanation';
import { cn } from '@/lib/utils';

interface FunctionScoreCardProps {
  score: FunctionScore;
}

function getScoreColor(score: number): { text: string; bg: string; gradient: string } {
  if (score >= 3.5) return { text: 'text-green-600', bg: 'bg-green-100', gradient: 'from-green-400 to-green-600' };
  if (score >= 2.5) return { text: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' };
  if (score >= 1.5) return { text: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-400 to-amber-600' };
  if (score >= 0.5) return { text: 'text-orange-600', bg: 'bg-orange-100', gradient: 'from-orange-400 to-orange-600' };
  return { text: 'text-red-600', bg: 'bg-red-100', gradient: 'from-red-400 to-red-600' };
}

const functionIcons: Record<string, typeof Shield> = {
  GV: Shield,
  ID: Search,
  PR: Lock,
  DE: Eye,
  RS: Zap,
  RC: RotateCcw,
};

const functionDescriptions: Record<string, string> = {
  GV: 'Establish and monitor organizational cybersecurity risk management strategy',
  ID: 'Understand organizational context to manage cybersecurity risk',
  PR: 'Implement appropriate safeguards to ensure delivery of critical services',
  DE: 'Develop and implement activities to identify cybersecurity events',
  RS: 'Develop and implement activities to take action regarding detected events',
  RC: 'Develop and implement activities to maintain resilience and restore capabilities',
};

export function FunctionScoreCard({ score }: FunctionScoreCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const colors = getScoreColor(score.score);
  const Icon = functionIcons[score.function_code || ''] || Shield;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with icon */}
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn('p-3 rounded-xl', colors.bg)}>
                <Icon className={cn('h-6 w-6', colors.text)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-neutral-900 text-lg">
                    {score.function_code}: {score.function_name}
                  </h3>
                  <span className={cn(
                    'px-3 py-1 rounded-lg text-lg font-bold',
                    colors.text,
                    colors.bg
                  )}>
                    {score.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  {functionDescriptions[score.function_code || ''] || 'CSF Function'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div
                className={cn('h-2 rounded-full bg-gradient-to-r', colors.gradient)}
                style={{ width: `${(score.score / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={cn(
            'w-full px-5 py-3 flex items-center justify-between text-sm font-medium',
            'border-t border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50',
            'transition-colors duration-200'
          )}
        >
          <span className="text-neutral-600">
            {showExplanation ? 'Hide Details' : 'View Details'}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-neutral-400 transition-transform duration-200',
              showExplanation && 'rotate-180'
            )}
          />
        </button>

        {showExplanation && (
          <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/30 animate-slideInUp">
            <ScoreExplanation explanation={score.explanation_payload} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
