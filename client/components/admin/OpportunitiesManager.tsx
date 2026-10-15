import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Search } from 'lucide-react';
import { api, Opportunity } from '@/lib/api';
import { OpportunityForm } from './forms/OpportunityForm';
import { Pagination } from './Pagination';

const PAGE_SIZE = 6;

export const OpportunitiesManager: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await api
        .from('opportunities')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setOpportunities(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await api.from('opportunities').delete().eq('id', id);
      if (error) throw error;
      setOpportunities(opportunities.filter(o => o.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOpportunity(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchOpportunities();
  };

  const types = [...new Set(opportunities.map((opportunity) => opportunity.type))];
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [opportunity.title, opportunity.description, opportunity.department].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (typeFilter === 'all' || opportunity.type === typeFilter);
  });
  const paginatedOpportunities = filteredOpportunities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Opportunities</h2>
          <p className="text-sm text-gray-500 mt-1">{opportunities.length} opportunities in total</p>
        </div>
        <button
          onClick={() => {
            setEditingOpportunity(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {opportunities.length > 0 && (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_220px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search opportunities…" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"><option value="all">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select>
        </div>
      )}

      {/* Opportunities List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No opportunities yet. Create one to get started!</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No opportunities match your filters.</div>
        ) : (
          paginatedOpportunities.map((opp) => (
            <div key={opp.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{opp.title}</h3>
                  <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {opp.department}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {opp.level}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {opp.type}
                    </span>
                    {opp.school && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-semibold uppercase">
                        {opp.school}
                      </span>
                    )}
                    {opp.term && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded font-semibold capitalize">
                        {opp.term}
                      </span>
                    )}
                    {opp.education_level && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold capitalize">
                        {opp.education_level === 'both' ? 'Underg/Grad' : opp.education_level}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{opp.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{opp.requirements.length} requirements</span>
                    <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingOpportunity(opp);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination currentPage={currentPage} totalItems={filteredOpportunities.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
    </div>
  );
};
