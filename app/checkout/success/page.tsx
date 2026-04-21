'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!params.get('session_id')) {
      router.push('/');
      return;
    }
    setTimeout(() => setReady(true), 1500);
  }, [params, router]);

  return (
    <div className="min-h-screen mesh-bg noise">
      <Header />

      <main className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          {!ready ? (
            <div className="w-6 h-6 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold mb-2">Payment successful</h1>
              <p className="text-[#a1a1aa] mb-8">Your credits have been added.</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/models" className="btn btn-primary">
                  Start comparing
                </Link>
                <Link href="/account" className="btn btn-ghost">
                  View account
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
