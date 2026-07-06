import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/auth-middleware";

const router = Router();

// GET /add-ons — list all add-on packages (public)
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .eq("category", "addon")
    .order("price", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      priceLabel: p.price_label,
      description: p.description,
      features: p.features,
    }))
  );
});

// GET /add-ons/me — list add-ons attached to the current client's active case
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const { data: caseData } = await supabase
    .from("cases")
    .select("id")
    .eq("client_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!caseData) {
    res.json([]);
    return;
  }

  const { data, error } = await supabase
    .from("add_ons")
    .select("*")
    .eq("case_id", caseData.id)
    .neq("status", "cancelled")
    .order("added_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data || []);
});

// POST /add-ons/me — attach an add-on to the current client's active case
router.post("/me", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { packageId, name, price, notes } = req.body as {
    packageId?: string;
    name: string;
    price?: number;
    notes?: string;
  };

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const { data: caseData } = await supabase
    .from("cases")
    .select("id")
    .eq("client_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!caseData) {
    res.status(404).json({ error: "No active case found" });
    return;
  }

  const { data, error } = await supabase
    .from("add_ons")
    .insert({
      case_id: caseData.id,
      package_id: packageId ?? null,
      name,
      price: price ?? null,
      notes: notes ?? null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

// GET /add-ons/admin/:caseId — list add-ons for a specific case (admin only)
router.get("/admin/:caseId", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { caseId } = req.params;

  const { data, error } = await supabase
    .from("add_ons")
    .select("*")
    .eq("case_id", caseId)
    .order("added_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data || []);
});

// POST /add-ons/admin/:caseId — add an add-on to any client's case (admin)
router.post("/admin/:caseId", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { caseId } = req.params;
  const { packageId, name, price, notes } = req.body as {
    packageId?: string;
    name: string;
    price?: number;
    notes?: string;
  };

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const { data, error } = await supabase
    .from("add_ons")
    .insert({
      case_id: caseId,
      package_id: packageId ?? null,
      name,
      price: price ?? null,
      notes: notes ?? null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

// PUT /add-ons/admin/item/:id — update an add-on's status or notes (admin)
router.put("/admin/item/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, notes } = req.body as { status?: string; notes?: string };

  const { data, error } = await supabase
    .from("add_ons")
    .update({ status, notes })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});

export default router;
