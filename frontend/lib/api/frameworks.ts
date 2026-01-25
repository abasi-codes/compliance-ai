import { apiRequest } from './client';
import {
  Framework,
  FrameworkRequirement,
  FrameworkHierarchyNode,
  FrameworkStats,
  CompanyFramework,
  CompanyFrameworkCreate,
  AssessmentScope,
  AssessmentScopeCreate,
} from '../types/unified-framework';

// Framework CRUD
export async function listFrameworks(
  isActive?: boolean,
  frameworkType?: string
): Promise<Framework[]> {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('is_active', String(isActive));
  if (frameworkType) params.append('framework_type', frameworkType);
  const query = params.toString();
  return apiRequest<Framework[]>(`/frameworks${query ? `?${query}` : ''}`);
}

export async function getFramework(frameworkId: string): Promise<Framework> {
  return apiRequest<Framework>(`/frameworks/${frameworkId}`);
}

export async function createFramework(data: {
  code: string;
  name: string;
  version: string;
  description?: string;
  hierarchy_levels?: number;
  hierarchy_labels?: string[];
  metadata?: Record<string, unknown>;
}): Promise<Framework> {
  return apiRequest<Framework>('/frameworks', {
    method: 'POST',
    body: data,
  });
}

export async function updateFramework(
  frameworkId: string,
  data: {
    name?: string;
    description?: string;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  }
): Promise<Framework> {
  return apiRequest<Framework>(`/frameworks/${frameworkId}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function deleteFramework(frameworkId: string): Promise<void> {
  return apiRequest<void>(`/frameworks/${frameworkId}`, {
    method: 'DELETE',
  });
}

// Framework requirements
export async function getFrameworkStats(
  frameworkId: string
): Promise<FrameworkStats> {
  return apiRequest<FrameworkStats>(`/frameworks/${frameworkId}/stats`);
}

export async function getFrameworkRequirements(
  frameworkId: string,
  options?: {
    parentId?: string;
    level?: number;
    isAssessable?: boolean;
  }
): Promise<FrameworkRequirement[]> {
  const params = new URLSearchParams();
  if (options?.parentId) params.append('parent_id', options.parentId);
  if (options?.level !== undefined) params.append('level', String(options.level));
  if (options?.isAssessable !== undefined)
    params.append('is_assessable', String(options.isAssessable));
  const query = params.toString();
  return apiRequest<FrameworkRequirement[]>(
    `/frameworks/${frameworkId}/requirements${query ? `?${query}` : ''}`
  );
}

export async function getFrameworkHierarchy(
  frameworkId: string,
  maxDepth?: number
): Promise<FrameworkHierarchyNode[]> {
  const params = maxDepth !== undefined ? `?max_depth=${maxDepth}` : '';
  return apiRequest<FrameworkHierarchyNode[]>(
    `/frameworks/${frameworkId}/hierarchy${params}`
  );
}

// Load built-in frameworks
export async function loadBuiltinFrameworks(
  frameworkType?: string,
  forceReload?: boolean
): Promise<{
  message: string;
  frameworks?: { id: string; code: string; name: string }[];
  framework_id?: string;
  framework_code?: string;
}> {
  const params = new URLSearchParams();
  if (frameworkType) params.append('framework_type', frameworkType);
  if (forceReload) params.append('force_reload', 'true');
  const query = params.toString();
  return apiRequest(`/frameworks/load-builtin${query ? `?${query}` : ''}`, {
    method: 'POST',
  });
}

// Company framework selection
export async function getCompanyFrameworks(
  organizationName: string,
  isActive?: boolean
): Promise<CompanyFramework[]> {
  const params = isActive !== undefined ? `?is_active=${isActive}` : '';
  return apiRequest<CompanyFramework[]>(
    `/frameworks/companies/${encodeURIComponent(organizationName)}/frameworks${params}`
  );
}

export async function addCompanyFramework(
  organizationName: string,
  data: CompanyFrameworkCreate
): Promise<CompanyFramework> {
  return apiRequest<CompanyFramework>(
    `/frameworks/companies/${encodeURIComponent(organizationName)}/frameworks`,
    {
      method: 'POST',
      body: data,
    }
  );
}

export async function removeCompanyFramework(
  organizationName: string,
  frameworkId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/frameworks/companies/${encodeURIComponent(organizationName)}/frameworks/${frameworkId}`,
    {
      method: 'DELETE',
    }
  );
}

// Assessment scope
export async function getAssessmentScope(
  assessmentId: string
): Promise<AssessmentScope[]> {
  return apiRequest<AssessmentScope[]>(
    `/frameworks/assessments/${assessmentId}/scope`
  );
}

export async function setAssessmentScope(
  assessmentId: string,
  data: AssessmentScopeCreate
): Promise<AssessmentScope> {
  return apiRequest<AssessmentScope>(
    `/frameworks/assessments/${assessmentId}/scope`,
    {
      method: 'POST',
      body: data,
    }
  );
}

export async function removeAssessmentScope(
  assessmentId: string,
  frameworkId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/frameworks/assessments/${assessmentId}/scope/${frameworkId}`,
    {
      method: 'DELETE',
    }
  );
}
