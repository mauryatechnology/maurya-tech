'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  History,
  Filter,
  RefreshCw,
  Clock,
  User,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (entityFilter !== 'all') params.append('entityType', entityFilter);

      const res = await fetch(`/api/audit?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [entityFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <History className="w-8 h-8 text-cyan-400" />
            Audit Trail & Mutation Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Immutable log of system configuration updates, content mutations, and administrative operations
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs text-slate-400">
          Showing recent <span className="font-bold text-white">{logs.length}</span> audit events
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Entities</option>
            <option value="Post">Posts / Articles</option>
            <option value="Tool">Tools</option>
            <option value="Country">Countries</option>
            <option value="Order">Orders</option>
            <option value="AutomationRule">Automation Rules</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading audit trails...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No audit logs found. Perform an admin action (e.g. update a tool or post) to generate log records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Target Name / Description</th>
                  <th className="p-4">Admin User</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((l) => (
                  <React.Fragment key={l._id}>
                    <tr className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(l.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            l.action === 'create'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : l.action === 'delete'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {l.entityType}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {l.entityName || l.entityId || 'System Entity'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{l.performedBy || 'admin'}</span>
                        </div>
                        {l.ip && (
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            IP: {l.ip}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {l.changes && Object.keys(l.changes).length > 0 ? (
                          <button
                            onClick={() => toggleExpand(l._id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer inline-flex items-center gap-1"
                          >
                            <span className="text-[10px]">Diff</span>
                            {expandedLogId === l._id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedLogId === l._id && (
                      <tr className="bg-slate-950/60">
                        <td colSpan={6} className="p-4">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                            <pre>{JSON.stringify(l.changes, null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
