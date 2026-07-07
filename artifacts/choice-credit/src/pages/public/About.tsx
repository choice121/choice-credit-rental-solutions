import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Heart, TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const TEAM = [
  {
    initials: "RW",
    photo: "https://images.pexels.com/photos/6150694/pexels-photo-6150694.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
    name: "Raymond Williams",
    title: "Founder & Lead Advisor",
    bg: "bg-primary",
    bio: "Raymond spent 12 years inside the property management industry before founding Choice Credit. He's seen firsthand how the screening system works — and how to work within it. He built this company after watching qualified renters get turned away over technicalities that could have been fixed.",
    credentials: ["Former Property Management Executive", "FCRA Certified", "15+ years in credit consulting"],
  },
  {
    initials: "MJ",
    photo: "https://images.pexels.com/photos/7145022/pexels-photo-7145022.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
    name: "Michelle Johnson",
    title: "Senior Credit Strategist",
    bg: "bg-violet-700",
    bio: "Michelle specializes in complex cases — evictions, bankruptcies, and broken leases. She's worked with over 200 clients in the past three years alone and holds a deep knowledge of how credit bureaus and screening services process dispute letters.",
    credentials: ["Credit Dispute Specialist", "200+ complex cases resolved", "Licensed in all 50 states"],
  },
  {
    initials: "DT",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=700",
    name: "David Torres",
    title: "Income Documentation Specialist",
    bg: "bg-emerald-700",
    bio: "David is the team's expert on income verification strategies for freelancers, entrepreneurs, and gig workers. He knows exactly how to present non-traditional income in a way that satisfies screening software and landlord requirements.",
    credentials: ["Self-Employment Income Expert", "Gig Economy Specialist", "CPA-certified income formatting"],
  },
];

const VALUES = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Radical Transparency",
    desc: "We tell you exactly what we can and can't do upfront. No inflated promises. No surprise fees. Our pricing is public on our services page.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Dignity First",
    desc: "Our clients have often been through difficult situations. We approach every conversation with care and respect — never judgment.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Results-Driven",
    desc: "We are measured by approvals, not activity. If you don't get housed, we haven't done our job. Every strategy is built toward a concrete outcome.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Legal, 100% Ethical",
    desc: "Every technique we use is grounded in the Fair Credit Reporting Act. We refuse to take shortcuts that could harm our clients.",
  },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600')",
            opacity: 0.12,
            mixBlendMode: "overlay",
          }}
        />
        <div className="container max-w-4xl text-center relative z-10">
          <span className="inline-block bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Built by people who've<br className="hidden sm:block" /> seen both sides.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto">
            Our founder spent over a decade inside the property management industry. He built this company because he saw the system up close — and knew it was beatable.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/6150694/pexels-photo-6150694.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Raymond Williams, Choice Credit founder"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-5 shadow-xl max-w-[200px]">
                  <p className="text-3xl font-bold font-serif">500+</p>
                  <p className="text-sm font-medium mt-1">Families housed since founding</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <span className="inline-block bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                  Why We Exist
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                  "I saw people get denied for problems that were completely fixable. Nobody was helping them."
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Raymond Williams spent 12 years as a property management executive, overseeing tenant screening for thousands of units. He watched the system reject qualified people every week — not because they were bad tenants, but because their paperwork didn't match what the screening algorithm expected.
                  </p>
                  <p>
                    An eviction from 5 years ago when someone lost their job. A credit score dragged down by a single medical collection. Income that was real but formatted in a way the software didn't recognize. These weren't disqualifying factors. They were solvable problems.
                  </p>
                  <p>
                    In 2019, he left property management and founded Choice Credit & Rental Solutions with one goal: give renters access to the same knowledge that landlords use to evaluate them. We know exactly what screening companies look for. We know how to help you present your best honest self.
                  </p>
                </div>
                <Button asChild className="mt-8 h-12 px-6">
                  <Link href="/book">
                    Work with our team <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card border-y">
        <div className="container max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block bg-accent/10 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                How We Operate
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our values aren't posted on a wall. They're in every call.
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex gap-4 p-6 bg-background rounded-2xl border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block bg-primary/10 text-primary font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                Meet the Team
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Real advisors. Real experience.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                When you work with Choice Credit, you work directly with one of these advisors — not a support queue or a bot.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-foreground">{member.name}</h3>
                    <p className="text-sm text-accent font-semibold mb-4">{member.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{member.bio}</p>
                    <div className="space-y-1.5 border-t pt-4">
                      {member.credentials.map((c, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Award className="w-3.5 h-3.5 text-accent shrink-0" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="py-20 bg-primary">
        <div className="container max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-3">By the numbers</h2>
              <p className="text-primary-foreground/70">Since our founding in 2019</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Clients Housed" },
              { value: "98%", label: "Approval Rate" },
              { value: "50", label: "States Served" },
              { value: "22", label: "Avg. Days to Approval" },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-primary-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container max-w-2xl">
          <ScrollReveal>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Ready to work with us?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Book a free, no-pressure consultation. We'll review your situation and tell you exactly what's possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/book">Book Free Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
