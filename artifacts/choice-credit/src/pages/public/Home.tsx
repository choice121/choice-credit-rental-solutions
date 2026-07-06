import { useEffect, useRef, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Shield, TrendingUp, Home as HomeIcon,
  Clock, Users, Award, Lock, MapPin
} from "lucide-react";
import RenterChallenges from "@/components/RenterChallenges";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import BeforeAfter from "@/components/BeforeAfter";
import ScrollReveal from "@/components/ScrollReveal";

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
  const steps = [
    {
      number: "01",
      icon: <Clock className="w-7 h-7" />,
      title: "Free Assessment",
      description: "We review your credit profile, rental history, and income situation to identify exactly why you were denied and what needs to change.",
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      number: "02",
      icon: <CheckCircle2 className="w-7 h-7" />,
      title: "Strategic Plan",
      description: "We build a custom roadmap — credit dispute letters, strategic tradelines, or specialized income documentation, tailored to your exact situation.",
      accent: "text-accent",
      bg: "bg-accent/10",
    },
    {
      number: "03",
      icon: <HomeIcon className="w-7 h-7" />,
      title: "Application & Approval",
      description: "When ready, we package your application to present you as the ideal tenant — maximizing your chance of a 'Yes' from day one.",
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three steps from denied to approved
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven framework built for your specific barriers — not a generic credit repair template.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-blue-200 via-accent/40 to-emerald-200" />
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 140}>
                <div className="relative flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 ${step.bg} rounded-full flex items-center justify-center ${step.accent} shadow-sm group-hover:scale-105 transition-transform duration-300 z-10 relative`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-foreground rounded-full flex items-center justify-center z-20">
                      <span className="text-background text-[10px] font-black">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/book">
                Start with a free assessment <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
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

      {/* Trust badge bar — immediately below hero */}
      <TrustBadgeBar />

      {/* Animated stats */}
      <AnimatedStats />

      {/* How It Works */}
      <HowItWorks />

      {/* Renter Challenges */}
      <RenterChallenges />

      {/* Testimonials */}
      <Testimonials />

      {/* Before/After transformations */}
      <BeforeAfter />

      {/* Why Choose Us */}
      <WhyChooseUs />

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
