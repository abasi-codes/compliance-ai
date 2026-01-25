import { UUID } from './common';

export type InterviewSessionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';

export interface InterviewQuestion {
  id: UUID;
  subcategory_id: UUID;
  subcategory_code: string | null;
  question_text: string;
  question_type: string;
  order: number;
  target_roles: string[] | null;
  follow_up_on_yes_id: UUID | null;
  follow_up_on_no_id: UUID | null;
  is_active: boolean;
}

export interface InterviewSessionCreate {
  assessment_id: UUID;
  interviewee_name?: string;
  interviewee_role?: string;
  notes?: string;
}

export interface InterviewSession {
  id: UUID;
  assessment_id: UUID;
  interviewee_id: UUID | null;
  interviewee_name: string | null;
  interviewee_role: string | null;
  notes: string | null;
  status: string;
  current_question_index: number;
  total_questions: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterviewResponseCreate {
  question_id: UUID;
  response_text?: string;
  response_value?: string;
  confidence_level?: string;
  evidence_references?: Record<string, unknown>;
}

export interface InterviewResponse {
  id: UUID;
  session_id: UUID;
  question_id: UUID;
  response_text: string | null;
  response_value: string | null;
  confidence_level: string | null;
  evidence_references: Record<string, unknown> | null;
  responded_at: string;
  created_at: string;
  question_text: string | null;
}

export interface NextQuestionResponse {
  question: InterviewQuestion | null;
  question_number: number;
  total_questions: number;
  progress_percentage: number;
  is_complete: boolean;
}

export interface InterviewProgressResponse {
  session_id: UUID;
  status: string;
  questions_answered: number;
  total_questions: number;
  progress_percentage: number;
  responses: InterviewResponse[] | null;
}
