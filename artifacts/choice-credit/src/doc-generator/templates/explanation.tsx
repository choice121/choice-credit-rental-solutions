import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles as s, COLORS, COMPANY } from "./styles";
import type { AdvisorInfo } from "../types";

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
      <Text style={s.footerText}>Confidential — Prepared for Landlord Review</Text>
    </View>
  );
}

// ── 4. Eviction Explanation Letter ───────────────────────────

export interface EvictionExplanationProps {
  clientName: string;
  evictionDate?: string;
  evictionAddress?: string;
  explanation: string;
  stepsToRectify?: string;
  currentStatus?: string;
  advisorInfo: AdvisorInfo;
  landlordName?: string;
  generationDate: string;
}

export function EvictionExplanationPDF({
  clientName,
  evictionDate,
  evictionAddress,
  explanation,
  stepsToRectify,
  currentStatus,
  advisorInfo,
  landlordName,
  generationDate,
}: EvictionExplanationProps) {
  return (
    <Document title={`Eviction Explanation — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Eviction Explanation Letter" date={generationDate} />

        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "To Whom It May Concern,"}</Text>
          <Text style={{ ...s.bodySmall, marginTop: 4 }}>Re: Applicant — {clientName}</Text>
        </View>

        {(evictionDate || evictionAddress) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Eviction Details</Text>
            <View style={{ flexDirection: "row", gap: 24 }}>
              {evictionDate && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Date of Eviction</Text>
                  <Text style={s.infoBoxValue}>{evictionDate}</Text>
                </View>
              )}
              {evictionAddress && (
                <View style={{ ...s.infoBox, flex: 1 }}>
                  <Text style={s.infoBoxLabel}>Property Address</Text>
                  <Text style={s.infoBoxValue}>{evictionAddress}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Explanation</Text>
          <Text style={s.body}>{explanation}</Text>
        </View>

        {stepsToRectify && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Steps Taken to Rectify the Situation</Text>
            <Text style={s.body}>{stepsToRectify}</Text>
          </View>
        )}

        {currentStatus && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Current Status</Text>
            <View style={s.infoBox}>
              <Text style={s.body}>{currentStatus}</Text>
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.body}>
            As {clientName}'s advisor, I have personally reviewed this matter and believe the circumstances
            described above provide important context. I am confident that {clientName} is committed to
            maintaining a positive tenancy going forward and would be a reliable and responsible tenant.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.body}>Respectfully,</Text>
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

// ── 5. Income Verification Letter ────────────────────────────

export interface IncomeVerificationProps {
  clientName: string;
  employerName?: string;
  employmentStatus?: string;
  monthlyIncome: number;
  monthlyRent: number;
  incomeSource?: string;
  advisorInfo: AdvisorInfo;
  landlordName?: string;
  generationDate: string;
}

export function IncomeVerificationPDF({
  clientName,
  employerName,
  employmentStatus,
  monthlyIncome,
  monthlyRent,
  incomeSource,
  advisorInfo,
  landlordName,
  generationDate,
}: IncomeVerificationProps) {
  const ratio = monthlyRent > 0 ? (monthlyIncome / monthlyRent).toFixed(1) : "—";
  const meetsThreshold = monthlyIncome >= monthlyRent * 2.5;

  return (
    <Document title={`Income Verification — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Income Verification Letter" date={generationDate} />

        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "To Whom It May Concern,"}</Text>
          <Text style={{ ...s.bodySmall, marginTop: 4 }}>Re: Income Verification for {clientName}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            This letter is to confirm the income status of <Text style={s.bold}>{clientName}</Text> as
            documented through our advisory services.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Income Summary</Text>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Monthly Income</Text>
              <Text style={{ ...s.infoBoxValue, fontFamily: "Helvetica-Bold", fontSize: 14, color: COLORS.navy }}>
                ${monthlyIncome.toLocaleString()}
              </Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Monthly Rent Requested</Text>
              <Text style={s.infoBoxValue}>${monthlyRent.toLocaleString()}</Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Income-to-Rent Ratio</Text>
              <Text style={{ ...s.infoBoxValue, color: meetsThreshold ? COLORS.green : COLORS.muted }}>
                {ratio}× {meetsThreshold ? "✓ Meets threshold" : ""}
              </Text>
            </View>
          </View>
          {incomeSource && (
            <View style={{ marginTop: 8 }}>
              <Text style={s.infoBoxLabel}>Income Source</Text>
              <Text style={s.body}>{incomeSource}</Text>
            </View>
          )}
          {employerName && (
            <View style={{ marginTop: 8 }}>
              <Text style={s.infoBoxLabel}>Employer / Income Provider</Text>
              <Text style={s.body}>{employerName}</Text>
              {employmentStatus && <Text style={s.bodySmall}>{employmentStatus}</Text>}
            </View>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            Based on our review, {clientName} demonstrates sufficient income to comfortably afford
            the requested rent of ${monthlyRent.toLocaleString()}/month, with an income-to-rent ratio
            of {ratio}×, which {meetsThreshold ? "meets or exceeds" : "approaches"} the standard 3×
            monthly rent threshold commonly required by landlords.
          </Text>
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

// ── 6. Credit Progress Report ─────────────────────────────────

export interface CreditProgressReportProps {
  clientName: string;
  startDate: string;
  currentDate: string;
  startScore: number;
  currentScore: number;
  targetScore: number;
  milestones?: string[];
  openCollections?: number;
  resolvedCollections?: number;
  advisorInfo: AdvisorInfo;
  generationDate: string;
}

export function CreditProgressReportPDF({
  clientName,
  startDate,
  currentDate,
  startScore,
  currentScore,
  targetScore,
  milestones,
  openCollections,
  resolvedCollections,
  advisorInfo,
  generationDate,
}: CreditProgressReportProps) {
  const improvement = currentScore - startScore;
  const progressPct = targetScore > startScore
    ? Math.min(100, Math.round(((currentScore - startScore) / (targetScore - startScore)) * 100))
    : 0;

  const scoreCategory = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 580) return "Poor";
    return "Very Poor";
  };

  return (
    <Document title={`Credit Progress Report — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Credit Improvement Progress Report" date={generationDate} />

        <View style={s.section}>
          <Text style={s.bold}>Client: {clientName}</Text>
          <Text style={s.bodySmall}>
            Program Period: {startDate} – {currentDate}
          </Text>
        </View>

        {/* Score Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Credit Score Journey</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Starting Score</Text>
              <Text style={{ ...s.infoBoxValue, fontSize: 18, fontFamily: "Helvetica-Bold", color: COLORS.muted }}>
                {startScore}
              </Text>
              <Text style={s.bodySmall}>{scoreCategory(startScore)}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 8 }}>
              <Text style={{ fontSize: 14, color: COLORS.gold }}>→</Text>
            </View>
            <View style={{ ...s.infoBox, borderLeftColor: COLORS.navy }}>
              <Text style={s.infoBoxLabel}>Current Score</Text>
              <Text style={{ ...s.infoBoxValue, fontSize: 18, fontFamily: "Helvetica-Bold", color: COLORS.navy }}>
                {currentScore}
              </Text>
              <Text style={s.bodySmall}>{scoreCategory(currentScore)}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 8 }}>
              <Text style={{ fontSize: 14, color: COLORS.gold }}>→</Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoBoxLabel}>Target Score</Text>
              <Text style={{ ...s.infoBoxValue, fontSize: 18, fontFamily: "Helvetica-Bold", color: COLORS.green }}>
                {targetScore}
              </Text>
              <Text style={s.bodySmall}>{scoreCategory(targetScore)}</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={s.bodySmall}>
              Net Improvement: <Text style={{ fontFamily: "Helvetica-Bold", color: improvement >= 0 ? COLORS.green : COLORS.muted }}>
                {improvement >= 0 ? "+" : ""}{improvement} points
              </Text>
              {"  |  "}Progress to Goal: <Text style={{ fontFamily: "Helvetica-Bold", color: COLORS.navy }}>{progressPct}%</Text>
            </Text>
          </View>
        </View>

        {/* Collections */}
        {(openCollections !== undefined || resolvedCollections !== undefined) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Collections Status</Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {resolvedCollections !== undefined && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Resolved Collections</Text>
                  <Text style={{ ...s.infoBoxValue, color: COLORS.green, fontFamily: "Helvetica-Bold", fontSize: 14 }}>
                    {resolvedCollections}
                  </Text>
                </View>
              )}
              {openCollections !== undefined && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Remaining Open</Text>
                  <Text style={{ ...s.infoBoxValue, fontFamily: "Helvetica-Bold", fontSize: 14 }}>
                    {openCollections}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Milestones */}
        {milestones && milestones.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Key Milestones Achieved</Text>
            {milestones.map((m, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
                <Text style={{ color: COLORS.green, fontFamily: "Helvetica-Bold" }}>✓</Text>
                <Text style={s.body}>{m}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.signatureSection}>
          <Text style={s.bodySmall}>Report prepared by:</Text>
          <Text style={s.signatureName}>{advisorInfo.name}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.title} · {advisorInfo.company}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.phone} · {advisorInfo.email}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
