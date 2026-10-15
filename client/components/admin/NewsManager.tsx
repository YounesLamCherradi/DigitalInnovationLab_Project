import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Search, Star } from 'lucide-react';
import { api, News } from '@/lib/api';
import { resolveAssetUrl } from '@/lib/assets';
import { NewsForm } from './forms/NewsForm';
import { Pagination } from './Pagination';

const PAGE_SIZE = 6;

export const NewsManager: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await api
        .from('news')
        .admin()
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      const { error } = await api.from('news').delete().eq('id', id);
      if (error) throw error;
      setNews(news.filter(n => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete news');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await api
        .from('news')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;
      setNews(news.map(n => n.id === id ? { ...n, featured: !currentFeatured } : n));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update news');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchNews();
  };

  const filteredNews = news.filter((article) => {
    const query = search.trim().toLowerCase();
    return !query || [article.title, article.category, article.author, article.content].some((value) => value?.toLowerCase().includes(query));
  });
  const paginatedNews = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">News</h2>
          <p className="text-sm text-gray-500 mt-1">{news.length} news articles in total</p>
        </div>
        <button
          onClick={() => {
            setEditingNews(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add News</span>
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
        <NewsForm
          news={editingNews}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {news.length > 0 && (
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search news by title or content…" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      )}

      {/* News List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No news yet. Create one to get started!</div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No news matches your search.</div>
        ) : (
          paginatedNews.map((article) => (
            <div key={article.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-4">
                {/* Image */}
                {article.image && (
                  <img
                    src={resolveAssetUrl(article.image)}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 break-words">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                      <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
                        {article.category && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            {article.category}
                          </span>
                        )}
                        {article.author && (
                          <span className="text-xs text-gray-500">By {article.author}</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${article.publication_status === 'published' ? 'bg-green-100 text-green-700' : article.publication_status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {article.publication_status === 'scheduled' && article.scheduled_for ? `Scheduled ${new Date(article.scheduled_for).toLocaleString()}` : article.publication_status.charAt(0).toUpperCase() + article.publication_status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(article.id, article.featured)}
                        className={`p-2 rounded-lg transition-colors ${
                          article.featured
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                        title={article.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className="w-4 h-4" fill={article.featured ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingNews(article);
                          setShowForm(true);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination currentPage={currentPage} totalItems={filteredNews.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
    </div>
  );
};
