'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';

const PACKS = [
  { id: 'starter', name: 'Starter', credits: 50, price: 5, per: '10¢' },
  { id: 'pro', name: 'Pro', credits: 250, price: 20, per: '8¢', popular: true },
  { id: 'power', name: 'Power', credits: 700, price: 50, per: '7¢' },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const buy = async (id: string) => {
    if (!session) { router.push('/'); return; }
    setLoading(id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen mesh-bg noise">
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-3">Pricing</h1>
            <p className="text-[#a1a1aa]">
              1 credit = 1 prompt. No subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {PACKS.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl p-5 border ${
                  p.popular
                    ? 'bg-[#a78bfa]/5 border-[#a78bfa]/30'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
              >
                {p.popular && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#a78bfa] text-[#09090b] mb-3">
                    Popular
                  </span>
                )}
                <h2 className="font-semibold mb-1">{p.name}</h2>
                <div className="text-3xl font-semibold mb-1">${p.price}</div>
                <p className="text-sm text-[#71717a] mb-4">{p.credits} credits · {p.per}/prompt</p>
                <button
                  onClick={() => buy(p.id)}
                  disabled={loading !== null || status === 'loading'}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                    p.popular
                      ? 'bg-[#a78bfa] text-[#09090b] hover:bg-[#c4b5fd]'
                      : 'bg-[#27272a] text-white hover:bg-[#3f3f46]'
                  } disabled:opacity-50`}
                >
                  {loading === p.id ? 'Processing...' : session ? 'Buy' : 'Sign in'}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold mb-4">FAQ</h2>
            {[
              ['How do credits work?', '1 credit = 1 prompt, regardless of how many models you compare.'],
              ['Do credits expire?', 'No, credits never expire.'],
              ['Refunds?', 'Contact us within 7 days for unused credits.'],
            ].map(([q, a]) => (
              <div key={q} className="p-4 rounded-lg bg-[#18181b] border border-[#27272a]">
                <h3 className="font-medium text-sm mb-1">{q}</h3>
                <p className="text-sm text-[#a1a1aa]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
