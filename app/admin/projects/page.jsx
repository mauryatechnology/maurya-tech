'use client';

import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Star,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'SaaS Platforms',
    role: 'Full Stack Development',
    shortDescription: '',
    fullDescription: '',
    problem: '',
    solution: '',
    thumbnail: '',
    liveLink: '',
    githubLink: '',
    results: '',
    frontendTech: '',
    backendTech: '',
    isFeatured: false,
    isPublished: true,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?all=true');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'SaaS Platforms',
      role: 'Full Stack Development',
      shortDescription: '',
      fullDescription: '',
      problem: '',
      solution: '',
      thumbnail: '',
      liveLink: '',
      githubLink: '',
      results: '',
      frontendTech: 'React, Next.js, Tailwind CSS',
      backendTech: 'Node.js, MongoDB',
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'SaaS Platforms',
      role: p.role || 'Full Stack Development',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      problem: p.problem || '',
      solution: p.solution || '',
      thumbnail: p.thumbnail || '',
      liveLink: p.liveLink || '',
      githubLink: p.githubLink || '',
      results: Array.isArray(p.results) ? p.results.join('\n') : '',
      frontendTech: p.techStack?.frontend ? p.techStack.frontend.join(', ') : '',
      backendTech: p.techStack?.backend ? p.techStack.backend.join(', ') : '',
      isFeatured: p.isFeatured || false,
      isPublished: p.isPublished !== undefined ? p.isPublished : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      results: formData.results.split('\n').map((s) => s.trim()).filter(Boolean),
      techStack: {
        frontend: formData.frontendTech.split(',').map((s) => s.trim()).filter(Boolean),
        backend: formData.backendTech.split(',').map((s) => s.trim()).filter(Boolean),
      },
    };

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.slug || editingProject.id || editingProject._id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error('Save project error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Are you sure you want to delete project "${p.title}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${p.slug || p.id || p._id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((item) => item._id !== p._id && item.slug !== p.slug));
      }
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-cyan-400" />
            Portfolio & Projects CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage showcase projects, case studies, technologies, and live client links
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid / Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading portfolio projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No projects found. Seed from Settings or click &ldquo;Add New Project&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Project</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p._id || p.slug} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-100 text-sm">{p.title}</div>
                      <div className="text-[11px] text-cyan-400 font-mono">/projects/{p.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{p.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          p.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {p.liveLink && (
                          <a
                            href={p.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                            title="Live URL"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                          title="View Case Study"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-heading font-bold text-lg text-white">
                {editingProject ? 'Edit Project Case Study' : 'Add New Portfolio Project'}
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
                  <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. LeadHarvest SaaS"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="leadharvest-saas"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SaaS Platforms">SaaS Platforms</option>
                    <option value="Business Applications">Business Applications</option>
                    <option value="Startups">Startups</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="IoT & AI">IoT & AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role / Deliverable</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Full Stack Engineering"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Summary</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One-line elevator pitch for card previews..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Live Website URL</label>
                  <input
                    type="text"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    placeholder="https://client-app.com"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Case Study Content (Rich Markdown Editor)
                </label>
                <RichTextEditor
                  value={formData.fullDescription}
                  onChange={(val) => setFormData({ ...formData, fullDescription: val })}
                  placeholder="Detailed case study background, architecture, and solutions in Markdown..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Frontend Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.frontendTech}
                    onChange={(e) => setFormData({ ...formData, frontendTech: e.target.value })}
                    placeholder="React, Next.js, Tailwind CSS"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Backend Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.backendTech}
                    onChange={(e) => setFormData({ ...formData, backendTech: e.target.value })}
                    placeholder="Node.js, Express, MongoDB"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500"
                  />
                  <span>Published on Website</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500"
                  />
                  <span>Feature on Homepage</span>
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
                  <span>{editingProject ? 'Save Changes' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
