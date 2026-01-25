import { apiRequest } from './client';
import { Report, ReportListResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

export function getReportDownloadUrl(reportId: string): string {
  return `${API_BASE}/reports/${reportId}/download`;
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
