'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  PlusCircle,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MousePointerClick,
  Globe,
  Tag,
  Loader2,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function AdminMonetizationPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'dev_tool',
    country: 'GLOBAL',
    placement: 'tool_sidebar',
    targetUrl: '',
    badge: 'Partner Offer',
    ctaText: 'Explore Deal',
    description: '',
    imageUrl: '',
    enabled: true,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/monetization/offers?all=true');
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      slug: '',
      category: 'dev_tool',
      country: 'GLOBAL',
      placement: 'tool_sidebar',
      targetUrl: '',
      badge: 'Special Offer',
      ctaText: 'Claim Deal',
      description: '',
      imageUrl: '',
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      slug: offer.slug || '',
      category: offer.category || 'dev_tool',
      country: offer.country || 'GLOBAL',
      placement: offer.placement || 'tool_sidebar',
      targetUrl: offer.targetUrl || '',
      badge: offer.badge || 'Partner Offer',
      ctaText: offer.ctaText || 'Learn More',
      description: offer.description || '',
      imageUrl: offer.imageUrl || '',
      enabled: offer.enabled !== false,
    });
    setIsModalOpen(true);
  };

  const handleToggleEnabled = async (offer) => {
    try {
      const res = await fetch('/api/monetization/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer._id, enabled: !offer.enabled }),
      });
      if (res.ok) {
        setOffers((prev) =>
          prev.map((o) => (o._id === offer._id ? { ...o, enabled: !o.enabled } : o))
        );
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = editingOffer ? 'PUT' : 'POST';
      const payload = editingOffer ? { id: editingOffer._id, ...formData } : formData;

      const res = await fetch('/api/monetization/offers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchOffers();
        setFeedback({
          type: 'success',
          message: editingOffer ? 'Offer updated successfully.' : 'New affiliate offer created.',
        });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to save offer.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error saving offer.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offer) => {
    if (!confirm(`Are you sure you want to delete offer "${offer.title}"?`)) return;
    try {
      const res = await fetch(`/api/monetization/offers?id=${offer._id}`, { method: 'DELETE' });
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o._id !== offer._id));
        setFeedback({ type: 'success', message: 'Offer deleted successfully.' });
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const totalClicks = offers.reduce((sum, o) => sum + (o.clicksCount || 0), 0);
  const activeCount = offers.filter((o) => o.enabled).length;

  const filteredOffers = offers.filter((o) => {
    if (countryFilter === 'ALL') return true;
    return o.country === countryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            Monetization & Affiliate CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage sponsored ad slots, affiliate deals (tax filing, hosting, courses), and country targeting
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Affiliate Deal</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Deals Configured</div>
          <div className="text-2xl font-bold text-white mt-1">{offers.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Active / Live Offers</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Tracked Clicks</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-cyan-500" />
            <span>{totalClicks}</span>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
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

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredOffers.length}</span> monetization placements
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Countries</option>
            <option value="IN">🇮🇳 India (IN)</option>
            <option value="US">🇺🇸 United States (US)</option>
            <option value="UK">🇬🇧 United Kingdom (UK)</option>
            <option value="GLOBAL">🌐 Global</option>
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading affiliate offers...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No monetization offers found. Click &ldquo;New Affiliate Deal&rdquo; to create sponsored partner slots.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Offer & Badge</th>
                  <th className="p-4">Target Market</th>
                  <th className="p-4">Category & Placement</th>
                  <th className="p-4">Tracking Link</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOffers.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">{o.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {o.badge}
                        </span>
                        <span className="text-[11px] text-slate-500">CTA: &ldquo;{o.ctaText}&rdquo;</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {o.country}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-medium capitalize">
                        {o.category.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {o.placement}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      <a
                        href={o.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 flex items-center gap-1"
                      >
                        <span className="truncate">{o.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="p-4 font-mono font-bold text-cyan-400">
                      {o.clicksCount || 0}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleEnabled(o)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition cursor-pointer ${
                          o.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(o)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(o)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                {editingOffer ? 'Edit Monetization Offer' : 'Create Affiliate Deal'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Quicko - File Indian Taxes Online with ₹500 Discount"
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
                    <option value="GLOBAL">🌐 Global (All Markets)</option>
                    <option value="IN">🇮🇳 India (/in)</option>
                    <option value="US">🇺🇸 USA (/us)</option>
                    <option value="UK">🇬🇧 UK (/uk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tax_filing">Tax Filing Software</option>
                    <option value="hosting">Cloud & Hosting</option>
                    <option value="dev_tool">Developer Tools</option>
                    <option value="courses">Engineering Courses</option>
                    <option value="career">Resume & Career Advisory</option>
                    <option value="banking">Banking & Fintech</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Page Placement</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tool_sidebar">Calculator Sidebar Card</option>
                    <option value="tool_footer">Tool Bottom Banner</option>
                    <option value="blog_inline">Article Inline Sponsor</option>
                    <option value="banner_top">Top Header Sticky</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 20% Discount"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Affiliate / Tracking Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://partner.com/?ref=mauryatech"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Claim Discount"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-500"
                    />
                    <span>Enable Immediately</span>
                  </label>
                </div>
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
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingOffer ? 'Save Changes' : 'Create Deal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
