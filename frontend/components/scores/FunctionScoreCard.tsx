'use client';

import { useState } from 'react';
import { FunctionScore } from '@/lib/types';
import { Card, CardContent, Button } from '@/components/ui';
import { ScoreExplanation } from './ScoreExplanation';

interface FunctionScoreCardProps {
  score: FunctionScore;
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return 'text-green-600 bg-green-100';
  if (score >= 2.5) return 'text-lime-600 bg-lime-100';
  if (score >= 1.5) return 'text-yellow-600 bg-yellow-100';
  if (score >= 0.5) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

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
  const colorClasses = getScoreColor(score.score);

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-lg font-bold ${colorClasses}`}>
                {score.score.toFixed(1)}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {score.function_code}: {score.function_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {functionDescriptions[score.function_code || ''] || 'CSF Function'}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${colorClasses.split(' ')[1]} rounded-full h-2`}
                  style={{ width: `${(score.score / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide' : 'Details'}
          </Button>
        </div>

        {showExplanation && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ScoreExplanation explanation={score.explanation_payload} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
