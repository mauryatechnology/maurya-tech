'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe,
  PlusCircle,
  Edit2,
  Check,
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMarketsPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/countries');
      const data = await res.json();
      if (data.success) {
        setCountries(data.countries || []);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
      toast.error('Failed to load countries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleToggleEnabled = async (country) => {
    try {
      const updatedStatus = !country.enabled;
      const res = await fetch('/api/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: country.code, enabled: updatedStatus }),
      });

      if (res.ok) {
        setCountries((prev) =>
          prev.map((c) => (c.code === country.code ? { ...c, enabled: updatedStatus } : c))
        );
        toast.success(`${country.name} is now ${updatedStatus ? 'Enabled' : 'Disabled'}`);
      }
    } catch {
      toast.error('Failed to update country status.');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCountry),
      });

      if (res.ok) {
        toast.success(`Updated ${editingCountry.name} configuration.`);
        setEditingCountry(null);
        fetchCountries();
      }
    } catch {
      toast.error('Failed to save market configuration.');
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
            <Globe className="w-6 h-6 text-cyan-400" />
            <span>Market & Country Manager</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure country hubs, currencies, language dialects, and launch tiers dynamically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCountries}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Country</th>
                <th className="py-3.5 px-4 font-semibold">Code</th>
                <th className="py-3.5 px-4 font-semibold">Currency</th>
                <th className="py-3.5 px-4 font-semibold">Default Language</th>
                <th className="py-3.5 px-4 font-semibold">Tier</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {countries.map((c) => {
                const flag = c.code === 'IN' ? '🇮🇳' : c.code === 'US' ? '🇺🇸' : c.code === 'UK' ? '🇬🇧' : '🌐';
                return (
                  <tr key={c.code} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-white font-bold flex items-center gap-2">
                      <span className="text-lg">{flag}</span>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{c.code}</td>
                    <td className="py-3 px-4">{c.currency}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{c.defaultLanguage}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px]">
                        Tier {c.launchTier || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleEnabled(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                          c.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {c.enabled ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active Hub</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingCountry(c)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                        title="Edit Market Config"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Configure {editingCountry.name} ({editingCountry.code})</span>
              </h3>
              <button onClick={() => setEditingCountry(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Currency Code</label>
                <input
                  type="text"
                  value={editingCountry.currency || ''}
                  onChange={(e) => setEditingCountry({ ...editingCountry, currency: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Default Language Code</label>
                <input
                  type="text"
                  value={editingCountry.defaultLanguage || ''}
                  onChange={(e) => setEditingCountry({ ...editingCountry, defaultLanguage: e.target.value })}
                  placeholder="e.g. en-IN"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Timezone</label>
                <input
                  type="text"
                  value={editingCountry.timezone || ''}
                  onChange={(e) => setEditingCountry({ ...editingCountry, timezone: e.target.value })}
                  placeholder="e.g. Asia/Kolkata"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCountry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
