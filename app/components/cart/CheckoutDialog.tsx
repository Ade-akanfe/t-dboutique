'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useDispatch } from 'react-redux';
import { X, CreditCard, LoaderCircle, Copy, Check } from 'lucide-react';
import { clearCart } from '../../store/features/cartSlice';
import type { CartItem } from '../../store/features/cartSlice';
import { supabase } from '../../lib/supabaseClient';
import { parseMoneyAmount } from '../../lib/money';
import { useAuth } from '../../context/AuthContext';
import { BANK_DETAILS } from '../../lib/paymentDetails';
import { saveGuestOrderCredential } from '../../lib/guestOrders';

interface CheckoutDialogProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
}

interface PendingCheckout {
  orderId: string;
  paymentToken: string;
  totalAmount: number;
}

type CheckoutStep = 'details' | 'payment' | 'complete';

interface CheckoutState {
  step: CheckoutStep;
  pendingCheckout: PendingCheckout | null;
}

function formatAmount(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function profileValue(user: User | null, key: string) {
  const value = user?.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

export default function CheckoutDialog({ isOpen, items, onClose }: CheckoutDialogProps) {
  const dispatch = useDispatch();
  const { user, session } = useAuth();
  const [checkout, setCheckout] = useState<CheckoutState>({ step: 'details', pendingCheckout: null });
  const { pendingCheckout, step } = checkout;
  const [customerName, setCustomerName] = useState(
    () => profileValue(user, 'full_name') || profileValue(user, 'name'),
  );
  const [customerEmail, setCustomerEmail] = useState(() => user?.email ?? '');
  const [customerPhone, setCustomerPhone] = useState(() => profileValue(user, 'phone'));
  const [customerAddress, setCustomerAddress] = useState(() => profileValue(user, 'delivery_address'));
  const [customerPostalCode, setCustomerPostalCode] = useState(() => profileValue(user, 'postal_code'));
  const [customerNotes, setCustomerNotes] = useState(() => profileValue(user, 'delivery_notes'));
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [accountNotice, setAccountNotice] = useState('');
  const [copiedField, setCopiedField] = useState<'account' | 'reference' | null>(null);
  const [copyError, setCopyError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !user || step !== 'details') return;
    setCustomerName(profileValue(user, 'full_name') || profileValue(user, 'name'));
    setCustomerEmail(user.email ?? '');
    setCustomerPhone(profileValue(user, 'phone'));
    setCustomerAddress(profileValue(user, 'delivery_address'));
    setCustomerPostalCode(profileValue(user, 'postal_code'));
    setCustomerNotes(profileValue(user, 'delivery_notes'));
  }, [isOpen, step, user]);

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setAccountNotice('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail || user?.email || '',
          customerPhone,
          customerAddress,
          customerPostalCode,
          customerNotes,
          items: items.map((item) => ({
            slug: item.slug,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });
      const result = await response.json() as PendingCheckout & { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Unable to place your order.');

      if (!user) {
        try {
          saveGuestOrderCredential({
            orderId: result.orderId,
            paymentToken: result.paymentToken,
          });
        } catch {
          setAccountNotice('Your order was placed, but this browser could not save guest order access. Keep the order reference and payment details available.');
        }
      }

      setCheckout({ step: 'payment', pendingCheckout: result });

      if (createAccount && !user) {
        try {
          const { error } = await supabase.auth.signUp({
            email: customerEmail,
            password,
          });
          setAccountNotice((notice) => [
            notice,
            error
              ? `Your order is placed, but we couldn't create the account: ${error.message}. You can continue as a guest.`
              : 'Account created. Check your email to verify it; your order is ready for payment.',
          ].filter(Boolean).join(' '));
        } catch (error) {
          setAccountNotice((notice) => [
            notice,
            `Your order is placed, but account creation failed: ${error instanceof Error ? error.message : 'Please try again later.'} You can continue as a guest.`,
          ].filter(Boolean).join(' '));
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to place your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmPayment = async () => {
    if (!pendingCheckout) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/orders/payment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingCheckout),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Unable to submit payment confirmation.');

      setCheckout({ step: 'complete', pendingCheckout: null });
      dispatch(clearCart());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit payment confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPaymentDetail = async (field: 'account' | 'reference', value: string) => {
    setCopyError('');
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((current) => current === field ? null : current);
      }, 2000);
    } catch {
      setCopyError('Could not copy to clipboard. Please select and copy the value manually.');
    }
  };

  const close = () => {
    setCheckout({ step: 'details', pendingCheckout: null });
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">T&amp;D Boutique</p>
            <h2 id="checkout-title" className="mt-1 text-xl font-semibold text-zinc-900">
              {step === 'payment' ? 'Complete your payment' : step === 'complete' ? 'Confirmation received' : 'Checkout'}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Close checkout"
            disabled={isSubmitting}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {step === 'details' && (
          <form onSubmit={placeOrder} className="space-y-5 px-5 py-6 sm:px-7">
            <div>
              <h3 className="font-semibold text-zinc-900">Your order</h3>
              <ul className="mt-3 divide-y divide-zinc-100 text-sm">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 py-2.5">
                    <span className="text-zinc-600">{item.name} <span className="text-zinc-400">× {item.quantity}</span></span>
                    <span className="shrink-0 font-medium text-zinc-900">
                      {(() => {
                        const price = parseMoneyAmount(item.price);
                        return price === null ? 'Price unavailable' : formatAmount(price * item.quantity);
                      })()}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-zinc-200 pt-3 font-semibold text-zinc-900">
                <span>Total</span>
                <span>{formatAmount(items.reduce((total, item) => total + (parseMoneyAmount(item.price) ?? 0) * item.quantity, 0))}</span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">
                Full name *
                <input required minLength={2} maxLength={120} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Email *
                <input required type="email" maxLength={254} autoComplete="email" value={customerEmail || user?.email || ''} onChange={(event) => setCustomerEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
              <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                Delivery address *
                <textarea required minLength={5} maxLength={500} autoComplete="street-address" rows={3} value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
              <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                Phone number
                <input type="tel" maxLength={40} autoComplete="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
              <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                Postal code
                <input type="text" maxLength={20} autoComplete="postal-code" value={customerPostalCode} onChange={(event) => setCustomerPostalCode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
              <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
                Delivery notes
                <textarea maxLength={1000} rows={3} value={customerNotes} onChange={(event) => setCustomerNotes(event.target.value)} placeholder="Add delivery instructions or other notes (optional)" className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
              </label>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700">
                <input type="checkbox" checked={createAccount} onChange={(event) => setCreateAccount(event.target.checked)} className="mt-1 accent-amber-700" />
                <span><strong className="text-zinc-900">{user ? 'Your account is connected' : 'Create an account'}</strong> {user ? 'This order will be saved to your account.' : 'for faster future checkout, or leave this unchecked to order as a guest.'}</span>
              </label>
              {createAccount && !user && (
                <label className="mt-3 block text-sm font-medium text-zinc-700">
                  Account password *
                  <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-amber-600" />
                  <span className="mt-1 block text-xs font-normal text-zinc-500">At least 8 characters.</span>
                </label>
              )}
            </div>

            {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{errorMessage}</p>}
            <button disabled={isSubmitting || items.length === 0} className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3.5 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Placing order…' : 'Place order & view payment details'}
            </button>
          </form>
        )}

        {step === 'payment' && pendingCheckout && (
          <div className="space-y-5 px-5 py-6 sm:px-7">
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0" />
              <p>Your order is saved. Transfer the exact total below and paste the order reference into your bank transfer reference or description field. Your order remains pending until the boutique verifies your transfer.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <p className="text-sm font-medium text-zinc-500">Amount to transfer</p>
              <p className="mt-1 text-3xl font-bold text-zinc-900">{formatAmount(pendingCheckout.totalAmount)}</p>
              <dl className="mt-5 space-y-3 border-t border-zinc-100 pt-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Bank</dt><dd className="font-semibold text-zinc-900">{BANK_DETAILS.bank}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Account name</dt><dd className="text-right font-semibold text-zinc-900">{BANK_DETAILS.accountName}</dd></div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500">Account number</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-zinc-900">{BANK_DETAILS.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyPaymentDetail('account', BANK_DETAILS.accountNumber)}
                      aria-label="Copy account number"
                      title="Copy account number"
                      className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      {copiedField === 'account' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3">
                  <dt className="text-zinc-500">Transfer reference</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono text-zinc-900">{pendingCheckout.orderId.slice(0, 8).toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => copyPaymentDetail('reference', pendingCheckout.orderId.slice(0, 8).toUpperCase())}
                      aria-label="Copy transfer reference"
                      title="Copy transfer reference"
                      className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      {copiedField === 'reference' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
            {copyError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{copyError}</p>}
            {accountNotice && <p className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-800">{accountNotice}</p>}
            {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{errorMessage}</p>}
            <button onClick={confirmPayment} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-semibold text-zinc-900 transition disabled:cursor-not-allowed disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}>
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting confirmation…' : 'I have made the transfer'}
            </button>
            <p className="text-center text-xs text-zinc-500">Your payment confirmation is not a bank verification. We’ll email you when it is received and again after the boutique confirms your order.</p>
          </div>
        )}

        {step === 'complete' && (
          <div className="px-5 py-10 text-center sm:px-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">✓</div>
            <h3 className="mt-4 text-xl font-semibold text-zinc-900">Payment confirmation received</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">We’ve emailed you a confirmation of your transfer submission. The boutique will verify the payment and send another email when your order is confirmed.</p>
            <button onClick={close} className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">Continue shopping</button>
          </div>
        )}
      </section>
    </div>
  );
}
