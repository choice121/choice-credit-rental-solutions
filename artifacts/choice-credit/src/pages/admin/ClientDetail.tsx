import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAdminClient, useUpdateAdminClient, useUpdateClientPlan, useReviewDocument, useSendAdminMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle, Send, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { CaseStatus, DocumentReviewStatus, PlanStepStatus } from "@workspace/api-client-react";

export default function ClientDetail() {
  const params = useParams();
  const clientId = params.id as string;
  const { data: client, isLoading, refetch } = useGetAdminClient(clientId, { query: { enabled: !!clientId } });
  
  const updateClient = useUpdateAdminClient();
  const updatePlan = useUpdateClientPlan();
  const reviewDoc = useReviewDocument();
  const sendMsg = useSendAdminMessage();
  const { toast } = useToast();

  const [messageContent, setMessageContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [client?.messages]);

  const handleStatusUpdate = (status: string) => {
    updateClient.mutate({
      id: clientId,
      data: { caseStatus: status as CaseStatus }
    }, {
      onSuccess: () => {
        toast({ title: "Status updated successfully" });
        refetch();
      }
    });
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    sendMsg.mutate({
      data: { clientId, content: messageContent, caseId: client?.case?.id }
    }, {
      onSuccess: () => {
        setMessageContent("");
        refetch();
      }
    });
  };

  const handleDocumentReview = (docId: string, status: string, notes?: string) => {
    reviewDoc.mutate({
      id: docId,
      data: { status: status as DocumentReviewStatus, advisorNotes: notes }
    }, {
      onSuccess: () => {
        toast({ title: "Document reviewed" });
        refetch();
      }
    });
  };

  // Simple local state for plan editing
  const [editingPlan, setEditingPlan] = useState(false);
  const [planSteps, setPlanSteps] = useState<any[]>([]);

  useEffect(() => {
    if (client?.plan?.steps && !editingPlan) {
      setPlanSteps(client.plan.steps.map(s => ({ ...s })));
    } else if (!client?.plan && !editingPlan) {
      setPlanSteps([{ id: "new-1", order: 1, title: "", status: "pending" }]);
    }
  }, [client?.plan, editingPlan]);

  const savePlan = () => {
    updatePlan.mutate({
      id: clientId,
      data: { 
        title: client?.plan?.title || "Approval Plan",
        steps: planSteps 
      }
    }, {
      onSuccess: () => {
        toast({ title: "Plan updated successfully" });
        setEditingPlan(false);
        refetch();
      }
    });
  };

  if (isLoading) return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="lg:col-span-2 h-64 rounded-lg" />
        </div>
      </div>
    </AdminLayout>
  );
  if (!client) return (
    <AdminLayout>
      <div className="p-8 text-center">
        <p className="text-destructive font-medium">Client not found</p>
        <Link href="/admin/clients" className="text-sm text-muted-foreground hover:underline mt-2 inline-block">← Back to Clients</Link>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/clients"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{client.fullName}</h1>
          <p className="text-muted-foreground text-sm">{client.email} • {client.phone || "No phone"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Case Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Package</p>
              <p className="font-medium">{client.case?.packageName || "None assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Case Status</p>
              <Select 
                value={client.case?.status || "intake"} 
                onValueChange={handleStatusUpdate}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intake">Intake</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Joined</p>
              <p className="font-medium">{format(new Date(client.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <Tabs defaultValue="plan" className="w-full">
            <CardHeader className="pb-0 pt-4 px-6 border-b">
              <TabsList className="bg-transparent h-12 w-full justify-start space-x-6 border-b-0 rounded-none p-0">
                <TabsTrigger value="plan" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent">Approval Plan</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent">Documents</TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent">Messages</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="p-6">
              
              <TabsContent value="plan" className="mt-0 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-xl font-bold">Strategic Roadmap</h3>
                  {editingPlan ? (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => setEditingPlan(false)}>Cancel</Button>
                      <Button onClick={savePlan} disabled={updatePlan.isPending}>Save Plan</Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditingPlan(true)}>Edit Plan</Button>
                  )}
                </div>

                {editingPlan ? (
                  <div className="space-y-4">
                    {planSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/30">
                        <Input 
                          type="number" 
                          value={step.order} 
                          onChange={e => {
                            const newSteps = [...planSteps];
                            newSteps[idx].order = parseInt(e.target.value);
                            setPlanSteps(newSteps);
                          }}
                          className="w-20"
                        />
                        <div className="flex-1 space-y-2">
                          <Input 
                            placeholder="Step Title" 
                            value={step.title} 
                            onChange={e => {
                              const newSteps = [...planSteps];
                              newSteps[idx].title = e.target.value;
                              setPlanSteps(newSteps);
                            }}
                          />
                          <Select 
                            value={step.status} 
                            onValueChange={(val: PlanStepStatus) => {
                              const newSteps = [...planSteps];
                              newSteps[idx].status = val;
                              setPlanSteps(newSteps);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => {
                          setPlanSteps(planSteps.filter((_, i) => i !== idx));
                        }}>
                          X
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => {
                      setPlanSteps([...planSteps, { id: `new-${Date.now()}`, order: planSteps.length + 1, title: "", status: "pending" }]);
                    }}>
                      + Add Step
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {client.plan?.steps?.sort((a,b) => a.order - b.order).map((step) => (
                      <div key={step.id} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                          {step.order}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold">{step.title}</h4>
                            <Badge variant={step.status === 'completed' ? 'default' : step.status === 'in_progress' ? 'secondary' : 'outline'}>
                              {step.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground">No plan created yet.</p>}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-0 space-y-4">
                {client.documents?.map(doc => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-start gap-4">
                      <FileText className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline text-primary">
                          {doc.name}
                        </a>
                        <p className="text-xs text-muted-foreground">Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'outline'}>
                        {doc.status}
                      </Badge>
                      <Select 
                        onValueChange={(val) => handleDocumentReview(doc.id, val)}
                        value={doc.status}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No documents uploaded.</p>}
              </TabsContent>

              <TabsContent value="messages" className="mt-0 flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg border mb-4" ref={scrollRef}>
                  {client.messages?.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                    const isAdminMsg = msg.senderRole === 'admin';
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isAdminMsg ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          isAdminMsg 
                            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                            : 'bg-muted text-foreground border rounded-tl-sm'
                        }`}>
                          {msg.content}
                          <div className={`text-[10px] mt-1 ${isAdminMsg ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {format(new Date(msg.createdAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  }) || <p className="text-center text-muted-foreground pt-10">No messages.</p>}
                </div>
                <div className="flex gap-2">
                  <Textarea 
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message to the client..."
                    className="resize-none min-h-[60px]"
                  />
                  <Button 
                    className="shrink-0 h-auto" 
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() || sendMsg.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
}
