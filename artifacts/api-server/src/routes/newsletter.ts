import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { strictLimiter } from "../lib/rate-limiter";

const router = Router();

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// POST /newsletter
router.post("/", strictLimiter, async (req, res) => {
  try {
    const parsed = NewsletterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const { email } = parsed.data;

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, is_active: true }, { onConflict: "email" });

    if (error) {
      console.error("Newsletter insert error:", error);
      res.status(500).json({ error: "Failed to subscribe. Please try again." });
      return;
    }

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err: unknown) {
    console.error("Newsletter route error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

export default router;
