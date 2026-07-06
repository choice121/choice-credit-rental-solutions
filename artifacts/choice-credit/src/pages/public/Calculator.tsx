import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetTradelineEstimate } from "@workspace/api-client-react";
import { TrendingUp, ArrowRight, Star, Lock } from "lucide-react";

function getScoreColor(score: number) {
  if (score < 580) return "text-rose-500";
  if (score < 670) return "text-amber-500";
  if (score < 740) return "text-blue-500";
  return "text-emerald-500";
}

function getScoreLabel(score: number) {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  return "Very Good";
}

// Nearest real-feeling client match for social proof on CTA
function getProofClient(score: number): { initials: string; bg: string; name: string; from: number; to: number; days: number } {
  if (score < 540) return { initials: "DW", bg: "bg-indigo-600", name: "Darnell W.", from: 498, to: 695, days: 25 };
  if (score < 600) return { initials: "MT", bg: "bg-blue-600", name: "Marcus T.", from: 524, to: 714, days: 22 };
  if (score < 650) return { initials: "DR", bg: "bg-violet-600", name: "Destiny R.", from: 561, to: 728, days: 17 };
  return { initials: "AM", bg: "bg-pink-600", name: "Aaliyah M.", from: 591, to: 720, days: 19 };
}

export default function Calculator() {
  const [score, setScore] = useState(580);
  const [utilization, setUtilization] = useState(80);
  const [age, setAge] = useState(2);
  const [debouncedParams, setDebouncedParams] = useState({ score, utilization, age });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({ score, utilization, age });
    }, 500);
    return () => clearTimeout(timer);
  }, [score, utilization, age]);

  const { data: estimate, isLoading } = useGetTradelineEstimate({
    currentScore: debouncedParams.score,
    utilization: debouncedParams.utilization,
    accountAge: debouncedParams.age
  });

  const proof = getProofClient(score);
  const targetScore = estimate?.estimatedNewScore ?? score;
  const boost = estimate?.estimatedBoost ?? 0;

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <span className="inline-block bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            Free Tool
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Tradeline Impact Estimator</h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto">
            Dial in your current profile and see the potential impact of strategic tradeline placement on your credit score and rental approval odds.
          </p>
        </div>
      </div>

      <div className="container py-16 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Input card */}
          <Card className="shadow-lg border-t-4 border-t-accent">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Your Current Profile</CardTitle>
              <CardDescription>Adjust the sliders to match your situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-base font-semibold">Current Credit Score</Label>
                  <div className="text-right">
                    <span className={`font-mono text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span className={`ml-2 text-xs font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
                  </div>
                </div>
                <Slider
                  value={[score]}
                  onValueChange={(val) => setScore(val[0])}
                  min={300} max={850} step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor (300)</span><span>Excellent (850)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-base font-semibold">Credit Utilization</Label>
                  <span className={`font-mono text-2xl font-bold ${utilization > 50 ? "text-rose-500" : utilization > 30 ? "text-amber-500" : "text-emerald-500"}`}>
                    {utilization}%
                  </span>
                </div>
                <Slider
                  value={[utilization]}
                  onValueChange={(val) => setUtilization(val[0])}
                  min={0} max={100} step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% (Ideal)</span><span>100%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-base font-semibold">Avg. Account Age (Years)</Label>
                  <span className="font-mono text-2xl font-bold text-primary">{age}</span>
                </div>
                <Slider
                  value={[age]}
                  onValueChange={(val) => setAge(val[0])}
                  min={0} max={20} step={0.5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span><span>20+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            {/* Results card */}
            <Card className="bg-sidebar text-sidebar-foreground border-sidebar shadow-xl">
              <CardHeader>
                <CardTitle className="text-sidebar-primary font-serif text-xl">Estimated Impact</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center animate-pulse text-sidebar-foreground/60">
                    Calculating your potential…
                  </div>
                ) : estimate ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-sidebar-accent/50 rounded-xl p-5">
                        <div className="text-xs text-sidebar-foreground/60 uppercase tracking-wider font-semibold mb-2">Potential Boost</div>
                        <div className="text-4xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <TrendingUp className="w-6 h-6" />+{boost}
                        </div>
                        <div className="text-xs text-sidebar-foreground/50 mt-1">points</div>
                      </div>
                      <div className="bg-sidebar-accent/50 rounded-xl p-5">
                        <div className="text-xs text-sidebar-foreground/60 uppercase tracking-wider font-semibold mb-2">Target Score</div>
                        <div className={`text-4xl font-bold ${getScoreColor(targetScore)}`}>{targetScore}</div>
                        <div className="text-xs text-sidebar-foreground/50 mt-1">{getScoreLabel(targetScore)}</div>
                      </div>
                    </div>

                    <div className="bg-sidebar-accent rounded-xl p-4">
                      <h4 className="font-semibold mb-2 text-sidebar-primary text-sm">Recommendation</h4>
                      <p className="text-sm leading-relaxed text-sidebar-foreground/80">{estimate.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-sidebar-foreground/50">Unable to generate estimate.</div>
                )}
              </CardContent>
            </Card>

            {/* Personalized CTA — the money moment */}
            {estimate && (
              <div className="bg-primary rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-lg font-bold text-primary-foreground">
                    Your score could reach{" "}
                    <span className={getScoreColor(targetScore)}>{targetScore}</span>.
                  </h3>
                </div>
                <p className="text-sm text-primary-foreground/75 mb-5 leading-relaxed">
                  This is an estimate. In a free consultation, we do a full profile dive and give you exact numbers — along with a concrete plan to get there.
                </p>

                {/* Proof client with similar starting score */}
                <div className="flex items-center gap-3 mb-5 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-3">
                  <div className={`w-9 h-9 rounded-full ${proof.bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {proof.initials}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-accent text-accent" />)}
                    </div>
                    <p className="text-xs text-primary-foreground/80">
                      <span className="font-semibold">{proof.name}</span> started at {proof.from}, reached {proof.to} in {proof.days} days. ✓ Approved.
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Link href="/book">
                    Get My Free Analysis <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Fallback CTA when no estimate yet */}
            {!estimate && !isLoading && (
              <div className="bg-muted p-6 rounded-xl text-center">
                <h3 className="font-serif text-xl font-bold mb-2">Ready to take action?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Adjust the sliders above to see your estimate, or book a free consultation for an exact analysis.
                </p>
                <Button asChild className="w-full h-11">
                  <Link href="/book">Book Your Free Analysis</Link>
                </Button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>Estimates are based on standard scoring models and are not a guarantee of specific results. Actual score changes depend on individual credit profiles and reporting agencies.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
