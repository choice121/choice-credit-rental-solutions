import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetMyCase, useGetMyChecklist, useGetMyPlan, useListMyMessages } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: activeCase, isLoading: caseLoading } = useGetMyCase();
  const { data: checklist, isLoading: checklistLoading } = useGetMyChecklist();
  const { data: plan, isLoading: planLoading } = useGetMyPlan();
  const { data: messages, isLoading: messagesLoading } = useListMyMessages();

  const unreadMessages = messages?.filter(m => !m.readAt && m.senderRole !== 'client').length || 0;
  
  const nextStep = plan?.steps.find(s => s.status !== 'completed');

  // Show onboarding card if no active case yet
  const showOnboarding = !caseLoading && !activeCase;

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Here's the status of your approval journey.</p>
      </div>

      {showOnboarding && (
        <Card className="mb-8 border-l-4 border-l-primary shadow-sm bg-primary/5">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">Get started with your approval journey</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is set up! Book a free consultation and an advisor will create your personalized plan.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/book">Book Your Free Consultation</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-l-4 border-l-primary shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Case Status</CardTitle>
            <CardDescription>Your current package: {activeCase?.packageName || "Loading..."}</CardDescription>
          </CardHeader>
          <CardContent>
            {caseLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold capitalize text-primary">
                    {activeCase?.status ? activeCase.status.replace('_', ' ') : "Not Started"}
                  </div>
                  {activeCase?.advisorName && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Advisor: <span className="font-medium text-foreground">{activeCase.advisorName}</span>
                    </div>
                  )}
                </div>
                <Badge variant={activeCase?.status === 'approved' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                  {activeCase?.status === 'approved' ? 'Success' : 'In Progress'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full gap-4">
            <div className="relative">
              <MessageSquare className="w-8 h-8 text-primary" />
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold text-lg">{unreadMessages} Unread Messages</div>
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/portal/messages">Open Inbox</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Document Checklist
              </CardTitle>
              <CardDescription>Required for your application</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/documents">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {checklistLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ) : checklist ? (
              <div className="space-y-6 pt-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Progress</span>
                    <span>{checklist.completedCount} of {checklist.totalCount} Documents</span>
                  </div>
                  <Progress value={(checklist.completedCount / checklist.totalCount) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {checklist.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {item.label}
                          {item.required && !item.completed && <span className="text-destructive ml-1">*</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {checklist.items.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center pt-2">
                      +{checklist.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-8 text-center">No checklist available yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Next Steps
              </CardTitle>
              <CardDescription>Your approval roadmap</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/plan">View Plan</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {planLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : nextStep ? (
              <div className="bg-muted/50 rounded-lg p-5 mt-4 border border-border">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Step {nextStep.order}
                </div>
                <h4 className="font-semibold text-lg mb-2">{nextStep.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {nextStep.description}
                </p>
                <Button className="w-full group" asChild>
                  <Link href="/portal/plan">
                    Continue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            ) : plan ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-semibold">All Steps Completed!</h4>
                <p className="text-sm text-muted-foreground">Your approval plan is fully executed.</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-8 text-center">No active plan. Your advisor will create one soon.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
