'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Loader2,
  FileText,
  Phone,
  Linkedin,
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

const STATUS_OPTIONS = [
  'All',
  'Pending',
  'Reviewing',
  'Shortlisted',
  'Interviewed',
  'Hired',
  'Rejected',
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [notifyApplicant, setNotifyApplicant] = useState(true);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    app: null,
    loading: false,
  });

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/applications?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes: selectedApp?.notes,
          notifyApplicant,
          emailMessage: notifyApplicant ? emailMessage : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? data.application : a))
        );
        setSelectedApp(data.application);
        setEmailMessage('');
        toast.success(`Application status updated to "${newStatus}"`, {
          description: notifyApplicant ? 'Applicant has been notified via email.' : undefined,
        });
      } else {
        toast.error(data.message || 'Failed to update application');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    } finally {
      setUpdating(false);
    }
  };

  const promptDelete = (app) => {
    setDeleteConfirm({
      isOpen: true,
      app,
      loading: false,
    });
  };

  const executeDelete = async () => {
    const app = deleteConfirm.app;
    if (!app) return;

    setDeleteConfirm((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/applications/${app._id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a._id !== app._id));
        if (selectedApp?._id === app._id) setSelectedApp(null);
        toast.success(`Application from ${app.name} deleted.`);
        setDeleteConfirm({ isOpen: false, app: null, loading: false });
      } else {
        toast.error('Failed to delete application.');
      }
    } catch (err) {
      toast.error('Error connecting to server.');
    } finally {
      setDeleteConfirm((prev) => ({ ...prev, loading: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
      case 'Hired':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Interviewed':
      case 'Reviewing':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Job Applications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review candidate resumes, update status pipeline, and send email notifications
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-72">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Applications List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applications List */}
        <div
          className={`${
            selectedApp ? 'lg:col-span-7' : 'lg:col-span-12'
          } bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm transition-all`}
        >
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No applications found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${
                        selectedApp?._id === app._id ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-100 text-sm">{app.name}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{app.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-300">{app.jobTitle}</span>
                      </td>
                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                            title="View Resume"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => promptDelete(app)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
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

        {/* Candidate Detail Drawer */}
        {selectedApp && (
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 inline-block ${getStatusBadge(
                    selectedApp.status
                  )}`}
                >
                  {selectedApp.status}
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-100">{selectedApp.name}</h3>
                <p className="text-xs text-cyan-400 font-medium mt-0.5">
                  Applied for: {selectedApp.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-500 hover:text-slate-300 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs border-y border-slate-800 py-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${selectedApp.email}`} className="hover:underline text-cyan-400">
                  {selectedApp.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{selectedApp.phone || 'Not provided'}</span>
              </div>
              {selectedApp.linkedin && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Linkedin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a
                    href={selectedApp.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-cyan-400 truncate"
                  >
                    {selectedApp.linkedin}
                  </a>
                </div>
              )}
            </div>

            {/* Resume Button */}
            <a
              href={selectedApp.resume}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>View Submitted Resume / Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Cover Letter */}
            {selectedApp.coverLetter && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Cover Letter / Note:
                </label>
                <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-300 border border-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {/* Status Updater */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Update Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.filter((s) => s !== 'All').map((st) => (
                  <button
                    key={st}
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedApp._id, st)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedApp.status === st
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Notification Note */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifyApplicant"
                  checked={notifyApplicant}
                  onChange={(e) => setNotifyApplicant(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="notifyApplicant" className="text-xs text-slate-300 cursor-pointer">
                  Send status update email to candidate
                </label>
              </div>

              {notifyApplicant && (
                <textarea
                  rows={2}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Optional custom message to include in email..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Candidate Application?"
        description={`Are you sure you want to permanently delete the application from "${deleteConfirm.app?.name}" for "${deleteConfirm.app?.jobTitle}"? This cannot be undone.`}
        confirmText="Delete Application"
        loading={deleteConfirm.loading}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, app: null, loading: false })}
      />
    </div>
  );
}
