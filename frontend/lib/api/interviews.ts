import { apiRequest } from './client';
import {
  InterviewSession,
  InterviewResponseCreate,
  InterviewResponse,
  NextQuestionResponse,
  InterviewProgressResponse,
} from '../types';

export async function listSessions(
  assessmentId: string,
  userId?: string
): Promise<InterviewSession[]> {
  // The backend returns sessions when creating, we need to track them
  // For now, return empty array as there's no list endpoint
  return [];
}

export async function createSession(
  assessmentId: string,
  data: { interviewee_name?: string; interviewee_role?: string; notes?: string },
  userId?: string
): Promise<InterviewSession> {
  return apiRequest<InterviewSession>(
    `/interviews/assessments/${assessmentId}/sessions`,
    {
      method: 'POST',
      body: { ...data, assessment_id: assessmentId },
      userId,
    }
  );
}

export async function getSession(
  sessionId: string,
  userId?: string
): Promise<InterviewSession> {
  return apiRequest<InterviewSession>(`/interviews/${sessionId}`, { userId });
}

export async function getNextQuestion(
  sessionId: string,
  userId?: string
): Promise<NextQuestionResponse> {
  return apiRequest<NextQuestionResponse>(
    `/interviews/${sessionId}/next-question`,
    { userId }
  );
}

export async function submitResponse(
  sessionId: string,
  data: InterviewResponseCreate,
  userId?: string
): Promise<InterviewResponse> {
  return apiRequest<InterviewResponse>(
    `/interviews/${sessionId}/responses`,
    {
      method: 'POST',
      body: data,
      userId,
    }
  );
}

export async function getProgress(
  assessmentId: string,
  userId?: string
): Promise<InterviewProgressResponse> {
  return apiRequest<InterviewProgressResponse>(
    `/interviews/assessments/${assessmentId}/progress`,
    { userId }
  );
}

export async function pauseSession(
  sessionId: string,
  userId?: string
): Promise<InterviewSession> {
  return apiRequest<InterviewSession>(
    `/interviews/${sessionId}/pause`,
    {
      method: 'POST',
      userId,
    }
  );
}

export async function resumeSession(
  sessionId: string,
  userId?: string
): Promise<InterviewSession> {
  return apiRequest<InterviewSession>(
    `/interviews/${sessionId}/resume`,
    {
      method: 'POST',
      userId,
    }
  );
}
