import { apiRequest } from './client';
import { ScoreSummary, SubcategoryScore, ScoreExplanation } from '../types';

export async function calculateScores(
  assessmentId: string,
  userId?: string
): Promise<ScoreSummary> {
  return apiRequest<ScoreSummary>(`/scores/assessments/${assessmentId}/calculate`, {
    method: 'POST',
    userId,
  });
}

export async function getScoreSummary(
  assessmentId: string,
  userId?: string
): Promise<ScoreSummary> {
  return apiRequest<ScoreSummary>(`/scores/assessments/${assessmentId}/summary`, {
    userId,
  });
}

export async function getSubcategoryScores(
  assessmentId: string,
  userId?: string
): Promise<SubcategoryScore[]> {
  return apiRequest<SubcategoryScore[]>(
    `/scores/assessments/${assessmentId}/subcategory`,
    { userId }
  );
}

export async function getScoreExplanation(
  scoreId: string,
  userId?: string
): Promise<ScoreExplanation> {
  return apiRequest<ScoreExplanation>(
    `/scores/${scoreId}/explanation`,
    { userId }
  );
}
