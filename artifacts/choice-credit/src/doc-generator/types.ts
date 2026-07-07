export interface RentalHistoryEntry {
  id: string;
  client_id: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string | null;
  move_in_date: string;
  move_out_date?: string | null;
  is_current: boolean;
  monthly_rent?: number | null;
  landlord_name?: string | null;
  landlord_phone?: string | null;
  landlord_email?: string | null;
  reason_for_leaving?: string | null;
  payment_history: "excellent" | "good" | "fair" | "poor";
  had_eviction: boolean;
  eviction_explanation?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentalHistoryInsert {
  client_id: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  move_in_date: string;
  move_out_date?: string;
  is_current: boolean;
  monthly_rent?: number;
  landlord_name?: string;
  landlord_phone?: string;
  landlord_email?: string;
  reason_for_leaving?: string;
  payment_history: "excellent" | "good" | "fair" | "poor";
  had_eviction: boolean;
  eviction_explanation?: string;
  notes?: string;
}

export interface GeneratedDocument {
  id: string;
  client_id: string;
  document_type: string;
  document_name: string;
  data_snapshot?: Record<string, unknown>;
  file_url?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface AdvisorInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  company: string;
  address: string;
}

export const DEFAULT_ADVISOR: AdvisorInfo = {
  name: "Credit Advisor",
  title: "Senior Credit & Rental Advisor",
  phone: "(404) 555-0100",
  email: "info@choicecreditrental.com",
  company: "Choice Credit & Rental Solutions",
  address: "Atlanta, Georgia",
};

export type DocumentTypeId =
  | "rental_history_report"
  | "advisor_cover_letter"
  | "client_personal_statement"
  | "eviction_explanation"
  | "income_verification"
  | "credit_progress_report"
  | "character_reference_template"
  | "rental_app_cover_letter"
  | "criminal_history_letter"
  | "credit_dispute_letter"
  | "debt_validation_letter"
  | "goodwill_deletion_request"
  | "housing_voucher_letter";

export interface DocumentTemplate {
  id: DocumentTypeId;
  name: string;
  description: string;
  category: "rental_package" | "explanation" | "credit" | "support";
  emoji: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // Rental Package
  {
    id: "rental_history_report",
    name: "Rental History Report",
    description: "Complete timeline of all past rental addresses with landlord contacts",
    category: "rental_package",
    emoji: "🏠",
  },
  {
    id: "advisor_cover_letter",
    name: "Advisor Cover Letter",
    description: "Your personal letter vouching for the client to the landlord",
    category: "rental_package",
    emoji: "✉️",
  },
  {
    id: "client_personal_statement",
    name: "Client Personal Statement",
    description: "Client's own statement explaining their past and commitment",
    category: "rental_package",
    emoji: "📝",
  },
  // Explanation Letters
  {
    id: "eviction_explanation",
    name: "Eviction Explanation Letter",
    description: "Addresses eviction directly with context and accountability",
    category: "explanation",
    emoji: "⚖️",
  },
  {
    id: "income_verification",
    name: "Income Verification Letter",
    description: "Confirms client meets the 3× monthly rent income threshold",
    category: "explanation",
    emoji: "💰",
  },
  {
    id: "credit_progress_report",
    name: "Credit Progress Report",
    description: "Shows credit score trajectory and improvement milestones",
    category: "explanation",
    emoji: "📈",
  },
  // Support Letters
  {
    id: "character_reference_template",
    name: "Character Reference Template",
    description: "Template employers or community leaders fill out for the client",
    category: "support",
    emoji: "🤝",
  },
  {
    id: "rental_app_cover_letter",
    name: "Rental Application Cover Letter",
    description: "Professional intro letter submitted with every application",
    category: "support",
    emoji: "📋",
  },
  {
    id: "criminal_history_letter",
    name: "Criminal History Context Letter",
    description: "Explains criminal record with rehabilitation context",
    category: "support",
    emoji: "📖",
  },
  {
    id: "housing_voucher_letter",
    name: "Housing Voucher Accommodation Letter",
    description: "For Section 8 holders facing landlord refusal",
    category: "support",
    emoji: "🏡",
  },
  // Credit Letters
  {
    id: "credit_dispute_letter",
    name: "Credit Bureau Dispute Letter",
    description: "Formal dispute to Equifax, Experian, or TransUnion",
    category: "credit",
    emoji: "🏦",
  },
  {
    id: "debt_validation_letter",
    name: "Debt Validation Letter",
    description: "Sent to debt collectors to verify or challenge a debt",
    category: "credit",
    emoji: "🔍",
  },
  {
    id: "goodwill_deletion_request",
    name: "Goodwill Deletion Request",
    description: "Asks creditor to remove a paid negative item as a goodwill gesture",
    category: "credit",
    emoji: "🙏",
  },
];

export const CATEGORY_LABELS: Record<DocumentTemplate["category"], string> = {
  rental_package: "Rental Package",
  explanation: "Explanation Letters",
  credit: "Credit Letters",
  support: "Support Letters",
};
