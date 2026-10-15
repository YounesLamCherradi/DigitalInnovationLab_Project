type ApiError = Error | null;
type Result<T = unknown> = { data: T | null; error: ApiError };
type Session = { user: { id: string; email: string; role: AdminRole } };

async function request<T>(url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const response = await fetch(url, { credentials: 'include', ...init, headers: init?.body instanceof FormData ? init.headers : { 'Content-Type': 'application/json', ...init?.headers } });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) return { data: null, error: new Error(payload?.error || 'Request failed') };
    return { data: payload as T, error: null };
  } catch (error) { return { data: null, error: error instanceof Error ? error : new Error('Network request failed') }; }
}

class QueryBuilder implements PromiseLike<Result<any[]>> {
  private method = 'GET'; private body?: unknown; private id?: string; private orderBy?: string; private ascending = true; private adminScope = false;
  constructor(private table: string) {}
  select(_columns = '*') { return this; }
  insert(body: unknown) { this.method = 'POST'; this.body = body; return this; }
  update(body: unknown) { this.method = 'PATCH'; this.body = body; return this; }
  delete() { this.method = 'DELETE'; return this; }
  eq(column: string, value: string) { if (column !== 'id') throw new Error('Only id filters are supported'); this.id = value; return this; }
  order(column: string, options?: { ascending?: boolean }) { this.orderBy = column; this.ascending = options?.ascending ?? true; return this; }
  admin() { this.adminScope = true; return this; }
  then<TResult1 = Result<any[]>, TResult2 = never>(resolve?: ((value: Result<any[]>) => TResult1 | PromiseLike<TResult1>) | null, reject?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null) {
    const params = new URLSearchParams(); if (this.orderBy) { params.set('order', this.orderBy); params.set('ascending', String(this.ascending)); } if (this.adminScope) params.set('scope', 'admin');
    const query = params.size ? `?${params}` : '';
    return request<any[]>(`/api/tables/${this.table}${this.id ? `/${encodeURIComponent(this.id)}` : ''}${query}`, { method: this.method, body: this.body === undefined ? undefined : JSON.stringify(this.body) }).then(resolve, reject);
  }
}

const authListeners = new Set<(event: string, session: Session | null) => void>();

export const api = {
  from: (table: string) => new QueryBuilder(table),
  auth: {
    async getSession(): Promise<{ data: { session: Session | null }; error: ApiError }> {
      const result = await request<{ user: Session['user'] | null }>('/api/auth/session');
      return { data: { session: result.data?.user ? { user: result.data.user } : null }, error: result.error };
    },
    async signInWithPassword(credentials: { email: string; password: string }) {
      const result = await request<{ user: Session['user'] }>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      if (result.data) authListeners.forEach((listener) => listener('SIGNED_IN', { user: result.data!.user }));
      return result;
    },
    async signOut() { const result = await request('/api/auth/logout', { method: 'POST' }); authListeners.forEach((listener) => listener('SIGNED_OUT', null)); return result; },
    async updateUser({ password }: { password: string }) { return request('/api/auth/password', { method: 'PUT', body: JSON.stringify({ password }) }); },
    onAuthStateChange(listener: (event: string, session: Session | null) => void) { authListeners.add(listener); return { data: { subscription: { unsubscribe: () => { authListeners.delete(listener); } } } }; },
  },
  functions: { invoke: (_name: string, { body }: { body: unknown }) => request<any>('/api/users/action', { method: 'POST', body: JSON.stringify(body) }) },
  storage: {
    from: (bucket: string) => ({
      upload: async (_filename: string, file: File, _options?: { cacheControl?: string; upsert?: boolean }) => { const form = new FormData(); form.append('file', file); return request<{ path: string; publicUrl: string }>(`/api/uploads/${bucket}`, { method: 'POST', body: form }); },
      getPublicUrl: (filePath: string) => ({ data: { publicUrl: filePath.startsWith('/') ? filePath : `/uploads/${filePath}` } }),
    }),
  },
};

export async function submitApplication(input: {
  full_name: string; email: string; phone: string; position: string; opportunity_id?: string;
  cover_letter: string; resume: File;
}) {
  const form = new FormData();
  Object.entries(input).forEach(([key, value]) => { if (value !== undefined) form.append(key, value); });
  return request<{ id: string }>('/api/applications', { method: 'POST', body: form });
}

export async function decideApplication(id: string, status: 'pending' | 'accepted' | 'rejected', emailBody = '') {
  return request<{ status: 'pending' | 'accepted' | 'rejected'; emailSent: boolean }>(`/api/applications/${encodeURIComponent(id)}/decision`, {
    method: 'POST', body: JSON.stringify({ status, emailBody }),
  });
}

export interface ApplicationHistory { id: string; previous_status: Application['status']; new_status: Application['status']; changed_by: string | null; created_at: string; }
export function getApplicationHistory(id: string) { return request<ApplicationHistory[]>(`/api/applications/${encodeURIComponent(id)}/history`); }
export function saveApplicationNotes(id: string, notes: string) { return request<{ internal_notes: string; updated_at: string }>(`/api/applications/${encodeURIComponent(id)}/notes`, { method: 'PATCH', body: JSON.stringify({ notes }) }); }

export type AdminRole = 'administrator' | 'manager';
export async function getCurrentUserRole(): Promise<AdminRole | null> { const { data } = await api.auth.getSession(); return data.session?.user.role ?? null; }
export async function isCurrentUserAdmin() { return (await getCurrentUserRole()) !== null; }

export interface Project { id: string; title: string; category: string; description: string; image: string; technologies: string[]; status: 'completed' | 'in-progress' | 'planning'; website_link?: string | null; github_link?: string | null; }
export interface Opportunity { id: string; title: string; department: string; level: string; type: string; description: string; requirements: string[]; deadline: string; school?: 'sse' | 'sshs' | 'sba'; term?: 'spring' | 'summer' | 'fall' | 'winter'; education_level?: 'undergraduate' | 'graduate' | 'both'; }
export interface TeamMember { id: string; name: string; role: string; bio: string; image: string; section: 'board' | 'research' | 'lab-staff'; keywords: string[]; linkedin_url?: string | null; twitter_url?: string | null; }
export interface Application { id: string; full_name: string; email: string; phone: string; position: string; opportunity_id?: string; cover_letter: string; resume_url?: string; internal_notes?: string; status: 'pending' | 'accepted' | 'rejected'; created_at: string; updated_at: string; }
export interface News { id: string; title: string; content: string; image?: string; category?: string; author?: string; featured: boolean; published_at: string; created_at: string; updated_at: string; link?: string; publication_status: 'draft' | 'published' | 'scheduled'; scheduled_for?: string | null; }
