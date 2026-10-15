import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Plus, RefreshCw, Search, ShieldCheck, UserCog, Users } from 'lucide-react';
import { AdminRole, api } from '@/lib/api';

type DashboardUser = {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
  last_sign_in_at?: string | null;
};

export const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AdminRole>('manager');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);

  const invokeUserFunction = async (body: Record<string, unknown>) => {
    const { data, error: functionError } = await api.functions.invoke('manage-users', { body });
    if (functionError) throw functionError;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setSetupRequired(false);
    try {
      const data = await invokeUserFunction({ action: 'list' });
      setUsers(data.users || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load dashboard users.';
      const unavailable = /404|not found|fetch|network/i.test(message);
      setSetupRequired(unavailable);
      setError(unavailable
        ? 'The PostgreSQL API is unavailable. Check that the server is running and DATABASE_URL is configured.'
        : message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await invokeUserFunction({ action: 'create', email: email.trim().toLowerCase(), password, role });
      setSuccess(`${email.trim().toLowerCase()} was created as ${role === 'administrator' ? 'an Administrator' : 'a Manager'}.`);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('manager');
      setShowForm(false);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the user.');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    return !query || user.email.toLowerCase().includes(query) || user.role.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard Users</h2>
          <p className="mt-1 text-sm text-gray-500">Create administrators and managers, and review dashboard access.</p>
        </div>
        <button disabled={setupRequired} onClick={() => { setShowForm((value) => !value); setError(null); setSuccess(null); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
          <Plus className="h-4 w-4" /> Add user
        </button>
      </div>

      {error && <div className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${setupRequired ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-red-200 bg-red-50 text-red-700'}`}><AlertCircle className="mt-0.5 h-5 w-5 flex-none" /><div><p className="font-semibold">{setupRequired ? 'PostgreSQL setup required' : 'Unable to load users'}</p><p className="mt-1">{error}</p></div></div>}
      {success && <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" /><span>{success}</span></div>}

      {showForm && !setupRequired && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="font-bold text-gray-900">Create dashboard user</h3>
            <p className="mt-1 text-sm text-gray-500">Managers can manage content but cannot access Applications or Dashboard Users.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label><input id="user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="off" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
            <div><label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-gray-700">Temporary password</label><input id="user-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
            <div><label htmlFor="user-confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label><input id="user-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
            <div className="sm:col-span-2"><label htmlFor="user-role" className="mb-1.5 block text-sm font-medium text-gray-700">Access level</label><select id="user-role" value={role} onChange={(event) => setRole(event.target.value as AdminRole)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"><option value="manager">Manager — content tabs only</option><option value="administrator">Administrator — full control</option></select></div>
          </div>
          <div className="mt-5 flex justify-end gap-3 border-t border-gray-100 pt-4"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg bg-gray-100 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-200">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-60">{saving ? 'Creating…' : 'Create user'}</button></div>
        </form>
      )}

      {!setupRequired && <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users or roles…" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
        <button onClick={fetchUsers} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>}

      {!setupRequired && (loading ? <div className="py-10 text-center text-gray-500">Loading users…</div> : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"><Users className="mx-auto h-9 w-9 text-gray-400" /><p className="mt-3 font-semibold text-gray-800">No dashboard users found</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3"><div className={`rounded-xl p-2.5 ${user.role === 'administrator' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'}`}>{user.role === 'administrator' ? <ShieldCheck className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}</div><div className="min-w-0"><p className="truncate font-semibold text-gray-900">{user.email}</p><p className="text-xs text-gray-500">Created {new Date(user.created_at).toLocaleDateString()}</p></div></div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'administrator' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-700'}`}>{user.role === 'administrator' ? 'Administrator' : 'Manager'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
