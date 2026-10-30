'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, CreditCard, LayoutDashboard, LoaderCircle, LogOut, MapPin, Package, Settings, ShoppingBag, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BANK_DETAILS } from '../lib/paymentDetails';
import { readGuestOrderCredentials } from '../lib/guestOrders';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'submitted' | 'verified';

interface CustomerOrder {
  id: string;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    size: string | null;
    color: string | null;
  }>;
    paymentToken?: string;
}

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

type AccountTab = 'dashboard' | 'orders' | 'settings';

function metadataValue(user: User, key: string) {
  const value = user.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

function AccountSettings({ user }: { user: User }) {
  const [name, setName] = useState(() => metadataValue(user, 'full_name'));
  const [phone, setPhone] = useState(() => metadataValue(user, 'phone'));
  const [address, setAddress] = useState(() => metadataValue(user, 'delivery_address'));
  const [postalCode, setPostalCode] = useState(() => metadataValue(user, 'postal_code'));
  const [deliveryNotes, setDeliveryNotes] = useState(() => metadataValue(user, 'delivery_notes'));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const saveDeliveryDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          full_name: name.trim(),
          phone: phone.trim(),
          delivery_address: address.trim(),
          postal_code: postalCode.trim(),
          delivery_notes: deliveryNotes.trim(),
        },
      });
      if (error) throw error;
      setSuccessMessage('Your delivery details have been saved and will be filled in at checkout.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save your delivery details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Delivery details</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Save your usual delivery information once. We’ll prefill it next time you place an order, and you can still edit it during checkout.
        </p>
      </div>
      <form onSubmit={saveDeliveryDetails} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          Full name
          <input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Phone number
          <input type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Delivery address
          <textarea required minLength={5} maxLength={500} autoComplete="street-address" rows={3} value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Postal code
          <input type="text" maxLength={20} autoComplete="postal-code" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Default delivery notes
          <textarea maxLength={1000} rows={3} value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} placeholder="Optional delivery instructions" className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
        </label>
        {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 sm:col-span-2">{errorMessage}</p>}
        {successMessage && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 sm:col-span-2">{successMessage}</p>}
        <div className="sm:col-span-2">
          <button disabled={isSaving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 sm:w-auto">
            {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving details…' : 'Save delivery details'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function AccountPage() {
  const { user, session, isLoading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentEmailWarning, setPaymentEmailWarning] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountTab>('dashboard');

  useEffect(() => {
    if (window.location.hash === '#orders') {
      window.requestAnimationFrame(() => setActiveTab('orders'));
    }
  }, []);

  useEffect(() => {
    if (!session?.access_token) return;

    let isActive = true;
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await fetch('/api/account/orders', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const result = await response.json() as { orders?: CustomerOrder[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? 'Unable to load your orders.');
        if (isActive) {
          setOrders(result.orders ?? []);
          setErrorMessage('');
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load your orders.');
        }
      } finally {
        if (isActive) setOrdersLoading(false);
      }
    };

    void loadOrders();
    return () => {
      isActive = false;
    };
  }, [session?.access_token]);

  useEffect(() => {
    if (isLoading || user) return;

    let isActive = true;
    const loadGuestOrders = async () => {
      setOrdersLoading(true);
      setErrorMessage('');

      try {
        const credentials = readGuestOrderCredentials();
        if (credentials.length === 0) {
          if (isActive) setOrders([]);
          return;
        }

        const response = await fetch('/api/orders/guest-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: credentials }),
        });
        const result = await response.json() as { orders?: CustomerOrder[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? 'Unable to load your guest orders.');
        if (isActive) {
          const tokensByOrderId = new Map(credentials.map(({ orderId, paymentToken }) => [orderId, paymentToken]));
          setOrders((result.orders ?? []).map((order) => ({
            ...order,
            paymentToken: tokensByOrderId.get(order.id),
          })));
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load your guest orders.');
        }
      } finally {
        if (isActive) setOrdersLoading(false);
      }
    };

    void loadGuestOrders();
    return () => {
      isActive = false;
    };
  }, [isLoading, user]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) setErrorMessage(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmOrderPayment = async (orderId: string) => {
    if (!session?.access_token) return;
    setConfirmingOrderId(orderId);
    setPaymentMessage('');
    setPaymentEmailWarning(false);
    setErrorMessage('');

    try {
      const response = await fetch('/api/account/orders/payment-confirmation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      const result = await response.json() as { error?: string; notificationSent?: boolean };
      if (!response.ok) throw new Error(result.error ?? 'Unable to confirm payment.');

      setOrders((currentOrders) => currentOrders.map((order) => (
        order.id === orderId ? { ...order, payment_status: 'submitted' } : order
      )));
      setPaymentEmailWarning(result.notificationSent !== true);
      setPaymentMessage(
        result.notificationSent
          ? 'Payment confirmation submitted. We’ve emailed you and will contact you again after the boutique verifies your transfer.'
          : 'Payment confirmation submitted, but we could not send the email. Please contact the boutique.',
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to confirm payment.');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const confirmGuestOrderPayment = async (order: CustomerOrder) => {
    if (!order.paymentToken) {
      setErrorMessage('Payment access for this guest order is unavailable in this browser.');
      return;
    }

    setConfirmingOrderId(order.id);
    setPaymentMessage('');
    setPaymentEmailWarning(false);
    setErrorMessage('');
    try {
      const response = await fetch('/api/orders/payment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, paymentToken: order.paymentToken }),
      });
      const result = await response.json() as { error?: string; notificationSent?: boolean };
      if (!response.ok) throw new Error(result.error ?? 'Unable to submit payment confirmation.');
      setOrders((currentOrders) => currentOrders.map((currentOrder) => (
        currentOrder.id === order.id ? { ...currentOrder, payment_status: 'submitted' } : currentOrder
      )));
      setPaymentEmailWarning(result.notificationSent !== true);
      setPaymentMessage(
        result.notificationSent
          ? 'Payment confirmation submitted. We’ve emailed you and will contact you again after the boutique verifies your transfer.'
          : 'Payment confirmation submitted, but we could not send the email. Please contact the boutique.',
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit payment confirmation.');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const copyPaymentDetail = async (value: string) => {
    setErrorMessage('');
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      window.setTimeout(() => {
        setCopiedValue((current) => current === value ? null : current);
      }, 2000);
    } catch {
      setErrorMessage('Could not copy to clipboard. Please select and copy the value manually.');
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-1 items-center justify-center pt-28">
          <LoaderCircle className="h-8 w-8 animate-spin text-amber-700" aria-label="Loading account" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen flex-1 bg-zinc-50 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        {!user ? (
          <>
            <section className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-800">
                <UserRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-zinc-900">Sign in to view account orders</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Sign in to access orders linked to your account. Guest orders saved in this browser appear below.
              </p>
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Email
                  <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
                </label>
                <label className="block text-sm font-medium text-zinc-700">
                  Password
                  <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
                </label>
                {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{errorMessage}</p>}
                <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-60">
                  {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </section>
            <section id="orders" className="mt-8">
              <header className="mb-5">
                <h2 className="text-xl font-semibold text-zinc-900">Guest orders on this browser</h2>
                <p className="mt-1 text-sm text-zinc-600">Order details are loaded securely from the boutique. Only order access details—not prices—are saved in this browser.</p>
              </header>
              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <LoaderCircle className="h-7 w-7 animate-spin text-amber-700" aria-label="Loading guest orders" />
                </div>
              ) : errorMessage ? (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center">
                  <Package className="mx-auto h-10 w-10 text-zinc-300" />
                  <p className="mt-3 text-sm text-zinc-500">No guest orders saved in this browser.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMessage && <p role="status" className={`rounded-xl border p-4 text-sm ${paymentEmailWarning ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{paymentMessage}</p>}
                  {orders.map((order) => (
                    <article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
                        <div>
                          <p className="font-mono text-xs text-zinc-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="mt-1 text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">{orderStatusLabels[order.status]} · Payment {order.payment_status}</span>
                      </header>
                      <ul className="divide-y divide-zinc-100">
                        {order.order_items.map((item) => (
                          <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                            <span className="text-zinc-700">{item.product_name} × {item.quantity}</span>
                            <span className="shrink-0 font-medium text-zinc-900">₦{(item.price * item.quantity).toLocaleString('en-NG')}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="flex justify-between border-t border-zinc-100 pt-4 font-semibold text-zinc-900">
                        <span>Total</span>
                        <span>₦{Number(order.total_amount).toLocaleString('en-NG')}</span>
                      </p>
                      {order.payment_status === 'pending' && order.status === 'pending' && (
                        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm text-amber-950">Transfer the exact total to {BANK_DETAILS.bank}, account name {BANK_DETAILS.accountName}. Use the order reference in your transfer description.</p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                            <span className="font-mono font-semibold text-zinc-900">{BANK_DETAILS.accountNumber}</span>
                            <button type="button" onClick={() => void copyPaymentDetail(BANK_DETAILS.accountNumber)} aria-label="Copy account number" className="rounded-md p-1.5 text-zinc-600 hover:bg-amber-100">
                              {copiedValue === BANK_DETAILS.accountNumber ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <span className="font-mono font-semibold text-zinc-900">{order.id.slice(0, 8).toUpperCase()}</span>
                            <button type="button" onClick={() => void copyPaymentDetail(order.id.slice(0, 8).toUpperCase())} aria-label="Copy transfer reference" className="rounded-md p-1.5 text-zinc-600 hover:bg-amber-100">
                              {copiedValue === order.id.slice(0, 8).toUpperCase() ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <button onClick={() => void confirmGuestOrderPayment(order)} disabled={confirmingOrderId === order.id} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60">
                            {confirmingOrderId === order.id && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {confirmingOrderId === order.id ? 'Submitting confirmation…' : 'I have made the transfer'}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section>
            <header className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-800">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Account dashboard</h1>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
              <button onClick={() => void signOut()} className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 sm:self-auto">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </header>

            <nav aria-label="Account navigation" role="tablist" className="mb-6 grid grid-cols-3 gap-2 rounded-xl border border-zinc-200 bg-white p-2">
              {([
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'settings', label: 'Settings', icon: Settings },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold transition ${
                    activeTab === id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>

            {activeTab === 'dashboard' && (
              <div role="tabpanel" className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Total orders', value: ordersLoading ? '…' : String(orders.length), icon: Package },
                    { label: 'Awaiting payment', value: ordersLoading ? '…' : String(orders.filter((order) => order.payment_status === 'pending').length), icon: CreditCard },
                    { label: 'In progress', value: ordersLoading ? '…' : String(orders.filter((order) => ['pending', 'confirmed', 'shipped'].includes(order.status)).length), icon: ShoppingBag },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-zinc-600">{label}</p>
                        <Icon className="h-5 w-5 text-amber-700" />
                      </div>
                      <p className="mt-3 text-3xl font-semibold text-zinc-900">{value}</p>
                    </div>
                  ))}
                </div>

                <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="flex items-center gap-2 font-semibold text-zinc-900">
                        <MapPin className="h-4 w-4 text-amber-700" />
                        Saved delivery details
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">Used to prefill checkout for your next order.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className="text-sm font-semibold text-amber-800 hover:text-amber-950"
                    >
                      Edit details
                    </button>
                  </div>
                  {metadataValue(user, 'delivery_address') ? (
                    <address className="mt-4 space-y-1 text-sm not-italic text-zinc-700">
                      <p className="font-medium text-zinc-900">{metadataValue(user, 'full_name') || 'Name not set'}</p>
                      {metadataValue(user, 'phone') && <p>{metadataValue(user, 'phone')}</p>}
                      <p className="whitespace-pre-wrap">{metadataValue(user, 'delivery_address')}</p>
                      {metadataValue(user, 'postal_code') && <p>{metadataValue(user, 'postal_code')}</p>}
                    </address>
                  ) : (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
                      You haven’t saved a delivery address yet. Add it in Settings to have it ready at checkout.
                    </div>
                  )}
                </section>
                {paymentMessage && <p role="status" className={`rounded-xl border p-4 text-sm ${paymentEmailWarning ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{paymentMessage}</p>}
              </div>
            )}

            {activeTab === 'settings' && (
              <div role="tabpanel">
                <AccountSettings user={user} />
              </div>
            )}

            {activeTab === 'orders' && (
              <section id="orders" role="tabpanel">
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <LoaderCircle className="h-7 w-7 animate-spin text-amber-700" aria-label="Loading orders" />
              </div>
            ) : errorMessage ? (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center">
                <Package className="mx-auto h-10 w-10 text-zinc-300" />
                <h2 className="mt-4 font-semibold text-zinc-900">No orders found</h2>
                <p className="mt-2 text-sm text-zinc-500">Orders placed with this verified email address will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMessage && <p role="status" className={`rounded-xl border p-4 text-sm ${paymentEmailWarning ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{paymentMessage}</p>}
                {orders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
                      <div>
                        <p className="font-mono text-xs text-zinc-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="mt-1 text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">{orderStatusLabels[order.status]} · Payment {order.payment_status}</span>
                    </header>
                    <ul className="divide-y divide-zinc-100">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                          <span className="text-zinc-700">
                            {item.product_name} × {item.quantity}
                            {(item.size || item.color) && <span className="mt-1 block text-xs text-zinc-500">{[item.size, item.color].filter(Boolean).join(' · ')}</span>}
                          </span>
                          <span className="shrink-0 font-medium text-zinc-900">₦{(item.price * item.quantity).toLocaleString('en-NG')}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="flex justify-between border-t border-zinc-100 pt-4 font-semibold text-zinc-900">
                      <span>Total</span>
                      <span>₦{Number(order.total_amount).toLocaleString('en-NG')}</span>
                    </p>
                    {order.payment_status === 'pending' && order.status === 'pending' && (
                      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3 text-sm text-amber-950">
                          <CreditCard className="mt-0.5 h-5 w-5 shrink-0" />
                          <p>Transfer the exact total to the account below. Use the order reference in your transfer description/reference field.</p>
                        </div>
                        <dl className="mt-4 space-y-3 border-t border-amber-200 pt-3 text-sm">
                          <div className="flex justify-between gap-4">
                            <dt className="text-zinc-600">Bank</dt>
                            <dd className="font-semibold text-zinc-900">{BANK_DETAILS.bank}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-zinc-600">Account name</dt>
                            <dd className="text-right font-semibold text-zinc-900">{BANK_DETAILS.accountName}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-zinc-600">Account number</dt>
                            <dd className="flex items-center gap-2">
                              <span className="font-mono font-bold text-zinc-900">{BANK_DETAILS.accountNumber}</span>
                              <button
                                type="button"
                                onClick={() => void copyPaymentDetail(BANK_DETAILS.accountNumber)}
                                aria-label="Copy account number"
                                className="rounded-md p-1.5 text-zinc-600 hover:bg-amber-100"
                              >
                                {copiedValue === BANK_DETAILS.accountNumber ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-zinc-600">Transfer reference</dt>
                            <dd className="flex items-center gap-2">
                              <span className="font-mono font-bold text-zinc-900">{order.id.slice(0, 8).toUpperCase()}</span>
                              <button
                                type="button"
                                onClick={() => void copyPaymentDetail(order.id.slice(0, 8).toUpperCase())}
                                aria-label="Copy transfer reference"
                                className="rounded-md p-1.5 text-zinc-600 hover:bg-amber-100"
                              >
                                {copiedValue === order.id.slice(0, 8).toUpperCase() ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </dd>
                          </div>
                        </dl>
                        <button
                          onClick={() => void confirmOrderPayment(order.id)}
                          disabled={confirmingOrderId === order.id}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                        >
                          {confirmingOrderId === order.id && <LoaderCircle className="h-4 w-4 animate-spin" />}
                          {confirmingOrderId === order.id ? 'Submitting confirmation…' : 'I have made the transfer'}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
              </section>
            )}
          </section>
        )}
      </div>
    </main>
    <Footer />
    </>
  );
}
