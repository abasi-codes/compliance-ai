'use client';

import { useState, useEffect, use } from 'react';
import { BarChart3, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/ui';
import { ScoreSummary, FunctionScoreCard } from '@/components/scores';
import { calculateScores, getScoreSummary } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { ScoreSummary as ScoreSummaryType } from '@/lib/types';

interface ScoresPageProps {
  params: Promise<{ id: string }>;
}

export default function ScoresPage({ params }: ScoresPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [summary, setSummary] = useState<ScoreSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = async () => {
    if (!userId) return;

    try {
      const data = await getScoreSummary(id, userId);
      setSummary(data);
    } catch {
      // Scores may not exist yet
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchScores();
    }
  }, [id, userId]);

  const handleCalculate = async () => {
    if (!userId) return;

    setCalculating(true);
    setError(null);

    try {
      const data = await calculateScores(id, userId);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate scores');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card animated>
        <CardHeader variant="gradient">
          <div className="flex justify-between items-center">
            <CardTitle icon={<BarChart3 className="h-5 w-5" />}>Maturity Scores</CardTitle>
            <Button variant="gradient" onClick={handleCalculate} loading={calculating} leftIcon={<Calculator className="h-4 w-4" />}>
              {summary ? 'Recalculate' : 'Calculate Scores'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Scores are calculated based on interview responses, control implementations,
            and policy coverage. Each function is scored from 0 (not implemented) to 4
            (fully optimized).
          </p>
          {error && <ErrorMessage message={error} className="mt-4" />}
        </CardContent>
      </Card>

      {summary ? (
        <>
          <Card animated>
            <CardContent>
              <ScoreSummary summary={summary} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold gradient-text">Function Scores</h2>
            {summary.function_scores.map((score, index) => (
              <div
                key={score.id}
                className="animate-slideInUp opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <FunctionScoreCard score={score} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No scores calculated"
          description="Calculate scores to see your maturity assessment results"
          action={{
            label: 'Calculate Scores',
            onClick: handleCalculate,
          }}
        />
      )}
    </div>
  );
}
