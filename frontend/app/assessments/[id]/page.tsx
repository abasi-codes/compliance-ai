'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Settings,
  FileText,
  Link2,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui';
import { getAssessment, listControls, listPolicies, listSessions, getScoreSummary } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { Assessment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface OverviewPageProps {
  params: Promise<{ id: string }>;
}

interface Stats {
  controls: number;
  policies: number;
  interviews: number;
  overallScore: number | null;
}

const statIconColors = [
  { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
];

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
    {
      name: 'Controls',
      value: stats.controls,
      href: `/assessments/${id}/controls`,
      icon: Settings,
      color: statIconColors[0],
    },
    {
      name: 'Policies',
      value: stats.policies,
      href: `/assessments/${id}/policies`,
      icon: FileText,
      color: statIconColors[1],
    },
    {
      name: 'Interviews',
      value: stats.interviews,
      href: `/assessments/${id}/interviews`,
      icon: MessageSquare,
      color: statIconColors[2],
    },
    {
      name: 'Maturity Score',
      value: stats.overallScore !== null ? stats.overallScore.toFixed(1) : '-',
      href: `/assessments/${id}/scores`,
      icon: BarChart3,
      color: statIconColors[3],
      suffix: stats.overallScore !== null ? '/4.0' : '',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Controls',
      description: 'Import CSV/XLSX',
      href: `/assessments/${id}/controls`,
      icon: Settings,
      color: { bg: 'bg-blue-100', text: 'text-blue-600' },
    },
    {
      title: 'Upload Policies',
      description: 'PDF, DOCX, TXT, MD',
      href: `/assessments/${id}/policies`,
      icon: FileText,
      color: { bg: 'bg-green-100', text: 'text-green-600' },
    },
    {
      title: 'Generate Mappings',
      description: 'AI-powered analysis',
      href: `/assessments/${id}/mappings`,
      icon: Link2,
      color: { bg: 'bg-purple-100', text: 'text-purple-600' },
    },
    {
      title: 'Start Interview',
      description: 'Guided questionnaire',
      href: `/assessments/${id}/interviews`,
      icon: MessageSquare,
      color: { bg: 'bg-orange-100', text: 'text-orange-600' },
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href}>
              <Card hover glow className="h-full">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-3 rounded-xl', stat.color.bg)}>
                      <Icon className={cn('h-6 w-6', stat.color.text)} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                      {stat.suffix && (
                        <span className="text-lg text-slate-400">{stat.suffix}</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Description */}
      {assessment?.description && (
        <Card>
          <CardHeader gradient>
            <CardTitle icon={<TrendingUp className="h-5 w-5" />}>
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{assessment.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader gradient>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl',
                    'bg-slate-50 hover:bg-slate-100',
                    'border border-transparent hover:border-slate-200',
                    'transition-all duration-200',
                    'group'
                  )}
                >
                  <div className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                    action.color.bg
                  )}>
                    <Icon className={cn('w-6 h-6', action.color.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
