'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Sidebar from '@/components/Sidebar';
import { AVAILABLE_MODELS } from '@/lib/openrouter';

interface ResponseData {
  text: string;
  isLoading: boolean;
  error: string | null;
  timeToFirstToken: number | null;
  totalTime: number | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function MaterialIcon({ name, className = '', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`material-icon ${className}`}
      style={{ fontWeight: 100, fontSize: 24, width: 24, height: 24, ...style }}
    >
      {name}
    </span>
  );
}

function CompareContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [models, setModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [history, setHistory] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const m = params.get('models');
    if (m) setModels(m.split(','));
    else router.push('/models');
  }, [params, router]);

  useEffect(() => {
    Object.values(refs.current).forEach(el => {
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [responses]);

  const parseMessages = (text: string): Message[] => {
    if (!text) return [];
    const msgs: Message[] = [];
    text.split(/\n\n---\n\n/).forEach(turn => {
      if (!turn.trim() || !turn.startsWith('You: ')) return;
      const rest = turn.slice(5);
      const idx = rest.indexOf('\n\n');
      if (idx !== -1) {
        msgs.push({ role: 'user', content: rest.slice(0, idx).trim() });
        const ai = rest.slice(idx + 2).trim();
        if (ai) msgs.push({ role: 'assistant', content: ai });
      } else {
        msgs.push({ role: 'user', content: rest.trim() });
      }
    });
    return msgs;
  };

  const send = async () => {
    if (!prompt.trim() || !models.length) return;

    const p = prompt.trim();
    setPrompt('');
    setLoading(true);

    const newHist: Record<string, Message[]> = {};
    models.forEach(id => {
      newHist[id] = [...(history[id] || []), { role: 'user', content: p }];
    });
    setHistory(newHist);

    setResponses(prev => {
      const upd = { ...prev };
      models.forEach(id => {
        const ex = prev[id]?.text || '';
        upd[id] = {
          text: ex ? `${ex}\n\n---\n\nYou: ${p}\n\n` : `You: ${p}\n\n`,
          isLoading: true,
          error: null,
          timeToFirstToken: null,
          totalTime: null,
        };
      });
      return upd;
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p, models, conversationHistory: newHist }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buf = '';
      const aiRes: Record<string, string> = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.trim() === 'data: [DONE]') continue;
          if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.text && !d.isComplete) aiRes[d.modelId] = (aiRes[d.modelId] || '') + d.text;

              setResponses(prev => ({
                ...prev,
                [d.modelId]: {
                  text: (prev[d.modelId]?.text || '') + d.text,
                  isLoading: !d.isComplete,
                  error: d.error || null,
                  timeToFirstToken: d.timeToFirstToken ?? prev[d.modelId]?.timeToFirstToken ?? null,
                  totalTime: d.totalTime ?? prev[d.modelId]?.totalTime ?? null,
                },
              }));

              if (d.isComplete) {
                setHistory(prev => {
                  const h = prev[d.modelId] || [];
                  if (h[h.length - 1]?.role === 'user') {
                    return { ...prev, [d.modelId]: [...h, { role: 'assistant', content: aiRes[d.modelId] || '' }] };
                  }
                  return prev;
                });
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      setResponses(prev => {
        const upd = { ...prev };
        models.forEach(id => {
          upd[id] = { ...upd[id], isLoading: false, error: err instanceof Error ? err.message : 'Error' };
        });
        return upd;
      });
    } finally {
      setLoading(false);
    }
  };

  if (!models.length) return null;

  return (
    <div className="flex h-full bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Model selector row */}
        <div className="flex items-center justify-between gap-4 px-8 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            {models.map((id, i) => {
              const model = AVAILABLE_MODELS.find(m => m.id === id);
              return (
                <div key={id} className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-muted-foreground font-secondary text-sm">vs</span>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-m border border-border">
                    <span className="font-secondary text-sm font-medium text-foreground">
                      {model?.name || id}
                    </span>
                    <span className="font-secondary text-xs text-muted-foreground">
                      {model?.provider}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => router.push('/models')}
            className="flex items-center gap-2 font-secondary text-sm font-medium px-4 py-2 bg-secondary text-secondary-foreground rounded-pill hover:opacity-80 transition-opacity shrink-0"
          >
            <MaterialIcon name="add" style={{ fontSize: 18, width: 18, height: 18 }} />
            New Session
          </button>
        </div>

        {/* Metrics row */}
        {models.some(id => responses[id]?.totalTime) && (
          <div className="flex items-center gap-4 px-8 py-3 border-b border-border bg-card">
            {models.map(id => {
              const model = AVAILABLE_MODELS.find(m => m.id === id);
              const r = responses[id];
              return (
                <div key={id} className="flex-1 flex items-center gap-6">
                  <span className="font-secondary text-xs text-muted-foreground truncate">{model?.name}</span>
                  {r?.timeToFirstToken && (
                    <div className="flex items-center gap-1.5">
                      <MaterialIcon name="speed" style={{ fontSize: 16, width: 16, height: 16 }} className="text-muted-foreground" />
                      <span className="font-primary text-xs text-foreground">
                        {(r.timeToFirstToken / 1000).toFixed(2)}s
                      </span>
                      <span className="font-secondary text-xs text-muted-foreground">TTFT</span>
                    </div>
                  )}
                  {r?.totalTime && (
                    <div className="flex items-center gap-1.5">
                      <MaterialIcon name="timer" style={{ fontSize: 16, width: 16, height: 16 }} className="text-muted-foreground" />
                      <span className="font-primary text-xs text-foreground">
                        {(r.totalTime / 1000).toFixed(2)}s
                      </span>
                      <span className="font-secondary text-xs text-muted-foreground">Total</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Response panels */}
        <div className="flex-1 flex min-h-0">
          {models.map((id, i) => {
            const model = AVAILABLE_MODELS.find(m => m.id === id);
            const r = responses[id];
            const msgs = parseMessages(r?.text || '');

            return (
              <div
                key={id}
                className={`flex-1 flex flex-col min-w-0 ${i < models.length - 1 ? 'border-r border-border' : ''}`}
              >
                <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-secondary text-sm font-medium text-foreground">
                      {model?.name}
                    </span>
                  </div>
                  {r?.isLoading && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                <div
                  ref={el => { refs.current[id] = el; }}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                  {r?.isLoading && !msgs.length && (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {r?.error && (
                    <div className="p-4 rounded-m bg-[var(--color-error)] border border-[var(--color-error-foreground)]/20 text-[var(--color-error-foreground)] font-secondary text-sm">
                      {r.error}
                    </div>
                  )}

                  {msgs.map((m, j) => (
                    <div key={j} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[90%] rounded-m px-4 py-3 ${
                          m.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border'
                        }`}
                      >
                        {m.role === 'assistant' ? (
                          <div className="prose-chat">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                            {j === msgs.length - 1 && r?.isLoading && (
                              <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
                            )}
                          </div>
                        ) : (
                          <p className="font-secondary text-sm">{m.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {!r?.text && !r?.isLoading && !r?.error && (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <MaterialIcon name="chat_bubble_outline" className="text-muted-foreground" style={{ fontSize: 32, width: 32, height: 32 }} />
                      <span className="font-secondary text-sm text-muted-foreground">
                        Ready to compare
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prompt input area */}
        <div className="border-t border-border bg-card px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Enter your prompt to compare models..."
                className="w-full font-secondary text-sm bg-background text-foreground border border-border rounded-m px-4 py-3 pr-12 resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-30 transition-opacity"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MaterialIcon name="arrow_upward" style={{ fontSize: 18, width: 18, height: 18 }} />
                )}
              </button>
            </div>
          </div>
          <p className="font-secondary text-xs text-muted-foreground mt-2">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
