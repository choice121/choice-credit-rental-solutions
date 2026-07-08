import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check, ClipboardList, TrendingUp, UserCheck, Zap, Home,
  ArrowRight, Star, AlertCircle, CheckCircle2, ShieldCheck
} from "lucide-react";
import { Link } from "wouter";
import Testimonials from "@/components/Testimonials";
import ScrollReveal from "@/components/ScrollReveal";

const ASSESSMENT = {
  slug: "assessment",
  name: "Approval Assessment",
  price: "$150",
  badge: "Start Here",
  description: "Find out exactly where you stand before you apply. A full tenant screening pull, credit profile review, and rental history check — delivered as a written report within 24 hours.",
  features: [
    "Full tenant screening pull (same report property managers use)",
    "Credit profile & tradeline analysis",
    "Rental history verification",
    "Written approval strategy report",
    "24-hour turnaround",
  ],
  cta: "Get My Assessment",
  href: "/book?service=assessment",
};

const PROFILE_PACKAGES = [
  {
    name: "Standard Housing Package",
    price: "$950",
    timeline: "30–45 days",
    badge: null,
    description: "A complete profile rebuild for standard apartment approvals.",
    features: [
      "Credit profile support & preparation",
      "650–680 credit score target",
      "1 authorized user tradeline (posts in 30 days)",
      "Positive rental history documentation",
      "Rental application assistance",
      "Nationwide service",
    ],
    cta: "Start Standard Package",
    href: "/book?service=standard-housing",
  },
  {
    name: "Expedited Housing Package",
    price: "$1,400",
    timeline: "7–14 days",
    badge: "Fast Track",
    description: "Urgent move-in ready — for luxury apartments, houses, and townhomes.",
    features: [
      "Credit profile generation & prep",
      "720–750 credit score range",
      "2 authorized user tradelines included",
      "Credit monitoring account management",
      "Positive rental history documentation",
      "Rental application assistance",
      "Nationwide service",
    ],
    cta: "Fast-Track My Approval",
    href: "/book?service=expedited-housing",
  },
];

const DONE_FOR_YOU = [
  {
    icon: <UserCheck className="w-8 h-8" />,
    name: "Co-Signer Program",
    price: "$800",
    priceSub: "one-time",
    badge: "High Approval Rate",
    iconBg: "bg-emerald-100 text-emerald-600",
    description:
      "We add a qualified co-signer to your rental application — 700+ credit score and $15k/month income. You get the approval, we handle the co-signer side entirely.",
    includes: [
      "IES-provided co-signer (700+ credit score)",
      "+$15k/month verifiable income added",
      "Covers up to 3 apartment applications",
      "48-hour processing",
      "Rep completes co-signer section on your behalf",
    ],
    note: "Apartments on RentCafe highly recommended for smooth processing.",
    href: "/book?service=co-signer",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    name: "Instant Approval Service",
    price: "$2,500–$2,800",
    priceSub: "apts from $2,500 · houses from $2,800",
    badge: "Skip the Screening",
    iconBg: "bg-violet-100 text-violet-600",
    description:
      "We get approved for the unit on your behalf using our own credit and income — then sublease it directly to you. You skip the entire tenant screening process.",
    includes: [
      "We lease the unit using our own qualified profile",
      "Corporate or personal lease structure",
      "No screening, credit check, or approval risk for you",
      "Key delivery after signing",
      "Nationwide service — all 50 states",
    ],
    note: "Fastest path to move-in with zero rejection risk.",
    href: "/book?service=instant-approval",
  },
];

// ── Guarantee Section ────────────────────────────────────────────────────────
function GuaranteeSection() {
  const points = [
    "We work with you beyond your package timeline — at no extra charge — if approval isn't achieved",
    "Every strategy we use is legal, ethical, and grounded in the Fair Credit Reporting Act",
    "You'll know exactly what we're doing and why at every step — no black boxes",
    "If we determine during the free consultation that we can't help you, we'll tell you honestly",
  ];

  return (
    <section id="guarantee" className="py-20 bg-emerald-600 text-white">
      <div className="container max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white/70">Our Promise</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                We don't stop until you're approved.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                If we don't produce measurable results within your package timeline, we keep working with you at no extra charge. No fine print. No runaround. No landlord can be legally guaranteed — but our commitment to your case absolutely can.
              </p>
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-white/90 h-12 px-8 font-semibold">
                <Link href="/book">Claim Your Free Consultation</Link>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-7 space-y-4">
              <p className="font-semibold text-white text-sm uppercase tracking-wider mb-5">What our guarantee means in practice:</p>
              {points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
              <div className="pt-4 border-t border-white/20 mt-4">
                <p className="text-white/60 text-xs italic">
                  Our 98% approval rate exists because we stay committed — not because we cherry-pick easy cases. We specialize in the hard ones.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Mini testimonial strip for social proof at the top of services
const MINI_TESTIMONIALS = [
  { initials: "MT", photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=80&h=80", bg: "bg-blue-600", quote: "Approved in 22 days — 524 score to Midtown 2BR", challenge: "Bad Credit" },
  { initials: "DR", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=80&h=80", bg: "bg-violet-600", quote: "Eviction on file. Still got approved in 17 days.", challenge: "Eviction" },
  { initials: "JK", photo: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&q=80&w=80&h=80", bg: "bg-emerald-600", quote: "Freelancers with no pay stubs — townhome approved!", challenge: "Income" },
];

// Who we work with section
function SeriousClientsOnly() {
  const weHelp = [
    "You have an eviction — recent or old",
    "You have bad credit or no credit history",
    "You have a criminal record",
    "You're self-employed or have non-traditional income",
    "You've been denied 2+ times already",
    "You have a broken lease or collections balance",
    "You're a first-time renter with no rental history",
  ];

  const notAFit = [
    "You want to wait and \"see what happens\"",
    "You're not ready to take action within the next 30 days",
    "You're looking for a free workaround with no investment",
  ];

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block bg-accent/20 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Who We Work With
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            We only work with clients who are ready to move forward.
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto">
            Past challenges do not disqualify you — lack of commitment does. If you're serious about getting housed, we're serious about getting you there.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* We help */}
          <div className="bg-background/5 border border-background/10 rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg text-background">We've helped clients with:</h3>
            </div>
            <ul className="space-y-3">
              {weHelp.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span className="text-background/80 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not a fit */}
          <div className="flex flex-col gap-6">
            <div className="bg-background/5 border border-background/10 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-bold text-lg text-background">Not the right fit if:</h3>
              </div>
              <ul className="space-y-3">
                {notAFit.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-rose-400 shrink-0 mt-0.5 font-bold text-sm">✕</span>
                    <span className="text-background/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
              <p className="font-serif text-xl font-bold text-background mb-2">
                Positive results — guaranteed focus.
              </p>
              <p className="text-background/65 text-sm mb-5">
                We stay focused on clients who want real results, not just reassurance. If that's you, let's get to work.
              </p>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-11">
                <Link href="/book">I'm Ready — Book Free Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero — dark navy, matching home energy */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=1600')",
            opacity: 0.12,
            mixBlendMode: "overlay",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/40" />
        <div className="container max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span>★★★★★</span>
            <span className="text-primary-foreground/80">500+ clients approved</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground leading-tight">
            Every Path to Approval,<br className="hidden sm:block" /> Covered.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto mb-4">
            Evictions, criminal records, bad credit, no credit, income gaps — past challenges don't disqualify you. We have a service for every situation.
          </p>
          <p className="text-primary-foreground/55 text-sm mb-8">Transparent pricing. Real results. All 50 states.</p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-13 px-8" asChild>
            <Link href="/book">Get a Free Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Mini testimonial strip */}
      <div className="bg-card border-b py-6">
        <div className="container max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {MINI_TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                <div className={`w-9 h-9 rounded-full ${t.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden`}>
                  {t.photo
                    ? <img src={t.photo} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                    : t.initials}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-accent text-accent" />)}
                  </div>
                  <p className="text-xs text-foreground/80 italic">"{t.quote}"</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{t.challenge} challenge</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Assessment — entry point */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <ClipboardList className="w-4 h-4" />
              Step One
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Not sure where you stand? Start with an assessment.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We recommend every client start here — it tells you exactly what you qualify for before you spend on anything else.
            </p>
          </div>

          <Card className="relative flex flex-col md:flex-row items-stretch overflow-hidden border-2 border-primary shadow-xl">
            <div className="absolute top-0 left-6 -translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase bg-accent text-accent-foreground">
              {ASSESSMENT.badge}
            </div>
            <div className="flex-1 p-8 pt-10">
              <CardTitle className="text-2xl font-serif mb-2">{ASSESSMENT.name}</CardTitle>
              <CardDescription className="text-base mb-6">{ASSESSMENT.description}</CardDescription>
              <ul className="space-y-3">
                {ASSESSMENT.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-0.5 text-accent" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-64 shrink-0 bg-muted/40 p-8 flex flex-col items-center justify-center text-center gap-4 border-t md:border-t-0 md:border-l">
              <div>
                <span className="text-4xl font-bold">{ASSESSMENT.price}</span>
                <p className="text-muted-foreground text-sm mt-1">one-time · 24-hour turnaround</p>
              </div>
              <Button asChild className="w-full">
                <Link href={ASSESSMENT.href}>{ASSESSMENT.cta}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Full Testimonials carousel after the assessment */}
      <Testimonials />

      {/* Profile Building Packages */}
      <section className="py-20 bg-muted/50 border-y">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              Profile Building Packages
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Rebuild your credit and rental profile
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Full profile rebuilds using tradelines, credit monitoring, and rental history documentation — with a defined timeline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PROFILE_PACKAGES.map((pkg) => (
              <Card key={pkg.name} className={`relative flex flex-col hover:shadow-lg transition-shadow ${pkg.badge === "Fast Track" ? "border-2 border-accent shadow-xl" : ""}`}>
                {pkg.badge && (
                  <div className={`absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pkg.badge === "Fast Track" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground border"}`}>
                    {pkg.badge}
                  </div>
                )}
                <CardHeader className="pt-8">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-xl font-serif">{pkg.name}</CardTitle>
                    {pkg.timeline && (
                      <Badge variant="secondary" className="text-xs font-semibold shrink-0">
                        ⏱ {pkg.timeline}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">one-time</span>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={pkg.badge === "Fast Track" ? "default" : "outline"}>
                    <Link href={pkg.href}>{pkg.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Done-For-You Services */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Home className="w-4 h-4" />
              Done-For-You Services
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              We do it. You get the keys.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              High-touch services where we handle the application process entirely — so your past record never becomes a barrier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {DONE_FOR_YOU.map((svc) => (
              <Card key={svc.name} className="flex flex-col border-2 border-border hover:border-primary/40 hover:shadow-xl transition-all shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${svc.iconBg}`}>
                      {svc.icon}
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 shrink-0 text-xs font-semibold">
                      {svc.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{svc.name}</CardTitle>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{svc.price}</span>
                    <span className="text-xs text-muted-foreground ml-2">{svc.priceSub}</span>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{svc.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5">
                    {svc.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {svc.note && (
                    <p className="mt-4 text-xs text-muted-foreground italic border-t pt-3">{svc.note}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={svc.href}>
                      Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee section */}
      <GuaranteeSection />

      {/* Serious Clients Only */}
      <SeriousClientsOnly />

      {/* CTA */}
      <section className="py-20 bg-primary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
        <div className="container max-w-3xl relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Not sure which service fits your situation?
          </h2>
          <p className="text-lg text-primary-foreground/75 mb-8">
            Book a free consultation. We'll review your situation and tell you exactly what you need — no upselling, no pressure.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 text-base shadow-lg" asChild>
            <Link href="/book">Book Free Consultation</Link>
          </Button>
          <p className="text-primary-foreground/50 text-sm mt-4">No pressure. No commitment required.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
