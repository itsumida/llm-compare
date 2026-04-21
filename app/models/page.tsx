'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_MODELS, PROVIDERS } from '@/lib/openrouter';
import Header from '@/components/Header';

export default function ModelsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let models = AVAILABLE_MODELS;
    if (search) {
      const q = search.toLowerCase();
      models = models.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
      );
    }
    if (provider) {
      models = models.filter(m => m.provider === provider);
    }
    return models;
  }, [search, provider]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  const handleCompare = () => {
    if (selected.length > 0) {
      router.push(`/compare?models=${selected.join(',')}`);
    }
  };

  return (
    <div className="min-h-screen mesh-bg noise">
      <Header />

      <main className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Select models</h1>
            <p className="text-[#a1a1aa]">Choose up to 4 models to compare</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models..."
                className="input pl-10"
              />
            </div>
            <select
              value={provider || ''}
              onChange={(e) => setProvider(e.target.value || null)}
              className="input w-auto min-w-[140px] cursor-pointer"
            >
              <option value="">All providers</option>
              {PROVIDERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Model Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((model) => {
              const isSelected = selected.includes(model.id);
              const isDisabled = !isSelected && selected.length >= 4;

              return (
                <button
                  key={model.id}
                  onClick={() => toggle(model.id)}
                  disabled={isDisabled}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#a78bfa]/10 border-[#a78bfa]/40'
                      : isDisabled
                      ? 'bg-[#18181b]/50 border-[#27272a] opacity-40 cursor-not-allowed'
                      : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-[#71717a] mb-1 block">
                        {model.provider}
                      </span>
                      <h3 className="font-medium">{model.name}</h3>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#a78bfa] border-[#a78bfa]'
                          : 'border-[#3f3f46]'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-[#09090b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#71717a]">
              No models found
            </div>
          )}
        </div>
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-md border-t border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-[#a1a1aa]">
            <span className="font-semibold text-white">{selected.length}</span> of 4 selected
          </span>
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="btn btn-ghost text-sm"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleCompare}
              disabled={selected.length === 0}
              className="btn btn-primary text-sm"
            >
              Compare
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
