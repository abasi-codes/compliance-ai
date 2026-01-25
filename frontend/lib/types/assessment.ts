import { UUID } from './common';

export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export interface Assessment {
  id: UUID;
  name: string;
  description: string | null;
  organization_name: string;
  status: AssessmentStatus;
  created_by_id: UUID;
  created_at: string;
  updated_at: string;
}

export interface AssessmentCreate {
  name: string;
  description?: string;
  organization_name: string;
}

export interface AssessmentUpdate {
  name?: string;
  description?: string;
  organization_name?: string;
  status?: AssessmentStatus;
}

export interface AssessmentListResponse {
  items: Assessment[];
  total: number;
}

export interface AssessmentTransitions {
  current_status: string;
  available_transitions: string[];
}
