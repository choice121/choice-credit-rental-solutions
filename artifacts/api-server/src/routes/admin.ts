import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAdmin, AuthRequest } from "../lib/auth-middleware";

const router = Router();

// GET /admin/dashboard
router.get("/dashboard", requireAdmin, async (req: AuthRequest, res) => {
  const [clients, activeCases, leads, pendingDocs, invoices, activity] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "client"),
    supabase.from("cases").select("id", { count: "exact" }).in("status", ["intake", "in_progress", "review"]),
    supabase.from("consultations").select("id", { count: "exact" }).eq("status", "new"),
    supabase.from("documents").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("invoices").select("amount, status"),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const allInvoices = invoices.data || [];
  const totalRevenue = allInvoices.reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.amount), 0);
  const paidRevenue = allInvoices
    .filter((i: Record<string, unknown>) => i.status === "paid")
    .reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.amount), 0);

  res.json({
    totalClients: clients.count || 0,
    activeClients: activeCases.count || 0,
    newLeads: leads.count || 0,
    pendingDocuments: pendingDocs.count || 0,
    totalRevenue,
    paidRevenue,
    recentActivity: (activity.data || []).map((a: Record<string, unknown>) => ({
      id: a.id, type: a.type, description: a.description, createdAt: a.created_at,
    })),
  });
});

// GET /admin/clients
router.get("/clients", requireAdmin, async (req: AuthRequest, res) => {
  const { status, search } = req.query;

  let query = supabase
    .from("profiles")
    .select(`*, cases(status, package_name)`)
    .eq("role", "client")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map((p: Record<string, unknown>) => {
    const cases = p.cases as Record<string, unknown>[];
    const latestCase = cases && cases.length > 0 ? cases[0] : null;
    return {
      id: p.id, email: p.email, fullName: p.full_name, phone: p.phone,
      role: p.role, createdAt: p.created_at,
      caseStatus: latestCase?.status || null,
      packageName: latestCase?.package_name || null,
    };
  }));
});

// GET /admin/clients/:id
router.get("/clients/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const [profileRes, casesRes, docsRes, messagesRes, invoicesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("cases").select("*, approval_plans(*, plan_steps(*))").eq("client_id", id).limit(1).single(),
    supabase.from("documents").select("*").eq("client_id", id),
    supabase.from("messages").select("*").eq("client_id", id).order("created_at", { ascending: true }),
    supabase.from("invoices").select("*").eq("client_id", id),
  ]);

  if (profileRes.error || !profileRes.data) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const p = profileRes.data;
  const c = casesRes.data;
  const plan = c?.approval_plans;

  res.json({
    id: p.id, email: p.email, fullName: p.full_name, phone: p.phone,
    role: p.role, createdAt: p.created_at,
    case: c ? {
      id: c.id, clientId: c.client_id, packageName: c.package_name,
      status: c.status, advisorName: c.advisor_name, notes: c.notes,
      createdAt: c.created_at, updatedAt: c.updated_at,
    } : null,
    plan: plan ? {
      id: plan.id, caseId: plan.case_id, title: plan.title,
      steps: (plan.plan_steps || []).sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.step_order as number) - (b.step_order as number)).map((s: Record<string, unknown>) => ({
        id: s.id, order: s.step_order, title: s.title,
        description: s.description, status: s.status, dueDate: s.due_date,
      })),
      createdAt: plan.created_at, updatedAt: plan.updated_at,
    } : null,
    documents: (docsRes.data || []).map((d: Record<string, unknown>) => ({
      id: d.id, clientId: d.client_id, caseId: d.case_id,
      name: d.name, fileUrl: d.file_url, fileType: d.file_type,
      status: d.status, advisorNotes: d.advisor_notes, uploadedAt: d.uploaded_at,
    })),
    messages: (messagesRes.data || []).map((m: Record<string, unknown>) => ({
      id: m.id, caseId: m.case_id, clientId: m.client_id,
      senderId: m.sender_id, senderName: m.sender_name,
      senderRole: m.sender_role, content: m.content,
      createdAt: m.created_at, readAt: m.read_at,
    })),
    invoices: (invoicesRes.data || []).map((i: Record<string, unknown>) => ({
      id: i.id, clientId: i.client_id, caseId: i.case_id,
      packageName: i.package_name, amount: i.amount,
      status: i.status, paymentMethod: i.payment_method,
      createdAt: i.created_at, paidAt: i.paid_at,
    })),
  });
});

// PUT /admin/clients/:id
router.put("/clients/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { fullName, phone, caseStatus, notes } = req.body;

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (caseStatus || notes) {
    await supabase.from("cases")
      .update({ status: caseStatus, notes, updated_at: new Date().toISOString() })
      .eq("client_id", id);
  }

  res.json({
    id: data.id, email: data.email, fullName: data.full_name,
    phone: data.phone, role: data.role, createdAt: data.created_at,
    caseStatus: caseStatus || null, packageName: null,
  });
});

// PUT /admin/clients/:id/plan
router.put("/clients/:id/plan", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, steps } = req.body;

  const { data: caseData } = await supabase
    .from("cases").select("id").eq("client_id", id).limit(1).single();

  if (!caseData) {
    res.status(404).json({ error: "No case found for client" });
    return;
  }

  let planId: string;
  const { data: existing } = await supabase
    .from("approval_plans").select("id").eq("case_id", caseData.id).single();

  if (existing) {
    planId = existing.id;
    await supabase.from("approval_plans")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", planId);
    await supabase.from("plan_steps").delete().eq("plan_id", planId);
  } else {
    const { data: newPlan } = await supabase
      .from("approval_plans").insert({ case_id: caseData.id, title }).select().single();
    planId = newPlan!.id;
  }

  if (steps && steps.length > 0) {
    await supabase.from("plan_steps").insert(
      steps.map((s: Record<string, unknown>, idx: number) => ({
        plan_id: planId, step_order: s.order || idx + 1,
        title: s.title, description: s.description || null,
        status: s.status || "pending", due_date: s.dueDate || null,
      }))
    );
  }

  res.json({ id: planId, caseId: caseData.id, title, steps: steps || [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
});

// GET /admin/leads
router.get("/leads", requireAdmin, async (req: AuthRequest, res) => {
  const { status } = req.query;
  let query = supabase.from("consultations").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json((data || []).map((c: Record<string, unknown>) => ({
    id: c.id, fullName: c.full_name, email: c.email, phone: c.phone,
    situation: c.situation, preferredTime: c.preferred_time,
    packageId: c.package_id, status: c.status, notes: c.notes, createdAt: c.created_at,
  })));
});

// PUT /admin/leads/:id
router.put("/leads/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const { data, error } = await supabase
    .from("consultations")
    .update({ status, notes })
    .eq("id", id)
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json({
    id: data.id, fullName: data.full_name, email: data.email, phone: data.phone,
    situation: data.situation, preferredTime: data.preferred_time,
    packageId: data.package_id, status: data.status, notes: data.notes, createdAt: data.created_at,
  });
});

// GET /admin/messages
router.get("/messages", requireAdmin, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from("messages").select("*").order("created_at", { ascending: false });

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json((data || []).map((m: Record<string, unknown>) => ({
    id: m.id, caseId: m.case_id, clientId: m.client_id,
    senderId: m.sender_id, senderName: m.sender_name,
    senderRole: m.sender_role, content: m.content,
    createdAt: m.created_at, readAt: m.read_at,
  })));
});

// POST /admin/messages
router.post("/messages", requireAdmin, async (req: AuthRequest, res) => {
  const { clientId, content, caseId } = req.body;

  const { data: adminProfile } = await supabase
    .from("profiles").select("full_name").eq("id", req.userId!).single();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      client_id: clientId, case_id: caseId || null,
      sender_id: req.userId!, sender_name: adminProfile?.full_name || "Advisor",
      sender_role: "admin", content,
    })
    .select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.status(201).json({
    id: data.id, caseId: data.case_id, clientId: data.client_id,
    senderId: data.sender_id, senderName: data.sender_name,
    senderRole: data.sender_role, content: data.content,
    createdAt: data.created_at, readAt: data.read_at,
  });
});

// PUT /admin/documents/:id
router.put("/documents/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, advisorNotes } = req.body;

  const { data, error } = await supabase
    .from("documents")
    .update({ status, advisor_notes: advisorNotes || null })
    .eq("id", id)
    .select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json({
    id: data.id, clientId: data.client_id, caseId: data.case_id,
    name: data.name, fileUrl: data.file_url, fileType: data.file_type,
    status: data.status, advisorNotes: data.advisor_notes, uploadedAt: data.uploaded_at,
  });
});

// PUT /admin/invoices/:id/status
router.put("/invoices/:id/status", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("invoices")
    .update({ status, paid_at: status === "paid" ? new Date().toISOString() : null })
    .eq("id", id)
    .select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json({
    id: data.id, clientId: data.client_id, caseId: data.case_id,
    packageName: data.package_name, amount: data.amount,
    status: data.status, paymentMethod: data.payment_method,
    createdAt: data.created_at, paidAt: data.paid_at,
  });
});

// GET /admin/revenue
router.get("/revenue", requireAdmin, async (req: AuthRequest, res) => {
  const { data: invoices } = await supabase.from("invoices").select("*");
  const all = invoices || [];

  const totalRevenue = all.reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.amount), 0);
  const paidRevenue = all.filter((i: Record<string, unknown>) => i.status === "paid").reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.amount), 0);
  const pendingRevenue = all.filter((i: Record<string, unknown>) => i.status === "pending").reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.amount), 0);

  const byPackageMap: Record<string, { total: number; count: number }> = {};
  all.forEach((i: Record<string, unknown>) => {
    const name = (i.package_name as string) || "Unknown";
    if (!byPackageMap[name]) byPackageMap[name] = { total: 0, count: 0 };
    byPackageMap[name].total += Number(i.amount);
    byPackageMap[name].count++;
  });

  res.json({
    totalRevenue, paidRevenue, pendingRevenue,
    invoiceCount: all.length,
    byPackage: Object.entries(byPackageMap).map(([packageName, v]) => ({ packageName, ...v })),
  });
});

export default router;
