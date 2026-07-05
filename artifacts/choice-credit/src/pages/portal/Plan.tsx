import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetMyPlan } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Plan() {
  const { data: plan, isLoading } = useGetMyPlan();

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Approval Plan</h1>
        <p className="text-muted-foreground mt-2">Your personalized roadmap to securing approval.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>{plan?.title || "Your Plan"}</CardTitle>
          <CardDescription>
            {plan ? `Created ${format(new Date(plan.createdAt), 'MMMM d, yyyy')}` : "Loading..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !plan || plan.steps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Your advisor is currently crafting your customized approval plan.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="relative p-6 lg:p-8">
              <div className="absolute top-8 bottom-8 left-[39px] lg:left-[47px] w-0.5 bg-border"></div>
              
              <div className="space-y-8 relative">
                {plan.steps.sort((a,b) => a.order - b.order).map((step, index) => {
                  const isCompleted = step.status === 'completed';
                  const isInProgress = step.status === 'in_progress';
                  const isPending = step.status === 'pending';

                  return (
                    <div key={step.id} className="flex gap-6 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                        isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                        isInProgress ? 'bg-background border-primary text-primary' :
                        'bg-background border-muted-foreground text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                         isInProgress ? <Clock className="w-4 h-4" /> : 
                         <span className="text-xs font-bold">{step.order}</span>}
                      </div>
                      
                      <div className="flex-1 pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className={`text-lg font-bold ${isCompleted ? 'text-foreground/80 line-through decoration-muted-foreground/30' : 'text-foreground'}`}>
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            {step.dueDate && (
                              <span className="text-xs text-muted-foreground font-medium">
                                Due: {format(new Date(step.dueDate), 'MMM d, yyyy')}
                              </span>
                            )}
                            <Badge variant={isCompleted ? 'secondary' : isInProgress ? 'default' : 'outline'}>
                              {step.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        {step.description && (
                          <p className={`text-sm ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
