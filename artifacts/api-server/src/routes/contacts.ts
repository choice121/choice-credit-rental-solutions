import { Router } from "express";
import { supabase } from "../lib/supabase";
import { sendEmail, buildContactEmail } from "../lib/email";

const router = Router();

router.post("/", async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert({ full_name: fullName, email, phone: phone || null, message })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await sendEmail(buildContactEmail({ fullName, email, phone, message }));

  res.status(201).json({
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    createdAt: data.created_at,
  });
});

export default router;
