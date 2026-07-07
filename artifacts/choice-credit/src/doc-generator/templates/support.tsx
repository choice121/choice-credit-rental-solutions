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

function Footer({ note }: { note?: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{COMPANY.name} · {COMPANY.website}</Text>
      <Text style={s.footerText}>{note ?? "Confidential — Prepared for Landlord Review"}</Text>
    </View>
  );
}

// ── 7. Character Reference Template ──────────────────────────

export interface CharacterReferenceTemplateProps {
  clientName: string;
  refereeRelationship?: string;
  generationDate: string;
}

export function CharacterReferenceTemplatePDF({
  clientName,
  refereeRelationship,
  generationDate,
}: CharacterReferenceTemplateProps) {
  const BlankLine = ({ label, width = 200 }: { label: string; width?: number }) => (
    <View style={{ marginBottom: 14 }}>
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width, marginBottom: 3 }} />
      <Text style={s.bodySmall}>{label}</Text>
    </View>
  );

  return (
    <Document title={`Character Reference Template — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Character Reference Letter Template" date={generationDate} />

        <View style={{ ...s.infoBox, marginBottom: 16 }}>
          <Text style={s.infoBoxLabel}>Instructions for the Referee</Text>
          <Text style={s.body}>
            This template has been provided to you on behalf of <Text style={s.bold}>{clientName}</Text>.
            Please complete the form below in your own words, sign, and return to the applicant.
            {refereeRelationship ? ` You are being asked to serve as a ${refereeRelationship} reference.` : ""}
          </Text>
        </View>

        {/* Referee Info */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Referee Information</Text>
          <View style={{ flexDirection: "row", gap: 24 }}>
            <BlankLine label="Your Full Name" width={180} />
            <BlankLine label="Your Title / Position" width={180} />
          </View>
          <View style={{ flexDirection: "row", gap: 24 }}>
            <BlankLine label="Organization / Employer" width={180} />
            <BlankLine label="Phone Number" width={140} />
          </View>
          <BlankLine label="Email Address" width={220} />
          <BlankLine label="Relationship to Applicant" width={260} />
          <BlankLine label="Length of Time Known" width={200} />
        </View>

        {/* Reference Content */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Your Reference Statement</Text>
          <Text style={s.body}>
            Please describe the applicant's character, reliability, and why you believe they would be a
            responsible tenant. (Use additional paper if needed)
          </Text>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.border, marginTop: 18 }} />
          ))}
        </View>

        {/* Checkboxes */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Please Check All That Apply</Text>
          {[
            "I have known the applicant for more than 1 year",
            "I believe the applicant is honest and trustworthy",
            "I believe the applicant is financially responsible",
            "I would personally vouch for this person as a tenant",
            "I am willing to be contacted by the landlord to discuss this reference",
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
              <View style={{ width: 10, height: 10, borderWidth: 0.5, borderColor: COLORS.text, marginTop: 1 }} />
              <Text style={s.body}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Signature */}
        <View style={s.signatureSection}>
          <View style={{ flexDirection: "row", gap: 48 }}>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 200, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Referee Signature</Text>
            </View>
            <View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: COLORS.text, width: 120, marginBottom: 4 }} />
              <Text style={s.bodySmall}>Date Signed</Text>
            </View>
          </View>
        </View>

        <Footer note="Character Reference for Rental Application" />
      </Page>
    </Document>
  );
}

// ── 8. Rental Application Cover Letter ───────────────────────

export interface RentalAppCoverLetterProps {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  propertyAddress: string;
  landlordName?: string;
  clientBackground: string;
  whyThisProperty?: string;
  advisorInfo: AdvisorInfo;
  generationDate: string;
}

export function RentalAppCoverLetterPDF({
  clientName,
  clientPhone,
  clientEmail,
  propertyAddress,
  landlordName,
  clientBackground,
  whyThisProperty,
  advisorInfo,
  generationDate,
}: RentalAppCoverLetterProps) {
  return (
    <Document title={`Rental Application Cover Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Rental Application Cover Letter" date={generationDate} />

        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "Dear Property Manager / Landlord,"}</Text>
          <Text style={{ ...s.bodySmall, marginTop: 4 }}>
            Re: Rental Application — {propertyAddress}
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            My name is <Text style={s.bold}>{clientName}</Text>, and I am submitting this letter
            alongside my rental application for the property at {propertyAddress}. I want to take a
            moment to introduce myself and provide context that I believe will be valuable as you
            review my application.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>About Me</Text>
          <Text style={s.body}>{clientBackground}</Text>
        </View>

        {whyThisProperty && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Why This Property</Text>
            <Text style={s.body}>{whyThisProperty}</Text>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>My Commitment to You</Text>
          <Text style={s.body}>
            I am committed to being a respectful, communicative, and financially responsible tenant.
            I am currently working with {advisorInfo.company} to ensure my financial health and
            housing readiness. My advisor, {advisorInfo.name}, is available to speak with you directly
            regarding my application.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            Thank you sincerely for taking the time to consider my application. I would welcome the
            opportunity to speak with you further and am happy to provide any additional documentation
            you may require.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.body}>Warmly,</Text>
          <Text style={{ ...s.signatureName, marginTop: 8 }}>{clientName}</Text>
          {clientPhone && <Text style={s.signatureTitle}>{clientPhone}</Text>}
          {clientEmail && <Text style={s.signatureTitle}>{clientEmail}</Text>}
          <View style={{ marginTop: 16, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 8 }}>
            <Text style={s.bodySmall}>Supported by {advisorInfo.name} · {advisorInfo.company}</Text>
            <Text style={s.bodySmall}>{advisorInfo.phone} · {advisorInfo.email}</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 9. Criminal History Context Letter ───────────────────────

export interface CriminalHistoryLetterProps {
  clientName: string;
  offenseDate?: string;
  offenseType?: string;
  explanation: string;
  rehabilitationSteps?: string;
  currentStatus?: string;
  advisorInfo: AdvisorInfo;
  landlordName?: string;
  generationDate: string;
}

export function CriminalHistoryLetterPDF({
  clientName,
  offenseDate,
  offenseType,
  explanation,
  rehabilitationSteps,
  currentStatus,
  advisorInfo,
  landlordName,
  generationDate,
}: CriminalHistoryLetterProps) {
  return (
    <Document title={`Criminal History Context Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Criminal History Context Letter" date={generationDate} />

        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "To Whom It May Concern,"}</Text>
          <Text style={{ ...s.bodySmall, marginTop: 4 }}>Re: Applicant — {clientName}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am writing to address the criminal record that may appear on a background check for
            <Text style={s.bold}> {clientName}</Text>. I want to provide important context and
            documentation of the significant rehabilitation that has taken place since that time.
          </Text>
        </View>

        {(offenseDate || offenseType) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Offense Information</Text>
            <View style={{ flexDirection: "row", gap: 24 }}>
              {offenseType && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Nature of Offense</Text>
                  <Text style={s.infoBoxValue}>{offenseType}</Text>
                </View>
              )}
              {offenseDate && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Date</Text>
                  <Text style={s.infoBoxValue}>{offenseDate}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Context & Explanation</Text>
          <Text style={s.body}>{explanation}</Text>
        </View>

        {rehabilitationSteps && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Rehabilitation & Growth</Text>
            <Text style={s.body}>{rehabilitationSteps}</Text>
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
            As {clientName}'s advisor, I want to affirm that the person applying to rent your property
            today is not defined by their past. They have demonstrated consistent growth, accountability,
            and readiness to be a reliable member of your community. I am personally available to discuss
            this application further.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.signatureName}>{advisorInfo.name}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.title} · {advisorInfo.company}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.phone} · {advisorInfo.email}</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

// ── 13. Housing Voucher Accommodation Letter ──────────────────

export interface HousingVoucherLetterProps {
  clientName: string;
  voucherNumber?: string;
  voucherExpiry?: string;
  issuingAuthority?: string;
  landlordName?: string;
  propertyAddress?: string;
  advisorInfo: AdvisorInfo;
  generationDate: string;
}

export function HousingVoucherLetterPDF({
  clientName,
  voucherNumber,
  voucherExpiry,
  issuingAuthority,
  landlordName,
  propertyAddress,
  advisorInfo,
  generationDate,
}: HousingVoucherLetterProps) {
  return (
    <Document title={`Housing Voucher Letter — ${clientName}`}>
      <Page size="LETTER" style={s.page}>
        <Letterhead title="Housing Voucher Accommodation Letter" date={generationDate} />

        <View style={s.section}>
          <Text style={s.body}>{landlordName ? `Dear ${landlordName},` : "To Whom It May Concern,"}</Text>
          {propertyAddress && (
            <Text style={{ ...s.bodySmall, marginTop: 4 }}>
              Re: Housing Choice Voucher Application — {propertyAddress}
            </Text>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            I am writing on behalf of my client, <Text style={s.bold}>{clientName}</Text>, who is a
            participant in the Housing Choice Voucher Program (Section 8) and is seeking housing
            in your property.
          </Text>
        </View>

        {(voucherNumber || voucherExpiry || issuingAuthority) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Voucher Details</Text>
            <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
              {issuingAuthority && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Issuing Authority</Text>
                  <Text style={s.infoBoxValue}>{issuingAuthority}</Text>
                </View>
              )}
              {voucherNumber && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Voucher Number</Text>
                  <Text style={s.infoBoxValue}>{voucherNumber}</Text>
                </View>
              )}
              {voucherExpiry && (
                <View style={s.infoBox}>
                  <Text style={s.infoBoxLabel}>Voucher Expiry</Text>
                  <Text style={s.infoBoxValue}>{voucherExpiry}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Legal Notice</Text>
          <View style={s.infoBox}>
            <Text style={s.body}>
              Please be advised that under the Fair Housing Act (42 U.S.C. § 3604) and applicable
              state and local laws, refusing to rent to a qualified applicant solely because they hold
              a Housing Choice Voucher may constitute unlawful discrimination based on source of income.
              Many jurisdictions — including the state of Georgia and the City of Atlanta — have extended
              fair housing protections to voucher holders.
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            The Housing Choice Voucher Program guarantees a significant portion of the rent directly
            to you as the landlord, ensuring reliable and consistent payment. We encourage you to
            speak with the issuing housing authority to understand the program's benefits and
            protections for participating landlords.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.body}>
            We would welcome the opportunity to answer any questions you may have about the voucher
            program or {clientName}'s application. Please do not hesitate to contact us.
          </Text>
        </View>

        <View style={s.signatureSection}>
          <Text style={s.signatureName}>{advisorInfo.name}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.title} · {advisorInfo.company}</Text>
          <Text style={s.signatureTitle}>{advisorInfo.phone} · {advisorInfo.email}</Text>
        </View>

        <Footer note="Housing Voucher Accommodation Request" />
      </Page>
    </Document>
  );
}
