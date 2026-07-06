import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/", async (req, res) => {
  let query = supabase
    .from("packages")
    .select("*")
    .eq("is_active", true);

  // Optional category filter (consulting | profile_building | done_for_you | addon)
  const { category } = req.query as { category?: string };
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("price", { ascending: true, nullsFirst: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const packages = (data || []).map((p: Record<string, unknown>) => ({
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
  }));

  res.json(packages);
});

export default router;
