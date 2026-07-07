import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles as s, COLORS, COMPANY } from "./styles";
import type { RentalHistoryEntry, AdvisorInfo } from "../types";
import { format } from "date-fns";

// ── Shared Letterhead ────────────────────────────────────────

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

function Footer({ pageNum }: { pageNum?: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{COMPANY.name} · {COMPANY.website}</Text>
      <Text style={s.footerText}>Confidential — Prepared for Landlord Review</Text>
      {pageNum && <Text style={s.footerText}>Page {pageNum}</Text>}
    </View>
  );
}

const paymentLabel: Record<string, string> = {
  excellent: "Excellent — No late payments",
  good: "Good — Rare late payments",
  fair: "Fair — Occasional late payments",
  poor: "Poor — Frequent late payments",
};

// ── 1. Rental History Report ─────────────────────────────────

export interface RentalHistoryReportProps {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  advisorInfo: AdvisorInfo;
  rentalHistory: RentalHistoryEntry[];
  advisorNotes?: string;
  generationDate: string;
}

export function RentalHistoryReportPDF({
  clientName,
  clientEmail,
  clientPhone,
  advisorInfo,
  rentalHistory,
  advisorNotes,
  generationDate,
}: RentalHistoryReportProps) {
  const sortedHistory = [...rentalHistory].sort(
    (a, b) => new Date(b.move_in_date).getTime() - new Date(a.move_in_date).getTime()
  );

  return (
    <Document title={`Rental History Report — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Rental History Report" date={generationDate} />

        {/* Client Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Client Information</Text>
          <View style={{ flexDirection: "row", gap: 40 }}>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Full Name</Text>
              <Text style={s.infoBoxValue}>{clientName}</Text>
            </View>
            {clientEmail && (
              <View style={s.infoBox}>
                <Text style={s.infoBoxLabel}>Email</Text>
                <Text style={s.infoBoxValue}>{clientEmail}</Text>
              </View>
            )}
            {clientPhone && (
              <View style={s.infoBox}>
                <Text style={s.infoBoxLabel}>Phone</Text>
                <Text style={s.infoBoxValue}>{clientPhone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rental History Table */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Complete Rental History ({sortedHistory.length} addresses)</Text>

          {sortedHistory.length === 0 ? (
            <Text style={s.bodySmall}>No rental history entries recorded.</Text>
          ) : (
            sortedHistory.map((entry, i) => {
              const moveIn = (() => { try { return format(new Date(entry.move_in_date), "MMM yyyy"); } catch { return entry.move_in_date; } })();
              const moveOut = entry.is_current
                ? "Present"
                : entry.move_out_date
                ? (() => { try { return format(new Date(entry.move_out_date), "MMM yyyy"); } catch { return entry.move_out_date; } })()
                : "—";

              return (
                <View
                  key={entry.id}
                  style={{
                    marginBottom: 10,
                    borderWidth: 0.5,
                    borderColor: COLORS.border,
                    borderRadius: 3,
                    padding: 10,
                  }}
                  wrap={false}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={s.bold}>
                      {entry.address}, {entry.city}, {entry.state}
                      {entry.zip_code ? ` ${entry.zip_code}` : ""}
                    </Text>
                    <Text style={s.bodySmall}>{moveIn} – {moveOut}</Text>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
                    {entry.landlord_name && (
                      <View>
                        <Text style={s.infoBoxLabel}>Landlord / Manager</Text>
                        <Text style={s.bodySmall}>{entry.landlord_name}</Text>
                        {entry.landlord_phone && <Text style={s.bodySmall}>{entry.landlord_phone}</Text>}
                        {entry.landlord_email && <Text style={s.bodySmall}>{entry.landlord_email}</Text>}
                      </View>
                    )}
                    {entry.monthly_rent && (
                      <View>
                        <Text style={s.infoBoxLabel}>Monthly Rent</Text>
                        <Text style={s.bodySmall}>${entry.monthly_rent.toLocaleString()}/mo</Text>
                      </View>
                    )}
                    <View>
                      <Text style={s.infoBoxLabel}>Payment History</Text>
                      <Text style={s.bodySmall}>{paymentLabel[entry.payment_history] ?? entry.payment_history}</Text>
                    </View>
                    {entry.reason_for_leaving && (
                      <View>
                        <Text style={s.infoBoxLabel}>Reason for Leaving</Text>
                        <Text style={s.bodySmall}>{entry.reason_for_leaving}</Text>
                      </View>
                    )}
                  </View>

                  {entry.had_eviction && entry.eviction_explanation && (
                    <View style={{ ...s.infoBox, marginTop: 6, marginBottom: 0 }}>
                      <Text style={s.infoBoxLabel}>⚠ Eviction Note</Text>
                      <Text style={s.bodySmall}>{entry.eviction_explanation}</Text>
                    </View>
                  )}

                  {entry.notes && !entry.had_eviction && (
                    <Text style={{ ...s.bodySmall, marginTop: 4, fontStyle: "italic" }}>
                      Note: {entry.notes}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Advisor Notes */}
        {advisorNotes && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Advisor Notes</Text>
            <View style={s.infoBox}>
              <Text style={s.body}>{advisorNotes}</Text>
            </View>
          </View>
        )}

        {/* Advisor Signature */}
        <View style={s.signatureSection}>
          <Text style={s.body}>Prepared and verified by:</Text>
          <Text style={{ ...s.signatureName, marginTop: 8 }}>{advisorInfo.name}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.title}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.company}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.phone} · {advisorInfo.email}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 2. Advisor Cover Letter ──────────────────────────────────

export interface AdvisorCoverLetterProps {
  clientName: string;
  landlordName?: string;
  propertyAddress?: string;
  advisorInfo: AdvisorInfo;
  clientBackground?: string;
  endorsementStatement?: string;
  generationDate: string;
}

export function AdvisorCoverLetterPDF({
  clientName,
  landlordName,
  propertyAddress,
  advisorInfo,
  clientBackground,
  endorsementStatement,
  generationDate,
}: AdvisorCoverLetterProps) {
  return (
    <Document title={`Advisor Cover Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Letter of Recommendation & Introduction" date={generationDate} />

        {/* Salutation */}
        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "To Whom It May Concern,"}</Text>
          {propertyAddress && (
            <Text style={{ ...s.bodySmall, marginTop: 4 }}>
              Re: Rental Application — {propertyAddress}
            </Text>
          )}
        </View>

        {/* Introduction */}
        <View style={s.section}>
          <Text style={s.body}>
            My name is {advisorInfo.name}, and I serve as a {advisorInfo.title} at {advisorInfo.company}.
            I am writing on behalf of my client, <Text style={s.bold}>{clientName}</Text>, to provide
            a professional recommendation and offer context that I believe will be valuable as you
            consider their rental application.
          </Text>
        </View>

        {/* Client Background */}
        {clientBackground && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Client Background</Text>
            <Text style={s.body}>{clientBackground}</Text>
          </View>
        )}

        {/* Endorsement */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>My Endorsement</Text>
          <Text style={s.body}>
            {endorsementStatement ||
              `After working closely with ${clientName}, I am confident in vouching for their character, commitment, and readiness to be a responsible tenant. They have demonstrated a genuine effort to address past challenges and have shown the discipline and accountability that any landlord would value in a long-term tenant.`}
          </Text>
        </View>

        {/* Closing */}
        <View style={s.section}>
          <Text style={s.body}>
            I am available to speak directly with you regarding {clientName}'s application.
            Please feel free to contact me at any time using the information below.
          </Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={s.body}>Sincerely,</Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.signatureName}>{advisorInfo.name}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.title}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.company}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.phone} · {advisorInfo.email}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 3. Client Personal Statement ─────────────────────────────

export interface ClientPersonalStatementProps {
  clientName: string;
  statement: string;
  acknowledgement?: string;
  generationDate: string;
}

export function ClientPersonalStatementPDF({
  clientName,
  statement,
  acknowledgement,
  generationDate,
}: ClientPersonalStatementProps) {
  return (
    <Document title={`Personal Statement — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Client Personal Statement" date={generationDate} />

        <View style={s.section}>
          <Text style={{ ...s.bold, marginBottom: 6 }}>Statement by: {clientName}</Text>
          <Text style={s.body}>
            The following is a personal statement provided by the applicant in their own words.
          </Text>
        </View>

        <View style={{ ...s.infoBox, marginBottom: 16 }}>
          <Text style={s.body}>{statement || "[Client statement goes here]"}</Text>
        </View>

        {acknowledgement && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Acknowledgement</Text>
            <Text style={s.body}>{acknowledgement}</Text>
          </View>
        )}

        <View style={s.signatureSection}>
          <Text style={s.body}>I, {clientName}, certify that the above statement is truthful and my own.</Text>
          <View style={{ marginTop: 20, flexDirection: "row", gap: 48 }}>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 160, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Client Signature</Text>
            </View>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 120, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Date</Text>
            </View>
          </View>
          <Text style={{ ...s.bodySmall, marginTop: 12 }}>
            Prepared in partnership with {COMPANY.name}
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
