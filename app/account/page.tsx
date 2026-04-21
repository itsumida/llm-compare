'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

interface Purchase {
  id: string;
  credits: number;
  amount_cents: number;
  created_at: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/credits').then(r => r.json()).then(d => setCredits(d.credits));
      fetch('/api/purchases').then(r => r.json()).then(d => setPurchases(d.purchases || []));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen mesh-bg noise">
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Account</h1>

          {/* Profile */}
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#a78bfa] flex items-center justify-center text-[#09090b] font-semibold">
                  {session.user?.name?.[0] || '?'}
                </div>
              )}
              <div>
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-sm text-[#71717a]">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mt-4 text-sm text-red-400 hover:text-red-300"
            >
              Sign out
            </button>
          </div>

          {/* Credits */}
          <div className="card p-5 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#71717a] mb-1">Credits</p>
              <p className="text-2xl font-semibold">{credits ?? '...'}</p>
            </div>
            <button onClick={() => router.push('/pricing')} className="btn btn-primary text-sm">
              Buy more
            </button>
          </div>

          {/* Purchases */}
          <div className="card p-5">
            <h2 className="font-medium mb-4">Purchase history</h2>
            {purchases.length === 0 ? (
              <p className="text-sm text-[#71717a]">No purchases yet</p>
            ) : (
              <div className="space-y-3">
                {purchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#27272a] last:border-0">
                    <div>
                      <p className="text-sm font-medium">{p.credits} credits</p>
                      <p className="text-xs text-[#71717a]">
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm">${(p.amount_cents / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
