// Simple API client wrapper for backend endpoints
// Adjust BASE_URL as needed (could move to env later)
const BASE_URL = 'https://localhost:7022';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string,string>;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = opts;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // Try parse JSON; if empty string return as any
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as any);
}

export const api = {
  admin: {
    login: (username: string, password: string) => request<{ token?: string; id?: string; name?: string; surname?: string; email?: string; role?: string }>(`/admin/AdminLogin`, { method: 'POST', body: { username, password } }),
    add: (data: { name: string; surname: string; email: string; phone: string; password: string }) => request(`/admin/addAdmin`, { method: 'POST', body: data }),
    updateDetails: (data: { id: string; name?: string; surname?: string; phone?: string }) => request(`/admin/updateDetails`, { method: 'POST', body: data }),
    updateEmail: (data: { id: string; newEmail: string }) => request(`/admin/updateEmail`, { method: 'POST', body: data }),
    updatePassword: (data: { id: string; oldPassword: string; newPassword: string }) => request(`/admin/updatePassword`, { method: 'POST', body: data }),
  },
  news: {
    create: (data: any) => request(`/news/createNews`, { method: 'POST', body: data }),
    update: (data: any) => request(`/news/updateNews`, { method: 'PUT', body: data }),
    remove: (id: string) => request(`/news/deleteNews?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    getAll: () => request(`/news/getAllNews`),
    getByCampus: (campus: string) => request(`/news/getNewsByCampus?campus=${encodeURIComponent(campus)}`)
  }
};
