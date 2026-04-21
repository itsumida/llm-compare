'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const FEATURES = [
  { icon: 'compare_arrows', title: 'Side-by-Side View', desc: 'Run the same prompt against any two models and see both responses simultaneously in a clean split view.' },
  { icon: 'speed', title: 'Performance Metrics', desc: 'Track latency, token usage, cost per query, and coherence scores. Data-driven decisions, not gut feelings.' },
  { icon: 'leaderboard', title: 'Custom Leaderboards', desc: 'Build your own rankings based on your actual use cases. Every vote contributes to your personalized model scores.' },
  { icon: 'history', title: 'Prompt History', desc: 'Every comparison is saved. Search, filter, and revisit past sessions to track how models evolve over time.' },
  { icon: 'key', title: 'Bring Your Keys', desc: 'Use your own API keys from OpenAI, Anthropic, Google, and more. Pay only what you use — no markup.' },
  { icon: 'group', title: 'Team Collaboration', desc: 'Share comparison results with your team. Align on model choices with shared leaderboards and annotations.' },
];

const STEPS = [
  { num: '01', title: 'Pick Your Models', desc: 'Choose from 50+ models including GPT-4o, Claude, Gemini, Llama, Mistral, and more. Mix any two for head-to-head comparison.' },
  { num: '02', title: 'Run Your Prompt', desc: 'Type a single prompt and send it to both models simultaneously. Same input, different outputs — the fairest test possible.' },
  { num: '03', title: 'Compare & Decide', desc: 'See responses side by side with metrics — speed, cost, token count, and coherence scores. Rate outputs and build your own leaderboard.' },
];

const STATS = [
  { value: '12,000+', label: 'Comparisons Run' },
  { value: '50+', label: 'Models Available' },
  { value: '3,400+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const TESTIMONIALS = [
  { quote: '"We switched our entire eval pipeline to LLM Arena. The side-by-side view saved us weeks of manual testing."', name: 'Sarah Kim', role: 'ML Lead at Vercel', initials: 'SK' },
  { quote: '"Finally, a tool that lets me compare models without writing a single line of code. The metrics view is a game changer."', name: 'Marcus Rivera', role: 'CTO at Raycast', initials: 'MR' },
  { quote: '"We use LLM Arena for every model evaluation. It cut our decision time from weeks to hours. Essential tool for any AI team."', name: 'Anna Li', role: 'AI Engineer at Stripe', initials: 'AL' },
];

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for exploring and testing models on personal projects.',
    features: ['10 comparisons / day', '5 models available', 'Basic metrics', '7-day history'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For developers and small teams evaluating models seriously.',
    features: ['Unlimited comparisons', 'All 50+ models', 'Advanced metrics + export', 'Unlimited history', 'Custom leaderboards'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations running model evaluations at scale with compliance needs.',
    features: ['Everything in Pro', 'SSO + SAML', 'Dedicated support', 'Custom integrations', 'Audit logs + compliance'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const LOGOS = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Supabase'];

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span
      className={`material-icon ${className}`}
      style={{ fontWeight: 100 }}
    >
      {name}
    </span>
  );
}

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-lp-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between h-[72px] px-20">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-primary text-[20px] font-bold text-lp-accent leading-none">
            LLM ARENA
          </Link>
          <div className="flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="font-secondary text-[15px] text-lp-text-secondary hover:text-lp-text transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href={session ? '/models' : '/api/auth/signin'} className="font-secondary text-[15px] font-medium text-lp-text hover:text-lp-text-secondary transition-colors">
            Log In
          </Link>
          <Link
            href="/models"
            className="font-primary text-[14px] font-semibold text-lp-bg bg-lp-accent rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-20 pt-20 pb-[60px] gap-10">
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-lp-border">
          <span className="w-2 h-2 rounded-full bg-lp-green" />
          <span className="font-secondary text-[13px] font-medium text-lp-text-secondary">
            Now supporting 50+ models
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-6 max-w-[900px]">
          <h1 className="font-primary text-[56px] font-bold text-lp-text leading-[1.1] text-center">
            Compare Any LLM.<br />
            Side by Side.<br />
            In Real Time.
          </h1>
          <p className="font-secondary text-[20px] text-lp-text-muted leading-[1.5] text-center max-w-[700px]">
            Pick any two models, run the same prompt, and instantly see which one gives you a better answer. No guessing — just data.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Link
            href="/models"
            className="font-primary text-[16px] font-semibold text-lp-bg bg-lp-accent rounded-full px-8 py-4 hover:opacity-90 transition-opacity"
          >
            Start Comparing — Free
          </Link>
          <button className="font-secondary text-[16px] font-medium text-lp-text rounded-full px-8 py-4 border border-lp-border hover:border-lp-text-muted transition-colors">
            Watch Demo
          </button>
        </div>

        {/* Product Preview */}
        <div className="relative w-full max-w-[1100px] mt-4">
          <div className="rounded-[16px] border border-lp-border bg-lp-surface overflow-hidden shadow-2xl shadow-black/50">
            {/* Simulated dashboard UI */}
            <div className="flex">
              {/* Sidebar preview */}
              <div className="w-[220px] bg-[#18181b] border-r border-lp-border p-6 hidden lg:block">
                <p className="font-primary text-[14px] font-bold text-lp-accent mb-8">LLM ARENA</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-full bg-[#2a2a30]">
                    <MaterialIcon name="compare_arrows" className="!text-[18px] text-lp-text" />
                    <span className="font-secondary text-[14px] text-lp-text">Compare</span>
                  </div>
                  {['code', 'history', 'leaderboard'].map((icon) => (
                    <div key={icon} className="flex items-center gap-3 px-3 py-2.5">
                      <MaterialIcon name={icon} className="!text-[18px] text-lp-text-muted" />
                      <span className="font-secondary text-[14px] text-lp-text-muted">
                        {icon === 'code' ? 'Playground' : icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-primary text-[16px] font-semibold text-lp-text">Compare Models</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded text-lp-text-muted text-[13px] font-secondary">
                      <MaterialIcon name="search" className="!text-[16px]" />
                      Search models...
                    </div>
                    <div className="px-4 py-1.5 bg-lp-accent rounded-full text-lp-bg text-[13px] font-primary font-semibold">
                      + New Session
                    </div>
                  </div>
                </div>

                {/* Model selector row */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-lp-text-muted text-[12px] font-secondary">Model A</span>
                    <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-full border border-lp-border bg-lp-bg">
                      <span className="text-lp-text text-[13px] font-secondary">Claude 4.5 Sonnet</span>
                      <MaterialIcon name="expand_more" className="!text-[16px] text-lp-text-muted" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-lp-text-muted text-[12px] font-secondary">Model B</span>
                    <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-full border border-lp-border bg-lp-bg">
                      <span className="text-lp-text text-[13px] font-secondary">GPT-4o</span>
                      <MaterialIcon name="expand_more" className="!text-[16px] text-lp-text-muted" />
                    </div>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="flex gap-3 mb-4">
                  {[
                    { label: 'Response Time', a: '1.2s', b: '0.8s', bWins: true },
                    { label: 'Token Count', a: '847', b: '923', aWins: true },
                    { label: 'Cost', a: '$0.003', b: '$0.005', aWins: true },
                    { label: 'Coherence', a: '9.2', b: '8.7', aWins: true },
                  ].map((m) => (
                    <div key={m.label} className="flex-1 p-3 rounded-[12px] border border-lp-border bg-[#1A1A1A]">
                      <p className="text-lp-text-muted text-[11px] font-secondary mb-1">{m.label}</p>
                      <div className="flex items-center justify-between">
                        <span className={`font-primary text-[15px] font-semibold ${m.aWins ? 'text-lp-green' : 'text-lp-text'}`}>{m.a}</span>
                        <span className={`font-primary text-[15px] font-semibold ${m.bWins ? 'text-lp-green' : 'text-lp-text'}`}>{m.b}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Response panels */}
                <div className="flex gap-4">
                  {[
                    { name: 'Claude 4.5 Sonnet', color: '#10B981', tokens: '847 tokens', time: '1.2s' },
                    { name: 'GPT-4o', color: '#06B6D4', tokens: '923 tokens', time: '0.8s' },
                  ].map((model) => (
                    <div key={model.name} className="flex-1 rounded-[12px] border border-lp-border bg-[#1A1A1A] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-lp-border">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                          <span className="font-primary text-[13px] font-semibold text-lp-text">{model.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lp-text-muted text-[11px] font-secondary">{model.tokens}</span>
                          <span className="text-lp-text-muted text-[11px] font-secondary">{model.time}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="h-2.5 bg-lp-border/50 rounded w-full" />
                        <div className="h-2.5 bg-lp-border/50 rounded w-4/5" />
                        <div className="h-2.5 bg-lp-border/50 rounded w-3/5" />
                        <div className="h-2.5 bg-lp-border/50 rounded w-full mt-3" />
                        <div className="h-2.5 bg-lp-border/50 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow line */}
          <div className="mx-auto mt-2 w-[600px] h-1 rounded-sm bg-gradient-to-r from-transparent via-lp-accent to-transparent opacity-50" />
        </div>
      </section>

      {/* Trusted By */}
      <section className="flex flex-col items-center px-20 py-12 gap-8">
        <p className="font-primary text-[12px] font-medium text-lp-text-dim tracking-[3px]">
          TRUSTED BY TEAMS AT
        </p>
        <div className="flex items-center justify-center gap-16 w-full">
          {LOGOS.map((name) => (
            <span key={name} className="font-secondary text-[22px] font-semibold text-lp-text-dim">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col items-center px-20 py-20 gap-12">
        <div className="flex flex-col items-center gap-4 max-w-[700px]">
          <span className="font-primary text-[13px] font-semibold text-lp-accent tracking-[3px]">HOW IT WORKS</span>
          <h2 className="font-primary text-[36px] font-bold text-lp-text leading-[1.15] text-center">
            Three steps to smarter model decisions
          </h2>
        </div>
        <div className="flex gap-6 w-full max-w-[1280px]">
          {STEPS.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col gap-5 p-8 rounded-[16px] bg-lp-surface border border-[#1F1F1F]">
              <span className="font-primary text-[48px] font-bold text-lp-accent leading-none">{step.num}</span>
              <h3 className="font-primary text-[20px] font-semibold text-lp-text leading-[1.2]">{step.title}</h3>
              <p className="font-secondary text-[15px] text-lp-text-muted leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="flex flex-col items-center px-20 py-20 gap-12">
        <div className="flex flex-col items-center gap-4 max-w-[700px]">
          <span className="font-primary text-[13px] font-semibold text-lp-accent tracking-[3px]">FEATURES</span>
          <h2 className="font-primary text-[36px] font-bold text-lp-text leading-[1.15] text-center">
            Everything you need to evaluate LLMs
          </h2>
          <p className="font-secondary text-[18px] text-lp-text-muted leading-[1.5] text-center">
            From quick comparisons to deep analysis — tools built for engineers who need answers, not opinions.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5 w-full max-w-[1280px]">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-4 p-8 rounded-[16px] bg-lp-surface border border-[#1F1F1F]">
              <MaterialIcon name={f.icon} className="!text-[32px] text-lp-accent" />
              <h3 className="font-primary text-[18px] font-semibold text-lp-text leading-[1.2]">{f.title}</h3>
              <p className="font-secondary text-[15px] text-lp-text-muted leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="flex flex-col items-center px-20 py-20 gap-16 bg-lp-surface">
        {/* Stats */}
        <div className="flex items-center justify-center gap-20 w-full">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="font-primary text-[48px] font-bold text-lp-text leading-none">{s.value}</span>
              <span className="font-secondary text-[15px] text-lp-text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="flex gap-6 w-full max-w-[1280px]">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex-1 flex flex-col gap-5 p-8 rounded-[16px] border border-lp-border">
              <p className="font-secondary text-[16px] text-lp-text leading-[1.6]">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lp-border flex items-center justify-center">
                  <span className="font-primary text-[14px] font-semibold text-lp-text">{t.initials}</span>
                </div>
                <div>
                  <p className="font-secondary text-[14px] font-semibold text-lp-text leading-none">{t.name}</p>
                  <p className="font-secondary text-[13px] text-lp-text-muted leading-none mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="flex flex-col items-center px-20 py-20 gap-12">
        <div className="flex flex-col items-center gap-4 max-w-[700px]">
          <span className="font-primary text-[13px] font-semibold text-lp-accent tracking-[3px]">PRICING</span>
          <h2 className="font-primary text-[36px] font-bold text-lp-text leading-[1.15] text-center">
            Start free. Scale when you&apos;re ready.
          </h2>
        </div>
        <div className="flex gap-6 max-w-[1100px] w-full">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex-1 flex flex-col gap-6 p-8 rounded-[16px] ${
                tier.highlighted
                  ? 'bg-lp-surface border-2 border-lp-accent'
                  : 'bg-lp-surface border border-lp-border'
              }`}
            >
              {tier.highlighted && (
                <span className="self-start font-primary text-[11px] font-bold text-lp-bg bg-lp-accent rounded-full px-3 py-1 tracking-[1px]">
                  MOST POPULAR
                </span>
              )}
              <span className="font-primary text-[20px] font-semibold text-lp-text">{tier.name}</span>
              <div className="flex items-end gap-1">
                <span className="font-primary text-[48px] font-bold text-lp-text leading-none">{tier.price}</span>
                {tier.period && <span className="font-secondary text-[16px] text-lp-text-muted leading-[1.8]">{tier.period}</span>}
              </div>
              <p className="font-secondary text-[15px] text-lp-text-muted leading-[1.5]">{tier.desc}</p>
              <div className="w-full h-px bg-lp-border" />
              <div className="flex flex-col gap-3">
                {tier.features.map((f) => (
                  <span key={f} className="font-secondary text-[14px] text-lp-text-secondary">{f}</span>
                ))}
              </div>
              <Link
                href={tier.name === 'Enterprise' ? '#' : '/models'}
                className={`w-full text-center py-3.5 rounded-full font-primary text-[14px] font-semibold transition-opacity hover:opacity-90 ${
                  tier.highlighted
                    ? 'bg-lp-accent text-lp-bg'
                    : 'border border-lp-border text-lp-text'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center px-20 py-[100px] gap-8 bg-lp-surface">
        <h2 className="font-primary text-[48px] font-bold text-lp-text leading-[1.1] text-center max-w-[800px]">
          Stop guessing.<br />
          Start comparing.
        </h2>
        <p className="font-secondary text-[18px] text-lp-text-muted leading-[1.5] text-center max-w-[600px]">
          Join 3,400+ engineers who make better model decisions with LLM Arena.
        </p>
        <Link
          href="/models"
          className="font-primary text-[16px] font-semibold text-lp-bg bg-lp-accent rounded-full px-8 py-4 hover:opacity-90 transition-opacity"
        >
          Get Started Free
        </Link>
        <p className="font-secondary text-[14px] text-lp-text-dim">
          No credit card required. Free plan available forever.
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-12 px-20 pt-16 pb-8 border-t border-[#1F1F1F]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3 max-w-[300px]">
            <span className="font-primary text-[18px] font-bold text-lp-accent">LLM ARENA</span>
            <p className="font-secondary text-[14px] text-lp-text-dim leading-[1.5]">
              The fastest way to compare language models side by side.
            </p>
          </div>
          <div className="flex gap-20">
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <span className="font-primary text-[13px] font-semibold text-lp-text">{col.title}</span>
                {col.links.map((link) => (
                  <a key={link} href="#" className="font-secondary text-[14px] text-lp-text-dim hover:text-lp-text-secondary transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-[#1F1F1F]" />
        <div className="flex items-center justify-between">
          <span className="font-secondary text-[13px] text-lp-text-dim">
            © 2026 LLM Arena. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {['X', 'GitHub', 'Discord'].map((s) => (
              <a key={s} href="#" className="font-secondary text-[13px] font-medium text-lp-text-dim hover:text-lp-text-secondary transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
