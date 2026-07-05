import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAdmin, AuthRequest } from "../lib/auth-middleware";

const router = Router();

router.post("/", async (req, res) => {
  const { fullName, email, phone, situation, preferredTime, packageId } = req.body;

  if (!fullName || !email || !phone || !situation) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      full_name: fullName,
      email,
      phone,
      situation,
      preferred_time: preferredTime || null,
      package_id: packageId || null,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // Log activity
  await supabase.from("activity_log").insert({
    type: "new_lead",
    description: `New consultation request from ${fullName}`,
  });

  res.status(201).json({
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    situation: data.situation,
    preferredTime: data.preferred_time,
    packageId: data.package_id,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  });
});

export default router;
