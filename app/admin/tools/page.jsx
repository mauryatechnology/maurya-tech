'use client';

import React, { useEffect, useState } from 'react';
import {
  Calculator,
  Edit2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Code2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState(null);
  const [configJson, setConfigJson] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tools');
      const data = await res.json();
      if (data.success) {
        setTools(data.tools || []);
      }
    } catch (err) {
      console.error('Failed to load tools:', err);
      toast.error('Failed to load tools.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleToggleEnabled = async (tool) => {
    try {
      const updatedStatus = !tool.enabled;
      const res = await fetch('/api/tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: tool.slug, enabled: updatedStatus }),
      });

      if (res.ok) {
        setTools((prev) =>
          prev.map((t) => (t.slug === tool.slug ? { ...t, enabled: updatedStatus } : t))
        );
        toast.success(`${tool.name} is now ${updatedStatus ? 'Enabled' : 'Disabled'}`);
      }
    } catch {
      toast.error('Failed to update tool status.');
    }
  };

  const openEditModal = (t) => {
    setEditingTool(t);
    setConfigJson(JSON.stringify(t.computeConfig || {}, null, 2));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(configJson);
      } catch {
        toast.error('Invalid JSON syntax in computeConfig.');
        setSaving(false);
        return;
      }

      const payload = {
        ...editingTool,
        computeConfig: parsedConfig,
      };

      const res = await fetch('/api/tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Updated ${editingTool.name} configuration.`);
        setEditingTool(null);
        fetchTools();
      }
    } catch {
      toast.error('Failed to save tool configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-cyan-400" />
            <span>Tools & Calculators Manager</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage client-side calculators, country availability, tax slab rules & SEO schemas without redeploying code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTools}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Tool Name</th>
                <th className="py-3.5 px-4 font-semibold">Slug</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Countries</th>
                <th className="py-3.5 px-4 font-semibold">Scope</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {tools.map((t) => (
                <tr key={t.slug} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-white font-bold">{t.name}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{t.slug}</td>
                  <td className="py-3 px-4 capitalize">{t.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {(t.countries || ['IN']).map((c) => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400">{t.scope || 'GLOBAL'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleEnabled(t)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                        t.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {t.enabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{t.enabled ? 'Live' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/in/tools/${t.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        title="View Tool Live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                        title="Edit Configuration & Rules"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Configure Tool: {editingTool.name}</span>
              </h3>
              <button onClick={() => setEditingTool(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editingTool.name || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scope</label>
                  <select
                    value={editingTool.scope || 'GLOBAL'}
                    onChange={(e) => setEditingTool({ ...editingTool, scope: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="GLOBAL">GLOBAL (Available everywhere)</option>
                    <option value="LOCALIZED">LOCALIZED (Country specific config)</option>
                    <option value="COUNTRY_EXCLUSIVE">COUNTRY_EXCLUSIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  computeConfig JSON (Tax slabs, deduction rules & default values)
                </label>
                <textarea
                  rows={8}
                  value={configJson}
                  onChange={(e) => setConfigJson(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  Save Tool Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
