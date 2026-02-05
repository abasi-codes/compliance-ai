import { apiRequest } from './client';
import { Report, ReportListResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'compliance-ai-access-token';

export async function generateReport(
  assessmentId: string,
  reportType: string = 'EXECUTIVE',
  userId?: string
): Promise<Report> {
  return apiRequest<Report>(`/reports/assessments/${assessmentId}/generate`, {
    method: 'POST',
    body: { report_type: reportType },
    userId,
  });
}

export async function listReports(
  assessmentId: string,
  userId?: string
): Promise<ReportListResponse> {
  return apiRequest<ReportListResponse>(
    `/reports/assessments/${assessmentId}/list`,
    { userId }
  );
}

export async function getReport(
  reportId: string,
  userId?: string
): Promise<Report> {
  return apiRequest<Report>(`/reports/${reportId}`, { userId });
}

export type ReportFormat = 'json' | 'pdf';

export function getReportDownloadUrl(reportId: string, format: ReportFormat = 'json'): string {
  return `${API_BASE}/reports/${reportId}/download?format=${format}`;
}

export async function downloadReport(reportId: string, format: ReportFormat = 'json'): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getReportDownloadUrl(reportId, format), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Download failed: ${response.status}`);
  }

  // Get the filename from the response headers or use a default
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `report_${reportId}.${format}`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];
    }
  }

  // Create a blob and download it
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function finalizeReport(
  reportId: string,
  userId?: string
): Promise<Report> {
  return apiRequest<Report>(`/reports/${reportId}/finalize`, {
    method: 'PATCH',
    userId,
  });
}
