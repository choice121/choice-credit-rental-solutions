import { useEffect, useRef, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Shield, TrendingUp,
  Clock, Users, Award, Lock, MapPin, ShieldCheck, X, Check,
  CalendarClock, ClipboardCheck, FileText, Rocket
} from "lucide-react";
import RenterChallenges from "@/components/RenterChallenges";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import BeforeAfter from "@/components/BeforeAfter";
import ScrollReveal from "@/components/ScrollReveal";

// ── Guarantee Banner ────────────────────────────────────────────────────────
function GuaranteeBanner() {
  return (
    <div className="bg-emerald-600 text-white py-3.5">
      <div className="container max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">
          <span className="font-bold">Our Promise:</span> If we don't produce measurable results within your package timeline, we keep working with you at no extra charge until we do.
        </p>
        <Button asChild size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10 shrink-0 text-xs h-7 px-3">
          <Link href="/services#guarantee">See Full Guarantee</Link>
        </Button>
      </div>
    </div>
  );
}

// ── Animated count-up hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, triggered: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const steps = Math.ceil(duration / 16);
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else { setValue(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);
  return value;
}

function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const approvalRate = useCountUp(98, 1400, triggered);
  const clients = useCountUp(500, 1800, triggered);
  const responseTime = useCountUp(48, 1000, triggered);
  const yearsExp = useCountUp(30, 1200, triggered);

  const stats = [
    { value: `${approvalRate}%`, label: "Approval Rate", icon: <Award className="w-5 h-5" />, sublabel: "across all client types" },
    { value: `${clients}+`, label: "Clients Housed", icon: <Users className="w-5 h-5" />, sublabel: "all 50 states" },
    { value: `${responseTime}h`, label: "Avg. Response", icon: <Clock className="w-5 h-5" />, sublabel: "or less to first contact" },
    { value: `${yearsExp}+`, label: "Years Combined Exp.", icon: <Award className="w-5 h-5" />, sublabel: "in credit & housing" },
  ];

  return (
    <section ref={ref} className="bg-primary border-y border-primary-foreground/10">
      <div className="container py-0">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/10">
          {stats.map((s, i) => (
            <div key={i} className="py-10 px-6 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-1">
                {s.icon}
              </div>
              <div className="text-4xl font-serif font-bold text-primary-foreground tabular-nums">{s.value}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">{s.label}</div>
              <div className="text-xs text-primary-foreground/50">{s.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Avatar proof strip ──────────────────────────────────────────────────────
const AVATAR_COLORS = ["bg-violet-600", "bg-emerald-600", "bg-rose-600", "bg-blue-600", "bg-amber-600"];
const AVATAR_INITIALS = ["MT", "DR", "JK", "AM", "DW"];

function ProofStrip() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <div className="flex -space-x-2">
        {AVATAR_INITIALS.map((init, i) => (
          <div key={i} className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i]} border-2 border-primary flex items-center justify-center text-white text-[10px] font-bold`}>
            {init}
          </div>
        ))}
      </div>
      <p className="text-primary-foreground/75 text-sm">
        <span className="text-primary-foreground font-semibold">500+ families</span> housed this year
      </p>
    </div>
  );
}

// ── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const timeline = [
    {
      day: "Day 1",
      icon: <CalendarClock className="w-6 h-6" />,
      title: "Free Consultation Call",
      description: "You speak with a real advisor — not a chatbot. We review your credit profile, rental history, income situation, and the exact reason(s) you were denied. No judgment, just a plan.",
      details: ["Full credit profile review", "Denial reason analysis", "Package recommendation", "Realistic timeline set"],
      accent: "bg-blue-100 text-blue-600",
      line: "bg-blue-200",
    },
    {
      day: "Days 2–5",
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Your Custom Plan is Built",
      description: "Your advisor builds a strategy tailored to your exact situation — dispute letters, tradeline selection, income documentation formatting, or co-signer coordination. Nothing generic.",
      details: ["Personalized approval roadmap", "Dispute letters drafted (if needed)", "Tradeline strategy selected", "Document checklist sent to you"],
      accent: "bg-violet-100 text-violet-600",
      line: "bg-violet-200",
    },
    {
      day: "Days 7–30",
      icon: <FileText className="w-6 h-6" />,
      title: "Execution & Progress",
      description: "We work through every step of the plan with you. Tradelines post, disputes resolve, your profile strengthens. You receive updates throughout — no guessing where things stand.",
      details: ["Tradelines posting to credit", "Dispute responses tracked", "Score monitoring active", "Advisor available for questions"],
      accent: "bg-emerald-100 text-emerald-600",
      line: "bg-emerald-200",
    },
    {
      day: "Day 30+",
      icon: <Rocket className="w-6 h-6" />,
      title: "Apply with Confidence",
      description: "When your profile is ready, we package your application to present you as the strongest possible tenant. We coach you on which properties to target, how to answer questions, and what to expect.",
      details: ["Application package prepared", "Property targeting guidance", "Application submission support", "Keys in hand"],
      accent: "bg-accent/20 text-accent",
      line: "bg-accent/30",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Exactly what happens after you book
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No mystery. No waiting to find out what's next. Here's the real day-by-day breakdown of your path from denied to approved.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[1.75rem] md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden sm:block" />

          <div className="space-y-10">
            {timeline.map((step, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className={`bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${i % 2 !== 0 ? "" : ""}`}>
                      <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${step.accent}`}>
                        {step.day}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                      <ul className={`space-y-1.5 ${i % 2 === 0 ? "md:items-end" : ""} flex flex-col`}>
                        {step.details.map((d, j) => (
                          <li key={j} className={`flex items-center gap-2 text-xs text-muted-foreground ${i % 2 === 0 ? "md:flex-row-reverse md:self-end" : ""}`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden sm:flex absolute left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background shadow ${step.accent}`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center mt-14">
            <p className="text-muted-foreground mb-4 text-sm">Most clients are approved within 14–45 days of starting.</p>
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/book">
                Start with a free consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Vs. Alone Comparison ─────────────────────────────────────────────────────
function VsAlone() {
  const rows = [
    { label: "Time to first approval", alone: "6–18 months of trial & error", us: "14–45 days on average" },
    { label: "Know why you were denied", alone: "Guessing or generic advice", us: "Specific denial analysis on Day 1" },
    { label: "Dispute letters", alone: "Templates from Google — often wrong", us: "Custom letters written for your case" },
    { label: "Tradeline strategy", alone: "Unknown — easy to do it wrong", us: "Targeted placement for maximum impact" },
    { label: "Second-chance landlords", alone: "Hours of research, still incomplete", us: "We know exactly who accepts your profile" },
    { label: "Application presentation", alone: "Same format that already got you denied", us: "Packaged to lead with your strengths" },
    { label: "Cost of another denial", alone: "Lost deposit + application fees + time", us: "Avoided — we get it right the first time" },
    { label: "Support when you're stuck", alone: "None", us: "Direct advisor access throughout" },
  ];

  return (
    <section className="py-24 bg-muted/40 border-y">
      <div className="container max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Why Not DIY?
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Doing it alone vs. doing it right
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most people try on their own first. Most get denied again. Here's what the difference looks like in practice.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl overflow-hidden border shadow-sm">
            <div className="grid grid-cols-3 bg-foreground text-background text-sm font-semibold">
              <div className="px-6 py-4 text-muted-foreground/60">What you need</div>
              <div className="px-6 py-4 border-l border-background/10 flex items-center gap-2">
                <X className="w-4 h-4 text-rose-400" /> On your own
              </div>
              <div className="px-6 py-4 border-l border-background/10 flex items-center gap-2 bg-accent/20">
                <Check className="w-4 h-4 text-emerald-400" /> With Choice Credit
              </div>
            </div>
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t text-sm ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                <div className="px-6 py-4 font-medium text-foreground">{row.label}</div>
                <div className="px-6 py-4 border-l text-muted-foreground">{row.alone}</div>
                <div className="px-6 py-4 border-l text-foreground font-medium bg-emerald-50/50">{row.us}</div>
              </div>
            ))}
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="font-semibold text-foreground text-sm mb-3">{row.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-rose-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <X className="w-3 h-3 text-rose-400" />
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">On your own</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{row.alone}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">With us</span>
                    </div>
                    <p className="text-xs text-foreground font-medium leading-relaxed">{row.us}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-10 bg-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-serif text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                Our fee pays for itself the first time you avoid a denial.
              </p>
              <p className="text-primary-foreground/70 text-sm">
                One failed application typically costs $50–$200 in fees alone — before counting lost time and deposit.
              </p>
            </div>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-12 px-8">
              <Link href="/book">Get Started for Free</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Soft Quiz CTA ────────────────────────────────────────────────────────────
function FindYourPath() {
  const paths = [
    {
      emoji: "🏠",
      label: "I need an apartment fast",
      desc: "Move-in ready within 2 weeks",
      href: "/book?challenge=urgent&service=instant-approval",
      color: "hover:border-violet-400 hover:bg-violet-50/50",
    },
    {
      emoji: "📈",
      label: "I want to rebuild my credit",
      desc: "Score improvement + approval plan",
      href: "/book?challenge=bad-credit&service=guided-approval",
      color: "hover:border-blue-400 hover:bg-blue-50/50",
    },
    {
      emoji: "📋",
      label: "I have an eviction on my record",
      desc: "Second-chance housing strategy",
      href: "/book?challenge=eviction&service=full-service-approval",
      color: "hover:border-amber-400 hover:bg-amber-50/50",
    },
    {
      emoji: "💼",
      label: "I'm self-employed or freelance",
      desc: "Income documentation that landlords accept",
      href: "/book?challenge=income-verification&service=guided-approval",
      color: "hover:border-emerald-400 hover:bg-emerald-50/50",
    },
    {
      emoji: "🤷",
      label: "I'm not sure what I need",
      desc: "Tell us your situation — we'll figure it out",
      href: "/book",
      color: "hover:border-primary/40 hover:bg-primary/5",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-block bg-accent/10 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Find Your Path
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Which one sounds like you?
            </h2>
            <p className="text-muted-foreground">
              Pick your situation and we'll pre-fill your consultation with the right context.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {paths.map((p, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <Link href={p.href}>
                <div className={`flex items-center gap-5 p-5 rounded-2xl border border-border cursor-pointer transition-all duration-200 ${p.color} group`}>
                  <span className="text-3xl shrink-0">{p.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.label}</p>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Free consultation · No commitment · We respond within 3 hours
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Why Choose Us ───────────────────────────────────────────────────────────
function WhyChooseUs() {
  const points = [
    { icon: <Shield className="w-6 h-6" />, title: "Confidential & Secure", desc: "Your personal and financial data is handled with bank-level encryption. We never share your information." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Data-Driven Strategies", desc: "No generic templates. Every strategy is built around current scoring models and your specific denial reasons." },
    { icon: <MapPin className="w-6 h-6" />, title: "Nationwide Coverage", desc: "We serve clients in all 50 states. Wherever you need to move, we have the experience to get you there." },
    { icon: <Users className="w-6 h-6" />, title: "Dedicated Advisor", desc: "You work directly with a real person — not a chatbot or support queue. Unlimited messaging on most packages." },
    { icon: <Lock className="w-6 h-6" />, title: "Legal & Fully Ethical", desc: "Every tactic we use is grounded in the Fair Credit Reporting Act. We don't cut corners — we know the rules cold." },
    { icon: <Award className="w-6 h-6" />, title: "98% Approval Track Record", desc: "Over 500 families housed. We don't count clients who give up — we count clients who move in." },
  ];

  return (
    <section className="py-24 bg-card border-y">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal direction="left">
            <div>
              <span className="inline-block bg-accent/10 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                Why Us
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Expertise you can trust with your housing future.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Property management companies use specialized algorithms and risk models to evaluate applicants. We know exactly what they look for — and how to present your profile so they say yes.
              </p>
              <Button asChild className="h-12 px-6">
                <Link href="/services">
                  See our services <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <ScrollReveal key={i} delay={i * 80} direction="right">
                <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/60 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">{p.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-16 relative rounded-2xl overflow-hidden shadow-2xl aspect-[21/6]">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600"
              alt="Professional consultation team"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/20 flex items-center px-10 md:px-16">
              <blockquote className="max-w-xl">
                <p className="font-serif text-xl md:text-2xl text-white italic leading-relaxed mb-4">
                  "We don't see denied applicants. We see people who deserve better — and we know exactly how to get them there."
                </p>
                <cite className="text-white/70 text-sm not-italic">— Choice Credit & Rental Solutions Advisory Team</cite>
              </blockquote>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-28 lg:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=1600')",
            opacity: 0.18,
            mixBlendMode: "overlay",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/40" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="flex gap-0.5">{"★★★★★"}</span>
            <span className="text-primary-foreground/80">Trusted by 500+ families nationwide</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground mb-6 leading-[1.05]">
            From Denied<br className="hidden sm:block" /> to Approved.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 mb-4 max-w-2xl mx-auto leading-relaxed">
            Evictions, bad credit, criminal history, or income gaps — none of these disqualify you. We specialize in getting people approved when every other door has closed.
          </p>
          <p className="text-base text-primary-foreground/55 mb-10 max-w-xl mx-auto">
            Professional credit and rental approval consulting, serving all 50 states.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base h-14 px-8 shadow-lg shadow-accent/20" asChild>
              <Link href="/book">Get Your Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 text-base h-14 px-8" asChild>
              <Link href="/services">View Our Packages</Link>
            </Button>
          </div>

          <ProofStrip />
        </div>
      </section>

      {/* Guarantee banner — immediately below hero */}
      <GuaranteeBanner />

      {/* Trust badge bar */}
      <TrustBadgeBar />

      {/* Animated stats */}
      <AnimatedStats />

      {/* How It Works — detailed day-by-day timeline */}
      <HowItWorks />

      {/* Renter Challenges */}
      <RenterChallenges />

      {/* Testimonials */}
      <Testimonials />

      {/* Before/After transformations */}
      <BeforeAfter />

      {/* Doing it alone vs. with us */}
      <VsAlone />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Find Your Path — soft quiz CTA */}
      <FindYourPath />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-24 bg-primary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
        <div className="container max-w-3xl relative z-10">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Stop letting a number define your living situation.
            </h2>
            <p className="text-xl text-primary-foreground/75 mb-10">
              Evictions, criminal history, low credit — we've seen it all and helped clients through it all. Your next chapter starts with one conversation.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg h-14 px-10 shadow-lg" asChild>
              <Link href="/book">Schedule Your Free Consultation</Link>
            </Button>
            <p className="text-primary-foreground/50 text-sm mt-4">No commitment. We'll respond within 24 hours.</p>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
