import React, { useEffect, useState } from 'react';
import { Download, History, RotateCcw, Save, X } from 'lucide-react';
import { Application, ApplicationHistory, getApplicationHistory, saveApplicationNotes } from '@/lib/api';

type Props = { application: Application; onClose: () => void; onRestore: () => Promise<void>; onNotesSaved: (notes: string) => void };

export const ApplicationDetailModal: React.FC<Props> = ({ application, onClose, onRestore, onNotesSaved }) => {
  const [notes, setNotes] = useState(application.internal_notes || '');
  const [history, setHistory] = useState<ApplicationHistory[]>([]);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplicationHistory(application.id).then(({ data, error }) => error ? setError(error.message) : setHistory(data || []));
  }, [application.id]);

  const saveNotes = async () => {
    setSaving(true); setError(null);
    const result = await saveApplicationNotes(application.id, notes);
    setSaving(false);
    if (result.error) return setError(result.error.message);
    onNotesSaved(notes);
  };

  const restore = async () => {
    setRestoring(true); setError(null);
    try { await onRestore(); onClose(); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to restore application'); }
    finally { setRestoring(false); }
  };

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="mx-auto my-6 max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b px-6 py-5">
        <div><h2 className="text-xl font-bold text-gray-900">{application.full_name}</h2><p className="text-sm text-gray-500">{application.position} · Submitted {new Date(application.created_at).toLocaleString()}</p></div>
        <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close"><X className="h-5 w-5" /></button>
      </div>
      {error && <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-5">
          <section className="rounded-xl border p-4"><h3 className="font-bold text-gray-900">Applicant details</h3><div className="mt-3 space-y-1 text-sm text-gray-700"><p><strong>Email:</strong> <a className="text-primary hover:underline" href={`mailto:${application.email}`}>{application.email}</a></p><p><strong>Phone:</strong> {application.phone}</p><p><strong>Status:</strong> <span className="capitalize">{application.status}</span></p></div></section>
          <section className="rounded-xl border p-4"><h3 className="font-bold text-gray-900">Cover letter</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">{application.cover_letter}</p></section>
          <section className="rounded-xl border p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-gray-900">Private notes</h3><button onClick={saveNotes} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save'}</button></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} maxLength={10000} className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Notes visible only to administrators…" /></section>
        </div>
        <div className="space-y-5">
          <section className="overflow-hidden rounded-xl border"><div className="flex items-center justify-between border-b px-4 py-3"><h3 className="font-bold text-gray-900">Résumé</h3>{application.resume_url && <a href={application.resume_url} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Download className="h-4 w-4" />Download</a>}</div>{application.resume_url ? <iframe title={`${application.full_name} résumé`} src={application.resume_url} className="h-[480px] w-full bg-gray-100" /> : <p className="p-6 text-sm text-gray-500">No résumé attached.</p>}</section>
          <section className="rounded-xl border p-4"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold text-gray-900"><History className="h-4 w-4" />Status history</h3>{application.status !== 'pending' && <button onClick={restore} disabled={restoring} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary disabled:opacity-50"><RotateCcw className="h-4 w-4" />{restoring ? 'Restoring…' : 'Restore to pending'}</button>}</div><div className="mt-3 space-y-3">{history.length === 0 ? <p className="text-sm text-gray-500">No status changes recorded yet.</p> : history.map((item) => <div key={item.id} className="border-l-2 border-primary/30 pl-3 text-sm"><p className="font-medium capitalize text-gray-800">{item.previous_status} → {item.new_status}</p><p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()} · {item.changed_by || 'Former administrator'}</p></div>)}</div></section>
        </div>
      </div>
    </div>
  </div>;
};
