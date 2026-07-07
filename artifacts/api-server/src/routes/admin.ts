import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { requireAdmin, AuthRequest } from "../lib/auth-middleware";
import { sendEmail, buildDocumentReviewedEmail, buildInvoiceCreatedEmail } from "../lib/email";

const router = Router();

const INTERNAL_ERROR = "An internal error occurred. Please try again.";

// GET /admin/dashboard
router.get("/dashboard", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [clients, activeCases, leads, pendingDocs, activity] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "client"),
      supabase.from("cases").select("id", { count: "exact" }).in("status", ["intake", "in_progress", "review"]),
      supabase.from("consultations").select("id", { count: "exact" }).eq("status", "new"),
      supabase.from("documents").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("activity_log").select("id, type, description, created_at").order("created_at", { ascending: false }).limit(10),
    ]);

    // Use SQL SUM via Supabase RPC-style select for revenue aggregation
    const { data: revenueData } = await supabase
      .from("invoices")
      .select("amount, status");

    const allInvoices = revenueData || [];
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
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/clients
router.get("/clients", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { search } = req.query;
    const page = Math.max(0, Number(req.query.page) || 0);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

    let query = supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, created_at, cases(status, package_name)", { count: "exact" })
      .eq("role", "client")
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (search && typeof search === "string" && search.length <= 100) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("List clients error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    // Return array for backward-compatibility with existing API client hooks
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
  } catch (err) {
    console.error("List clients error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/clients/:id
router.get("/clients/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
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
  } catch (err) {
    console.error("Get client error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// PUT /admin/clients/:id
router.put("/clients/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const UpdateSchema = z.object({
      fullName: z.string().min(2).max(100).optional(),
      phone: z.string().max(20).optional().nullable(),
      caseStatus: z.string().max(50).optional(),
      notes: z.string().max(2000).optional(),
    });
    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { fullName, phone, caseStatus, notes } = parsed.data;

    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone: phone ?? null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update client error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
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
  } catch (err) {
    console.error("Update client error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// PUT /admin/clients/:id/plan
router.put("/clients/:id/plan", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, steps } = req.body;

    const { data: caseData } = await supabase
      .from("cases").select("id").eq("client_id", id).limit(1).single();

    if (!caseData) {
      res.status(404).json({ error: "No case found for this client" });
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
  } catch (err) {
    console.error("Update plan error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/leads
router.get("/leads", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;
    const page = Math.max(0, Number(req.query.page) || 0);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

    let query = supabase
      .from("consultations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (status && typeof status === "string") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("List leads error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    // Return array for backward-compatibility with existing API client hooks
    res.json((data || []).map((c: Record<string, unknown>) => ({
      id: c.id, fullName: c.full_name, email: c.email, phone: c.phone,
      situation: c.situation, preferredTime: c.preferred_time,
      packageId: c.package_id, status: c.status, notes: c.notes, createdAt: c.created_at,
    })));
  } catch (err) {
    console.error("List leads error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// PUT /admin/leads/:id
router.put("/leads/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const LeadSchema = z.object({
      status: z.string().max(50).optional(),
      notes: z.string().max(2000).optional(),
    });
    const parsed = LeadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const { data, error } = await supabase
      .from("consultations")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update lead error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    res.json({
      id: data.id, fullName: data.full_name, email: data.email, phone: data.phone,
      situation: data.situation, preferredTime: data.preferred_time,
      packageId: data.package_id, status: data.status, notes: data.notes, createdAt: data.created_at,
    });
  } catch (err) {
    console.error("Update lead error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/messages
router.get("/messages", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, case_id, client_id, sender_id, sender_name, sender_role, content, created_at, read_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("List messages error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    res.json((data || []).map((m: Record<string, unknown>) => ({
      id: m.id, caseId: m.case_id, clientId: m.client_id,
      senderId: m.sender_id, senderName: m.sender_name,
      senderRole: m.sender_role, content: m.content,
      createdAt: m.created_at, readAt: m.read_at,
    })));
  } catch (err) {
    console.error("List messages error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// POST /admin/messages
router.post("/messages", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const MsgSchema = z.object({
      clientId: z.string().uuid(),
      content: z.string().min(1).max(5000),
      caseId: z.string().uuid().optional().nullable(),
    });
    const parsed = MsgSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { clientId, content, caseId } = parsed.data;

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

    if (error) {
      console.error("Send admin message error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    res.status(201).json({
      id: data.id, caseId: data.case_id, clientId: data.client_id,
      senderId: data.sender_id, senderName: data.sender_name,
      senderRole: data.sender_role, content: data.content,
      createdAt: data.created_at, readAt: data.read_at,
    });
  } catch (err) {
    console.error("Send admin message error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// PUT /admin/documents/:id
router.put("/documents/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const DocSchema = z.object({
      status: z.string().max(50),
      advisorNotes: z.string().max(2000).optional().nullable(),
    });
    const parsed = DocSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .update({ status: parsed.data.status, advisor_notes: parsed.data.advisorNotes ?? null })
      .eq("id", id)
      .select().single();

    if (error) {
      console.error("Review document error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    // Fire-and-forget: notify client about document review
    supabase.from("profiles").select("full_name, email").eq("id", data.client_id).single().then(({ data: profile }) => {
      if (profile) {
        sendEmail(buildDocumentReviewedEmail({
          clientName: profile.full_name || "Client",
          clientEmail: profile.email || "",
          documentName: data.name,
          status: data.status,
          advisorNotes: data.advisor_notes,
        })).catch((err: unknown) => console.error("Email error after doc review:", err));
      }
    }).catch((err: unknown) => console.error("Profile fetch error after doc review:", err));

    res.json({
      id: data.id, clientId: data.client_id, caseId: data.case_id,
      name: data.name, fileUrl: data.file_url, fileType: data.file_type,
      status: data.status, advisorNotes: data.advisor_notes, uploadedAt: data.uploaded_at,
    });
  } catch (err) {
    console.error("Review document error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// PUT /admin/invoices/:id/status
router.put("/invoices/:id/status", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const InvoiceSchema = z.object({ status: z.enum(["pending", "paid", "overdue", "cancelled"]) });
    const parsed = InvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid invoice status" });
      return;
    }

    const { data, error } = await supabase
      .from("invoices")
      .update({ status: parsed.data.status, paid_at: parsed.data.status === "paid" ? new Date().toISOString() : null })
      .eq("id", id)
      .select().single();

    if (error) {
      console.error("Update invoice status error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    res.json({
      id: data.id, clientId: data.client_id, caseId: data.case_id,
      packageName: data.package_name, amount: data.amount,
      status: data.status, paymentMethod: data.payment_method,
      createdAt: data.created_at, paidAt: data.paid_at,
    });
  } catch (err) {
    console.error("Update invoice status error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// POST /admin/clients/:id/case — manually create a case for a client
router.post("/clients/:id/case", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const CaseSchema = z.object({
      packageName: z.string().min(1).max(200),
      advisorName: z.string().max(100).optional().nullable(),
    });
    const parsed = CaseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { packageName, advisorName } = parsed.data;

    const { data: profile } = await supabase.from("profiles").select("id").eq("id", id).single();
    if (!profile) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const { data, error } = await supabase.from("cases").insert({
      client_id: id,
      package_name: packageName,
      advisor_name: advisorName || null,
      status: "intake",
    }).select().single();

    if (error) {
      console.error("Create case error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    await supabase.from("activity_log").insert({
      type: "case_created",
      description: `Case created: ${packageName}`,
      client_id: id,
    });

    res.status(201).json({
      id: data.id, clientId: data.client_id, packageName: data.package_name,
      status: data.status, advisorName: data.advisor_name,
      notes: data.notes, createdAt: data.created_at, updatedAt: data.updated_at,
    });
  } catch (err) {
    console.error("Create case error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// POST /admin/clients/:id/invoices — create an invoice for a client
router.post("/clients/:id/invoices", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const InvoiceSchema = z.object({
      packageName: z.string().min(1).max(200),
      amount: z.number().positive().max(100000),
      caseId: z.string().uuid().optional().nullable(),
    });
    const parsed = InvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { packageName, amount, caseId } = parsed.data;

    const { data, error } = await supabase.from("invoices").insert({
      client_id: id,
      package_name: packageName,
      amount,
      case_id: caseId || null,
      status: "pending",
    }).select().single();

    if (error) {
      console.error("Create invoice error:", error);
      res.status(500).json({ error: INTERNAL_ERROR });
      return;
    }

    await supabase.from("activity_log").insert({
      type: "invoice_created",
      description: `Invoice created: ${packageName} — ${amount}`,
      client_id: id,
    });

    // Fire-and-forget: notify client about new invoice
    supabase.from("profiles").select("full_name, email").eq("id", id).single().then(({ data: profile }) => {
      if (profile) {
        sendEmail(buildInvoiceCreatedEmail({
          clientName: profile.full_name || "Client",
          clientEmail: profile.email || "",
          invoiceId: data.id,
          amount,
          packageName,
        })).catch((err: unknown) => console.error("Email error after invoice creation:", err));
      }
    }).catch((err: unknown) => console.error("Profile fetch error after invoice creation:", err));

    res.status(201).json({
      id: data.id, clientId: data.client_id, caseId: data.case_id,
      packageName: data.package_name, amount: data.amount,
      status: data.status, paymentMethod: data.payment_method,
      createdAt: data.created_at, paidAt: data.paid_at,
    });
  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/clients/:id/rental-history
router.get("/clients/:id/rental-history", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("rental_history")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get rental history error:", error);
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
  } catch (err) {
    console.error("Get rental history error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

// GET /admin/revenue
router.get("/revenue", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { data: invoices } = await supabase
      .from("invoices")
      .select("amount, status, package_name");
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
  } catch (err) {
    console.error("Revenue error:", err);
    res.status(500).json({ error: INTERNAL_ERROR });
  }
});

export default router;
