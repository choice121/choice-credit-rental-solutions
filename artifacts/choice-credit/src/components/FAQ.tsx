import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Do you guarantee rental approval?",
    a: "We cannot legally guarantee approval from any specific landlord — no one can. What we can guarantee is that we do everything within legal and ethical means to maximize your odds. Our 98% approval rate across 500+ clients speaks for itself. If our strategy doesn't result in approval within the agreed timeline, we keep working with you at no additional charge until it does. No client gets left behind.",
  },
  {
    q: "Can I do this myself without paying for help?",
    a: "Technically, yes — dispute letters and tradeline research are publicly available. But most people who try it alone get denied again because the details matter enormously: which items to dispute, how to word the letter, which tradelines actually move your score, and how to present your application. One wrong move can reset your timeline by months. The clients who come to us after trying alone almost always say the same thing: 'I wish I'd done this first.' Our fee typically pays for itself the first time you avoid a failed application.",
  },
  {
    q: "How is this different from other credit repair companies?",
    a: "Most credit repair companies send generic dispute letters and wait. We do the full picture: disputes, tradeline strategy, income documentation, rental history narrative, landlord targeting, and application coaching. We don't stop at your credit score — we stop when you have keys in hand. You also get a dedicated advisor, not a call center. We specialize specifically in rental approval, which requires a different approach than general credit repair.",
  },
  {
    q: "Is this legal and ethical?",
    a: "Yes, completely. Everything we do is grounded in the Fair Credit Reporting Act (FCRA) and established credit consulting practices. Dispute letters, authorized user tradelines, income documentation formatting, co-signer programs — all of these are legitimate, legal strategies used by credit professionals nationwide. We do not offer fake documents, synthetic identities, or any unlawful workarounds. We've never had a legal issue in our history.",
  },
  {
    q: "How long does the process take?",
    a: "It depends on the service. Our Readiness Report is delivered within 48–72 hours. Consulting packages (Guided Approval, Full-Service) typically produce results in 2–4 weeks. Profile Building packages run 30–45 days for standard, 7–14 days for expedited. Our Instant Approval Service can have you in a unit within 48–72 hours. We'll give you a realistic timeline during your free consultation — we don't overpromise.",
  },
  {
    q: "What if I have an eviction or bankruptcy on my record?",
    a: "This is exactly what we specialize in. An eviction or bankruptcy is not a life sentence — it's a challenge we've helped hundreds of clients overcome. We know which landlords screen for these, how to dispute inaccurate records, how to build a compelling narrative, and which second-chance housing opportunities are available in your area. Many of our most successful clients came to us with evictions and bankruptcies on their record.",
  },
  {
    q: "Will this hurt my credit score?",
    a: "No. Everything we do is designed to improve or protect your score, not hurt it. Authorized user tradelines add positive history. Dispute letters remove negative items. We do not recommend any action that would negatively impact your score — and before we execute any strategy, we explain exactly what it does and why. You're always in control.",
  },
  {
    q: "What's the difference between the Co-Signer Program and Instant Approval?",
    a: "The Co-Signer Program adds a qualified co-signer (700+ credit, $15k+/month income) to your application — you still apply as the tenant, just with stronger backing. It's great for people who are close to qualifying on their own. The Instant Approval Service is more hands-off: we lease the unit using our own qualified profile and sublease it to you, so you bypass tenant screening entirely. It's the fastest path to move-in with zero rejection risk.",
  },
  {
    q: "What if my landlord finds out I used a consulting service?",
    a: "Using a credit or rental consultant is completely normal and carries no stigma — landlords don't ask. Just like people use mortgage brokers to buy homes, people use consultants to rent apartments. There is nothing to disclose. The improvements to your credit profile and documentation are real and stand on their own. Your advisor will coach you on how to present your application confidently.",
  },
  {
    q: "What information do I need to get started?",
    a: "Just your basic contact details and a description of your situation. During your free consultation, we'll ask for more detail — your current credit score (a rough estimate is fine), the reason(s) for your most recent denial if you know them, your target move-in timeline, and your budget. You don't need documents ready to book — we'll guide you on what to gather after we speak.",
  },
  {
    q: "Do you work in all states?",
    a: "Yes. We serve clients in all 50 states. Our co-signer program, tradeline placements, and profile consulting work nationwide. The Instant Approval Service is also available in all 50 states, though we do recommend RentCafe-listed properties for the smoothest co-signer processing.",
  },
  {
    q: "What happens if things don't work out?",
    a: "We take our results seriously. If you complete a package in good faith and don't see the expected outcome, we'll review your case and work with you to identify next steps — at no extra charge. We're invested in your success because our reputation depends on it. That said, results depend partly on your credit profile and the rental market in your area, which is why we do a thorough assessment upfront.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/10 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions people ask before booking
          </h2>
          <p className="text-lg text-muted-foreground">
            We believe in total transparency. No pressure, no gotchas.
          </p>
        </div>

        <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden shadow-sm">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="bg-card">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-foreground leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "1500px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Still have questions?{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            Contact us directly
          </Link>{" "}
          or{" "}
          <Link href="/book" className="text-primary font-medium hover:underline">
            book a free call
          </Link>{" "}
          — no commitment required.
        </p>
      </div>
    </section>
  );
}
