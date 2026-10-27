'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }}
        />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <span className="text-zinc-400 text-sm font-medium">Verifying credentials…</span>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect happening
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }}
        />
        <span className="text-zinc-400 text-sm">Redirecting to login…</span>
      </div>
    );
  }

  return <>{children}</>;
}
