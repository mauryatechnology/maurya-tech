'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BellRing, Download, Filter, Loader2, RefreshCw, Send } from 'lucide-react';

const STATUS_STYLE = {
  subscribed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  unsubscribed: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

const inputCls = 'w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500';

/** Compose and send a rule-change alert; calls the API in batches until everyone is mailed. */
function SendAlertPanel({ onDone }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [link, setLink] = useState('');
  const [countries, setCountries] = useState(['IN']);
  const [testTo, setTestTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const toggle = (c) => setCountries((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  const post = (payload) =>
    fetch('/api/admin/subscribers/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body, link, countries, ...payload }),
    }).then((r) => r.json());

  const sendTest = async () => {
    setBusy(true);
    const res = await post({ testTo }).catch(() => ({ message: 'Network error.' }));
    setLog(res.message || '');
    setBusy(false);
  };

  const sendAll = async () => {
    if (!window.confirm(`Email every confirmed subscriber in ${countries.join(', ')}? This cannot be undone.`)) return;
    // Reusing the ID after an interruption resumes the same campaign without duplicates.
    const id = campaignId || `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    setCampaignId(id);
    setBusy(true);
    let sent = 0;
    let failed = 0;
    try {
      for (;;) {
        const res = await post({ campaignId: id });
        if (!res.success) {
          setLog(`${res.message || 'Sending stopped.'} Sent ${sent} so far — press Send again to resume.`);
          return;
        }
        sent += res.sent;
        failed += res.failed;
        setLog(`Sent ${sent}${failed ? `, failed ${failed}` : ''}, remaining ${res.remaining}…`);
        if (!res.remaining) break;
      }
      setLog(`Done. Sent ${sent}${failed ? `, failed ${failed}` : ''}.`);
      setCampaignId('');
      onDone?.();
    } catch {
      setLog(`Network error. Sent ${sent} so far — press Send again to resume.`);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
      >
        <Send className="w-3.5 h-3.5" /> Send a rule-change alert
      </button>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
      <h2 className="text-sm font-bold text-white flex items-center gap-2"><Send className="w-4 h-4 text-cyan-400" /> Send a rule-change alert</h2>
      <p className="text-xs text-slate-400">Send only after the calculators are updated and verified. Goes to confirmed subscribers only; every email has an unsubscribe link.</p>
      <input className={inputCls} placeholder="Subject, e.g. Budget 2027: new tax slabs are live" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} />
      <textarea className={`${inputCls} min-h-[140px]`} placeholder="What changed and what it means (plain text; blank line = new paragraph)" value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} />
      <input className={inputCls} placeholder="Link to the updated calculator, e.g. /in/tools/ctc-calculator" value={link} onChange={(e) => setLink(e.target.value)} />
      <div className="flex flex-wrap gap-3 text-xs text-slate-300">
        {['IN', 'US', 'UK', 'GLOBAL'].map((c) => (
          <label key={c} className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={countries.includes(c)} onChange={() => toggle(c)} className="accent-cyan-500" /> {c}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input className={`${inputCls} max-w-xs`} placeholder="Test address" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
        <button disabled={busy || !subject || !body || !testTo} onClick={sendTest} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-50 cursor-pointer">
          Send test
        </button>
        <button disabled={busy || !subject || !body || !countries.length} onClick={sendAll} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-2">
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {campaignId ? 'Resume sending' : 'Send to subscribers'}
        </button>
        <button onClick={() => setOpen(false)} disabled={busy} className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Close</button>
      </div>
      {log && <p role="status" className="text-xs text-slate-300">{log}</p>}
    </div>
  );
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('subscribed');
  const [country, setCountry] = useState('all');

  const params = new URLSearchParams();
  if (status !== 'all') params.append('status', status);
  if (country !== 'all') params.append('country', country);
  const qs = params.toString();

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/admin/subscribers?${qs}`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setCounts(data.counts || []);
      } else {
        setError(data.message || 'Could not load subscribers.');
      }
    } catch {
      setError('Could not load subscribers.');
    } finally {
      setLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const total = (s, c) => counts.filter((x) => (!s || x.status === s) && (!c || x.country === c)).reduce((n, x) => n + x.n, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <BellRing className="w-8 h-8 text-cyan-400" />
            Tax-Alert Subscribers
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Double opt-in sign-ups from tool and salary pages. Email only <span className="text-white font-semibold">subscribed</span> addresses.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href={`/api/admin/subscribers?${qs ? `${qs}&` : ''}format=csv`}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Subscribed', total('subscribed')],
          ['Pending confirmation', total('pending')],
          ['Unsubscribed', total('unsubscribed')],
          ['Subscribed IN / US / UK', `${total('subscribed', 'IN')} / ${total('subscribed', 'US')} / ${total('subscribed', 'UK')}`],
        ].map(([label, value]) => (
          <div key={label} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-400">{label}</div>
            <div className="text-xl font-bold text-white mt-1">{value}</div>
          </div>
        ))}
      </div>

      <SendAlertPanel onDone={fetchSubscribers} />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{subscribers.length}</span> addresses (latest 500; the CSV has all)
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All statuses</option>
            <option value="subscribed">Subscribed</option>
            <option value="pending">Pending</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Filter by country"
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All countries</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="GLOBAL">Global</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading subscribers...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 text-sm">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No subscribers match these filters yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Email</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Source page</th>
                  <th className="p-4">Signed up</th>
                  <th className="p-4">Confirmed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-slate-200">{s.email}</td>
                    <td className="p-4 text-slate-300">{s.country}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${STATUS_STYLE[s.status] || ''}`}>{s.status}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{s.source || '—'}</td>
                    <td className="p-4 text-slate-400">{fmt(s.createdAt)}</td>
                    <td className="p-4 text-slate-400">{fmt(s.confirmedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
