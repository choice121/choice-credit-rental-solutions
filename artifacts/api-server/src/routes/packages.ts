import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const packages = (data || []).map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    tier: p.tier,
    price: p.price,
    description: p.description,
    features: p.features,
    isActive: p.is_active,
    createdAt: p.created_at,
  }));

  res.json(packages);
});

export default router;
