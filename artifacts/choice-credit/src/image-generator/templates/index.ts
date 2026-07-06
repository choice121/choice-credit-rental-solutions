import type { ComponentType } from "react";

export interface TemplateProps {
  headline: string;
  subtext: string;
  bullets: string[];
  accentColor: string;
  badge?: string;
}

export interface TemplateFormat {
  id: "square" | "landscape";
  label: string;
  width: number;
  height: number;
  description: string;
}

export const FORMATS: TemplateFormat[] = [
  {
    id: "square",
    label: "Square",
    width: 1080,
    height: 1080,
    description: "1080×1080 — Instagram, Facebook",
  },
  {
    id: "landscape",
    label: "Landscape",
    width: 1200,
    height: 628,
    description: "1200×628 — LinkedIn, Facebook Link",
  },
];

export interface TemplateDefinition {
  id: string;
  label: string;
  description: string;
  /** Component receives TemplateProps + { width, height } */
  component: ComponentType<TemplateProps & { width: number; height: number }>;
  defaults: TemplateProps;
}

// Lazy-load to keep the bundle light
import CreditRepairTemplate from "./CreditRepairTemplate";
import RentalApprovalTemplate from "./RentalApprovalTemplate";
import EvictionRecoveryTemplate from "./EvictionRecoveryTemplate";
import ConsultationTemplate from "./ConsultationTemplate";

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "credit-repair",
    label: "Credit Repair",
    description: "Score dial graphic — ideal for credit repair service promotion",
    component: CreditRepairTemplate,
    defaults: {
      headline: "We Fix Credit.\nWe Change Lives.",
      subtext: "Professional credit repair consulting in all 50 states.",
      bullets: [
        "Remove negative items & collections",
        "Build credit score to 700+",
        "Personalized action plan",
      ],
      accentColor: "#F59E0B",
      badge: "Credit Repair",
    },
  },
  {
    id: "rental-approval",
    label: "Rental Approval",
    description: "Split-panel with APPROVED stamp — great for rental assistance",
    component: RentalApprovalTemplate,
    defaults: {
      headline: "Denied?\nWe Get You\nApproved.",
      subtext: "Rental approval assistance for all backgrounds.",
      bullets: [
        "Evictions, bad credit, income gaps",
        "Serving all 50 states",
        "Results in 30–90 days",
      ],
      accentColor: "#F59E0B",
      badge: "Rental Approval",
    },
  },
  {
    id: "eviction-recovery",
    label: "Eviction Recovery",
    description: "Bold statement layout — addresses eviction history head-on",
    component: EvictionRecoveryTemplate,
    defaults: {
      headline: "Past Eviction?\nFresh Start\nIs Possible.",
      subtext: "We specialize in helping renters with eviction records move forward.",
      bullets: [
        "Eviction history on record? We know how to address it",
        "Landlord dispute strategy & letter writing",
        "Re-establish rental history step by step",
      ],
      accentColor: "#F59E0B",
      badge: "Eviction Recovery",
    },
  },
  {
    id: "consultation-cta",
    label: "Free Consultation CTA",
    description: "Centered action layout — drives bookings and consultations",
    component: ConsultationTemplate,
    defaults: {
      headline: "Book Your Free Consultation Today",
      subtext: "Speak with a credit advisor — Mon–Sat, 9AM–7PM EST.",
      bullets: [
        "No obligation",
        "Personalized plan",
        "Same-day response",
      ],
      accentColor: "#F59E0B",
      badge: "FREE",
    },
  },
];
