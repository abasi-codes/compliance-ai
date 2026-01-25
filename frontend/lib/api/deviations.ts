import { apiRequest } from './client';
import { Deviation, DeviationListResponse, DeviationUpdate, RiskSummary } from '../types';

export async function detectDeviations(
  assessmentId: string,
  userId?: string
): Promise<DeviationListResponse> {
  return apiRequest<DeviationListResponse>(
    `/assessments/${assessmentId}/deviations/detect`,
    {
      method: 'POST',
      userId,
    }
  );
}

export async function listDeviations(
  assessmentId: string,
  params: { severity?: string; status?: string } = {},
  userId?: string
): Promise<DeviationListResponse> {
  const searchParams = new URLSearchParams();
  if (params.severity) searchParams.set('severity', params.severity);
  if (params.status) searchParams.set('status', params.status);

  const query = searchParams.toString();
  return apiRequest<DeviationListResponse>(
    `/assessments/${assessmentId}/deviations${query ? `?${query}` : ''}`,
    { userId }
  );
}

export async function updateDeviation(
  deviationId: string,
  data: DeviationUpdate,
  userId?: string
): Promise<Deviation> {
  return apiRequest<Deviation>(`/deviations/${deviationId}`, {
    method: 'PATCH',
    body: data,
    userId,
  });
}

export async function getRiskSummary(
  assessmentId: string,
  userId?: string
): Promise<RiskSummary> {
  return apiRequest<RiskSummary>(
    `/assessments/${assessmentId}/risk-summary`,
    { userId }
  );
}
