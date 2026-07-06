import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ScrollReveal from "@/components/ScrollReveal";

const TRANSFORMATIONS = [
  {
    name: "Marcus T.",
    location: "Atlanta, GA",
    challenge: "Bad Credit + Collections",
    before: 524,
    after: 714,
    days: 22,
    avatarBg: "bg-blue-600",
    initials: "MT",
  },
  {
    name: "Destiny R.",
    location: "Houston, TX",
    challenge: "Eviction Record",
    before: 561,
    after: 728,
    days: 17,
    avatarBg: "bg-violet-600",
    initials: "DR",
  },
  {
    name: "Darnell W.",
    location: "Dallas, TX",
    challenge: "Broken Lease + Debt",
    before: 498,
    after: 695,
    days: 25,
    avatarBg: "bg-indigo-600",
    initials: "DW",
  },
];

function ScoreBar({ score, max = 850, min = 300, color }: { score: number; max?: number; min?: number; color: string }) {
  const pct = ((score - min) / (max - min)) * 100;
  return (
    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getScoreLabel(score: number) {
  if (score < 580) return { label: "Poor", color: "text-rose-500" };
  if (score < 670) return { label: "Fair", color: "text-amber-500" };
  if (score < 740) return { label: "Good", color: "text-blue-500" };
  return { label: "Very Good", color: "text-emerald-500" };
}

export default function BeforeAfter() {
  return (
    <section className="py-24 bg-muted/40 border-y">
      <div className="container max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-700 font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Real Results
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              The numbers don't lie.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These are real credit transformations from real clients — not estimates, not projections. Actual score movements that led to signed leases.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TRANSFORMATIONS.map((t, i) => {
            const boost = t.after - t.before;
            const beforeLabel = getScoreLabel(t.before);
            const afterLabel = getScoreLabel(t.after);

            return (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="bg-card border rounded-2xl p-6 hover:shadow-xl transition-shadow h-full flex flex-col">
                  {/* Client */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                    <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                      {t.challenge}
                    </span>
                  </div>

                  {/* Before */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Before</span>
                      <span className={`text-sm font-bold ${beforeLabel.color}`}>
                        {t.before} — {beforeLabel.label}
                      </span>
                    </div>
                    <ScoreBar score={t.before} color="bg-rose-400" />
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center my-3">
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">+{boost} points in {t.days} days</span>
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">After</span>
                      <span className={`text-sm font-bold ${afterLabel.color}`}>
                        {t.after} — {afterLabel.label}
                      </span>
                    </div>
                    <ScoreBar score={t.after} color="bg-emerald-500" />
                  </div>

                  <div className="mt-auto pt-5 border-t mt-5">
                    <p className="text-xs text-muted-foreground text-center">
                      ✓ Approved for apartment within {t.days} days of starting
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Want to see what your profile could look like?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="h-12 px-8">
                <Link href="/book">Get My Free Assessment <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8">
                <Link href="/tradeline-calculator">Try the Calculator</Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
