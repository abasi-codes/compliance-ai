import { apiRequest } from './client';
import { CSFFunction, FrameworkSummary } from '../types';

export async function getFramework(userId?: string): Promise<CSFFunction[]> {
  return apiRequest<CSFFunction[]>('/framework/functions', { userId });
}

export async function getFrameworkSummary(userId?: string): Promise<FrameworkSummary> {
  return apiRequest<FrameworkSummary>('/framework/summary', { userId });
}

export async function getFunction(
  functionId: string,
  userId?: string
): Promise<CSFFunction> {
  return apiRequest<CSFFunction>(`/framework/functions/${functionId}`, { userId });
}
