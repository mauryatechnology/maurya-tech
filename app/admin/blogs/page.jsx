'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Loader2,
  Calendar,
  Globe,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { runQualityGate } from '@/lib/content/qualityGate';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Engineering',
    canonicalCountry: 'IN',
    language: 'en-IN',
    clusterType: 'spoke',
    relatedToolSlug: '',
    tags: '',
    readTime: '5 min read',
    author: 'Maurya Technologies Team',
    coverImage: '',
    featured: false,
    status: 'published',
    isPublished: true,
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts?all=true');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Introduction\n\nWrite your blog article here using standard Markdown...\n\n| Feature | Details |\n|---|---|\n| Standard | Included |\n\n## Frequently Asked Questions\n\n### What are the key takeaways?\nDetailed answer goes here.',
      category: 'Engineering',
      canonicalCountry: 'IN',
      language: 'en-IN',
      clusterType: 'spoke',
      relatedToolSlug: '',
      tags: 'Tech, SaaS, React',
      readTime: '5 min read',
      author: 'Maurya Technologies Team',
      coverImage: '',
      featured: false,
      status: 'published',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPost(p);
    const postStatus = p.status || (p.isPublished ? 'published' : 'draft');
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      category: p.category || 'Engineering',
      canonicalCountry: p.canonicalCountry || 'IN',
      language: p.language || 'en-IN',
      clusterType: p.clusterType || 'spoke',
      relatedToolSlug: p.relatedToolSlug || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      readTime: p.readTime || '5 min read',
      author: p.author || 'Maurya Technologies Team',
      coverImage: p.coverImage || '',
      featured: p.featured || false,
      status: postStatus,
      isPublished: postStatus === 'published',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const isPub = formData.status === 'published';
    const payload = {
      ...formData,
      isPublished: isPub,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = editingPost
        ? `/api/posts/${editingPost.slug || editingPost.id || editingPost._id}`
        : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error('Save post error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (p, newStatus) => {
    try {
      const isPub = newStatus === 'published';
      const res = await fetch(`/api/posts/${p.slug || p.id || p._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...p,
          status: newStatus,
          isPublished: isPub,
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((item) =>
            item._id === p._id || item.slug === p.slug
              ? { ...item, status: newStatus, isPublished: isPub }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Are you sure you want to delete post "${p.title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${p.slug || p.id || p._id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((item) => item._id !== p._id && item.slug !== p.slug));
      }
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Blogs & Insights CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Write, edit, and publish technical insights, SaaS case studies, and engineering blogs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/automation"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>AI Content Studio</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Articles', count: posts.length },
          {
            id: 'published',
            label: 'Published',
            count: posts.filter(
              (p) => (p.status || (p.isPublished ? 'published' : 'draft')) === 'published'
            ).length,
          },
          {
            id: 'review',
            label: 'In Review',
            count: posts.filter((p) => p.status === 'review').length,
          },
          {
            id: 'draft',
            label: 'Drafts',
            count: posts.filter(
              (p) => (p.status || (p.isPublished ? 'published' : 'draft')) === 'draft'
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading blog posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No articles found. Write your first blog or Seed from Settings.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Editorial Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts
                  .filter((p) => {
                    const s = p.status || (p.isPublished ? 'published' : 'draft');
                    if (activeTab === 'all') return true;
                    return s === activeTab;
                  })
                  .map((p) => {
                    const currentStatus = p.status || (p.isPublished ? 'published' : 'draft');
                    return (
                      <tr key={p._id || p.slug} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="font-semibold text-slate-100 text-sm">{p.title}</div>
                          <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {p.date || 'Recent'}
                            </span>
                            <span>&bull;</span>
                            <span>{p.readTime || '5 min read'}</span>
                            {p.canonicalCountry && (
                              <>
                                <span>&bull;</span>
                                <span className="font-mono text-cyan-400 uppercase">
                                  {p.canonicalCountry}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            {p.viewsCount || 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                currentStatus === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : currentStatus === 'review'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {currentStatus}
                            </span>
                            {currentStatus === 'review' && (
                              <button
                                onClick={() => handleStatusChange(p, 'published')}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer transition"
                                title="Approve and Publish Immediately"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                              title="View Article"
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
                    );
                  })}
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
                {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
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
                  <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 5 Strategies to Scale SaaS to $10M ARR"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="5-strategies-scale-saas"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SaaS">SaaS</option>
                    <option value="Startups">Startups</option>
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Excerpt / Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short summary for SEO and card previews..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* International Market & Topic Cluster */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Globe className="w-4 h-4" />
                  <span>Target Market, Language & SEO Clustering</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Country</label>
                    <select
                      value={formData.canonicalCountry}
                      onChange={(e) => setFormData({ ...formData, canonicalCountry: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="IN">🇮🇳 India (/in)</option>
                      <option value="US">🇺🇸 USA (/us)</option>
                      <option value="UK">🇬🇧 UK (/uk)</option>
                      <option value="GLOBAL">🌐 Global (All)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="en-IN">English (India)</option>
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="hi">Hindi / Hinglish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cluster Type</label>
                    <select
                      value={formData.clusterType}
                      onChange={(e) => setFormData({ ...formData, clusterType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="spoke">Spoke Article</option>
                      <option value="pillar">Pillar Guide (Core Hub)</option>
                      <option value="tool_guide">Calculator Companion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Companion Tool Link</label>
                    <select
                      value={formData.relatedToolSlug}
                      onChange={(e) => setFormData({ ...formData, relatedToolSlug: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">None (Standard Article)</option>
                      <option value="ctc-calculator">CTC to In-Hand Calculator</option>
                      <option value="hourly-to-annual-salary">Hourly to Annual Salary</option>
                      <option value="emi-calculator">Loan EMI Calculator</option>
                      <option value="percentage-calculator">Percentage Calculator</option>
                      <option value="age-calculator">Age Calculator</option>
                      <option value="ats-resume-checker">ATS Resume Checker</option>
                      <option value="cgpa-calculator">CGPA & GPA Calculator</option>
                      <option value="resume-builder">Resume & CV Builder</option>
                      <option value="unit-converter">Unit Converter</option>
                      <option value="freelance-rate-calculator">Freelance Rate Calculator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quality Gate Live Auditor */}
              {(() => {
                const qg = runQualityGate(formData);
                return (
                  <div className={`p-4 rounded-xl border ${qg.passed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/30 border-amber-500/40 text-amber-300'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Google Helpful Content & E-E-A-T Quality Gate</span>
                      </div>
                      <span className="font-extrabold text-sm">
                        Score: {qg.score}/100 ({qg.status.toUpperCase().replace('_', ' ')})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5">
                        {qg.checks.minWordCount.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Words: {qg.checks.minWordCount.actual}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {qg.checks.hasFaq.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Structured FAQ</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {qg.checks.hasTable.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Markdown Table</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {qg.checks.hasInternalToolLink.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Tool Link</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Article Content (Rich Markdown Editor)
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  placeholder="Write your article in Markdown with live preview..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="SaaS, Architecture, Growth"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Editorial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value, isPublished: e.target.value === 'published' })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="draft">Draft (Work in Progress)</option>
                    <option value="review">In Review (Editorial Gate Pending)</option>
                    <option value="published">Published (Live on Website)</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-700 text-cyan-500"
                    />
                    <span>Feature on Blog Homepage</span>
                  </label>
                </div>
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
                  <span>{editingPost ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
