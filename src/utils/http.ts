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
  if (err?.response?.data) {
    if (typeof err.response.data === 'string') return err.response.data;
    if (err.response.data.message) return err.response.data.message;
  }
  return err?.message || 'Request failed';
}
