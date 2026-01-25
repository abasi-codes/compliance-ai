import { UUID } from './common';

export type ReportType = 'EXECUTIVE' | 'DETAILED' | 'TECHNICAL';

export interface ExecutiveSummary {
  overall_maturity: number;
  key_strengths: string[];
  critical_gaps: string[];
  recommendations_summary: string;
}

export interface MaturitySummary {
  by_function: Array<{
    code: string;
    name: string;
    score: number;
  }>;
  by_category: Array<{
    code: string;
    name: string;
    score: number;
  }>;
}

export interface DeviationSummary {
  total_count: number;
  by_severity: Record<string, number>;
  risk_ranked_list: Array<{
    title: string;
    severity: string;
    risk_score: number;
  }>;
}

export interface Recommendations {
  immediate: Array<{
    title: string;
    description: string;
    priority: number;
  }>;
  short_term: Array<{
    title: string;
    description: string;
    priority: number;
  }>;
  long_term: Array<{
    title: string;
    description: string;
    priority: number;
  }>;
}

export interface ReportContent {
  executive_summary: ExecutiveSummary;
  maturity_summary: MaturitySummary;
  deviations: DeviationSummary;
  recommendations: Recommendations;
  function_details?: Array<{
    function_code: string;
    function_name: string;
    score: number;
    categories: Array<{
      code: string;
      name: string;
      score: number;
    }>;
  }>;
  appendices?: Record<string, unknown>;
}

export interface Report {
  id: UUID;
  assessment_id: UUID;
  report_type: string;
  title: string;
  content: ReportContent;
  generated_at: string;
  generated_by_id: UUID | null;
  version: number;
  is_final: boolean;
}

export interface ReportListResponse {
  items: Report[];
  total: number;
}
