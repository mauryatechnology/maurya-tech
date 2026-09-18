'use client';

import React, { useEffect, useState } from 'react';
import {
  Cpu,
  PlusCircle,
  Edit2,
  Trash2,
  Loader2,
  Code,
  Rocket,
  Cloud,
  Cog,
  Smartphone,
  Shield,
  Layers,
} from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    icon: 'Code',
    shortDescription: '',
    fullDescription: '',
    features: '',
    technologies: '',
    isPublished: true,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services?all=true');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      icon: 'Code',
      shortDescription: '',
      fullDescription: '',
      features: '',
      technologies: 'React, Node.js, Next.js, MongoDB',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingService(s);
    setFormData({
      title: s.title || '',
      icon: s.icon || 'Code',
      shortDescription: s.shortDescription || '',
      fullDescription: s.fullDescription || '',
      features: Array.isArray(s.features) ? s.features.join('\n') : '',
      technologies: Array.isArray(s.technologies) ? s.technologies.join(', ') : '',
      isPublished: s.isPublished !== undefined ? s.isPublished : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      features: formData.features.split('\n').map((f) => f.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = editingService
        ? `/api/services/${editingService.id || editingService.customId || editingService._id}`
        : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      }
    } catch (err) {
      console.error('Save service error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Are you sure you want to delete service "${s.title}"?`)) return;
    try {
      const res = await fetch(`/api/services/${s.id || s.customId || s._id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((item) => item._id !== s._id && item.id !== s.id));
      }
    } catch (err) {
      console.error('Delete service error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-400" />
            Services & Offerings CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your company&apos;s core software engineering services, features, and tech stacks
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-sm bg-slate-900 rounded-2xl border border-slate-800">
            No services found. Click &ldquo;Add New Service&rdquo; or Seed Database from Settings.
          </div>
        ) : (
          services.map((s) => (
            <div
              key={s._id || s.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {s.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{s.shortDescription}</p>

                {s.features && s.features.length > 0 && (
                  <div className="space-y-1 mb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-500">Features:</p>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {s.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="truncate">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-cyan-400 font-mono">
                  {s.technologies ? s.technologies.slice(0, 2).join(', ') : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-heading font-bold text-lg text-white">
                {editingService ? 'Edit Service Offering' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Custom Software Development"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Icon Key</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Code">Code (Software)</option>
                    <option value="Rocket">Rocket (MVP/Startups)</option>
                    <option value="Cloud">Cloud (SaaS & DevOps)</option>
                    <option value="Cog">Cog (Automation/CRM)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="Shield">Shield (Security/QA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence overview..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Service Description (Rich Markdown Editor)
                </label>
                <RichTextEditor
                  value={formData.fullDescription}
                  onChange={(val) => setFormData({ ...formData, fullDescription: val })}
                  placeholder="Detailed service delivery model, architecture, and standards in Markdown..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deliverables / Key Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Full-stack web applications&#10;API development & integration&#10;Performance optimization"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, Python, PostgreSQL, AWS"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="servicePublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="servicePublished" className="text-slate-300 font-medium">
                  Publish to live website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? 'Save Changes' : 'Publish Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
