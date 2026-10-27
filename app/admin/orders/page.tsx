'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import AuthGuard from '../components/AuthGuard';
import {
  Package,
  ArrowLeft,
  RefreshCw,
  Eye,
  ChevronDown,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'submitted' | 'verified';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  postal_code: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmed', color: '#34D399', bg: 'rgba(52,211,153,0.1)',  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  shipped:   { label: 'Shipped',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: 'Delivered', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: <XCircle className="w-3.5 h-3.5" /> },
};

function OrdersPageInner() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .neq('payment_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load orders.');
      console.error(error);
    } else {
      setOrders(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Your admin session has expired. Please sign in again.');
        return;
      }

      const response = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const result = await response.json() as {
        error?: string;
        notificationSent?: boolean;
        notificationError?: string;
      };

      if (!response.ok) {
        toast.error(result.error ?? 'Failed to update order status.');
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                payment_status: newStatus === 'confirmed' ? 'verified' : order.payment_status,
              }
            : order
        )
      );
      if (result.notificationSent === false) {
        toast.error(result.notificationError ?? 'Order updated, but the customer email could not be sent.');
      } else {
        toast.success(`Order status updated to ${newStatus}.`, { icon: '✅' });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatAmount = (amount: number) =>
    `₦${amount.toLocaleString('en-NG')}`;

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-inter">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="w-px h-5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" style={{ color: '#D4AF37' }} />
              <h1 className="text-lg font-bold text-white">Orders</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400">
                {orders.length}
              </span>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.entries(STATUS_CONFIG) as [OrderStatus, typeof STATUS_CONFIG[OrderStatus]][]).map(([status, cfg]) => (
            <div key={status} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{statusCounts[status] ?? 0}</p>
                <p className="text-xs text-zinc-500">{cfg.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">No payment confirmations yet</p>
            <p className="text-zinc-600 text-sm mt-1">Orders appear here after customers confirm their bank transfer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all">
                  {/* Order Row */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Left info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-zinc-500">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          order.payment_status === 'verified'
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : order.payment_status === 'submitted'
                              ? 'bg-amber-900/50 text-amber-300'
                              : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          Payment {order.payment_status}
                        </span>
                      </div>
                      <p className="font-semibold text-white">{order.customer_name}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{order.customer_email}</span>
                        {order.customer_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer_phone}</span>}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: '#D4AF37' }}>{formatAmount(order.total_amount)}</p>
                      <p className="text-xs text-zinc-500">{formatDate(order.created_at)}</p>
                    </div>

                    {/* Status Selector */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updatingStatus === order.id}
                        className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-xs font-medium cursor-pointer focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                      >
                        {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
                          <option
                            key={s}
                            value={s}
                            disabled={s === 'confirmed' && order.payment_status === 'pending'}
                          >
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* Expand button */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-all border border-zinc-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
      {expandedOrder && (() => {
        const order = orders.find((item) => item.id === expandedOrder);
        if (!order) return null;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setExpandedOrder(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-details-title"
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-2xl sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="mb-6 flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h2 id="order-details-title" className="text-lg font-bold text-white">Order details</h2>
                  <p className="mt-1 font-mono text-xs text-zinc-500">#{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedOrder(null)}
                  aria-label="Close order details"
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Customer name</dt><dd className="mt-1 text-white">{order.customer_name}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email address</dt><dd className="mt-1 break-all text-white">{order.customer_email}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone number</dt><dd className="mt-1 text-white">{order.customer_phone || 'Not provided'}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Postal code</dt><dd className="mt-1 text-white">{order.postal_code || 'Not provided'}</dd></div>
                <div className="sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500"><MapPin className="h-3.5 w-3.5" /> Dispatch address</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white">{order.customer_address || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Delivery notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white">{order.notes || 'No notes provided'}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-zinc-800 pt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Order items</h3>
                <div className="space-y-2">
                  {(order.order_items ?? []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product_image} alt={item.product_name} className="h-12 w-12 shrink-0 rounded-lg bg-zinc-800 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.product_name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.quantity}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-white">{formatAmount(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-zinc-800 pt-4">
                  <span className="text-sm text-zinc-400">Total</span>
                  <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>{formatAmount(order.total_amount)}</span>
                </div>
              </div>
            </section>
          </div>
        );
      })()}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersPageInner />
    </AuthGuard>
  );
}
