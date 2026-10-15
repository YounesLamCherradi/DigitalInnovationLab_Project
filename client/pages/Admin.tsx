import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BriefcaseBusiness, CheckCircle2, ExternalLink, FileText, FolderKanban, KeyRound, LogOut, Newspaper, ShieldCheck, UserCog, Users, X } from 'lucide-react';
import { AdminRole, getCurrentUserRole, api } from '@/lib/api';
import { ProjectsManager }      from '@/components/admin/ProjectsManager';
import { OpportunitiesManager } from '@/components/admin/OpportunitiesManager';
import { TeamMembersManager }   from '@/components/admin/TeamMembersManager';
import { ApplicationsManager }  from '@/components/admin/ApplicationsManager';
import { NewsManager }          from '@/components/admin/NewsManager';
import { UsersManager }         from '@/components/admin/UsersManager';

type TabType = 'projects' | 'opportunities' | 'team' | 'applications' | 'news' | 'users';
const VALID_TABS: TabType[] = ['applications', 'news', 'projects', 'opportunities', 'team', 'users'];

export default function Admin() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed]           = useState(false);
  const [adminEmail, setAdminEmail]   = useState('');
  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') as TabType | null;
  const permittedTabs = currentRole === 'manager' ? VALID_TABS.filter((tab) => tab !== 'applications' && tab !== 'users') : VALID_TABS;
  const defaultTab: TabType = currentRole === 'manager' ? 'news' : 'applications';
  const activeTab: TabType = requestedTab && permittedTabs.includes(requestedTab) ? requestedTab : defaultTab;

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await api.auth.getSession();
      const role = data.session ? await getCurrentUserRole() : null;
      if (!data.session || !role) {
        if (data.session) await api.auth.signOut();
        navigate('/admin-login', { replace: true });
      } else {
        setAdminEmail(data.session.user.email ?? 'Administrator');
        setCurrentRole(role);
        setAuthed(true);
      }
      setAuthChecked(true);
    };
    checkAuth();

    const { data: { subscription } } = api.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAuthed(false);
          navigate('/admin-login', { replace: true });
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await api.auth.signOut();
    navigate('/admin-login', { replace: true });
  };

  const selectTab = (tab: TabType) => {
    setSearchParams(tab === 'applications' ? {} : { tab }, { replace: true });
  };

  const openPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordChanged(false);
    setShowPasswordModal(true);
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('The passwords do not match.');
      return;
    }

    setChangingPassword(true);
    const { error } = await api.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setPasswordChanged(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  // Render nothing until auth is verified — prevents flash of admin UI
  if (!authChecked) return null;
  if (!authed) return null;

  const allTabs = [
    { id: 'applications' as const, label: 'Applications', icon: FileText },
    { id: 'news' as const, label: 'News', icon: Newspaper },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'opportunities' as const, label: 'Opportunities', icon: BriefcaseBusiness },
    { id: 'team' as const, label: 'Team Members', icon: Users },
    { id: 'users' as const, label: 'Dashboard Users', icon: UserCog },
  ];
  const tabs = currentRole === 'manager'
    ? allTabs.filter((tab) => tab.id !== 'applications' && tab.id !== 'users')
    : allTabs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <a href="/" aria-label="Digital Innovation Lab home" className="flex-none">
                <img src="/logo.png" alt="Al Akhawayn University" className="h-11 w-auto sm:h-12" />
              </a>
              <div className="hidden h-10 w-px bg-gray-200 sm:block" />
              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">Digital Innovation Lab</h1>
                  <span className="hidden items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary md:flex">
                    <ShieldCheck className="h-3 w-3" /> {currentRole === 'manager' ? 'Manager' : 'Admin'}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500 sm:text-sm">Content administration</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden text-right lg:block">
                <p className="max-w-52 truncate text-sm font-medium text-gray-700">{adminEmail}</p>
                <p className="text-xs text-gray-500">{currentRole === 'manager' ? 'Manager' : 'Administrator'}</p>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden md:inline">View website</span>
              </a>
              <button
                onClick={openPasswordModal}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
                title="Change password"
              >
                <KeyRound className="h-4 w-4" />
                <span className="hidden xl:inline">Change password</span>
              </button>
              <div className="hidden h-7 w-px bg-gray-200 sm:block" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7" aria-label="Admin sections">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <tab.icon className="h-4 w-4 flex-none" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 pb-12">
        {activeTab === 'applications'  && <ApplicationsManager />}
        {activeTab === 'news'          && <NewsManager />}
        {activeTab === 'projects'      && <ProjectsManager />}
        {activeTab === 'opportunities' && <OpportunitiesManager />}
        {activeTab === 'team'          && <TeamMembersManager />}
        {activeTab === 'users' && currentRole === 'administrator' && <UsersManager />}
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><KeyRound className="h-5 w-5" /></div>
                <div>
                  <h2 id="change-password-title" className="text-lg font-bold text-gray-900">Change password</h2>
                  <p className="text-xs text-gray-500">Update the password for {adminEmail}</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            {passwordChanged ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-3 text-lg font-semibold text-gray-900">Password changed</h3>
                <p className="mt-1 text-sm text-gray-500">Your new password is active immediately.</p>
                <button onClick={() => setShowPasswordModal(false)} className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90">Done</button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4 px-6 py-6">
                {passwordError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{passwordError}</div>}
                <div>
                  <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
                  <input id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={8} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <p className="mt-1 text-xs text-gray-500">Use at least 8 characters.</p>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm new password</label>
                  <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex gap-3 border-t border-gray-100 pt-4">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
                  <button type="submit" disabled={changingPassword} className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{changingPassword ? 'Updating…' : 'Update password'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
