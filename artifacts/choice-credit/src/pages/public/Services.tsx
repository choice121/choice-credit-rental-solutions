import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ClipboardList, TrendingUp, UserCheck, Zap, Car, Home, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const STATIC_PACKAGES = [
  {
    slug: "readiness-report",
    name: "Readiness Report",
    price: "$149",
    timeline: null,
    badge: null,
    description: "A professional analysis of your credit and rental profile with a clear action plan.",
    features: [
      "Full credit profile review",
      "Rental history assessment",
      "Written action plan",
      "Score improvement roadmap",
      "One advisor check-in",
    ],
    cta: "Get My Report",
    href: "/book?service=readiness-report",
    highlight: false,
  },
  {
    slug: "guided-approval",
    name: "Guided Approval Package",
    price: "$349",
    timeline: null,
    badge: "Most Popular",
    description: "Hands-on consulting to guide you through the full approval process step by step.",
    features: [
      "Everything in Readiness Report",
      "Dispute letter drafting",
      "1 authorized tradeline placement",
      "Rental application review",
      "Unlimited advisor messaging",
      "Document checklist & tracking",
    ],
    cta: "Get Started",
    href: "/book?service=guided-approval",
    highlight: true,
  },
  {
    slug: "full-service-approval",
    name: "Full-Service Approval",
    price: "$649",
    timeline: null,
    badge: "Premium",
    description: "Complete done-with-you service — we manage your entire path from denied to approved.",
    features: [
      "Everything in Guided Approval",
      "2 authorized tradeline placements",
      "Priority advisor access",
      "Income documentation strategy",
      "Application submission support",
      "Lease review & guidance",
    ],
    cta: "Get Full Service",
    href: "/book?service=full-service-approval",
    highlight: false,
  },
];

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

const ADDONS = [
  {
    name: "Approval Assessment",
    price: "$150",
    description: "Full tenant screening pull — know exactly where you stand before applying. Delivered in 24 hours.",
    badge: "Start Here",
    href: "/book?service=assessment",
  },
  {
    name: "Car Approval Package",
    price: "$1,600",
    description: "Three seasoned tradelines designed to improve your financing readiness for vehicle purchases. Profile builds in 30 days.",
    badge: "Auto",
    href: "/book?service=car-approval",
  },
  {
    name: "Expedited Review",
    price: "$99",
    description: "24-hour turnaround on document review — for clients who need to move fast.",
    badge: "Add-on",
    href: "/book?service=expedited-review",
  },
  {
    name: "Additional Tradeline",
    price: "Varies",
    description: "Strategic tradeline placement to boost specific scoring criteria beyond your package.",
    badge: "Add-on",
    href: "/book?service=tradeline",
  },
];

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-muted py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Every Path to Approval, Covered.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From credit consulting to full done-for-you approvals — transparent pricing, real results.
          </p>
        </div>
      </div>

      {/* Consulting Packages */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <ClipboardList className="w-4 h-4" />
              Consulting Packages
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Guided by an advisor, every step of the way
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We work with you directly — reviewing your profile, building your strategy, and managing your path to approval.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {STATIC_PACKAGES.map((pkg) => (
              <Card
                key={pkg.slug}
                className={`relative flex flex-col ${pkg.highlight ? "border-2 border-primary shadow-2xl md:scale-105 z-10" : ""}`}
              >
                {pkg.badge && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase ${pkg.highlight ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                    {pkg.badge}
                  </div>
                )}
                <CardHeader className={pkg.highlight ? "bg-primary text-primary-foreground rounded-t-xl pt-8" : "pt-8"}>
                  <CardTitle className="text-2xl font-serif">{pkg.name}</CardTitle>
                  <CardDescription className={pkg.highlight ? "text-primary-foreground/80" : ""}>
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2">one-time</span>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.highlight ? "text-accent" : "text-accent"}`} />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button asChild className="w-full" variant={pkg.highlight ? "default" : "outline"}>
                    <Link href={pkg.href}>{pkg.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <Card key={pkg.name} className={`relative flex flex-col ${pkg.badge === "Fast Track" ? "border-2 border-accent shadow-xl" : ""}`}>
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
      <section className="py-20 bg-background">
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
              <Card key={svc.name} className="flex flex-col border-2 border-border hover:border-primary/40 transition-colors shadow-sm">
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

      {/* Additional Services & Add-ons */}
      <section className="py-20 bg-muted/50 border-t">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Car className="w-4 h-4" />
              Additional Services & Add-ons
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
              Standalone services & upgrades
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Entry-point diagnostics, auto financing prep, and add-ons to supercharge any package.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {ADDONS.map((addon) => (
              <Card key={addon.name} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg font-semibold">{addon.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{addon.badge}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{addon.price}</div>
                  <CardDescription className="text-sm leading-relaxed">{addon.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-0">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={addon.href}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="container max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Not sure which service fits your situation?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Book a free 15-minute consultation. We'll review your situation and tell you exactly what you need.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 text-base" asChild>
            <Link href="/book">Book Free Consultation</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
