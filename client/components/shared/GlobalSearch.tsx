import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

type Result = { id: string; title: string; description: string; type: string; href: string };
export const GlobalSearch: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState(''); const [items, setItems] = useState<Result[]>([]); const [loading, setLoading] = useState(false);
  useEffect(() => { if (!open || items.length) return; setLoading(true); Promise.all(['projects','opportunities','news','team_members'].map((table) => api.from(table).select('*'))).then(([projects, opportunities, news, team]) => { setItems([
    ...(projects.data || []).map((x: any) => ({ id:x.id,title:x.title,description:x.description,type:'Project',href:'/projects' })),
    ...(opportunities.data || []).map((x: any) => ({ id:x.id,title:x.title,description:x.description,type:'Opportunity',href:'/apply' })),
    ...(news.data || []).map((x: any) => ({ id:x.id,title:x.title,description:x.content,type:'News',href:'/news' })),
    ...(team.data || []).map((x: any) => ({ id:x.id,title:x.name,description:`${x.role} — ${x.bio}`,type:'Team',href:'/team' })),
  ]); setLoading(false); }); }, [open, items.length]);
  useEffect(() => { if (!open) setQuery(''); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, [open, onClose]);
  const results = useMemo(() => { const value=query.trim().toLowerCase(); if (value.length < 2) return []; return items.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(value)).slice(0, 12); }, [items, query]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center gap-3 border-b p-4"><Search className="h-5 w-5 text-gray-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, news, opportunities, and people…" className="flex-1 border-0 text-base outline-none" aria-label="Search website" /><button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close search"><X className="h-5 w-5" /></button></div><div className="max-h-[65vh] overflow-y-auto p-3">{loading ? <p className="p-5 text-center text-sm text-gray-500">Loading content…</p> : query.trim().length < 2 ? <p className="p-5 text-center text-sm text-gray-500">Enter at least two characters to search.</p> : results.length === 0 ? <p className="p-5 text-center text-sm text-gray-500">No matching content found.</p> : results.map((item) => <Link key={`${item.type}-${item.id}`} to={item.href} onClick={onClose} className="block rounded-xl p-4 hover:bg-primary/5"><div className="flex items-center gap-2"><span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.type}</span><h3 className="font-semibold text-gray-900">{item.title}</h3></div><p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p></Link>)}</div></div></div>;
};
