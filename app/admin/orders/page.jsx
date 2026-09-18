'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Loader2,
  DollarSign,
  Download,
  Filter,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleResendEmail = async (orderId) => {
    try {
      setActionLoading(orderId);
      setFeedback(null);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'resend_email' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Download link resent for order #${orderId}` });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to resend download link.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to send request.' });
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-cyan-400" />
            Digital Product Orders
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor digital product purchases, verified transactions, and dispatch download access
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Verified Orders</div>
          <div className="text-2xl font-bold text-white mt-1">
            {orders.filter((o) => o.status === 'paid').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Revenue (Sample)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Downloads Fulfilled</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0)}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, email or customer name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid & Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2 text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            Loading digital product orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product Purchased</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o._id || o.orderId} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-100">{o.orderId}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(o.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{o.customerName || 'Customer'}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {o.customerEmail}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200 font-semibold">{o.productTitle}</div>
                      <div className="text-[11px] text-slate-500">Slug: {o.productId}</div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-200">
                      {o.currency?.toUpperCase()} {o.amount}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {o.provider || 'direct'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          o.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : o.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleResendEmail(o.orderId)}
                          disabled={actionLoading === o.orderId}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Resend download link email to customer"
                        >
                          {actionLoading === o.orderId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          <span>Resend Link</span>
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
    </div>
  );
}
