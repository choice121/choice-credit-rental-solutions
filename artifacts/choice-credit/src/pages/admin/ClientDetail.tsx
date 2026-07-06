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
import { Label } from "@/components/ui/label";
import {
  useGetAdminClient,
  useUpdateAdminClient,
  useUpdateClientPlan,
  useReviewDocument,
  useSendAdminMessage,
  useUpdateInvoiceStatus,
  useCreateAdminCase,
  useCreateAdminInvoice,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle,
  Send, Plus, DollarSign, Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { CaseStatus, DocumentReviewStatus, PlanStepStatus, InvoiceStatusUpdateStatus } from "@workspace/api-client-react";

export default function ClientDetail() {
  const params = useParams();
  const clientId = params.id as string;
  const { data: client, isLoading, refetch } = useGetAdminClient(clientId, { query: { enabled: !!clientId } });

  const updateClient = useUpdateAdminClient();
  const updatePlan = useUpdateClientPlan();
  const reviewDoc = useReviewDocument();
  const sendMsg = useSendAdminMessage();
  const updateInvoiceStatus = useUpdateInvoiceStatus();
  const createCase = useCreateAdminCase();
  const createInvoice = useCreateAdminInvoice();
  const { toast } = useToast();

  const [messageContent, setMessageContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Plan edit state
  const [editingPlan, setEditingPlan] = useState(false);
  const [planSteps, setPlanSteps] = useState<{ id: string; order: number; title: string; description?: string | null; status: string; dueDate?: string | null }[]>([]);

  // Create Case state
  const [newCasePkg, setNewCasePkg] = useState("");
  const [newCaseAdvisor, setNewCaseAdvisor] = useState("");

  // Create Invoice state
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [newInvoicePkg, setNewInvoicePkg] = useState("");
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [client?.messages]);

  useEffect(() => {
    if (client?.plan?.steps && !editingPlan) {
      setPlanSteps(client.plan.steps.map((s) => ({ ...s })));
    } else if (!client?.plan && !editingPlan) {
      setPlanSteps([{ id: "new-1", order: 1, title: "", description: "", status: "pending", dueDate: null }]);
    }
  }, [client?.plan, editingPlan]);

  const handleStatusUpdate = (status: string) => {
    updateClient.mutate(
      { id: clientId, data: { caseStatus: status as CaseStatus } },
      {
        onSuccess: () => { toast({ title: "Status updated" }); refetch(); },
      }
    );
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    sendMsg.mutate(
      { data: { clientId, content: messageContent, caseId: client?.case?.id } },
      {
        onSuccess: () => { setMessageContent(""); refetch(); },
      }
    );
  };

  const handleDocumentReview = (docId: string, status: string, notes?: string) => {
    reviewDoc.mutate(
      { id: docId, data: { status: status as DocumentReviewStatus, advisorNotes: notes } },
      {
        onSuccess: () => { toast({ title: "Document reviewed" }); refetch(); },
      }
    );
  };

  const savePlan = () => {
    updatePlan.mutate(
      {
        id: clientId,
        data: {
          title: client?.plan?.title || "Approval Plan",
          steps: planSteps,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Plan updated" });
          setEditingPlan(false);
          refetch();
        },
      }
    );
  };

  const handleCreateCase = () => {
    if (!newCasePkg.trim()) {
      toast({ title: "Package name is required", variant: "destructive" });
      return;
    }
    createCase.mutate(
      { id: clientId, data: { packageName: newCasePkg.trim(), advisorName: newCaseAdvisor.trim() || null } },
      {
        onSuccess: () => {
          toast({ title: "Case created successfully" });
          setNewCasePkg("");
          setNewCaseAdvisor("");
          refetch();
        },
        onError: () => {
          toast({ title: "Failed to create case", variant: "destructive" });
        },
      }
    );
  };

  const handleCreateInvoice = () => {
    const amount = parseFloat(newInvoiceAmount);
    if (!newInvoicePkg.trim() || isNaN(amount) || amount <= 0) {
      toast({ title: "Valid package name and amount are required", variant: "destructive" });
      return;
    }
    createInvoice.mutate(
      {
        id: clientId,
        data: {
          packageName: newInvoicePkg.trim(),
          amount,
          caseId: client?.case?.id || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Invoice created" });
          setNewInvoicePkg("");
          setNewInvoiceAmount("");
          setShowInvoiceForm(false);
          refetch();
        },
        onError: () => {
          toast({ title: "Failed to create invoice", variant: "destructive" });
        },
      }
    );
  };

  const handleInvoiceStatusUpdate = (invoiceId: string, status: string) => {
    updateInvoiceStatus.mutate(
      { id: invoiceId, data: { status: status as InvoiceStatusUpdateStatus } },
      {
        onSuccess: () => { toast({ title: "Invoice status updated" }); refetch(); },
      }
    );
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
          <p className="text-muted-foreground text-sm">{client.email} · {client.phone || "No phone"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left column: Case Overview ── */}
        <Card className="lg:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Case Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {client.case ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Package</p>
                  <p className="font-medium">{client.case.packageName || "None assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Advisor</p>
                  <p className="font-medium">{client.case.advisorName || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Case Status</p>
                  <Select value={client.case.status || "intake"} onValueChange={handleStatusUpdate}>
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
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 bg-muted/40 rounded-lg">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  No case exists yet for this client.
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Package Name</Label>
                    <Input
                      value={newCasePkg}
                      onChange={(e) => setNewCasePkg(e.target.value)}
                      placeholder="e.g. Rental Readiness Report"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Advisor Name (optional)</Label>
                    <Input
                      value={newCaseAdvisor}
                      onChange={(e) => setNewCaseAdvisor(e.target.value)}
                      placeholder="e.g. Marcus Jones"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCreateCase}
                    disabled={createCase.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createCase.isPending ? "Creating..." : "Create Case"}
                  </Button>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Joined</p>
              <p className="font-medium">{format(new Date(client.createdAt), "MMM d, yyyy")}</p>
            </div>
          </CardContent>
        </Card>

        {/* ── Right column: Tabs ── */}
        <Card className="lg:col-span-2 shadow-sm">
          <Tabs defaultValue="plan" className="w-full">
            <CardHeader className="pb-0 pt-4 px-6 border-b">
              <TabsList className="bg-transparent h-12 w-full justify-start space-x-4 border-b-0 rounded-none p-0 overflow-x-auto">
                <TabsTrigger value="plan" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent shrink-0">Approval Plan</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent shrink-0">Documents</TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent shrink-0">Messages</TabsTrigger>
                <TabsTrigger value="invoices" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent shrink-0">
                  Invoices
                  {client.invoices && client.invoices.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 text-xs h-4">{client.invoices.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-6">

              {/* ── Plan tab ── */}
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
                          onChange={(e) => {
                            const next = [...planSteps];
                            next[idx].order = parseInt(e.target.value) || 1;
                            setPlanSteps(next);
                          }}
                          className="w-16 shrink-0"
                          min={1}
                        />
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Step Title"
                            value={step.title}
                            onChange={(e) => {
                              const next = [...planSteps];
                              next[idx].title = e.target.value;
                              setPlanSteps(next);
                            }}
                          />
                          <Textarea
                            placeholder="Step description (shown to client)"
                            value={step.description || ""}
                            onChange={(e) => {
                              const next = [...planSteps];
                              next[idx].description = e.target.value;
                              setPlanSteps(next);
                            }}
                            className="resize-none min-h-[60px] text-sm"
                          />
                          <div className="flex gap-2">
                            <Select
                              value={step.status}
                              onValueChange={(val: PlanStepStatus) => {
                                const next = [...planSteps];
                                next[idx].status = val;
                                setPlanSteps(next);
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="date"
                              value={step.dueDate?.slice(0, 10) || ""}
                              onChange={(e) => {
                                const next = [...planSteps];
                                next[idx].dueDate = e.target.value || null;
                                setPlanSteps(next);
                              }}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="shrink-0"
                          onClick={() => setPlanSteps(planSteps.filter((_, i) => i !== idx))}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setPlanSteps([
                          ...planSteps,
                          { id: `new-${Date.now()}`, order: planSteps.length + 1, title: "", description: "", status: "pending", dueDate: null },
                        ])
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Step
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {client.plan?.steps?.sort((a, b) => a.order - b.order).map((step) => (
                      <div key={step.id} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                          {step.order}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold">{step.title}</h4>
                            <Badge variant={step.status === "completed" ? "default" : step.status === "in_progress" ? "secondary" : "outline"}>
                              {step.status.replace("_", " ")}
                            </Badge>
                            {step.dueDate && (
                              <span className="text-xs text-muted-foreground">Due {format(new Date(step.dueDate), "MMM d")}</span>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No plan created yet.</p>}
                  </div>
                )}
              </TabsContent>

              {/* ── Documents tab ── */}
              <TabsContent value="documents" className="mt-0 space-y-4">
                {!client.documents || client.documents.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">No documents uploaded.</p>
                ) : (
                  client.documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-start gap-4">
                        <FileText className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium hover:underline text-primary"
                          >
                            {doc.name}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.status === "approved" ? "default" : doc.status === "rejected" ? "destructive" : "outline"}>
                          {doc.status}
                        </Badge>
                        <Select onValueChange={(val) => handleDocumentReview(doc.id, val)} value={doc.status}>
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
                  ))
                )}
              </TabsContent>

              {/* ── Messages tab ── */}
              <TabsContent value="messages" className="mt-0 flex flex-col h-[500px]">
                <div
                  className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg border mb-4"
                  ref={scrollRef}
                >
                  {client.messages?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                    const isAdminMsg = msg.senderRole === "admin";
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isAdminMsg ? "ml-auto flex-row-reverse" : ""}`}>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${isAdminMsg ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground border rounded-tl-sm"}`}>
                          {msg.content}
                          <div className={`text-[10px] mt-1 ${isAdminMsg ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {format(new Date(msg.createdAt), "h:mm a")}
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

              {/* ── Invoices tab ── */}
              <TabsContent value="invoices" className="mt-0 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-lg font-bold">Invoices</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowInvoiceForm((v) => !v)}
                    variant={showInvoiceForm ? "outline" : "default"}
                  >
                    {showInvoiceForm ? "Cancel" : (
                      <><Plus className="w-4 h-4 mr-1.5" /> New Invoice</>
                    )}
                  </Button>
                </div>

                {showInvoiceForm && (
                  <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                    <p className="text-sm font-medium">Create Invoice</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Package / Description</Label>
                        <Input
                          value={newInvoicePkg}
                          onChange={(e) => setNewInvoicePkg(e.target.value)}
                          placeholder="e.g. Rental Readiness Report"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Amount ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={newInvoiceAmount}
                            onChange={(e) => setNewInvoiceAmount(e.target.value)}
                            placeholder="0.00"
                            type="number"
                            min={0}
                            step={0.01}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateInvoice}
                      disabled={createInvoice.isPending}
                      className="w-full sm:w-auto"
                    >
                      {createInvoice.isPending ? "Creating..." : "Create Invoice"}
                    </Button>
                  </div>
                )}

                {!client.invoices || client.invoices.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">No invoices yet. Create one above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {client.invoices.map((inv) => (
                      <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div>
                          <p className="font-medium">{inv.packageName || "Invoice"}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {format(new Date(inv.createdAt), "MMM d, yyyy")}
                            {inv.paidAt && ` · Paid ${format(new Date(inv.paidAt), "MMM d, yyyy")}`}
                          </p>
                          {inv.paymentMethod && (
                            <p className="text-xs text-muted-foreground capitalize">
                              Method: {inv.paymentMethod}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-lg">${Number(inv.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                          <Badge
                            variant={inv.status === "paid" ? "default" : inv.status === "cancelled" ? "destructive" : "outline"}
                            className={inv.status === "paid" ? "bg-green-500" : ""}
                          >
                            {inv.status}
                          </Badge>
                          <Select value={inv.status} onValueChange={(val) => handleInvoiceStatusUpdate(inv.id, val)}>
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Mark Paid</SelectItem>
                              <SelectItem value="cancelled">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
}
