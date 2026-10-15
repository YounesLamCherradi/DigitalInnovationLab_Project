import React, { useEffect, useState } from 'react';
import { FileText, AlertCircle, Check, Download, ExternalLink, Eye, FileDown, Inbox, Search, X } from 'lucide-react';
import { api, Application, decideApplication } from '@/lib/api';
import { ApplicationActionModal } from './modals/ApplicationActionModal';
import { ApplicationDetailModal } from './modals/ApplicationDetailModal';
import { Pagination } from './Pagination';

const PAGE_SIZE = 6;

export const ApplicationsManager: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [positions, setPositions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [actionModal, setActionModal] = useState<{ open: boolean; action: 'accept' | 'reject' | null }>({
    open: false,
    action: null,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await api
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);

      // Extract unique positions for filter
      const uniquePositions = [...new Set((data || []).map((app) => app.position))];
      setPositions(uniquePositions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: 'accepted' | 'rejected', emailBody: string) => {
    try {
      const { error } = await decideApplication(appId, newStatus, emailBody);

      if (error) throw error;

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus as 'accepted' | 'rejected' } : app
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      throw err;
    }
  };

  const getFilteredApplications = () => {
    return applications.filter((app) => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const positionMatch = filterPosition === 'all' || app.position === filterPosition;
      const query = search.trim().toLowerCase();
      const searchMatch = !query || [app.full_name, app.email, app.phone, app.position].some((value) => value?.toLowerCase().includes(query));
      return statusMatch && positionMatch && searchMatch;
    });
  };

  const filteredApps = getFilteredApplications();
  const paginatedApps = filteredApps.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const exportCsv = () => {
    const fields = ['full_name', 'email', 'phone', 'position', 'status', 'created_at'] as const;
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [fields.join(','), ...filteredApps.map((application) => fields.map((field) => escape(application[field])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h2 className="text-xl font-bold text-gray-900">Applications</h2><p className="text-sm text-gray-500 mt-1">{applications.length} total applications</p></div>
        <button onClick={exportCsv} disabled={filteredApps.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"><FileDown className="h-4 w-4" />Export CSV</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-yellow-200 bg-yellow-50">
          <p className="text-xs text-yellow-700 font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 bg-green-50">
          <p className="text-xs text-green-700 font-medium mb-1">Accepted</p>
          <p className="text-2xl font-bold text-green-800">{stats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-red-200 bg-red-50">
          <p className="text-xs text-red-700 font-medium mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      {applications.length > 0 && <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Name, email, position…" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as 'all' | 'pending' | 'accepted' | 'rejected'); setCurrentPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <select
            value={filterPosition}
            onChange={(e) => { setFilterPosition(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>}

      {/* Applications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Inbox className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No applications yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
              New submissions from the website application form will appear here, ready for review.
            </p>
            <a
              href="/apply"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              View application page <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="font-medium text-gray-800">No applications match these filters</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterPosition('all');
              }}
              className="mt-2 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          paginatedApps.map((app) => (
            <div key={app.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{app.full_name}</h3>
                      <p className="text-sm text-gray-600">Position: {app.position}</p>
                      <p className="text-sm text-gray-600">Email: {app.email}</p>
                      <p className="text-sm text-gray-600">Phone: {app.phone}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {app.resume_url && (
                        <a href={app.resume_url} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                          <Download className="h-4 w-4" /> Download résumé
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setDetailApp(app)} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Review details"><Eye className="h-4 w-4" /></button>
                    {app.status === 'pending' && <>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActionModal({ open: true, action: 'accept' });
                      }}
                      className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                      title="Accept"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActionModal({ open: true, action: 'reject' });
                      }}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    </>}
                  </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalItems={filteredApps.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />

      {/* Action Modal */}
      {actionModal.open && selectedApp && actionModal.action && (
        <ApplicationActionModal
          application={selectedApp}
          action={actionModal.action}
          onClose={() => {
            setActionModal({ open: false, action: null });
            setSelectedApp(null);
          }}
          onSuccess={(newStatus: 'accepted' | 'rejected', emailBody: string) => handleStatusChange(selectedApp.id, newStatus, emailBody)}
        />
      )}
      {detailApp && <ApplicationDetailModal application={detailApp} onClose={() => setDetailApp(null)} onRestore={async () => {
        const { error } = await decideApplication(detailApp.id, 'pending'); if (error) throw error;
        setApplications((items) => items.map((item) => item.id === detailApp.id ? { ...item, status: 'pending' } : item));
      }} onNotesSaved={(notes) => {
        setApplications((items) => items.map((item) => item.id === detailApp.id ? { ...item, internal_notes: notes } : item));
        setDetailApp((item) => item ? { ...item, internal_notes: notes } : item);
      }} />}
    </div>
  );
};
