'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Mail,
  Building,
  Handshake,
  User,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Loader2,
  Search,
} from 'lucide-react';

const STATUSES = ['All', 'New', 'In Progress', 'Responded', 'Closed'];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [spamFilter, setSpamFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/inquiries?';
      if (typeFilter !== 'all') url += `type=${typeFilter}&`;
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (spamFilter !== 'all') url += `spam=${spamFilter}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, spamFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (inqId, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === inqId ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?._id === inqId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (inqId) => {
    if (!confirm('Are you sure you want to delete this lead inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i._id !== inqId));
        if (selectedInquiry?._id === inqId) setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-emerald-400" />
            Inquiries & Client Leads CRM
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track and manage incoming user questions, company project requests, and sales leads
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Total Leads: <span className="font-bold text-white">{inquiries.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
        {/* Type Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter('company')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              typeFilter === 'company'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Company Projects</span>
          </button>
          <button
            onClick={() => setTypeFilter('sales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              typeFilter === 'sales'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Partnerships</span>
          </button>
          <button
            onClick={() => setTypeFilter('user')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              typeFilter === 'user'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>General Users</span>
          </button>
        </div>

        {/* Status & Spam Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1.5">
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Spam Filter */}
          <div className="flex gap-1.5 items-center">
            {[
              { id: 'all', label: 'All' },
              { id: 'clean', label: 'Real Leads' },
              { id: 'spam', label: 'Spam' },
            ].map((sf) => (
              <button
                key={sf.id}
                onClick={() => setSpamFilter(sf.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  spamFilter === sf.id
                    ? sf.id === 'spam'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`${
            selectedInquiry ? 'lg:col-span-2' : 'lg:col-span-3'
          } bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm`}
        >
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              Loading inquiry leads...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No inquiries found under the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                    <th className="p-4">Lead / Contact</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Subject / Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {inquiries.map((inq) => {
                    const isSelected = selectedInquiry?._id === inq._id;
                    const contactName = inq.name || inq.contactName || inq.fullName;
                    const contactEmail = inq.email || inq.workEmail || inq.officialEmail;

                    return (
                      <tr
                        key={inq._id}
                        onClick={() => setSelectedInquiry(inq)}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? 'bg-emerald-500/10 border-l-2 border-emerald-500'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100">{contactName}</span>
                            {(inq.isSpam || inq.spamScore >= 60) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Likely Spam
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{contactEmail}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {inq.companyName && (
                              <span className="text-[11px] text-emerald-400 font-medium">
                                {inq.companyName}
                              </span>
                            )}
                            {inq.sourceCountry && inq.sourceCountry !== 'Unknown' && (
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                {inq.sourceCountry}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="capitalize px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {inq.type}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 max-w-[200px] truncate">
                          {inq.subject || inq.service || inq.partnershipType || inq.message}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                              inq.status === 'New'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : inq.status === 'In Progress'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(inq._id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Panel */}
        {selectedInquiry && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-sm h-fit">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {selectedInquiry.name || selectedInquiry.contactName || selectedInquiry.fullName}
                </h3>
                <p className="text-xs text-emerald-400 font-medium capitalize">
                  {selectedInquiry.type} Inquiry &bull;{' '}
                  {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-500 hover:text-white text-xs"
              >
                Close &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Spam Risk Indicator */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Spam Risk Score:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    selectedInquiry.isSpam || selectedInquiry.spamScore >= 60
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedInquiry.spamScore || 0}%{' '}
                  {selectedInquiry.isSpam || selectedInquiry.spamScore >= 60 ? '• Likely Spam' : '• Verified Clean'}
                </span>
              </div>

              {selectedInquiry.sourceCountry && selectedInquiry.sourceCountry !== 'Unknown' && (
                <div>
                  <span className="text-slate-500 block font-semibold uppercase text-[10px]">Origin Country:</span>
                  <span className="text-slate-200 font-mono">{selectedInquiry.sourceCountry}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block font-semibold uppercase text-[10px]">Email:</span>
                <a
                  href={`mailto:${
                    selectedInquiry.email || selectedInquiry.workEmail || selectedInquiry.officialEmail
                  }`}
                  className="text-cyan-400 hover:underline"
                >
                  {selectedInquiry.email ||
                    selectedInquiry.workEmail ||
                    selectedInquiry.officialEmail}
                </a>
              </div>

              {selectedInquiry.companyName && (
                <div>
                  <span className="text-slate-500 block font-semibold uppercase text-[10px]">Company:</span>
                  <span className="text-slate-200">{selectedInquiry.companyName} ({selectedInquiry.jobTitle || 'N/A'})</span>
                </div>
              )}

              {selectedInquiry.service && (
                <div>
                  <span className="text-slate-500 block font-semibold uppercase text-[10px]">Service Requested:</span>
                  <span className="text-slate-200">{selectedInquiry.service}</span>
                </div>
              )}

              {selectedInquiry.budget && (
                <div>
                  <span className="text-slate-500 block font-semibold uppercase text-[10px]">Estimated Budget:</span>
                  <span className="text-emerald-400 font-bold">{selectedInquiry.budget}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block font-semibold uppercase text-[10px]">Details / Message:</span>
                <div className="p-3 bg-slate-800/80 rounded-xl text-slate-200 border border-slate-800 whitespace-pre-wrap mt-1">
                  {selectedInquiry.message || selectedInquiry.details}
                </div>
              </div>
            </div>

            {/* Status Change */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Update Lead Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.filter((s) => s !== 'All').map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedInquiry._id, st)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedInquiry.status === st
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
