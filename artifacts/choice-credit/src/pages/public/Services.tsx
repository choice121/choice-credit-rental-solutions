import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "wouter";
import { useListPackages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Services() {
  const { data: packages, isLoading } = useListPackages();

  const tierColors = {
    starter: "bg-secondary text-secondary-foreground border-secondary",
    standard: "bg-primary text-primary-foreground border-primary shadow-xl scale-105 z-10",
    premium: "bg-sidebar text-sidebar-foreground border-sidebar"
  };

  return (
    <PublicLayout>
      <div className="bg-muted py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Consulting Packages</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Clear, transparent pricing. Choose the level of support that fits your needs and timeline.
          </p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-[500px]">
                <CardHeader>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-1/3 mb-6" />
                  <div className="space-y-4">
                    {[1,2,3,4].map(j => <Skeleton key={j} className="h-4 w-full" />)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {packages?.map((pkg) => {
              const isStandard = pkg.tier === 'standard';
              const colorClass = tierColors[pkg.tier as keyof typeof tierColors] || tierColors.starter;
              
              return (
                <Card key={pkg.id} className={`relative flex flex-col ${isStandard ? 'border-2 border-primary shadow-xl md:scale-105 z-10' : ''}`}>
                  {isStandard && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={isStandard ? "bg-primary text-primary-foreground rounded-t-xl" : ""}>
                    <CardTitle className="text-2xl font-serif">{pkg.name}</CardTitle>
                    <CardDescription className={isStandard ? "text-primary-foreground/80" : ""}>
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-6">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground ml-2">one-time</span>
                    </div>
                    <ul className="space-y-4">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 shrink-0 ${isStandard ? "text-primary" : "text-accent"}`} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button asChild className="w-full" variant={isStandard ? "default" : "outline"}>
                      <Link href={`/book?package=${pkg.id}`}>Select {pkg.name}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">À la Carte Add-ons</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expedited Review</CardTitle>
                <CardDescription>24-hour turnaround on document review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$99</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Additional Tradeline</CardTitle>
                <CardDescription>Strategic placement to boost specific criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Varies</div>
                <div className="text-sm text-muted-foreground">Consultation required</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
