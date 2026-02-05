/**
 * Authentication API functions
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  is_guest: boolean;
  roles: string[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

class AuthApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function authRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new AuthApiError(
      res.status,
      errorData.detail || `API error: ${res.status}`,
      errorData
    );
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}

export async function register(data: RegisterData): Promise<UserResponse> {
  return authRequest<UserResponse>('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export async function login(data: LoginData): Promise<TokenResponse> {
  return authRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: data,
  });
}

export async function loginAsGuest(): Promise<TokenResponse> {
  return authRequest<TokenResponse>('/auth/guest', {
    method: 'POST',
  });
}

export async function refreshToken(refresh_token: string): Promise<TokenResponse> {
  return authRequest<TokenResponse>('/auth/refresh', {
    method: 'POST',
    body: { refresh_token },
  });
}

export async function logout(): Promise<void> {
  return authRequest<void>('/auth/logout', { method: 'POST' });
}

export async function getCurrentUser(token: string): Promise<UserResponse> {
  return authRequest<UserResponse>('/auth/me', { token });
}

export async function changePassword(
  token: string,
  data: PasswordChangeData
): Promise<void> {
  return authRequest<void>('/auth/change-password', {
    method: 'POST',
    body: data,
    token,
  });
}
