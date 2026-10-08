const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  // Pass current role header if stored
  const currentRole = localStorage.getItem('r360_user_role') || 'ADMIN';
  if (!headers.has('X-User-Role')) {
    headers.set('X-User-Role', currentRole);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // JSON parse error fallback
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
