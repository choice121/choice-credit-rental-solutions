import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles as s, COLORS, COMPANY } from "./styles";

function Letterhead({ title, date }: { title: string; date: string }) {
  return (
    <View>
      <View style={s.letterheadRow}>
        <View>
          <Text style={s.companyName}>{COMPANY.name}</Text>
          <Text style={s.tagline}>{COMPANY.tagline}</Text>
        </View>
        <View style={s.contactBlock}>
          <Text style={s.contactLine}>{COMPANY.address}</Text>
          <Text style={s.contactLine}>{COMPANY.phone}</Text>
          <Text style={s.contactLine}>{COMPANY.email}</Text>
        </View>
      </View>
      <View style={s.goldDivider} />
      <Text style={s.docTitle}>{title}</Text>
      <Text style={s.docDate}>Date: {date}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{COMPANY.name} · {COMPANY.website}</Text>
      <Text style={s.footerText}>Sent via Certified Mail — Return Receipt Requested</Text>
    </View>
  );
}

const BUREAU_ADDRESSES: Record<string, string> = {
  Equifax: "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374",
  Experian: "Experian\nP.O. Box 4500\nAllen, TX 75013",
  TransUnion: "TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016",
};

// ── 10. Credit Bureau Dispute Letter ─────────────────────────

export interface CreditDisputeLetterProps {
  clientName: string;
  /** Full mailing address — e.g. "123 Main St, Atlanta, GA 30301" */
  clientFullAddress: string;
  bureau: "Equifax" | "Experian" | "TransUnion";
  accountName: string;
  accountNumber?: string;
  errorDescription: string;
  requestType: "removal" | "correction" | "investigation";
  generationDate: string;
}

export function CreditDisputeLetterPDF({
  clientName,
  clientFullAddress,
  bureau,
  accountName,
  accountNumber,
  errorDescription,
  requestType,
  generationDate,
}: CreditDisputeLetterProps) {
  const bureauAddress = BUREAU_ADDRESSES[bureau] ?? `${bureau}\n[Bureau Address]`;
  const requestLabel = {
    removal: "immediate removal of the inaccurate item",
    correction: "correction of the inaccurate information",
    investigation: "a full investigation and resolution of the disputed item",
  }[requestType];

  return (
    <Document title={`Credit Dispute Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title={`Credit Bureau Dispute — ${bureau}`} date={generationDate} />

        {/* Sender */}
        <View style={s.section}>
          <Text style={s.bold}>{clientName}</Text>
          {clientFullAddress.split(",").map((line, i) => (
            <Text key={i} style={s.body}>{line.trim()}</Text>
          ))}
        </View>

        {/* Recipient */}
        <View style={s.section}>
          {bureauAddress.split("\n").map((line, i) => (
            <Text key={i} style={s.body}>{line}</Text>
          ))}
        </View>

        {/* Subject */}
        <View style={{ ...s.infoBox, marginBottom: 14 }}>
          <Text style={s.infoBoxLabel}>RE: Formal Dispute of Inaccurate Credit Information</Text>
          <Text style={s.body}>
            Account: {accountName}{accountNumber ? ` (Account #: ${accountNumber})` : ""}
          </Text>
        </View>

        {/* Body */}
        <View style={s.section}>
          <Text style={s.body}>To Whom It May Concern,</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am writing to formally dispute inaccurate information appearing on my credit report. Under
            the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., I have the right to dispute
            incomplete or inaccurate information, and you are required to investigate my dispute within
            30 days of receipt.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Disputed Item</Text>
          <View style={s.infoBox}>
            <Text style={s.infoBoxLabel}>Account / Creditor</Text>
            <Text style={s.body}>{accountName}{accountNumber ? ` — Account #${accountNumber}` : ""}</Text>
            <Text style={{ ...s.infoBoxLabel, marginTop: 8 }}>Nature of Error</Text>
            <Text style={s.body}>{errorDescription}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am requesting {requestLabel} from my credit report. I request that you investigate
            this item, verify its accuracy with the original creditor, and provide me with written
            results of your investigation within the statutory 30-day period.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            Please send all communications regarding this dispute to the address listed above.
            I am happy to provide any supporting documentation upon request.
          </Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={s.body}>Sincerely,</Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.signatureName}>{clientName}</Text>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 48 }}>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 160, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Signature</Text>
            </View>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 100, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Date</Text>
            </View>
          </View>
          <Text style={{ ...s.bodySmall, marginTop: 12 }}>Prepared with assistance from {COMPANY.name}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 11. Debt Validation Letter ────────────────────────────────

export interface DebtValidationLetterProps {
  clientName: string;
  clientAddress: string;
  collectorName: string;
  collectorAddress: string;
  debtAmount?: number;
  originalCreditor?: string;
  accountNumber?: string;
  generationDate: string;
}

export function DebtValidationLetterPDF({
  clientName,
  clientAddress,
  collectorName,
  collectorAddress,
  debtAmount,
  originalCreditor,
  accountNumber,
  generationDate,
}: DebtValidationLetterProps) {
  return (
    <Document title={`Debt Validation Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Debt Validation Request" date={generationDate} />

        <View style={s.section}>
          <Text style={s.bold}>{clientName}</Text>
          <Text style={s.body}>{clientAddress}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.bold}>{collectorName}</Text>
          {collectorAddress.split("\n").map((line, i) => (
            <Text key={i} style={s.body}>{line}</Text>
          ))}
        </View>

        {(debtAmount || originalCreditor || accountNumber) && (
          <View style={{ ...s.infoBox, marginBottom: 14 }}>
            <Text style={s.infoBoxLabel}>RE: Debt Validation Request</Text>
            {originalCreditor && <Text style={s.body}>Original Creditor: {originalCreditor}</Text>}
            {accountNumber && <Text style={s.body}>Account Number: {accountNumber}</Text>}
            {debtAmount && <Text style={s.body}>Alleged Amount: ${debtAmount.toLocaleString()}</Text>}
          </View>
        )}

        <View style={s.section}>
          <Text style={s.body}>To Whom It May Concern,</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am writing in response to your communication regarding the above-referenced debt. Pursuant
            to the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692g, I am hereby
            requesting that you provide validation of this debt within 30 days.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Information Requested</Text>
          {[
            "The name and address of the original creditor",
            "The amount of the alleged debt, including a breakdown of any fees or interest",
            "A copy of any signed agreement or documentation establishing my obligation",
            "Proof that your agency is licensed to collect debts in my state",
            "Verification that the statute of limitations has not expired on this debt",
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
              <Text style={s.body}>{i + 1}.</Text>
              <Text style={s.body}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            Until this debt has been properly validated, please cease all collection activity,
            including reporting this account to any credit bureau. This request does not constitute
            acknowledgement of the alleged debt.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.signatureName}>{clientName}</Text>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 48 }}>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 160, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Signature</Text>
            </View>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 100, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Date</Text>
            </View>
          </View>
          <Text style={{ ...s.bodySmall, marginTop: 12 }}>Prepared with assistance from {COMPANY.name}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 12. Goodwill Deletion Request ─────────────────────────────

export interface GoodwillDeletionRequestProps {
  clientName: string;
  clientAddress: string;
  creditorName: string;
  creditorAddress: string;
  accountNumber?: string;
  paymentDate?: string;
  negativeItemDate?: string;
  requestReason: string;
  generationDate: string;
}

export function GoodwillDeletionRequestPDF({
  clientName,
  clientAddress,
  creditorName,
  creditorAddress,
  accountNumber,
  paymentDate,
  negativeItemDate,
  requestReason,
  generationDate,
}: GoodwillDeletionRequestProps) {
  return (
    <Document title={`Goodwill Deletion Request — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Goodwill Deletion Request" date={generationDate} />

        <View style={s.section}>
          <Text style={s.bold}>{clientName}</Text>
          <Text style={s.body}>{clientAddress}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.bold}>{creditorName}</Text>
          {creditorAddress.split("\n").map((line, i) => (
            <Text key={i} style={s.body}>{line}</Text>
          ))}
        </View>

        <View style={{ ...s.infoBox, marginBottom: 14 }}>
          <Text style={s.infoBoxLabel}>RE: Goodwill Adjustment Request</Text>
          {accountNumber && <Text style={s.body}>Account Number: {accountNumber}</Text>}
          {negativeItemDate && <Text style={s.body}>Date of Negative Item: {negativeItemDate}</Text>}
          {paymentDate && <Text style={s.body}>Date Account Paid in Full: {paymentDate}</Text>}
        </View>

        <View style={s.section}>
          <Text style={s.body}>Dear {creditorName} Customer Relations Team,</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am writing to humbly request that you consider removing the negative item referenced
            above from my credit report as a goodwill gesture. I understand that this item was
            accurately reported, and I take full responsibility for the circumstances that led to it.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>My Circumstances</Text>
          <Text style={s.body}>{requestReason}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I have since resolved this account
            {paymentDate ? ` (paid in full on ${paymentDate})` : ""} and have worked diligently
            to rebuild my financial standing. This negative item continues to significantly impact my
            ability to secure housing and employment, despite my genuine progress.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I sincerely appreciate your time and consideration. A goodwill removal would make a
            profound difference in my life, and I am committed to maintaining my positive financial
            habits going forward. Thank you for the opportunity to be heard.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.body}>With sincere gratitude,</Text>
          <Text style={{ ...s.signatureName, marginTop: 8 }}>{clientName}</Text>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 48 }}>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 160, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Signature</Text>
            </View>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 100, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Date</Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
