import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, AuthRequest } from "../lib/auth-middleware";
import { sendEmail, buildPaymentSelectedEmail } from "../lib/email";

const router = Router();

// GET /clients/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", req.userId!)
    .single();

  if (error || !data) {
    res.status(401).json({ error: "Profile not found" });
    return;
  }

  res.json({
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    role: data.role,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  });
});

// PUT /clients/me
router.put("/me", requireAuth, async (req: AuthRequest, res) => {
  const { fullName, phone } = req.body;

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null, updated_at: new Date().toISOString() })
    .eq("id", req.userId!)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    role: data.role,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
  });
});

// GET /clients/me/case
router.get("/me/case", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("client_id", req.userId!)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    res.status(404).json({ error: "No active case found" });
    return;
  }

  res.json({
    id: data.id,
    clientId: data.client_id,
    packageName: data.package_name,
    status: data.status,
    advisorName: data.advisor_name,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
});

// GET /clients/me/documents
router.get("/me/documents", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", req.userId!)
    .order("uploaded_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map((d: Record<string, unknown>) => ({
    id: d.id, clientId: d.client_id, caseId: d.case_id,
    name: d.name, fileUrl: d.file_url, fileType: d.file_type,
    status: d.status, advisorNotes: d.advisor_notes, uploadedAt: d.uploaded_at,
  })));
});

// POST /clients/me/documents
router.post("/me/documents", requireAuth, async (req: AuthRequest, res) => {
  const { name, fileUrl, fileType, caseId } = req.body;

  const { data, error } = await supabase
    .from("documents")
    .insert({ client_id: req.userId!, name, file_url: fileUrl, file_type: fileType, case_id: caseId || null })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await supabase.from("activity_log").insert({
    type: "document_uploaded",
    description: `Document "${name}" uploaded`,
    client_id: req.userId!,
  });

  res.status(201).json({
    id: data.id, clientId: data.client_id, caseId: data.case_id,
    name: data.name, fileUrl: data.file_url, fileType: data.file_type,
    status: data.status, advisorNotes: data.advisor_notes, uploadedAt: data.uploaded_at,
  });
});

// GET /clients/me/checklist
router.get("/me/checklist", requireAuth, async (req: AuthRequest, res) => {
  const { data: docs } = await supabase
    .from("documents")
    .select("name, status")
    .eq("client_id", req.userId!);

  const uploadedNames = (docs || []).map((d: Record<string, unknown>) => (d.name as string).toLowerCase());

  const requiredDocs = [
    { id: "1", label: "Government-issued photo ID", description: "Driver's license, passport, or state ID", required: true },
    { id: "2", label: "Recent pay stubs (last 2 months)", description: "From your current employer", required: true },
    { id: "3", label: "Bank statements (last 3 months)", description: "All accounts showing income deposits", required: true },
    { id: "4", label: "Credit report", description: "Full tri-merge credit report", required: true },
    { id: "5", label: "Rental history (last 2 years)", description: "Previous landlord contact info or references", required: true },
    { id: "6", label: "Employment verification letter", description: "Signed by HR or manager", required: false },
    { id: "7", label: "Explanation letter", description: "For any derogatory marks on credit", required: false },
  ];

  const items = requiredDocs.map((item) => {
    const matched = uploadedNames.some((name) => name.includes(item.label.toLowerCase().split(" ")[0]));
    const matchedDoc = (docs || []).find((d: Record<string, unknown>) =>
      (d.name as string).toLowerCase().includes(item.label.toLowerCase().split(" ")[0])
    ) as Record<string, unknown> | undefined;
    return {
      ...item,
      completed: matched,
      documentId: matchedDoc?.id || null,
    };
  });

  res.json({
    completedCount: items.filter((i) => i.completed).length,
    totalCount: items.length,
    items,
  });
});

// GET /clients/me/plan
router.get("/me/plan", requireAuth, async (req: AuthRequest, res) => {
  const { data: caseData } = await supabase
    .from("cases")
    .select("id")
    .eq("client_id", req.userId!)
    .limit(1)
    .single();

  if (!caseData) {
    res.status(404).json({ error: "No active case" });
    return;
  }

  const { data: plan, error } = await supabase
    .from("approval_plans")
    .select("*, plan_steps(*)")
    .eq("case_id", caseData.id)
    .single();

  if (error || !plan) {
    res.status(404).json({ error: "No plan found" });
    return;
  }

  res.json({
    id: plan.id,
    caseId: plan.case_id,
    title: plan.title,
    steps: (plan.plan_steps || []).sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.step_order as number) - (b.step_order as number)).map((s: Record<string, unknown>) => ({
      id: s.id, order: s.step_order, title: s.title,
      description: s.description, status: s.status, dueDate: s.due_date,
    })),
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  });
});

// GET /clients/me/messages
router.get("/me/messages", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("client_id", req.userId!)
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map((m: Record<string, unknown>) => ({
    id: m.id, caseId: m.case_id, clientId: m.client_id,
    senderId: m.sender_id, senderName: m.sender_name,
    senderRole: m.sender_role, content: m.content,
    createdAt: m.created_at, readAt: m.read_at,
  })));
});

// POST /clients/me/messages
router.post("/me/messages", requireAuth, async (req: AuthRequest, res) => {
  const { content, caseId } = req.body;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", req.userId!)
    .single();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      client_id: req.userId!,
      case_id: caseId || null,
      sender_id: req.userId!,
      sender_name: profile?.full_name || "Client",
      sender_role: "client",
      content,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({
    id: data.id, caseId: data.case_id, clientId: data.client_id,
    senderId: data.sender_id, senderName: data.sender_name,
    senderRole: data.sender_role, content: data.content,
    createdAt: data.created_at, readAt: data.read_at,
  });
});

// GET /clients/me/invoices
router.get("/me/invoices", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", req.userId!)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map((i: Record<string, unknown>) => ({
    id: i.id, clientId: i.client_id, caseId: i.case_id,
    packageName: i.package_name, amount: i.amount,
    status: i.status, paymentMethod: i.payment_method,
    createdAt: i.created_at, paidAt: i.paid_at,
  })));
});

// POST /clients/me/payment-selection
router.post("/me/payment-selection", requireAuth, async (req: AuthRequest, res) => {
  const { invoiceId, method } = req.body;

  const validMethods = ["cashapp", "paypal", "zelle", "applepay", "googlepay", "venmo"];
  if (!validMethods.includes(method)) {
    res.status(400).json({ error: "Invalid payment method" });
    return;
  }

  await supabase.from("payment_selections").insert({ invoice_id: invoiceId, method });

  await supabase.from("invoices")
    .update({ payment_method: method })
    .eq("id", invoiceId)
    .eq("client_id", req.userId!);

  const methodLabels: Record<string, string> = {
    cashapp: "Cash App", paypal: "PayPal", zelle: "Zelle",
    applepay: "Apple Pay", googlepay: "Google Pay", venmo: "Venmo",
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", req.userId!)
    .single();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("amount")
    .eq("id", invoiceId)
    .single();

  await Promise.all([
    supabase.from("activity_log").insert({
      type: "payment_selected",
      description: `Payment method selected: ${methodLabels[method]}`,
      client_id: req.userId!,
    }),
    sendEmail(buildPaymentSelectedEmail({
      clientName: profile?.full_name || "Client",
      clientEmail: profile?.email || "",
      method,
      invoiceId,
      amount: invoice?.amount,
    })),
  ]);

  res.status(201).json({
    invoiceId,
    method,
    message: `Your advisor will reach out with ${methodLabels[method]} payment details shortly.`,
  });
});

export default router;
