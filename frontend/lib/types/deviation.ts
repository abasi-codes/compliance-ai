import { UUID } from './common';

export type DeviationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DeviationStatus = 'OPEN' | 'IN_REMEDIATION' | 'RESOLVED' | 'ACCEPTED';
export type DeviationType = 'MISSING_CONTROL' | 'MISSING_POLICY' | 'LOW_MATURITY' | 'INCONSISTENT';

export interface Deviation {
  id: UUID;
  assessment_id: UUID;
  subcategory_id: UUID;
  subcategory_code: string | null;
  deviation_type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  evidence: Record<string, unknown> | null;
  impact_score: number;
  likelihood_score: number;
  risk_score: number;
  recommended_remediation: string | null;
  remediation_notes: string | null;
  detected_at: string;
  updated_at: string;
}

export interface DeviationListResponse {
  items: Deviation[];
  total: number;
  by_severity: Record<string, number>;
  by_status: Record<string, number>;
}

export interface RiskSummary {
  assessment_id: UUID;
  total_deviations: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  average_risk_score: number;
  highest_risk_areas: Array<{
    subcategory_code: string;
    risk_score: number;
    deviation_count: number;
  }>;
  risk_by_function: Record<string, number>;
}

export interface DeviationUpdate {
  status?: string;
  remediation_notes?: string;
  severity?: string;
}
