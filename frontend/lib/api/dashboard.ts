/**
 * Dashboard API functions
 */

import { apiRequest } from './client';

export interface AssessmentCountByStatus {
  draft: number;
  in_progress: number;
  review: number;
  completed: number;
  archived: number;
}

export interface FrameworkCoverage {
  framework_id: string;
  framework_code: string;
  framework_name: string;
  total_requirements: number;
  assessed_requirements: number;
  coverage_percentage: number;
}

export interface DeviationSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface RecentAssessment {
  id: string;
  name: string;
  organization_name: string;
  status: string;
  maturity_score: number | null;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  type: 'mapping_approval' | 'crosswalk_approval';
  title: string;
  assessment_name: string | null;
  created_at: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  entity_type: string;
  user_name: string | null;
  timestamp: string;
  details: string | null;
}

export interface DashboardSummary {
  total_assessments: number;
  assessments_by_status: AssessmentCountByStatus;
  overall_maturity_score: number | null;
  overall_maturity_trend: number | null;
  framework_coverage: FrameworkCoverage[];
  deviation_summary: DeviationSummary;
  open_deviations: number;
  recent_assessments: RecentAssessment[];
  pending_approvals: number;
  action_items: ActionItem[];
  recent_activity: ActivityEntry[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>('/dashboard/summary');
}
