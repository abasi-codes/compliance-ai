import { apiRequest } from './client';
import {
  MappingGenerateRequest,
  MappingGenerateResponse,
  MappingApproveResponse,
  GapListResponse,
  ControlMapping,
  PolicyMapping,
} from '../types';

export async function generateMappings(
  assessmentId: string,
  options: MappingGenerateRequest = {},
  userId?: string
): Promise<MappingGenerateResponse> {
  return apiRequest<MappingGenerateResponse>(
    `/mappings/assessments/${assessmentId}/generate`,
    {
      method: 'POST',
      body: options,
      userId,
    }
  );
}

export async function approveMapping(
  mappingId: string,
  userId?: string
): Promise<MappingApproveResponse> {
  return apiRequest<MappingApproveResponse>(
    `/mappings/${mappingId}/approve`,
    {
      method: 'POST',
      userId,
    }
  );
}

export async function rejectMapping(
  mappingId: string,
  userId?: string
): Promise<MappingApproveResponse> {
  return apiRequest<MappingApproveResponse>(
    `/mappings/${mappingId}/reject`,
    {
      method: 'POST',
      userId,
    }
  );
}

export async function listControlMappings(
  assessmentId: string,
  userId?: string
): Promise<ControlMapping[]> {
  return apiRequest<ControlMapping[]>(
    `/mappings/assessments/${assessmentId}/controls`,
    { userId }
  );
}

export async function listPolicyMappings(
  assessmentId: string,
  userId?: string
): Promise<PolicyMapping[]> {
  return apiRequest<PolicyMapping[]>(
    `/mappings/assessments/${assessmentId}/policies`,
    { userId }
  );
}

export async function getGaps(
  assessmentId: string,
  userId?: string
): Promise<GapListResponse> {
  return apiRequest<GapListResponse>(
    `/mappings/assessments/${assessmentId}/gaps`,
    { userId }
  );
}
