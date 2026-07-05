import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetTradelineEstimate } from "@workspace/api-client-react";

export default function Calculator() {
  const [score, setScore] = useState(580);
  const [utilization, setUtilization] = useState(80);
  const [age, setAge] = useState(2);
  const [debouncedParams, setDebouncedParams] = useState({ score, utilization, age });

  // Debounce the API call to avoid spamming while dragging
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

  return (
    <PublicLayout>
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Tradeline Estimator</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80">
            See how strategic tradelines could impact your credit profile and rental approval odds.
          </p>
        </div>
      </div>

      <div className="container py-16 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg border-t-4 border-t-accent">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Your Current Profile</CardTitle>
              <CardDescription>Adjust the sliders to match your situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-base font-semibold">Current Credit Score</Label>
                  <span className="font-mono text-primary font-bold">{score}</span>
                </div>
                <Slider 
                  value={[score]} 
                  onValueChange={(val) => setScore(val[0])} 
                  min={300} max={850} step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor (300)</span>
                  <span>Excellent (850)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-base font-semibold">Credit Utilization</Label>
                  <span className="font-mono text-primary font-bold">{utilization}%</span>
                </div>
                <Slider 
                  value={[utilization]} 
                  onValueChange={(val) => setUtilization(val[0])} 
                  min={0} max={100} step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-base font-semibold">Average Account Age (Years)</Label>
                  <span className="font-mono text-primary font-bold">{age}</span>
                </div>
                <Slider 
                  value={[age]} 
                  onValueChange={(val) => setAge(val[0])} 
                  min={0} max={20} step={0.5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>20+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-sidebar text-sidebar-foreground border-sidebar shadow-xl">
              <CardHeader>
                <CardTitle className="text-sidebar-primary font-serif">Estimated Impact</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-12 text-center animate-pulse">Calculating potential impact...</div>
                ) : estimate ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-sidebar-accent/50 rounded-lg p-4">
                        <div className="text-sm text-sidebar-foreground/70 uppercase tracking-wider font-semibold mb-1">Potential Boost</div>
                        <div className="text-3xl font-bold text-green-400">+{estimate.estimatedBoost}</div>
                      </div>
                      <div className="bg-sidebar-accent/50 rounded-lg p-4">
                        <div className="text-sm text-sidebar-foreground/70 uppercase tracking-wider font-semibold mb-1">Target Score</div>
                        <div className="text-3xl font-bold text-sidebar-primary">{estimate.estimatedNewScore}</div>
                      </div>
                    </div>

                    <div className="bg-sidebar-accent rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        Recommendation
                      </h4>
                      <p className="text-sm leading-relaxed text-sidebar-foreground/80">{estimate.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-sidebar-foreground/50">Unable to generate estimate.</div>
                )}
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-xl text-center">
              <h3 className="font-serif text-xl font-bold mb-2">Ready to take action?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This is an estimate. During a consultation, we perform a deep dive to give you exact numbers and a concrete plan.
              </p>
              <Button asChild className="w-full h-12 text-base">
                <Link href="/book">Book Your Free Analysis</Link>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              *Estimates are based on standard scoring models and are not a guarantee of specific results. Actual changes to credit score depend on individual credit profiles and reporting agencies.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
