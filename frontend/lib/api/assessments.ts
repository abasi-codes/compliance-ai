import { apiRequest } from './client';
import {
  Assessment,
  AssessmentCreate,
  AssessmentUpdate,
  AssessmentListResponse,
  AssessmentTransitions,
} from '../types';

export async function listAssessments(
  params: { status?: string; skip?: number; limit?: number } = {},
  userId?: string
): Promise<AssessmentListResponse> {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.skip !== undefined) searchParams.set('skip', params.skip.toString());
  if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  return apiRequest<AssessmentListResponse>(
    `/assessments${query ? `?${query}` : ''}`,
    { userId }
  );
}

export async function getAssessment(id: string, userId?: string): Promise<Assessment> {
  return apiRequest<Assessment>(`/assessments/${id}`, { userId });
}

export async function createAssessment(
  data: AssessmentCreate,
  userId?: string
): Promise<Assessment> {
  return apiRequest<Assessment>('/assessments', {
    method: 'POST',
    body: data,
    userId,
  });
}

export async function updateAssessment(
  id: string,
  data: AssessmentUpdate,
  userId?: string
): Promise<Assessment> {
  return apiRequest<Assessment>(`/assessments/${id}`, {
    method: 'PATCH',
    body: data,
    userId,
  });
}

export async function deleteAssessment(id: string, userId?: string): Promise<void> {
  return apiRequest<void>(`/assessments/${id}`, {
    method: 'DELETE',
    userId,
  });
}

export async function getAssessmentTransitions(
  id: string,
  userId?: string
): Promise<AssessmentTransitions> {
  return apiRequest<AssessmentTransitions>(`/assessments/${id}/transitions`, { userId });
}
