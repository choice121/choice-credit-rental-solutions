import { logger } from "./logger";

const GAS_URL = process.env.GAS_EMAIL_URL;

interface EmailPayload {
  type: "new_lead" | "new_contact" | "payment_selected" | "document_uploaded";
  to?: string;
  subject: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!GAS_URL) {
    logger.warn({ type: payload.type }, "GAS_EMAIL_URL not configured — skipping email notification");
    return;
  }

  try {
    const resp = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      logger.error({ status: resp.status, body: text }, "GAS email request failed");
    } else {
      logger.info({ type: payload.type }, "Email notification sent via GAS");
    }
  } catch (err) {
    logger.error({ err }, "Failed to reach GAS email endpoint");
  }
}

export function buildLeadEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  situation: string;
  preferredTime?: string;
  packageId?: string;
}): EmailPayload {
  return {
    type: "new_lead",
    subject: `🆕 New Consultation Request — ${data.fullName}`,
    body: [
      `A new consultation request was submitted on Choice Credit & Rental Solutions.`,
      ``,
      `Name:           ${data.fullName}`,
      `Email:          ${data.email}`,
      `Phone:          ${data.phone}`,
      `Situation:      ${data.situation}`,
      `Preferred Time: ${data.preferredTime || "Not specified"}`,
      `Package ID:     ${data.packageId || "None selected"}`,
      ``,
      `Log in to the admin dashboard to review and update this lead's status.`,
    ].join("\n"),
    data,
  };
}

export function buildContactEmail(data: {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}): EmailPayload {
  return {
    type: "new_contact",
    subject: `📬 New Contact Form Submission — ${data.fullName}`,
    body: [
      `A new contact form was submitted on Choice Credit & Rental Solutions.`,
      ``,
      `Name:    ${data.fullName}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone || "Not provided"}`,
      `Message: ${data.message}`,
      ``,
      `Reply directly to this email to respond, or log in to the admin dashboard.`,
    ].join("\n"),
    data,
  };
}

export function buildPaymentSelectedEmail(data: {
  clientName: string;
  clientEmail: string;
  method: string;
  invoiceId: string;
  amount?: number;
}): EmailPayload {
  const methodLabels: Record<string, string> = {
    cashapp: "Cash App",
    paypal: "PayPal",
    zelle: "Zelle",
    applepay: "Apple Pay",
    googlepay: "Google Pay",
    venmo: "Venmo",
  };
  const label = methodLabels[data.method] || data.method;

  return {
    type: "payment_selected",
    subject: `💳 Payment Method Selected — ${data.clientName}`,
    body: [
      `A client has selected their payment method.`,
      ``,
      `Client:         ${data.clientName}`,
      `Email:          ${data.clientEmail}`,
      `Payment Method: ${label}`,
      `Invoice ID:     ${data.invoiceId}`,
      `Amount:         ${data.amount ? `$${data.amount}` : "See invoice"}`,
      ``,
      `Action required: Send the client your ${label} payment details so they can complete their payment.`,
    ].join("\n"),
    data,
  };
}
