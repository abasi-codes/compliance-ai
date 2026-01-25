import { apiRequest, uploadFile } from './client';
import { Control, ControlUploadResponse } from '../types';

export async function uploadControls(
  assessmentId: string,
  file: File,
  userId?: string
): Promise<ControlUploadResponse> {
  return uploadFile<ControlUploadResponse>(
    `/assessments/${assessmentId}/controls/upload`,
    file,
    userId
  );
}

export async function listControls(
  assessmentId: string,
  userId?: string
): Promise<Control[]> {
  return apiRequest<Control[]>(`/assessments/${assessmentId}/controls`, { userId });
}

export async function getControl(controlId: string, userId?: string): Promise<Control> {
  return apiRequest<Control>(`/controls/${controlId}`, { userId });
}

export async function deleteControl(controlId: string, userId?: string): Promise<void> {
  return apiRequest<void>(`/controls/${controlId}`, {
    method: 'DELETE',
    userId,
  });
}
