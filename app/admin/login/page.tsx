'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [bootstrapComplete, setBootstrapComplete] = useState(() => (
    typeof window !== 'undefined' && window.localStorage.getItem('td-admin-bootstrap-complete') === 'true'
  ));
  const [bootstrapMessage, setBootstrapMessage] = useState('');

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message
      );
      setIsSubmitting(false);
    } else {
      router.replace('/admin');
    }
  };

  const handleBootstrapAdmin = async () => {
    setIsBootstrapping(true);
    setBootstrapMessage('');

    try {
      const response = await fetch('/api/bootstrap-admin', { method: 'POST' });
      const result = await response.json();

      if (!response.ok) {
        setBootstrapMessage(result.error ?? 'Unable to create the admin account.');
        return;
      }

      setBootstrapComplete(true);
      window.localStorage.setItem('td-admin-bootstrap-complete', 'true');
      setBootstrapMessage(`Admin account ready: ${result.email}`);
    } catch {
      setBootstrapMessage('Unable to reach the admin bootstrap endpoint.');
    } finally {
      setIsBootstrapping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.png"
              alt="T&D Ladies Fashion Logo"
              width={168}
              height={142}
              className="mb-4 h-32 w-auto object-contain"
            />

            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--brand-purple-light)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-purple-light)' }}>
                Admin Portal
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-playfair">T&amp;D Ladies Fashion</h1>
            <p className="text-zinc-400 text-sm mt-1">Sign in to manage your store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@tdboutique.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 text-sm focus:outline-none transition-all duration-200"
                style={{
                  borderColor: error ? '#ef4444' : '#3f3f46',
                  // @ts-expect-error focus style via css var
                  '--focus-border': '#D4AF37',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
                onBlur={(e) => (e.target.style.borderColor = error ? '#ef4444' : '#3f3f46')}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 text-sm focus:outline-none transition-all duration-200"
                  style={{ borderColor: error ? '#ef4444' : '#3f3f46' }}
                  onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
                  onBlur={(e) => (e.target.style.borderColor = error ? '#ef4444' : '#3f3f46')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/40 border border-red-500/30">
                <span className="text-red-400 text-sm flex-1">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: isSubmitting
                  ? 'rgba(212,175,55,0.5)'
                  : 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)',
                color: '#1a1200',
                boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
            <span className="text-xs text-zinc-500">
              T&amp;D Ladies Fashion Admin — Secure Access
            </span>
          </div>

          {process.env.NODE_ENV === 'development' && !bootstrapComplete && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={handleBootstrapAdmin}
                disabled={isBootstrapping}
                className="text-xs text-zinc-500 underline underline-offset-4 hover:text-zinc-300 disabled:opacity-60"
              >
                {isBootstrapping ? 'Creating admin account...' : 'Create one-time admin account'}
              </button>
              {bootstrapMessage && (
                <p className="mt-2 text-xs text-zinc-400">{bootstrapMessage}</p>
              )}
            </div>
          )}
        </div>

        {/* Back to store link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
