import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/auth-middleware";

const router = Router();

// Map a raw packages DB row to the Package API shape
function mapPackage(p: Record<string, unknown>) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tier: p.tier,
    category: p.category,
    price: p.price,
    priceLabel: p.price_label,
    description: p.description,
    features: p.features,
    isActive: p.is_active,
    createdAt: p.created_at,
  };
}

// Map a raw add_ons DB row to the AddOn API shape (snake_case → camelCase)
function mapAddOn(row: Record<string, unknown>) {
  return {
    id: row.id,
    caseId: row.case_id,
    packageId: row.package_id ?? null,
    name: row.name,
    price: row.price ?? null,
    status: row.status,
    notes: row.notes ?? null,
    addedAt: row.added_at,
    updatedAt: row.updated_at,
  };
}

// GET /add-ons — list all active add-on packages (public)
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .eq("category", "addon")
    .order("price", { ascending: true, nullsFirst: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map(mapPackage));
});

// GET /add-ons/me — list add-ons on the current client's active case
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
    .eq("case_id", (caseData as Record<string, unknown>).id)
    .neq("status", "cancelled")
    .order("added_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data || []).map(mapAddOn));
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
      case_id: (caseData as Record<string, unknown>).id,
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

  res.status(201).json(mapAddOn(data as Record<string, unknown>));
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

  res.json((data || []).map(mapAddOn));
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

  res.status(201).json(mapAddOn(data as Record<string, unknown>));
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

  res.json(mapAddOn(data as Record<string, unknown>));
});

export default router;
