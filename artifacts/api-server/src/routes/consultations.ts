import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { sendEmail, buildLeadEmail } from "../lib/email";
import { strictLimiter } from "../lib/rate-limiter";

const router = Router();

const ConsultationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short").max(20),
  situation: z.string().min(10, "Please describe your situation (min 10 characters)").max(2000),
  preferredTime: z.string().max(200).optional().nullable(),
  packageId: z.string().uuid().optional().nullable(),
});

router.post("/", strictLimiter, async (req, res) => {
  try {
    const parsed = ConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { fullName, email, phone, situation, preferredTime, packageId } = parsed.data;

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        full_name: fullName,
        email,
        phone,
        situation,
        preferred_time: preferredTime ?? null,
        package_id: packageId ?? null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Consultation insert error:", error);
      res.status(500).json({ error: "Failed to submit consultation. Please try again." });
      return;
    }

    // Fire-and-forget side effects — don't let them block or crash the response
    Promise.all([
      supabase.from("activity_log").insert({
        type: "new_lead",
        description: `New consultation request from ${fullName}`,
      }),
      sendEmail(buildLeadEmail({ fullName, email, phone, situation, preferredTime, packageId })),
    ]).catch((err) => {
      console.error("Side-effect error after consultation insert:", err);
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
  } catch (err) {
    console.error("Consultation route error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

export default router;
