import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, FileWarning, Home, Briefcase } from "lucide-react";

export interface RenterChallenge {
  slug: string;
  icon: React.ReactNode;
  label: string;
  headline: string;
  stat: string;
  statLabel: string;
  description: string;
  what: string;
  situationPrefill: string;
  accentColor: string;
  iconBg: string;
}

export const RENTER_CHALLENGES: RenterChallenge[] = [
  {
    slug: "bad-credit",
    icon: <TrendingDown className="w-7 h-7" />,
    label: "Bad Credit",
    headline: "Score below 580?",
    stat: "650+",
    statLabel: "avg. score we help clients reach",
    description:
      "Low credit is the #1 reason rental applications get denied. We identify every negative item dragging your score down and execute a targeted dispute and tradeline strategy.",
    what: "Dispute letters · Strategic tradelines · Score roadmap",
    situationPrefill:
      "I was denied because of my credit score. My score is currently around [X] and I have [late payments / collections / other issues] on my report.",
    accentColor: "from-red-600 to-rose-500",
    iconBg: "bg-rose-100 text-rose-600",
  },
  {
    slug: "eviction",
    icon: <FileWarning className="w-7 h-7" />,
    label: "Eviction Record",
    headline: "Past eviction on file?",
    stat: "1 in 5",
    statLabel: "renters has an eviction — we fix it",
    description:
      "An eviction on your record is not a life sentence. We know exactly which landlords screen for eviction records, how to dispute wrongful filings, and how to build a compelling case for second-chance housing.",
    what: "Eviction dispute letters · Second-chance landlord list · Narrative letters",
    situationPrefill:
      "I have a past eviction on my record from [approximate year]. The circumstances were [brief explanation]. I've been denied by multiple landlords because of this.",
    accentColor: "from-orange-600 to-amber-500",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    slug: "first-time-renter",
    icon: <Home className="w-7 h-7" />,
    label: "First-Time Renter",
    headline: "No rental history?",
    stat: "30 days",
    statLabel: "avg. time to first approval",
    description:
      "No rental history makes landlords nervous. We build a rental readiness profile for you — including reference letters, co-signer guidance, and application formatting — that turns a blank slate into a strong application.",
    what: "Rental profile building · Reference letter templates · Co-signer strategy",
    situationPrefill:
      "I am a first-time renter with no prior rental history. I've been living with [family / in a dorm / other] and I'm ready to rent on my own but I keep getting passed over.",
    accentColor: "from-emerald-600 to-teal-500",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    slug: "income-verification",
    icon: <Briefcase className="w-7 h-7" />,
    label: "Income Issues",
    headline: "Self-employed or irregular income?",
    stat: "3x",
    statLabel: "income requirement we help you document",
    description:
      "Freelancers, gig workers, and business owners are routinely denied even when they earn more than enough. We know how to format self-employment income, bank statements, and tax records to satisfy landlord requirements.",
    what: "Income documentation · Bank statement formatting · Offer letter strategy",
    situationPrefill:
      "I am self-employed / a freelancer / gig worker and have been denied because I can't show traditional pay stubs. My monthly income is approximately $[X] but I struggle to verify it in the format landlords require.",
    accentColor: "from-blue-600 to-indigo-500",
    iconBg: "bg-blue-100 text-blue-600",
  },
];

export default function RenterChallenges() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/10 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Your Situation Matters
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Which challenge are you facing?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every denial has a specific cause. Tell us yours and we'll show you the exact path to your approval.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RENTER_CHALLENGES.map((challenge) => (
            <div
              key={challenge.slug}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${challenge.accentColor}`} />

              <div className="p-6 flex flex-col flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${challenge.iconBg}`}>
                  {challenge.icon}
                </div>

                <div className="mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {challenge.label}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight">
                  {challenge.headline}
                </h3>

                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-2xl font-bold text-primary">{challenge.stat}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{challenge.statLabel}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                  {challenge.description}
                </p>

                <div className="text-xs text-muted-foreground border-t border-border pt-3 mb-5 font-medium">
                  {challenge.what}
                </div>

                <Button
                  asChild
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  <Link href={`/book?challenge=${challenge.slug}`}>
                    Get My Plan
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Not sure which fits? <Link href="/book" className="text-primary font-medium hover:underline">Book a free consultation</Link> and we'll figure it out together.
        </p>
      </div>
    </section>
  );
}
