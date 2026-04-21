'use client';

import Link from 'next/link';

const STEPS = [
  { num: '01', title: 'Pick your models', desc: 'Choose up to 4 models from GPT-4o, Claude, Gemini, Llama, Mistral, DeepSeek, and more.' },
  { num: '02', title: 'Send a prompt', desc: 'Type once — all selected models respond simultaneously with the same input.' },
  { num: '03', title: 'See the difference', desc: 'Responses appear side by side with timing metrics so you can judge quality and speed.' },
];

const MODELS = ['Claude Sonnet 4.5', 'GPT-4o', 'Gemini 2.5 Pro', 'DeepSeek R1', 'Llama 4 Maverick', 'Grok 4', 'Mistral Large', 'o3'];

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-icon ${className}`} style={{ fontWeight: 100 }}>
      {name}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-lp-bg text-lp-text">
      {/* Nav */}
      <nav className="flex items-center justify-between h-[64px] px-10 border-b border-lp-border">
        <span className="font-primary text-[18px] font-bold text-lp-accent">LLM ARENA</span>
        <Link
          href="/models"
          className="font-primary text-[13px] font-semibold text-lp-bg bg-lp-accent rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
        >
          Start Comparing
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-20 gap-8 text-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-lp-border">
          <span className="w-1.5 h-1.5 rounded-full bg-lp-green" />
          <span className="font-secondary text-[12px] text-lp-text-secondary">Free · No sign-in required</span>
        </div>

        <h1 className="font-primary text-[52px] font-bold text-lp-text leading-[1.1] max-w-[800px]">
          Compare any LLM.<br />Side by side. Free.
        </h1>
        <p className="font-secondary text-[18px] text-lp-text-muted leading-[1.6] max-w-[560px]">
          Run the same prompt across multiple AI models at once. See who answers better, faster, and more accurately — no account needed.
        </p>

        <Link
          href="/models"
          className="font-primary text-[15px] font-semibold text-lp-bg bg-lp-accent rounded-full px-8 py-3.5 hover:opacity-90 transition-opacity"
        >
          Start Comparing — Free
        </Link>

        {/* Model pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[640px] mt-2">
          {MODELS.map((m) => (
            <span key={m} className="font-secondary text-[13px] text-lp-text-secondary px-3 py-1 rounded-full border border-lp-border">
              {m}
            </span>
          ))}
          <span className="font-secondary text-[13px] text-lp-text-dim px-3 py-1">+ more</span>
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col items-center px-10 py-20 gap-12 border-t border-lp-border">
        <div className="flex flex-col items-center gap-3">
          <span className="font-primary text-[11px] font-bold text-lp-accent tracking-[3px]">HOW IT WORKS</span>
          <h2 className="font-primary text-[32px] font-bold text-lp-text leading-[1.2] text-center">
            Three steps, zero friction
          </h2>
        </div>
        <div className="flex gap-5 w-full max-w-[960px]">
          {STEPS.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col gap-4 p-7 rounded-[16px] bg-lp-surface border border-lp-border">
              <span className="font-primary text-[40px] font-bold text-lp-accent leading-none">{step.num}</span>
              <h3 className="font-primary text-[17px] font-semibold text-lp-text">{step.title}</h3>
              <p className="font-secondary text-[14px] text-lp-text-muted leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col items-center px-10 py-20 gap-10 border-t border-lp-border bg-lp-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="font-primary text-[11px] font-bold text-lp-accent tracking-[3px]">FEATURES</span>
          <h2 className="font-primary text-[32px] font-bold text-lp-text leading-[1.2] text-center">
            What you get
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-[960px]">
          {[
            { icon: 'compare_arrows', title: 'Side-by-side view', desc: 'Up to 4 models running in parallel on the same prompt.' },
            { icon: 'speed', title: 'Response timing', desc: 'See time-to-first-token and total response time per model.' },
            { icon: 'chat', title: 'Multi-turn chat', desc: 'Keep the conversation going across all models simultaneously.' },
            { icon: 'auto_awesome', title: '26+ models', desc: 'Anthropic, OpenAI, Google, Meta, Mistral, DeepSeek, xAI and more.' },
            { icon: 'lock_open', title: 'No account needed', desc: 'Jump straight in. No sign-up, no credit card, no friction.' },
            { icon: 'markdown', title: 'Markdown rendering', desc: 'Responses render with proper formatting, code blocks, and lists.' },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-3 p-6 rounded-[16px] bg-lp-bg border border-lp-border">
              <MaterialIcon name={f.icon} className="!text-[28px] text-lp-accent" />
              <h3 className="font-primary text-[15px] font-semibold text-lp-text">{f.title}</h3>
              <p className="font-secondary text-[13px] text-lp-text-muted leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center px-10 py-24 gap-6 border-t border-lp-border text-center">
        <h2 className="font-primary text-[40px] font-bold text-lp-text leading-[1.1]">
          Ready to compare?
        </h2>
        <p className="font-secondary text-[16px] text-lp-text-muted max-w-[440px] leading-[1.6]">
          No account required. Just pick your models and start prompting.
        </p>
        <Link
          href="/models"
          className="font-primary text-[15px] font-semibold text-lp-bg bg-lp-accent rounded-full px-8 py-3.5 hover:opacity-90 transition-opacity"
        >
          Start Comparing
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 py-6 border-t border-lp-border">
        <span className="font-primary text-[14px] font-bold text-lp-accent">LLM ARENA</span>
        <span className="font-secondary text-[13px] text-lp-text-dim">© 2026</span>
      </footer>
    </div>
  );
}
