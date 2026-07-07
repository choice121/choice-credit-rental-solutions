import { createElement } from "react";
import type { AdminClient } from "@workspace/api-client-react";
import type { RentalHistoryEntry, AdvisorInfo, DocumentTypeId } from "../types";

// ── Re-exports ────────────────────────────────────────────────
export * from "./rental-package";
export * from "./explanation";
export * from "./credit";
export * from "./support";
// Re-export types + constants from types.ts so consumers can import from one place
export {
  DOCUMENT_TEMPLATES,
  CATEGORY_LABELS,
  DEFAULT_ADVISOR,
} from "../types";
export type { DocumentTypeId, DocumentTemplate, AdvisorInfo, RentalHistoryEntry } from "../types";

// ── Field schema ──────────────────────────────────────────────

export interface DocField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const DOC_FIELDS: Record<DocumentTypeId, DocField[]> = {
  rental_history_report: [
    { key: "advisorNotes", label: "Advisor Notes (optional)", type: "textarea", rows: 4, placeholder: "Additional context for the landlord..." },
  ],
  advisor_cover_letter: [
    { key: "landlordName", label: "Landlord / Manager Name", type: "text", placeholder: "e.g. Mr. James Wilson" },
    { key: "propertyAddress", label: "Property Address", type: "text", placeholder: "e.g. 123 Oak St, Atlanta GA" },
    { key: "clientBackground", label: "Client Background", type: "textarea", required: true, rows: 5, placeholder: "Brief description of the client's situation, progress, and character..." },
    { key: "endorsementStatement", label: "Custom Endorsement (leave blank for default)", type: "textarea", rows: 4 },
  ],
  client_personal_statement: [
    { key: "statement", label: "Client Statement", type: "textarea", required: true, rows: 8, placeholder: "In the client's own words: what happened, what they've done to fix it, and their commitment going forward..." },
    { key: "acknowledgement", label: "Acknowledgement Note (optional)", type: "textarea", rows: 3 },
  ],
  eviction_explanation: [
    { key: "landlordName", label: "Landlord / Manager Name", type: "text" },
    { key: "evictionDate", label: "Date of Eviction", type: "date" },
    { key: "evictionAddress", label: "Property Where Eviction Occurred", type: "text" },
    { key: "explanation", label: "Explanation", type: "textarea", required: true, rows: 6, placeholder: "Honest, clear explanation of the circumstances that led to the eviction..." },
    { key: "stepsToRectify", label: "Steps Taken to Rectify", type: "textarea", rows: 4, placeholder: "What has the client done since? (paid balance, took classes, obtained stable income...)" },
    { key: "currentStatus", label: "Current Status", type: "text", placeholder: "e.g. Balance paid in full, actively employed, enrolled in credit repair program" },
  ],
  income_verification: [
    { key: "landlordName", label: "Landlord / Manager Name", type: "text" },
    { key: "monthlyIncome", label: "Monthly Income ($)", type: "number", required: true, placeholder: "3500" },
    { key: "monthlyRent", label: "Monthly Rent Being Applied For ($)", type: "number", required: true, placeholder: "1200" },
    { key: "incomeSource", label: "Income Source", type: "text", placeholder: "e.g. Full-time employment, self-employment, benefits" },
    { key: "employerName", label: "Employer / Income Provider", type: "text" },
    { key: "employmentStatus", label: "Employment Status", type: "text", placeholder: "e.g. Full-time, Part-time, Self-employed" },
  ],
  credit_progress_report: [
    { key: "startDate", label: "Program Start Date", type: "date", required: true },
    { key: "startScore", label: "Starting Credit Score", type: "number", required: true, placeholder: "490" },
    { key: "currentScore", label: "Current Credit Score", type: "number", required: true, placeholder: "620" },
    { key: "targetScore", label: "Target Credit Score", type: "number", required: true, placeholder: "700" },
    { key: "resolvedCollections", label: "Collections Resolved", type: "number", placeholder: "3" },
    { key: "openCollections", label: "Collections Remaining", type: "number", placeholder: "1" },
    { key: "milestones", label: "Key Milestones (one per line)", type: "textarea", rows: 5, placeholder: "Paid off Capital One balance\nRemoved medical collection from 2021\nOn-time payments for 6 consecutive months" },
  ],
  character_reference_template: [
    { key: "refereeRelationship", label: "Referee Relationship to Client", type: "text", placeholder: "e.g. Employer, Pastor, Community Leader, Former Landlord" },
  ],
  rental_app_cover_letter: [
    { key: "propertyAddress", label: "Property Address", type: "text", required: true, placeholder: "e.g. 456 Maple Ave, Apt 2B, Atlanta GA" },
    { key: "landlordName", label: "Landlord / Manager Name", type: "text" },
    { key: "clientBackground", label: "About the Client", type: "textarea", required: true, rows: 5, placeholder: "Brief, positive overview of client's background, employment, and character..." },
    { key: "whyThisProperty", label: "Why This Property (optional)", type: "textarea", rows: 3, placeholder: "Why does the client want this specific property/community?" },
  ],
  criminal_history_letter: [
    { key: "landlordName", label: "Landlord / Manager Name", type: "text" },
    { key: "offenseDate", label: "Date of Offense", type: "date" },
    { key: "offenseType", label: "Nature of Offense", type: "text", placeholder: "e.g. Misdemeanor, Non-violent felony" },
    { key: "explanation", label: "Context & Explanation", type: "textarea", required: true, rows: 5, placeholder: "Honest explanation of the circumstances..." },
    { key: "rehabilitationSteps", label: "Rehabilitation & Growth", type: "textarea", rows: 4, placeholder: "Programs completed, community service, stable employment, positive changes..." },
    { key: "currentStatus", label: "Current Status", type: "text", placeholder: "e.g. Charges expunged, probation completed, steadily employed" },
  ],
  credit_dispute_letter: [
    { key: "clientFullAddress", label: "Client's Full Mailing Address", type: "text", required: true, placeholder: "123 Main St, Atlanta, GA 30301" },
    {
      key: "bureau", label: "Credit Bureau", type: "select", required: true,
      options: [
        { value: "Equifax", label: "Equifax" },
        { value: "Experian", label: "Experian" },
        { value: "TransUnion", label: "TransUnion" },
      ],
    },
    { key: "accountName", label: "Account / Creditor Name", type: "text", required: true, placeholder: "e.g. Capital One, LVNV Funding" },
    { key: "accountNumber", label: "Account Number (partial, optional)", type: "text", placeholder: "e.g. ****1234" },
    { key: "errorDescription", label: "Description of Error / Inaccuracy", type: "textarea", required: true, rows: 4, placeholder: "Describe exactly what is wrong with this item on your credit report..." },
    {
      key: "requestType", label: "What Are You Requesting?", type: "select", required: true,
      options: [
        { value: "removal", label: "Removal of inaccurate item" },
        { value: "correction", label: "Correction of incorrect information" },
        { value: "investigation", label: "Full investigation" },
      ],
    },
  ],
  debt_validation_letter: [
    { key: "clientAddress", label: "Client's Mailing Address", type: "text", required: true },
    { key: "collectorName", label: "Debt Collector Name", type: "text", required: true },
    { key: "collectorAddress", label: "Collector's Address", type: "textarea", rows: 3, required: true },
    { key: "originalCreditor", label: "Original Creditor (if known)", type: "text" },
    { key: "accountNumber", label: "Account Number (if known)", type: "text" },
    { key: "debtAmount", label: "Alleged Debt Amount ($)", type: "number" },
  ],
  goodwill_deletion_request: [
    { key: "clientAddress", label: "Client's Mailing Address", type: "text", required: true },
    { key: "creditorName", label: "Creditor Name", type: "text", required: true },
    { key: "creditorAddress", label: "Creditor Address", type: "textarea", rows: 3, required: true },
    { key: "accountNumber", label: "Account Number", type: "text" },
    { key: "negativeItemDate", label: "Date of Negative Item", type: "date" },
    { key: "paymentDate", label: "Date Paid in Full", type: "date" },
    { key: "requestReason", label: "Your Circumstances (why should they do this?)", type: "textarea", required: true, rows: 5, placeholder: "Explain what happened, why you fell behind, what has changed, and why removal would make a meaningful difference..." },
  ],
  housing_voucher_letter: [
    { key: "landlordName", label: "Landlord Name", type: "text" },
    { key: "propertyAddress", label: "Property Address", type: "text" },
    { key: "issuingAuthority", label: "Housing Authority Name", type: "text", placeholder: "e.g. Atlanta Housing Authority" },
    { key: "voucherNumber", label: "Voucher Number (optional)", type: "text" },
    { key: "voucherExpiry", label: "Voucher Expiry Date", type: "date" },
  ],
};

// ── Default form data pre-filler ──────────────────────────────

export function getDefaultFormData(
  type: DocumentTypeId,
  client: AdminClient,
  rentalHistory: RentalHistoryEntry[]
): Record<string, string> {
  const today = new Date().toISOString().split("T")[0];

  // Find most recent eviction for pre-fill
  const evictionEntry = rentalHistory.find((e) => e.had_eviction);

  switch (type) {
    case "income_verification":
      return { landlordName: "", monthlyIncome: "", monthlyRent: "", incomeSource: "", employerName: "", employmentStatus: "" };
    case "credit_progress_report":
      return { startDate: today, startScore: "", currentScore: "", targetScore: "700", resolvedCollections: "", openCollections: "", milestones: "" };
    case "eviction_explanation":
      return {
        landlordName: "",
        evictionDate: evictionEntry?.move_in_date ?? "",
        evictionAddress: evictionEntry ? `${evictionEntry.address}, ${evictionEntry.city}, ${evictionEntry.state}` : "",
        explanation: evictionEntry?.eviction_explanation ?? "",
        stepsToRectify: "",
        currentStatus: "",
      };
    case "credit_dispute_letter":
      return { clientAddress: "", bureau: "Equifax", accountName: "", accountNumber: "", errorDescription: "", requestType: "removal" };
    case "goodwill_deletion_request":
      return { clientAddress: "", creditorName: "", creditorAddress: "", accountNumber: "", paymentDate: "", negativeItemDate: "", requestReason: "" };
    default:
      return {};
  }
}

// ── PDF Document factory ──────────────────────────────────────
// Import all PDFs (lazy to avoid import overhead)
import {
  RentalHistoryReportPDF,
  AdvisorCoverLetterPDF,
  ClientPersonalStatementPDF,
} from "./rental-package";
import {
  EvictionExplanationPDF,
  IncomeVerificationPDF,
  CreditProgressReportPDF,
} from "./explanation";
import {
  CreditDisputeLetterPDF,
  DebtValidationLetterPDF,
  GoodwillDeletionRequestPDF,
} from "./credit";
import {
  CharacterReferenceTemplatePDF,
  RentalAppCoverLetterPDF,
  CriminalHistoryLetterPDF,
  HousingVoucherLetterPDF,
} from "./support";

export function getDocumentComponent(
  type: DocumentTypeId,
  client: AdminClient,
  rentalHistory: RentalHistoryEntry[],
  advisor: AdvisorInfo,
  form: Record<string, string>,
  date: string
): React.ReactElement {
  const cn = client.fullName;
  const ce = client.email;
  const cp = client.phone ?? undefined;

  switch (type) {
    case "rental_history_report":
      return createElement(RentalHistoryReportPDF, {
        clientName: cn, clientEmail: ce, clientPhone: cp,
        advisorInfo: advisor, rentalHistory, advisorNotes: form.advisorNotes, generationDate: date,
      });

    case "advisor_cover_letter":
      return createElement(AdvisorCoverLetterPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        landlordName: form.landlordName || undefined,
        propertyAddress: form.propertyAddress || undefined,
        clientBackground: form.clientBackground,
        endorsementStatement: form.endorsementStatement || undefined,
      });

    case "client_personal_statement":
      return createElement(ClientPersonalStatementPDF, {
        clientName: cn, statement: form.statement,
        acknowledgement: form.acknowledgement || undefined, generationDate: date,
      });

    case "eviction_explanation":
      return createElement(EvictionExplanationPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        landlordName: form.landlordName || undefined,
        evictionDate: form.evictionDate || undefined,
        evictionAddress: form.evictionAddress || undefined,
        explanation: form.explanation,
        stepsToRectify: form.stepsToRectify || undefined,
        currentStatus: form.currentStatus || undefined,
      });

    case "income_verification":
      return createElement(IncomeVerificationPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        landlordName: form.landlordName || undefined,
        employerName: form.employerName || undefined,
        employmentStatus: form.employmentStatus || undefined,
        monthlyIncome: parseFloat(form.monthlyIncome) || 0,
        monthlyRent: parseFloat(form.monthlyRent) || 0,
        incomeSource: form.incomeSource || undefined,
      });

    case "credit_progress_report": {
      const milestones = form.milestones
        ? form.milestones.split("\n").filter(Boolean)
        : undefined;
      return createElement(CreditProgressReportPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        startDate: form.startDate, currentDate: date,
        startScore: parseInt(form.startScore) || 0,
        currentScore: parseInt(form.currentScore) || 0,
        targetScore: parseInt(form.targetScore) || 700,
        openCollections: form.openCollections ? parseInt(form.openCollections) : undefined,
        resolvedCollections: form.resolvedCollections ? parseInt(form.resolvedCollections) : undefined,
        milestones,
      });
    }

    case "character_reference_template":
      return createElement(CharacterReferenceTemplatePDF, {
        clientName: cn, generationDate: date,
        refereeRelationship: form.refereeRelationship || undefined,
      });

    case "rental_app_cover_letter":
      return createElement(RentalAppCoverLetterPDF, {
        clientName: cn, clientEmail: ce, clientPhone: cp, advisorInfo: advisor, generationDate: date,
        propertyAddress: form.propertyAddress || "[Property Address]",
        landlordName: form.landlordName || undefined,
        clientBackground: form.clientBackground || "",
        whyThisProperty: form.whyThisProperty || undefined,
      });

    case "criminal_history_letter":
      return createElement(CriminalHistoryLetterPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        landlordName: form.landlordName || undefined,
        offenseDate: form.offenseDate || undefined,
        offenseType: form.offenseType || undefined,
        explanation: form.explanation || "",
        rehabilitationSteps: form.rehabilitationSteps || undefined,
        currentStatus: form.currentStatus || undefined,
      });

    case "credit_dispute_letter":
      return createElement(CreditDisputeLetterPDF, {
        clientName: cn, generationDate: date,
        clientFullAddress: form.clientFullAddress || form.clientAddress || "",
        bureau: (form.bureau as "Equifax" | "Experian" | "TransUnion") || "Equifax",
        accountName: form.accountName || "",
        accountNumber: form.accountNumber || undefined,
        errorDescription: form.errorDescription || "",
        requestType: (form.requestType as "removal" | "correction" | "investigation") || "removal",
      });

    case "debt_validation_letter":
      return createElement(DebtValidationLetterPDF, {
        clientName: cn, generationDate: date,
        clientAddress: form.clientAddress || "",
        collectorName: form.collectorName || "",
        collectorAddress: form.collectorAddress || "",
        debtAmount: form.debtAmount ? parseFloat(form.debtAmount) : undefined,
        originalCreditor: form.originalCreditor || undefined,
        accountNumber: form.accountNumber || undefined,
      });

    case "goodwill_deletion_request":
      return createElement(GoodwillDeletionRequestPDF, {
        clientName: cn, generationDate: date,
        clientAddress: form.clientAddress || "",
        creditorName: form.creditorName || "",
        creditorAddress: form.creditorAddress || "",
        accountNumber: form.accountNumber || undefined,
        paymentDate: form.paymentDate || undefined,
        negativeItemDate: form.negativeItemDate || undefined,
        requestReason: form.requestReason || "",
      });

    case "housing_voucher_letter":
      return createElement(HousingVoucherLetterPDF, {
        clientName: cn, advisorInfo: advisor, generationDate: date,
        landlordName: form.landlordName || undefined,
        propertyAddress: form.propertyAddress || undefined,
        issuingAuthority: form.issuingAuthority || undefined,
        voucherNumber: form.voucherNumber || undefined,
        voucherExpiry: form.voucherExpiry || undefined,
      });

    default:
      return createElement(RentalHistoryReportPDF, {
        clientName: cn, advisorInfo: advisor, rentalHistory, generationDate: date,
      });
  }
}

export function getDocumentFileName(type: DocumentTypeId, clientName: string): string {
  const slug = clientName.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().split("T")[0];
  const typeSlug = type.replace(/_/g, "-");
  return `${typeSlug}-${slug}-${date}.pdf`;
}
