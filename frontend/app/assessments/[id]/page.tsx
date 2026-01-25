'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui';
import { getAssessment, listControls, listPolicies, listSessions, getScoreSummary } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Assessment } from '@/lib/types';

interface OverviewPageProps {
  params: Promise<{ id: string }>;
}

interface Stats {
  controls: number;
  policies: number;
  interviews: number;
  overallScore: number | null;
}

export default function AssessmentOverviewPage({ params }: OverviewPageProps) {
  const { id } = use(params);
  const userId = useUserId();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [stats, setStats] = useState<Stats>({
    controls: 0,
    policies: 0,
    interviews: 0,
    overallScore: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [assessmentData, controls, policies, sessions] = await Promise.all([
          getAssessment(id, userId),
          listControls(id, userId).catch(() => []),
          listPolicies(id, userId).catch(() => []),
          listSessions(id, userId).catch(() => []),
        ]);

        setAssessment(assessmentData);

        let overallScore = null;
        try {
          const scoreSummary = await getScoreSummary(id, userId);
          overallScore = scoreSummary.overall_maturity;
        } catch {
          // Scores may not be calculated yet
        }

        setStats({
          controls: controls.length,
          policies: policies.length,
          interviews: sessions.length,
          overallScore,
        });
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { name: 'Controls', value: stats.controls, href: `/assessments/${id}/controls` },
    { name: 'Policies', value: stats.policies, href: `/assessments/${id}/policies` },
    { name: 'Interviews', value: stats.interviews, href: `/assessments/${id}/interviews` },
    {
      name: 'Maturity Score',
      value: stats.overallScore !== null ? stats.overallScore.toFixed(1) : '-',
      href: `/assessments/${id}/scores`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {assessment?.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{assessment.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/assessments/${id}/controls`}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Upload Controls</p>
                <p className="text-xs text-gray-500">Import CSV/XLSX</p>
              </div>
            </Link>

            <Link
              href={`/assessments/${id}/policies`}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Upload Policies</p>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT, MD</p>
              </div>
            </Link>

            <Link
              href={`/assessments/${id}/mappings`}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Generate Mappings</p>
                <p className="text-xs text-gray-500">AI-powered analysis</p>
              </div>
            </Link>

            <Link
              href={`/assessments/${id}/interviews`}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Start Interview</p>
                <p className="text-xs text-gray-500">Guided questionnaire</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
