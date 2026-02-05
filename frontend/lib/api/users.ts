/**
 * User profile and preferences API functions
 */

import { apiRequest } from './client';

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  default_framework_id: string | null;
  items_per_page: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
  preferences: UserPreferences | null;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
}

export interface UserPreferencesUpdate {
  theme?: 'light' | 'dark' | 'system';
  email_notifications?: boolean;
  default_framework_id?: string | null;
  items_per_page?: number;
}

export async function getUserProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me');
}

export async function updateUserProfile(data: UserProfileUpdate): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', {
    method: 'PATCH',
    body: data,
  });
}

export async function getUserPreferences(): Promise<UserPreferences> {
  return apiRequest<UserPreferences>('/users/me/preferences');
}

export async function updateUserPreferences(
  data: UserPreferencesUpdate
): Promise<UserPreferences> {
  return apiRequest<UserPreferences>('/users/me/preferences', {
    method: 'PATCH',
    body: data,
  });
}
