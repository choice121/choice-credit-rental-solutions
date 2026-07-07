import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { requireAuth, AuthRequest } from "../lib/auth-middleware";
import { sendEmail, buildPaymentSelectedEmail } from "../lib/email";

const router = Router();

const INTERNAL_ERROR = "An internal error occurred. Please try again.";

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
  const UpdateSchema = z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional().nullable(),
  });
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const { fullName, phone } = parsed.data;

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone ?? null, updated_at: new Date().toISOString() })
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
  const DocSchema = z.object({
    name: z.string().min(1).max(255),
    fileUrl: z.string().url(),
    fileType: z.string().max(100),
    caseId: z.string().uuid().optional(),
  });
  const parsed = DocSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const { name, fileUrl, fileType, caseId } = parsed.data;

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
  const MsgSchema = z.object({
    content: z.string().min(1).max(5000),
  });
  const parsed = MsgSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const { content } = parsed.data;
  const { caseId } = req.body;

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

// GET /clients/me/rental-history
router.get("/me/rental-history", requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("rental_history")
    .select("*")
    .eq("client_id", req.userId!)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: INTERNAL_ERROR });
    return;
  }

  res.json((data || []).map((r: Record<string, unknown>) => ({
    id: r.id,
    clientId: r.client_id,
    address: r.address,
    city: r.city,
    state: r.state,
    zipCode: r.zip_code,
    moveInDate: r.move_in_date,
    moveOutDate: r.move_out_date,
    isCurrent: r.is_current,
    monthlyRent: r.monthly_rent,
    landlordName: r.landlord_name,
    landlordPhone: r.landlord_phone,
    landlordEmail: r.landlord_email,
    paymentHistory: r.payment_history,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })));
});

const RentalHistorySchema = z.object({
  address: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(50),
  zipCode: z.string().min(1).max(20),
  moveInDate: z.string(),
  moveOutDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  monthlyRent: z.number().optional().nullable(),
  landlordName: z.string().max(100).optional().nullable(),
  landlordPhone: z.string().max(30).optional().nullable(),
  landlordEmail: z.string().email().optional().nullable(),
  paymentHistory: z.string().max(50).optional().nullable(),
});

// POST /clients/me/rental-history
router.post("/me/rental-history", requireAuth, async (req: AuthRequest, res) => {
  const parsed = RentalHistorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const d = parsed.data;

  const { data, error } = await supabase
    .from("rental_history")
    .insert({
      client_id: req.userId!,
      address: d.address,
      city: d.city,
      state: d.state,
      zip_code: d.zipCode,
      move_in_date: d.moveInDate,
      move_out_date: d.moveOutDate ?? null,
      is_current: d.isCurrent,
      monthly_rent: d.monthlyRent ?? null,
      landlord_name: d.landlordName ?? null,
      landlord_phone: d.landlordPhone ?? null,
      landlord_email: d.landlordEmail ?? null,
      payment_history: d.paymentHistory ?? null,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: INTERNAL_ERROR });
    return;
  }

  const r = data as Record<string, unknown>;
  res.status(201).json({
    id: r.id,
    clientId: r.client_id,
    address: r.address,
    city: r.city,
    state: r.state,
    zipCode: r.zip_code,
    moveInDate: r.move_in_date,
    moveOutDate: r.move_out_date,
    isCurrent: r.is_current,
    monthlyRent: r.monthly_rent,
    landlordName: r.landlord_name,
    landlordPhone: r.landlord_phone,
    landlordEmail: r.landlord_email,
    paymentHistory: r.payment_history,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });
});

// PUT /clients/me/rental-history/:id
router.put("/me/rental-history/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const UpdateSchema = RentalHistorySchema.partial();
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const d = parsed.data;

  const updatePayload: Record<string, unknown> = {};
  if (d.address !== undefined) updatePayload.address = d.address;
  if (d.city !== undefined) updatePayload.city = d.city;
  if (d.state !== undefined) updatePayload.state = d.state;
  if (d.zipCode !== undefined) updatePayload.zip_code = d.zipCode;
  if (d.moveInDate !== undefined) updatePayload.move_in_date = d.moveInDate;
  if (d.moveOutDate !== undefined) updatePayload.move_out_date = d.moveOutDate ?? null;
  if (d.isCurrent !== undefined) updatePayload.is_current = d.isCurrent;
  if (d.monthlyRent !== undefined) updatePayload.monthly_rent = d.monthlyRent ?? null;
  if (d.landlordName !== undefined) updatePayload.landlord_name = d.landlordName ?? null;
  if (d.landlordPhone !== undefined) updatePayload.landlord_phone = d.landlordPhone ?? null;
  if (d.landlordEmail !== undefined) updatePayload.landlord_email = d.landlordEmail ?? null;
  if (d.paymentHistory !== undefined) updatePayload.payment_history = d.paymentHistory ?? null;
  updatePayload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("rental_history")
    .update(updatePayload)
    .eq("id", id)
    .eq("client_id", req.userId!)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: INTERNAL_ERROR });
    return;
  }

  const r = data as Record<string, unknown>;
  res.json({
    id: r.id,
    clientId: r.client_id,
    address: r.address,
    city: r.city,
    state: r.state,
    zipCode: r.zip_code,
    moveInDate: r.move_in_date,
    moveOutDate: r.move_out_date,
    isCurrent: r.is_current,
    monthlyRent: r.monthly_rent,
    landlordName: r.landlord_name,
    landlordPhone: r.landlord_phone,
    landlordEmail: r.landlord_email,
    paymentHistory: r.payment_history,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });
});

// DELETE /clients/me/rental-history/:id
router.delete("/me/rental-history/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("rental_history")
    .delete()
    .eq("id", id)
    .eq("client_id", req.userId!);

  if (error) {
    res.status(500).json({ error: INTERNAL_ERROR });
    return;
  }

  res.status(204).send();
});

export default router;
