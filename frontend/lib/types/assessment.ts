import { UUID } from './common';

export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type AssessmentDepth = 'design' | 'implementation';

export interface AIPromptOverrides {
  mapping_prompt_suffix?: string | null;
  analysis_prompt_suffix?: string | null;
}

export interface Assessment {
  id: UUID;
  name: string;
  description: string | null;
  organization_name: string;
  status: AssessmentStatus;
  depth_level: AssessmentDepth;
  ai_prompt_overrides: AIPromptOverrides | null;
  created_by_id: UUID;
  created_at: string;
  updated_at: string;
}

export interface AssessmentCreate {
  name: string;
  description?: string;
  organization_name: string;
  depth_level?: AssessmentDepth;
  ai_prompt_overrides?: AIPromptOverrides;
}

export interface AssessmentUpdate {
  name?: string;
  description?: string;
  organization_name?: string;
  status?: AssessmentStatus;
  depth_level?: AssessmentDepth;
  ai_prompt_overrides?: AIPromptOverrides;
}

export interface AssessmentListResponse {
  items: Assessment[];
  total: number;
}

export interface AssessmentTransitions {
  current_status: string;
  available_transitions: string[];
}
