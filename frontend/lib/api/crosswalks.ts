import { apiRequest } from './client';
import {
  Crosswalk,
  CrosswalkStats,
  CrosswalkGenerateRequest,
  CrosswalkCreateRequest,
  MappingType,
} from '../types/unified-framework';

// Crosswalk CRUD
export async function listCrosswalks(options?: {
  sourceFrameworkId?: string;
  targetFrameworkId?: string;
  isApproved?: boolean;
  mappingType?: MappingType;
  minConfidence?: number;
}): Promise<Crosswalk[]> {
  const params = new URLSearchParams();
  if (options?.sourceFrameworkId)
    params.append('source_framework_id', options.sourceFrameworkId);
  if (options?.targetFrameworkId)
    params.append('target_framework_id', options.targetFrameworkId);
  if (options?.isApproved !== undefined)
    params.append('is_approved', String(options.isApproved));
  if (options?.mappingType) params.append('mapping_type', options.mappingType);
  if (options?.minConfidence !== undefined)
    params.append('min_confidence', String(options.minConfidence));
  const query = params.toString();
  return apiRequest<Crosswalk[]>(`/crosswalks${query ? `?${query}` : ''}`);
}

export async function getCrosswalk(crosswalkId: string): Promise<Crosswalk> {
  return apiRequest<Crosswalk>(`/crosswalks/${crosswalkId}`);
}

export async function createCrosswalk(
  data: CrosswalkCreateRequest,
  userId?: string
): Promise<Crosswalk> {
  return apiRequest<Crosswalk>('/crosswalks', {
    method: 'POST',
    body: data,
    userId,
  });
}

export async function generateCrosswalks(
  data: CrosswalkGenerateRequest,
  userId?: string
): Promise<{
  message: string;
  total_generated: number;
  auto_approved: number;
  pending_review: number;
  crosswalks: Array<{
    id: string;
    source_requirement_id: string;
    target_requirement_id: string;
    mapping_type: string;
    confidence_score: number;
    is_approved: boolean;
  }>;
}> {
  return apiRequest('/crosswalks/generate', {
    method: 'POST',
    body: data,
    userId,
  });
}

export async function approveCrosswalk(
  crosswalkId: string,
  userId: string
): Promise<{
  id: string;
  is_approved: boolean;
  approved_at: string | null;
}> {
  return apiRequest(`/crosswalks/${crosswalkId}/approve`, {
    method: 'POST',
    userId,
  });
}

export async function rejectCrosswalk(
  crosswalkId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/crosswalks/${crosswalkId}`, {
    method: 'DELETE',
  });
}

// Requirement mappings
export async function getRequirementCrosswalks(
  requirementId: string,
  options?: {
    asSource?: boolean;
    asTarget?: boolean;
    isApproved?: boolean;
  }
): Promise<
  Array<{
    id: string;
    source_requirement_id: string;
    source_requirement_code: string | null;
    target_requirement_id: string;
    target_requirement_code: string | null;
    mapping_type: string;
    confidence_score: number;
    is_approved: boolean;
    direction: 'source' | 'target';
  }>
> {
  const params = new URLSearchParams();
  if (options?.asSource !== undefined)
    params.append('as_source', String(options.asSource));
  if (options?.asTarget !== undefined)
    params.append('as_target', String(options.asTarget));
  if (options?.isApproved !== undefined)
    params.append('is_approved', String(options.isApproved));
  const query = params.toString();
  return apiRequest(
    `/crosswalks/requirement/${requirementId}/mappings${query ? `?${query}` : ''}`
  );
}

export async function getEquivalentRequirements(
  requirementId: string,
  transitive?: boolean
): Promise<
  Array<{
    id: string;
    code: string;
    name: string;
    framework_id: string;
  }>
> {
  const params = transitive ? '?transitive=true' : '';
  return apiRequest(
    `/crosswalks/requirement/${requirementId}/equivalents${params}`
  );
}

// Statistics
export async function getCrosswalkStats(): Promise<CrosswalkStats> {
  return apiRequest<CrosswalkStats>('/crosswalks/stats');
}

// Bulk operations
export interface BulkCrosswalkResult {
  crosswalk_id: string;
  success: boolean;
  error: string | null;
}

export interface BulkCrosswalkResponse {
  total: number;
  successful: number;
  failed: number;
  results: BulkCrosswalkResult[];
}

export async function bulkApproveCrosswalks(
  crosswalkIds: string[],
  userId: string
): Promise<BulkCrosswalkResponse> {
  return apiRequest<BulkCrosswalkResponse>('/crosswalks/bulk-approve', {
    method: 'POST',
    body: { crosswalk_ids: crosswalkIds },
    userId,
  });
}

export async function bulkRejectCrosswalks(
  crosswalkIds: string[]
): Promise<BulkCrosswalkResponse> {
  return apiRequest<BulkCrosswalkResponse>('/crosswalks/bulk-reject', {
    method: 'POST',
    body: { crosswalk_ids: crosswalkIds },
  });
}
