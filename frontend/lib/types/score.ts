import { UUID } from './common';

export interface ExplanationComponent {
  type: string;
  source: string;
  contribution: number;
  details: string;
}

export interface ExplanationPayload {
  components: ExplanationComponent[];
  rationale: string;
  evidence_citations: Array<{ source: string; text: string }> | null;
  confidence_factors: Record<string, number> | null;
}

export interface SubcategoryScore {
  id: UUID;
  assessment_id: UUID;
  subcategory_id: UUID;
  subcategory_code: string | null;
  score: number;
  explanation_payload: ExplanationPayload;
  calculated_at: string;
  calculated_by: string | null;
  version: number;
}

export interface CategoryScore {
  id: UUID;
  assessment_id: UUID;
  category_id: UUID;
  category_code: string | null;
  category_name: string | null;
  score: number;
  explanation_payload: ExplanationPayload;
  calculated_at: string;
  version: number;
}

export interface FunctionScore {
  id: UUID;
  assessment_id: UUID;
  function_id: UUID;
  function_code: string | null;
  function_name: string | null;
  score: number;
  explanation_payload: ExplanationPayload;
  calculated_at: string;
  version: number;
}

export interface ScoreSummary {
  assessment_id: UUID;
  overall_maturity: number;
  function_scores: FunctionScore[];
  category_scores: CategoryScore[] | null;
  calculated_at: string;
}

export interface ScoreExplanation {
  score_id: UUID;
  level: 'subcategory' | 'category' | 'function';
  code: string;
  score: number;
  explanation: ExplanationPayload;
}
