import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Search } from 'lucide-react';
import { api, TeamMember } from '@/lib/api';
import { TeamMemberForm } from './forms/TeamMemberForm';
import { Pagination } from './Pagination';

const PAGE_SIZE = 6;

export const TeamMembersManager: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await api
        .from('team_members')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await api.from('team_members').delete().eq('id', id);
      if (error) throw error;
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team member');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchTeamMembers();
  };

  const filteredMembers = members.filter((member) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [member.name, member.role, member.bio, ...member.keywords].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (sectionFilter === 'all' || member.section === sectionFilter);
  });
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const sectionGroups = {
    board: paginatedMembers.filter(m => m.section === 'board'),
    research: paginatedMembers.filter(m => m.section === 'research'),
    'lab-staff': paginatedMembers.filter(m => m.section === 'lab-staff'),
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      board: 'Board Members',
      research: 'Research Team',
      'lab-staff': 'Lab Staff',
    };
    return labels[section] || section;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-1">{members.length} team members in total</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
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
        <TeamMemberForm
          member={editingMember}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {members.length > 0 && (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_220px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search name, role or expertise…" className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <select value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"><option value="all">All teams</option><option value="board">Board members</option><option value="research">Research team</option><option value="lab-staff">Lab staff</option></select>
        </div>
      )}

      {/* Team Members by Section */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading team members...</div>
      ) : filteredMembers.length === 0 && members.length > 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-10 text-center text-gray-500">No team members match your filters.</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(sectionGroups).filter(([, groupMembers]) => groupMembers.length > 0).map(([section, groupMembers]) => (
            <div key={section}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{getSectionLabel(section)}</h3>
              {groupMembers.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  No members in this section
                </div>
              ) : (
                <div className="grid gap-3">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                          {member.keywords.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {member.keywords.map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                          {member.linkedin_url && (
                            <p className="text-xs text-blue-600 mt-1 truncate">
                              LinkedIn: <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="underline">
                                Profile
                              </a>
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination currentPage={currentPage} totalItems={filteredMembers.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
    </div>
  );
};
