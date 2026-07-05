import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { strictLimiter } from "../lib/rate-limiter";

const router = Router();

const ContactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

router.post("/", strictLimiter, async (req, res) => {
  try {
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { fullName, email, phone, message } = parsed.data;

    const { data, error } = await supabase
      .from("contacts")
      .insert({
        full_name: fullName,
        email,
        phone: phone ?? null,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error("Contact insert error:", error);
      res.status(500).json({ error: "Failed to send message. Please try again." });
      return;
    }

    // Side-effect: log activity
    supabase.from("activity_log").insert({
      type: "new_contact",
      description: `Contact form submission from ${fullName}`,
    }).catch((err) => {
      console.error("Activity log error:", err);
    });

    res.status(201).json({
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

export default router;
