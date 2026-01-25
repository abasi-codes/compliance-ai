const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown; userId?: string } = {}
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (options.userId) {
    headers['X-User-ID'] = options.userId;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(
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

export async function uploadFile<T>(
  endpoint: string,
  file: File,
  userId?: string,
  additionalFields?: Record<string, string>
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalFields) {
    for (const [key, value] of Object.entries(additionalFields)) {
      if (value) {
        formData.append(key, value);
      }
    }
  }

  const headers: HeadersInit = {};
  if (userId) {
    headers['X-User-ID'] = userId;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      errorData.detail || 'Upload failed',
      errorData
    );
  }

  return res.json();
}
