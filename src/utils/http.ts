import axios from 'axios';

// Axios instance using relative /api prefix so Vite proxy handles CORS during dev.
// In production, ensure your hosting (or reverse proxy) forwards /api to backend or adjust baseURL via env.
const apiBase = '/api';

export const http = axios.create({
  baseURL: apiBase,
  withCredentials: false,
});

http.interceptors.request.use(cfg => {
  try {
    const token = sessionStorage.getItem('authToken');
    if (token && cfg.headers) cfg.headers['Authorization'] = `Bearer ${token}`;
  } catch {}
  return cfg;
});

http.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    // Auto logout on unauthorized
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentAdmin');
  }
  return Promise.reject(err);
});

export function extractErrorMessage(err: any): string {
  try {
    const payload = err?.response?.data;
    if (!payload) return err?.message || 'Request failed';

    // If server returned a plain string, try to avoid returning full stack traces.
    if (typeof payload === 'string') {
      const s = payload.trim();
      // If it looks like a stack trace or contains an exception type, extract a short message.
      if (s.length > 200 || s.includes('\n') || /Exception\b/.test(s) || / at [\\/]/.test(s)) {
        const firstLine = s.split('\n')[0];
        const m = firstLine.match(/(?:\w*Exception:??\s*)(.*)/);
        const candidate = (m && m[1]) ? m[1].trim() : firstLine.replace(/\s+at\s+.*/,'').trim();
        return candidate || 'Server error';
      }
      return s;
    }

    // ASP.NET ProblemDetails style
    if (payload.title || payload.detail) {
      return [payload.title, payload.detail].filter(Boolean).join(': ');
    }

    // Common shaped response { message: '...' }
    if (typeof payload.message === 'string') return payload.message;

    // Model state style: { errors: { FieldName: ["...", "..."] } }
    if (payload.errors && typeof payload.errors === 'object') {
      const parts: string[] = [];
      for (const k of Object.keys(payload.errors)) {
        const v = payload.errors[k];
        if (Array.isArray(v)) parts.push(v.join(' '));
        else parts.push(String(v));
      }
      if (parts.length) return parts.join(' ');
    }

    // Fallback: avoid dumping large objects to the UI; return a short hint.
    try {
      const json = JSON.stringify(payload);
      if (json.length > 200) return 'Server error';
      return json;
    } catch {
      return 'Server error';
    }
  } catch (e) {
    return err?.message || 'Request failed';
  }
}
