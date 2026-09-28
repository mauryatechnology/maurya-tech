'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, RefreshCw, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const Card = ({ title, children }) => (
  <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
    <h2 className="text-sm font-bold text-white">{title}</h2>
    {children}
  </section>
);

export default function AdminSeoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/admin/seo-report');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load report');
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-cyan-400" /> SEO Health
          </h1>
          <p className="text-xs text-slate-400 mt-1">Page inventory, review freshness, Quality Gate scores, orphan pages and launch configuration.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading && !data && (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" /> Building report…
        </div>
      )}
      {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">{error}</div>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Indexable pages', data.inventory.total],
              ['Tool pages', data.inventory.countryToolPages + data.inventory.globalToolPages],
              ['Salary pages', data.inventory.salaryPages],
              ['Guides + posts', data.inventory.guides + data.inventory.dbPublishedPosts],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">{k}</div>
                <div className="text-2xl font-extrabold text-white mt-1">{v}</div>
              </div>
            ))}
          </div>

          <Card title="Launch configuration">
            <ul className="space-y-1.5 text-xs">
              {data.config.map((c) => (
                <li key={c.key} className="flex items-start gap-2 text-slate-300">
                  {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>
                    <span className="font-mono text-slate-100">{c.key}</span>
                    {!c.ok && <span className="text-slate-400"> — {c.hint}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={`Generated pages gate — tools & salary pages (${data.pageGate.failing.length} of ${data.pageGate.total} failing)`}>
            <p className="text-xs text-slate-400">
              Checks title (20–60) and description (70–160) length, unique titles, answer-first summary, FAQ count, content depth, sources and review freshness.
              {' '}{Object.entries(data.pageGate.byType).map(([k, v]) => `${v} ${k} pages`).join(' · ')}
            </p>
            {data.pageGate.failing.length === 0 ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> All generated pages pass.</p>
            ) : (
              <ul className="space-y-1 text-xs text-slate-300">
                {data.pageGate.failing.map((f) => (
                  <li key={f.path}><span className="font-mono">{f.path}</span> <span className="text-amber-400">— {f.failing.join(', ')}</span></li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={`Guides & posts Quality Gate (${data.quality.filter((q) => !q.passed).length} failing)`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400">
                  <tr><th className="p-2">Page</th><th className="p-2">Source</th><th className="p-2">Score</th><th className="p-2">Failing checks</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {data.quality.map((q) => (
                    <tr key={`${q.source}-${q.slug}`}>
                      <td className="p-2 max-w-xs truncate">{q.title}</td>
                      <td className="p-2">{q.source}</td>
                      <td className={`p-2 font-bold ${q.passed ? 'text-emerald-400' : 'text-amber-400'}`}>{q.score}</td>
                      <td className="p-2 text-slate-400">{q.failing.join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Review freshness (finance pages must be reviewed within 12 months)">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
              {data.freshness.map((f) => (
                <li key={`${f.type}-${f.id}`} className="flex items-center gap-2 text-slate-300">
                  {f.stale ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span className="font-mono">{f.type}/{f.id}</span>
                  <span className="text-slate-500">{f.lastReviewed || 'never'}{f.ageDays != null ? ` · ${f.ageDays}d` : ''}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={`Orphan & thin-link report (${data.orphans.length})`}>
            {data.orphans.length === 0 ? (
              <p className="text-xs text-slate-400">No orphans found.</p>
            ) : (
              <ul className="space-y-1 text-xs text-slate-300">
                {data.orphans.map((o, i) => (
                  <li key={i}><span className="font-mono">{o.type}/{o.id}</span> <span className="text-slate-500">— {o.reason}</span></li>
                ))}
              </ul>
            )}
          </Card>

          <p className="text-[11px] text-slate-500">Generated {new Date(data.generatedAt).toLocaleString()}</p>
        </>
      )}
    </div>
  );
}
