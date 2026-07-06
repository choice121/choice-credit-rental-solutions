import { Link } from "wouter";
import { CheckCircle2, Clock, Mail, Phone, ArrowRight, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/PublicLayout";

const NEXT_STEPS = [
  {
    icon: <Mail className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
    title: "Check your inbox",
    desc: "A confirmation email is on its way. Check your spam folder if you don't see it within a few minutes.",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    color: "bg-emerald-100 text-emerald-600",
    title: "We'll call within 24 hours",
    desc: "An advisor will reach out at your preferred contact time to discuss your situation and next steps in detail.",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "bg-accent/20 text-accent-foreground",
    title: "Your personalized plan",
    desc: "We'll review your information before the call so we can hit the ground running with specific recommendations for your case.",
  },
  {
    icon: <Home className="h-5 w-5" />,
    color: "bg-violet-100 text-violet-600",
    title: "Move-in day",
    desc: "Our average client is in a signed lease within 22 days of starting. Your path forward starts today.",
  },
];

export default function BookConfirmation() {
  return (
    <PublicLayout>
      {/* Hero celebration area */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-8 left-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
        <div className="absolute bottom-8 right-12 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />

        <div className="container max-w-2xl text-center relative z-10">
          {/* Pulsing checkmark */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
          </div>

          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            You've taken the<br className="hidden sm:block" /> most important step.
          </h1>
          <p className="text-lg text-primary-foreground/75 mb-8 max-w-lg mx-auto leading-relaxed">
            Your consultation request is confirmed. Our team will review your information and reach out within{" "}
            <span className="text-accent font-bold">24 hours</span> — usually much sooner.
          </p>

          {/* Response time badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-5 py-2.5">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm text-primary-foreground font-medium">Average advisor response: under 3 hours</span>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 bg-background">
        <div className="container max-w-2xl">
          <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-10">
            What happens next
          </h2>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border hidden sm:block" />

            <div className="space-y-6">
              {NEXT_STEPS.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center shrink-0 relative z-10 ring-2 ring-background`}>
                    {step.icon}
                  </div>
                  <div className="bg-card border rounded-xl p-5 flex-1 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-foreground mb-1">{step.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-12 bg-muted/50 border-y">
        <div className="container max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            While you wait — hear what others say about their first call
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { initials: "MT", bg: "bg-blue-600", quote: '"My advisor knew my situation inside out before we even spoke."', name: "Marcus T." },
              { initials: "DR", bg: "bg-violet-600", quote: '"Most honest consultation I\'ve ever had. Zero pressure."', name: "Destiny R." },
              { initials: "AM", bg: "bg-pink-600", quote: '"I felt hopeful after that first call for the first time in months."', name: "Aaliyah M." },
            ].map((t, i) => (
              <div key={i} className="bg-card border rounded-xl p-4 text-left">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
                <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">{t.quote}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${t.bg} flex items-center justify-center text-white text-[10px] font-bold`}>{t.initials}</div>
                  <span className="text-xs font-semibold text-foreground">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA buttons */}
      <section className="py-14 bg-background text-center">
        <div className="container max-w-xl">
          <p className="text-muted-foreground mb-6 text-sm">
            Have questions before your call? We're available now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Button asChild>
              <Link href="/services">
                Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us Directly</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
          <a
            href="tel:18005550198"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" /> 1 (800) 555-0198 · Mon–Sat 9AM–7PM EST
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
