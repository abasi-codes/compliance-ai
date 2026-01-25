import { apiRequest } from './client';
import {
  RequirementCluster,
  ClusterMember,
  ClusterGenerateRequest,
  ClusterType,
  EmbeddingStats,
  InterviewReduction,
} from '../types/unified-framework';

// Cluster CRUD
export async function listClusters(
  clusterType?: ClusterType,
  isActive?: boolean
): Promise<RequirementCluster[]> {
  const params = new URLSearchParams();
  if (clusterType) params.append('cluster_type', clusterType);
  if (isActive !== undefined) params.append('is_active', String(isActive));
  const query = params.toString();
  return apiRequest<RequirementCluster[]>(`/clusters${query ? `?${query}` : ''}`);
}

export async function getCluster(clusterId: string): Promise<RequirementCluster> {
  return apiRequest<RequirementCluster>(`/clusters/${clusterId}`);
}

export async function getClusterMembers(
  clusterId: string
): Promise<ClusterMember[]> {
  return apiRequest<ClusterMember[]>(`/clusters/${clusterId}/members`);
}

export async function generateClusters(
  data: ClusterGenerateRequest
): Promise<{
  message: string;
  total_clusters: number;
  clusters: Array<{
    id: string;
    name: string;
    member_count: number;
  }>;
}> {
  return apiRequest('/clusters/generate', {
    method: 'POST',
    body: data,
  });
}

export async function deleteClusters(
  clusterType?: ClusterType
): Promise<{ message: string }> {
  const params = clusterType ? `?cluster_type=${clusterType}` : '';
  return apiRequest<{ message: string }>(`/clusters${params}`, {
    method: 'DELETE',
  });
}

// Interview reduction
export async function estimateInterviewReduction(
  frameworkIds?: string[]
): Promise<InterviewReduction> {
  const params = frameworkIds?.length
    ? `?framework_ids=${frameworkIds.join(',')}`
    : '';
  return apiRequest<InterviewReduction>(`/clusters/interview-reduction${params}`);
}

// Requirement cluster lookup
export async function getRequirementCluster(
  requirementId: string,
  clusterType?: ClusterType
): Promise<{
  cluster: {
    id: string;
    name: string;
    description: string | null;
    cluster_type: string;
    interview_question: string | null;
  } | null;
  message?: string;
}> {
  const params = clusterType ? `?cluster_type=${clusterType}` : '';
  return apiRequest(
    `/clusters/requirement/${requirementId}/cluster${params}`
  );
}

// Embedding management
export async function generateEmbeddings(
  frameworkId?: string,
  force?: boolean
): Promise<{
  message: string;
  processed: number;
  skipped: number;
  failed: number;
}> {
  const params = new URLSearchParams();
  if (frameworkId) params.append('framework_id', frameworkId);
  if (force) params.append('force', 'true');
  const query = params.toString();
  return apiRequest(`/clusters/embeddings/generate${query ? `?${query}` : ''}`, {
    method: 'POST',
  });
}

export async function getEmbeddingStats(
  frameworkId?: string
): Promise<EmbeddingStats> {
  const params = frameworkId ? `?framework_id=${frameworkId}` : '';
  return apiRequest<EmbeddingStats>(`/clusters/embeddings/stats${params}`);
}
