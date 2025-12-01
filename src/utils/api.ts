// Simple API client wrapper for backend endpoints
// BASE_URL can be configured via Vite env var (VITE_API_BASE_URL)
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:4000';

interface RequestOptions {
  method?: string;
  body?: any; // JSON object or FormData
  headers?: Record<string,string>;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = opts;
  const isFormData = (typeof FormData !== 'undefined') && body instanceof FormData;
  const token = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('authToken') : null;
  const finalHeaders = isFormData ? { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers } : {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr: any) {
    // Provide more actionable network error message
    throw new Error(`Network error: ${networkErr?.message || networkErr}`);
  }
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    // Include status for easier debugging
    throw new Error(text || `Request failed: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  try { return text ? JSON.parse(text) : (undefined as any); } catch { return text as any; }
}

export const api = {
  admin: {
  // Backend LoginAdminDTO expects: { email, password }
  login: (email: string, password: string) => request<{ token?: string; id?: string; name?: string; surname?: string; email?: string; role?: string }>(`/admin/AdminLogin`, { method: 'POST', body: { email, password } }),
    add: (data: { initials: string; surname: string; email: string; password: string }) => request(`/admin/addAdmin`, { method: 'POST', body: {
      initials: data.initials,
      surname: data.surname,
      email: data.email,
      password: data.password
    } }),
    updateDetails: (data: { id: string; name?: string; surname?: string; phone?: string }) => request(`/admin/updateDetails`, { method: 'POST', body: data }),
    updateEmail: (data: { id: string; newEmail: string }) => request(`/admin/updateEmail`, { method: 'POST', body: data }),
    updatePassword: (data: { id: string; oldPassword: string; newPassword: string }) => request(`/admin/updatePassword`, { method: 'POST', body: data }),
  },
  news: {
    /**
     * Create news using backend createNews endpoint expecting multipart/form-data with (AdminId, Title, Description, Priority, Category, Department?, CampusId, FormFile?)
     * Frontend passes friendly campus slug; we map to numeric CampusId (adjust mapping to match backend).
     */
    create: (data: { title: string; summary?: string; content?: string; priority: string; category: string; department?: string; campus?: string; file?: File | null; adminId?: number; }) => {
      const campusMap: Record<string, number> = { south: 1, emalahleni: 2, polokwane: 3, all: 4 };
      const description = data.content || data.summary || '';
      const campusId = data.campus ? (campusMap[data.campus] ?? data.campus) : '';
      const query = new URLSearchParams({
        ...(data.adminId ? { AdminId: String(data.adminId) } : {}),
        Title: data.title,
        Description: description,
        Priority: data.priority,
        Category: data.category,
        ...(data.department ? { Department: data.department } : {}),
        ...(campusId ? { CampusId: String(campusId) } : {})
      }).toString();
      // If there's a file, still send multipart for FormFile but ALSO include query params (Swagger shows scalars as query)
      if (data.file) {
        const form = new FormData();
        form.append('FormFile', data.file);
        return request(`/news/createNews?${query}`, { method: 'POST', body: form });
      }
      // No file: send empty body with query params (backend treats scalars as query)
      return request(`/news/createNews?${query}`, { method: 'POST' });
    },
  /**
   * Update endpoint: backend Swagger shows PUT /news/updateNews. Need to confirm expected payload.
   * For now send JSON body mirroring create fields plus Id.
   */
  update: (data: { id: string; title?: string; description?: string; priority?: string; category?: string; department?: string; campusId?: number; isVisible?: boolean; }) => request(`/news/updateNews`, { method: 'PUT', body: data }),
  remove: (id: string) => request(`/news/deleteNews?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getAll: () => request(`/news/getAllNews`),
  /**
   * Campus filter: backend shows /news/getNewsByCampus?campus= . Accepts slug matching ours or campusId? Keep slug for now.
   */
  getByCampus: (campus: string) => request(`/news/getNewsByCampus?campus=${encodeURIComponent(campus)}`)
  }
};
