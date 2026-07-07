import { StyleSheet } from "@react-pdf/renderer";

export const COMPANY = {
  name: "Choice Credit & Rental Solutions",
  tagline: "Credit Repair · Rental Assistance · Housing Consulting",
  address: "Atlanta, Georgia",
  phone: "(404) 555-0100",
  email: "info@choicecreditrental.com",
  website: "www.choicecreditrental.com",
};

export const COLORS = {
  navy: "#1a3a5c",
  gold: "#c9a96e",
  text: "#1f2937",
  muted: "#6b7280",
  light: "#f9fafb",
  border: "#d1d5db",
  white: "#ffffff",
  green: "#15803d",
};

export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    lineHeight: 1.5,
  },
  // Header / Letterhead
  letterheadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: COLORS.navy,
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 8,
    color: COLORS.muted,
    marginTop: 2,
  },
  contactBlock: {
    textAlign: "right",
  },
  contactLine: {
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "right",
  },
  goldDivider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
    marginTop: 8,
    marginBottom: 16,
  },
  thinDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    marginVertical: 10,
  },
  // Document title
  docTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docDate: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 16,
  },
  // Sections
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLORS.navy,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gold,
    paddingBottom: 3,
  },
  // Text
  body: {
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.6,
  },
  bodySmall: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  // Table
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.navy,
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginBottom: 0,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COLORS.white,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.text,
    paddingHorizontal: 4,
  },
  tableCellMuted: {
    fontSize: 9,
    color: COLORS.muted,
    paddingHorizontal: 4,
  },
  // Info box
  infoBox: {
    backgroundColor: COLORS.light,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    padding: 10,
    marginBottom: 12,
  },
  infoBoxLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COLORS.navy,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  infoBoxValue: {
    fontSize: 10,
    color: COLORS.text,
  },
  // Signature
  signatureSection: {
    marginTop: 24,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  signatureName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: COLORS.navy,
  },
  signatureTitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  // Badge-like row
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.navy,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 8,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
  },
  badgeGreen: {
    backgroundColor: COLORS.green,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 52,
    right: 52,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: COLORS.muted,
  },
});
