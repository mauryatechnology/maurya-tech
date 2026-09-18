'use client';

import React, { useEffect, useState } from 'react';
import {
  Zap,
  PlusCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Sliders,
  Sparkles,
  Loader2,
  ShieldCheck,
  Tag,
  BookOpen,
} from 'lucide-react';

export default function AdminAutomationPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    country: 'IN',
    category: 'Engineering',
    clusterType: 'spoke',
    targetKeywords: '',
    aiProvider: 'none',
    mode: 'assisted_review',
    relatedToolSlug: '',
    enabled: true,
  });

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/automation/rules');
      const data = await res.json();
      if (data.success) {
        setRules(data.rules || []);
      }
    } catch (err) {
      console.error('Failed to load rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleEnabled = async (rule) => {
    try {
      const res = await fetch('/api/automation/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule._id, enabled: !rule.enabled }),
      });
      const data = await res.json();
      if (data.success) {
        setRules((prev) =>
          prev.map((r) => (r._id === rule._id ? { ...r, enabled: !r.enabled } : r))
        );
      }
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        ...formData,
        targetKeywords: formData.targetKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/automation/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchRules();
        setFeedback({ type: 'success', message: 'New automation rule added successfully.' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to create rule.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error submitting automation rule.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSimulateRun = async (ruleId) => {
    setTriggerLoading(ruleId);
    setFeedback(null);
    setTimeout(() => {
      setTriggerLoading(null);
      setFeedback({
        type: 'success',
        message: 'Rule triggered: Generated content draft routed to Quality Gate in "In Review" status.',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Content Automation Rules
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Programmatic content rules, topic clustering triggers, and AI-assisted drafts with strict Quality Gate compliance
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              country: 'IN',
              category: 'Engineering',
              clusterType: 'spoke',
              targetKeywords: '',
              aiProvider: 'none',
              mode: 'assisted_review',
              relatedToolSlug: '',
              enabled: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Automation Rule</span>
        </button>
      </div>

      {/* Safety Policy Alert Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Google Helpful Content Protection Active:</span> Direct autonomous publishing is blocked by system governance. All automated generation operates in <code className="text-cyan-300 font-mono px-1 py-0.5 bg-slate-800 rounded">assisted_review</code> mode, routing new drafts to the Editorial Quality Gate where human approval is required.
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading automation rules...
          </div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No automation rules configured. Click "Add Automation Rule" to establish topic clustering schedules.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Rule Name</th>
                  <th className="p-4">Target Market</th>
                  <th className="p-4">Category & Cluster</th>
                  <th className="p-4">Target Keywords</th>
                  <th className="p-4">Engine Mode</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rules.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">{r.name}</div>
                      {r.relatedToolSlug && (
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                          Companion: {r.relatedToolSlug}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {r.country}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{r.category}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{r.clusterType}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(r.targetKeywords || []).map((k, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {r.mode}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleEnabled(r)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition cursor-pointer ${
                          r.enabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleSimulateRun(r._id)}
                        disabled={triggerLoading === r._id}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-50"
                        title="Trigger draft creation"
                      >
                        {triggerLoading === r._id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                        ) : (
                          <Play className="w-3 h-3 text-cyan-400" />
                        )}
                        <span>Run Draft</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-heading font-bold text-base text-white">
                Add Content Automation Rule
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. US Hourly Tech Wage Guides"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Market</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="IN">🇮🇳 India (/in)</option>
                    <option value="US">🇺🇸 USA (/us)</option>
                    <option value="UK">🇬🇧 UK (/uk)</option>
                    <option value="GLOBAL">🌐 Global</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Finance">Finance</option>
                    <option value="Careers">Careers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cluster Type</label>
                  <select
                    value={formData.clusterType}
                    onChange={(e) => setFormData({ ...formData, clusterType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="spoke">Spoke Article</option>
                    <option value="pillar">Pillar Guide</option>
                    <option value="tool_guide">Calculator Companion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Companion Tool</label>
                  <input
                    type="text"
                    value={formData.relatedToolSlug}
                    onChange={(e) => setFormData({ ...formData, relatedToolSlug: e.target.value })}
                    placeholder="e.g. hourly-to-annual-salary"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.targetKeywords}
                  onChange={(e) => setFormData({ ...formData, targetKeywords: e.target.value })}
                  placeholder="salary calculator, hourly rate, developer salary"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Save Rule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
