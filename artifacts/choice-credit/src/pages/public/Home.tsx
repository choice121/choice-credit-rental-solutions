import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Home as HomeIcon, Clock } from "lucide-react";
import RenterChallenges from "@/components/RenterChallenges";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground mb-6">
            From Denied to Approved.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-medium">
            Professional credit and rental approval consulting. We help you overcome credit issues, past rental history, and income verification challenges to secure the home you deserve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base h-14 px-8" asChild>
              <Link href="/book">Get Your Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base h-14 px-8" asChild>
              <Link href="/services">View Our Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b bg-card">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Approval Rate</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Clients Housed</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">48h</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avg. Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">30+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Years Combined Exp.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">How We Secure Your Approval</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A proven framework designed to address your specific barriers to renting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">1. Free Assessment</h3>
              <p className="text-muted-foreground text-center">We review your credit profile, rental history, and income situation to identify exactly why you were denied and what needs fixing.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">2. Strategic Plan</h3>
              <p className="text-muted-foreground text-center">We build a custom roadmap. This might include credit dispute letters, strategic tradelines, or specialized income documentation formatting.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <HomeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">3. Application Support</h3>
              <p className="text-muted-foreground text-center">When you're ready, we help package your application to present you as the ideal tenant, maximizing your chances of a "Yes."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Renter Challenges */}
      <RenterChallenges />

      {/* Why Choose Us */}
      <section className="py-24 bg-card border-y">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Expertise you can trust with your housing future.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Property management companies use specialized algorithms and risk assessment models to evaluate applicants. We know exactly what they look for and how to present your profile to meet their criteria.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-accent shrink-0" />
                  <div>
                    <strong className="block text-foreground">Confidential & Secure</strong>
                    <span className="text-muted-foreground">Your personal and financial data is handled with bank-level encryption.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent shrink-0" />
                  <div>
                    <strong className="block text-foreground">Data-Driven Strategies</strong>
                    <span className="text-muted-foreground">We don't use generic templates. Every strategy is based on current scoring models.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80" alt="Professional consultation" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-center">
        <div className="container max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Stop letting a number define your living situation.</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">Take the first step toward your new home today with a free, no-obligation consultation.</p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg h-14 px-10" asChild>
            <Link href="/book">Schedule Your Consultation</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
