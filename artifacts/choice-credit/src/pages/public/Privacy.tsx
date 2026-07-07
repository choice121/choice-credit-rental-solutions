import PublicLayout from "@/components/layout/PublicLayout";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly, including your name, email address, phone number, and details about your housing and credit situation when you complete a consultation request or contact form. We may also collect information about your use of our website through standard analytics tools, including pages visited, time on site, and referring pages. We do not collect your full Social Security Number, financial account numbers, or passwords through our website.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information you provide to:
• Respond to consultation requests and schedule calls with an advisor
• Deliver the services you have purchased or requested
• Send you updates about your case or consultation
• Improve our services and website experience
• Comply with legal obligations

We do not sell, rent, or trade your personal information to third parties for marketing purposes.`,
  },
  {
    title: "Information Sharing",
    content: `We share your information only as necessary to deliver our services — for example, with co-signer program partners or credit reporting access providers who are bound by confidentiality agreements. We may also disclose information when required by law, court order, or government authority, or to protect the rights, property, or safety of Choice Credit, our clients, or the public.`,
  },
  {
    title: "Data Security",
    content: `We use industry-standard security measures to protect your personal information, including SSL/TLS encryption for all data transmitted through our website. Access to personal client information is restricted to authorized team members who need it to provide services. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to access the personal information we hold about you, request corrections, or request that we delete your information, subject to our legal obligations. To exercise any of these rights, contact us at choicecreditandrentalsolutions@gmail.com. We will respond to all requests within 30 days.`,
  },
  {
    title: "Cookies",
    content: `Our website uses cookies and similar tracking technologies to improve user experience and analyze traffic. You can control cookie settings through your browser. Disabling cookies may limit some functionality of our website. We use Google Analytics for aggregate, anonymized traffic analysis and do not use cookies to track individual users across unrelated websites.`,
  },
  {
    title: "Third-Party Links",
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are intended for adults (18+). We do not knowingly collect personal information from individuals under 18 years of age. If we become aware that we have collected information from a minor, we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us at:\n\nChoice Credit & Rental Solutions\nchoicecreditandrentalsolutions@gmail.com\n(707) 706-3137 (text only)`,
  },
];

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="bg-primary py-14 text-center">
        <div className="container max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/70">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="container max-w-3xl py-16 md:py-20">
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Choice Credit & Rental Solutions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website and services.
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
