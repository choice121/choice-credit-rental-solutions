import PublicLayout from "@/components/layout/PublicLayout";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: `By accessing our website or using any of our services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. These terms apply to all visitors, clients, and others who access or use our services.`,
  },
  {
    title: "Description of Services",
    content: `Choice Credit & Rental Solutions provides credit consulting, rental approval strategy, authorized user tradeline placement, co-signer services, and instant approval (sublease) services. Our services are designed to help clients improve their rental application profile using legal and ethical methods grounded in the Fair Credit Reporting Act (FCRA).

We do not guarantee approval from any specific landlord, property manager, or screening company. Our services improve the strength and presentation of your application, but approval decisions are made by third parties outside our control.`,
  },
  {
    title: "Client Responsibilities",
    content: `By using our services, you agree to:
• Provide accurate, truthful information about your situation
• Respond promptly to advisor requests during active engagements
• Not use our services for any fraudulent or illegal purpose
• Not submit false documentation or misrepresent yourself to landlords
• Comply with all applicable laws in your jurisdiction

We reserve the right to terminate services immediately without refund if we determine that a client is engaging in fraud or providing false information.`,
  },
  {
    title: "Payments and Refunds",
    content: `All service fees are displayed on our Services page and communicated before any payment is collected. Payments are due at the start of service unless otherwise agreed in writing. 

Refund eligibility varies by service type:
• Approval Assessment: Non-refundable once the report has been delivered
• Standard & Expedited Housing Packages: Refundable within 48 hours of purchase if no credit-building work has begun; non-refundable once tradeline placements have been initiated
• Co-Signer Program: Non-refundable once the co-signer has been submitted on a rental application
• Instant Approval Service: Non-refundable once a lease has been signed on the client's behalf

We evaluate refund requests on a case-by-case basis for exceptional circumstances. Contact choicecreditandrentalsolutions@gmail.com to submit a refund request.`,
  },
  {
    title: "No Guarantee of Results",
    content: `Credit scores and rental approval outcomes depend on many factors outside our control, including but not limited to: individual credit history, accuracy of information at credit bureaus, landlord discretion, market conditions, and property-specific screening criteria.

Our 98% approval rate reflects our historical track record and does not constitute a guarantee of any specific outcome. Estimates provided through our Tradeline Calculator are illustrative and based on generalized scoring models — actual results may vary significantly.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on our website, including text, graphics, logos, and service materials, is the property of Choice Credit & Rental Solutions and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, Choice Credit & Rental Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, including but not limited to lost profits, loss of data, or rental application denials.

Our total liability for any claim arising from our services shall not exceed the amount you paid for the specific service giving rise to the claim.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service are governed by the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising from these terms or our services shall be resolved through binding arbitration in New York County, New York, in accordance with the rules of the American Arbitration Association.`,
  },
  {
    title: "Changes to These Terms",
    content: `We reserve the right to modify these Terms of Service at any time. When we do, we will update the "Last Updated" date at the top of this page. Your continued use of our services after any changes constitutes acceptance of the revised terms.`,
  },
  {
    title: "Contact",
    content: `If you have questions about these Terms of Service, please contact:\n\nChoice Credit & Rental Solutions\nchoicecreditandrentalsolutions@gmail.com\n(707) 706-3137 (text only)`,
  },
];

export default function Terms() {
  return (
    <PublicLayout>
      <div className="bg-primary py-14 text-center">
        <div className="container max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-primary-foreground/70">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="container max-w-3xl py-16 md:py-20">
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Please read these Terms of Service carefully before using the Choice Credit & Rental Solutions website or engaging any of our services. These terms constitute a legally binding agreement between you and Choice Credit & Rental Solutions.
          </p>

          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <div key={i} className="border-b pb-10 last:border-0">
                <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
