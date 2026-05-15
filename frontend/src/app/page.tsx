import {
  Brain,
  Zap,
  Database,
  MessageSquare,
  Bell,
  Users,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { NeuralBackground } from '@/components/NeuralBackground'
import { WaitlistForm } from '@/components/WaitlistForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05050f] text-white">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#05050f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold tracking-tight">Offboardly</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          </div>
          <a
            href="#waitlist"
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Join Waitlist <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <NeuralBackground />
        {/* centre purple glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(124,58,237,0.13)_0%,transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            Private Beta · Now Accepting Design Partners
          </div>

          <h1 className="mb-6 text-6xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            Your Company&apos;s Brain.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              Preserved Forever.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            42% of critical institutional knowledge walks out the door when employees leave.
            Offboardly captures it through AI-powered interviews — so your organization
            never loses a neuron.
          </p>

          <div className="mx-auto max-w-xl">
            <WaitlistForm />
            <p className="mt-3 text-sm text-gray-600">
              Join 200+ companies already on the waitlist. No spam, ever.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05050f] to-transparent" />
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-white/5 bg-[#07071a] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            The cost of organizational amnesia
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                stat: '$47M',
                label: 'Average annual loss from inefficient knowledge transfer',
                color: 'text-purple-400',
                glow: 'shadow-[0_0_40px_rgba(139,92,246,0.15)]',
              },
              {
                stat: '42%',
                label: 'Of critical knowledge walks out with every departing employee',
                color: 'text-violet-300',
                glow: 'shadow-[0_0_40px_rgba(167,139,250,0.15)]',
              },
              {
                stat: '6 mo+',
                label: 'Teams spend rebuilding after a single key departure',
                color: 'text-cyan-400',
                glow: 'shadow-[0_0_40px_rgba(6,182,212,0.15)]',
              },
            ].map(item => (
              <div
                key={item.stat}
                className={`rounded-2xl border border-white/10 bg-[#0d0d20] p-8 text-center ${item.glow}`}
              >
                <div className={`mb-3 text-5xl font-black ${item.color}`}>{item.stat}</div>
                <div className="text-sm leading-relaxed text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
            The Problem
          </div>
          <h2 className="mb-6 text-center text-4xl font-black leading-tight sm:text-5xl">
            When Sarah retires, she takes
            <br />
            <span className="text-gray-500">decades of institutional memory with her.</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center leading-relaxed text-gray-400">
            Six months later, teams are still asking{' '}
            <em>&ldquo;How did Sarah handle this?&rdquo;</em> while staring at cryptic
            spreadsheets and half-finished processes. Traditional offboarding captures none
            of this. Exit interviews focus on HR metrics. Knowledge transfer docs are rushed,
            incomplete, and outdated before the employee&apos;s last day.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-purple-900/50 bg-[#0d0d20] p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-900/40">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Tribal Knowledge</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-400">
                The unwritten rules, workarounds, and &ldquo;how we actually do things&rdquo; that
                never made it into any wiki.
              </p>
              <blockquote className="rounded-xl bg-purple-900/20 p-4 text-sm italic text-purple-300">
                &ldquo;Oh, you have to CC finance on that report or it gets stuck for weeks.&rdquo;
              </blockquote>
            </div>
            <div className="rounded-2xl border border-cyan-900/50 bg-[#0d0d20] p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-900/40">
                <Database className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Constitutional Knowledge</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-400">
                Deep understanding of why processes exist, how systems evolved, and the history
                behind decisions.
              </p>
              <blockquote className="rounded-xl bg-cyan-900/20 p-4 text-sm italic text-cyan-300">
                &ldquo;We stopped using that vendor in 2019 because of the data breach — that&apos;s
                why we have the manual review step.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="border-y border-white/5 bg-[#07071a] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
            How It Works
          </div>
          <h2 className="mb-4 text-center text-4xl font-black sm:text-5xl">
            The Neural Transfer Protocol
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-gray-500">
            Five steps. One goal: capture every neuron of institutional knowledge before it&apos;s gone.
          </p>

          <div className="relative">
            {/* connector line */}
            <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-gradient-to-r from-transparent via-purple-800/60 to-transparent lg:block" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {[
                {
                  step: '01',
                  Icon: Zap,
                  title: 'Trigger',
                  desc: 'Employee gives notice. Offboardly kicks in automatically via HRIS integration.',
                  color: 'text-purple-400',
                  ring: 'ring-purple-800/60',
                  bg: 'bg-purple-900/20',
                },
                {
                  step: '02',
                  Icon: Brain,
                  title: 'Discover',
                  desc: "AI maps the employee's knowledge footprint across Slack, email, docs, and tickets.",
                  color: 'text-violet-400',
                  ring: 'ring-violet-800/60',
                  bg: 'bg-violet-900/20',
                },
                {
                  step: '03',
                  Icon: MessageSquare,
                  title: 'Interview',
                  desc: 'Conversational AI conducts guided sessions covering workflows, decisions, and relationships.',
                  color: 'text-blue-400',
                  ring: 'ring-blue-800/60',
                  bg: 'bg-blue-900/20',
                },
                {
                  step: '04',
                  Icon: Database,
                  title: 'Synthesize',
                  desc: 'Raw conversations are structured into searchable knowledge entries and process docs.',
                  color: 'text-cyan-400',
                  ring: 'ring-cyan-800/60',
                  bg: 'bg-cyan-900/20',
                },
                {
                  step: '05',
                  Icon: Users,
                  title: 'Transfer',
                  desc: "Teams query an AI assistant trained on the departing employee's full institutional knowledge.",
                  color: 'text-teal-400',
                  ring: 'ring-teal-800/60',
                  bg: 'bg-teal-900/20',
                },
              ].map(({ step, Icon, title, desc, color, ring, bg }) => (
                <div
                  key={step}
                  className={`rounded-2xl border border-white/8 ${bg} p-6 text-center`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ring-1 ${ring} ${bg}`}
                  >
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <div className={`mb-1 text-[10px] font-black tracking-[0.2em] ${color}`}>
                    STEP {step}
                  </div>
                  <h3 className="mb-3 text-base font-bold">{title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
            The Memory System
          </div>
          <h2 className="mb-4 text-center text-4xl font-black sm:text-5xl">
            Everything Your Company Needs to Remember
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center leading-relaxed text-gray-400">
            Built for the knowledge that lives between the lines — the stuff that makes the
            difference between a smooth transition and six months of chaos.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                Icon: Brain,
                title: 'AI Knowledge Interviews',
                desc: "Guided conversational sessions that adapt to the employee's role, tenure, and knowledge footprint. Voice or text. Up to 60 minutes.",
                detail:
                  'Covers workflows, decision frameworks, relationships, undocumented workarounds, and the "why" behind every process.',
                color: 'text-purple-400',
                iconBg: 'bg-purple-900/30',
                border: 'border-purple-900/40',
              },
              {
                Icon: Database,
                title: 'Knowledge Synthesis Engine',
                desc: 'Raw interview transcripts are automatically structured into searchable Markdown docs, process maps, and decision trees.',
                detail:
                  'Exports to Confluence, Notion, Google Docs, or your knowledge base of choice. One click.',
                color: 'text-cyan-400',
                iconBg: 'bg-cyan-900/30',
                border: 'border-cyan-900/40',
              },
              {
                Icon: MessageSquare,
                title: 'AI Successor Assistant',
                desc: "A chatbot trained on the departing employee's captured knowledge that teammates can query after they're gone.",
                detail:
                  '"How would Sarah have handled this vendor dispute?" — answered instantly, based on her actual knowledge and decision patterns.',
                color: 'text-violet-400',
                iconBg: 'bg-violet-900/30',
                border: 'border-violet-900/40',
              },
              {
                Icon: Bell,
                title: 'Knowledge Gap Alerts',
                desc: "Identifies critical knowledge areas that haven't been captured yet and flags them before the employee's last day.",
                detail:
                  'Prevents the most common failure mode: running out of time before the important stuff gets documented.',
                color: 'text-blue-400',
                iconBg: 'bg-blue-900/30',
                border: 'border-blue-900/40',
              },
            ].map(({ Icon, title, desc, detail, color, iconBg, border }) => (
              <div
                key={title}
                className={`rounded-2xl border ${border} bg-[#0d0d20] p-8 transition hover:border-white/20`}
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{title}</h3>
                <p className="mb-4 leading-relaxed text-gray-400">{desc}</p>
                <p className="rounded-xl bg-white/4 p-4 text-sm leading-relaxed text-gray-500">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="border-y border-white/5 bg-[#07071a] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
            Who It&apos;s For
          </div>
          <h2 className="mb-16 text-center text-4xl font-black sm:text-5xl">
            Built for Companies That Can&apos;t Afford to Forget
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { industry: 'Financial Services', reason: 'Regulatory + process knowledge' },
              { industry: 'Healthcare', reason: 'Compliance + clinical workflows' },
              { industry: 'Manufacturing', reason: 'Machine-specific + safety knowledge' },
              { industry: 'Technology', reason: 'Architectural decisions + system knowledge' },
              { industry: 'Professional Services', reason: 'Client relationships + history' },
            ].map(item => (
              <div
                key={item.industry}
                className="rounded-2xl border border-white/8 bg-[#0d0d20] p-5 text-center"
              >
                <div className="mb-2 text-sm font-semibold">{item.industry}</div>
                <div className="text-xs leading-relaxed text-gray-500">{item.reason}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-purple-900/50 bg-purple-900/10 p-8 text-center">
            <div className="mb-2 text-lg font-bold">
              Sweet spot: 100–2,000 employees
            </div>
            <div className="text-gray-400">
              Large enough that key departures are felt company-wide. Small enough that you
              can&apos;t afford a six-month knowledge recovery.
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">
            Pricing
          </div>
          <h2 className="mb-4 text-center text-4xl font-black sm:text-5xl">
            Pay When You Need It
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
            Per-offboarding pricing ties cost directly to value. You only pay when an employee
            is actually leaving — and even $1,499 is a rounding error against a $47M annual loss.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                tier: 'Starter',
                price: '$299',
                unit: 'per offboarding',
                desc: 'For small teams navigating their first key departure.',
                features: [
                  'Up to 3 AI interview sessions',
                  'Knowledge base export (PDF / Confluence)',
                  '30-day AI Successor Assistant',
                  'Email support',
                ],
                cta: 'Join Waitlist',
                href: '#waitlist',
                highlight: false,
              },
              {
                tier: 'Professional',
                price: '$799',
                unit: 'per offboarding',
                desc: 'Full knowledge capture for mid-market teams.',
                features: [
                  'Unlimited AI interview sessions',
                  'Tool integrations (Slack, Jira, Google)',
                  'Knowledge footprint mapping',
                  '6-month AI Successor Assistant',
                  'Knowledge gap alerts',
                  'Priority support',
                ],
                cta: 'Join Waitlist',
                href: '#waitlist',
                highlight: true,
              },
              {
                tier: 'Enterprise',
                price: '$1,499',
                unit: 'per offboarding',
                desc: 'Enterprise-grade capture for critical departures.',
                features: [
                  'Everything in Professional',
                  'Custom integrations (Salesforce, SAP)',
                  'Working style & tone profiles',
                  'Permanent AI Successor Assistant',
                  'Compliance-ready audit trails',
                  'Dedicated CSM',
                ],
                cta: 'Contact Sales',
                href: '#waitlist',
                highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.tier}
                className={`flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? 'border-purple-500 bg-[#0d0d20] ring-1 ring-purple-500/20'
                    : 'border-white/10 bg-[#0d0d20]'
                }`}
              >
                {plan.highlight && (
                  <div className="mb-4 inline-flex self-start rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                    Most Popular
                  </div>
                )}
                <div className="mb-1 text-xl font-bold">{plan.tier}</div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.unit}</span>
                </div>
                <p className="mb-6 text-sm text-gray-500">{plan.desc}</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                      <span className="text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block rounded-xl px-6 py-3 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'border border-white/15 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA / WAITLIST ─── */}
      <section
        id="waitlist"
        className="relative overflow-hidden border-t border-white/5 py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(124,58,237,0.14)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <Brain className="mx-auto mb-6 h-12 w-12 text-purple-400" />
          <h2 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">
            Don&apos;t Let Your Company&apos;s
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Brain Walk Out the Door.
            </span>
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-gray-400">
            Join the waitlist. Be among the first companies to run Offboardly on a real
            offboarding. Design partners get white-glove onboarding and a lifetime discount.
          </p>
          <WaitlistForm large />
          <p className="mt-4 text-sm text-gray-600">No spam. No commitment. Just early access.</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Brain className="h-4 w-4" />
            <span className="text-sm">Offboardly — Organizational memory, perfected.</span>
          </div>
          <a
            href="https://github.com/mohit3647/Offboardly"
            className="text-sm text-gray-700 transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </footer>

    </div>
  )
}
