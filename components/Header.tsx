'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/credits')
        .then(r => r.json())
        .then(d => setCredits(d.credits))
        .catch(() => {});
    }
  }, [session]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#a78bfa] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#09090b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-semibold text-[15px]">LLM Compare</span>
          </Link>

          <nav className="flex items-center gap-1">
            {status === 'loading' ? (
              <div className="w-20 h-8 rounded-md bg-[#27272a] animate-pulse" />
            ) : session ? (
              <>
                <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#a1a1aa] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">{credits ?? '...'}</span>
                </Link>
                <Link href="/account" className="p-1.5 hover:bg-[#27272a] rounded-md transition-colors">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#a78bfa] flex items-center justify-center text-[#09090b] text-xs font-semibold">
                      {session.user?.name?.[0] || '?'}
                    </div>
                  )}
                </Link>
                <button onClick={() => signOut()} className="px-3 py-1.5 text-sm text-[#71717a] hover:text-white transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => signIn('google')} className="btn btn-primary text-sm">
                Sign in
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
