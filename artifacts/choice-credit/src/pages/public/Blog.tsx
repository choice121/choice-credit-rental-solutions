import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Clock, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const POSTS = [
  {
    slug: "5-reasons-rental-denied",
    tag: "Credit Tips",
    tagColor: "bg-rose-100 text-rose-700",
    readTime: "6 min read",
    title: "5 Reasons Your Rental Application Keeps Getting Denied (And How to Fix Each One)",
    excerpt:
      "A rejection letter rarely explains the real reason. Landlords use algorithmic screening — here's what those systems actually flag, and exactly what you can do about it before your next application.",
    image: "https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "credit-score-to-rent",
    tag: "Credit Score",
    tagColor: "bg-blue-100 text-blue-700",
    readTime: "5 min read",
    title: "What Credit Score Do You Need to Rent an Apartment in 2025?",
    excerpt:
      "Most landlords want a 650+, but the reality is more nuanced. Here's what the top property management companies actually look for — and how to get approved even if you're below that threshold.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "eviction-records",
    tag: "Evictions",
    tagColor: "bg-amber-100 text-amber-700",
    readTime: "7 min read",
    title: "Eviction Records: How Long They Stay on Your Record & What You Can Actually Do",
    excerpt:
      "An eviction can stay visible for 7 years — but there are legitimate ways to dispute inaccurate records, find second-chance landlords, and still get approved. Here's the complete breakdown.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "authorized-user-tradelines",
    tag: "Tradelines",
    tagColor: "bg-violet-100 text-violet-700",
    readTime: "8 min read",
    title: "The Truth About Authorized User Tradelines: Legal, Effective, and Widely Misunderstood",
    excerpt:
      "Authorized user tradelines are one of the most powerful and misunderstood tools in credit consulting. Here's exactly how they work, why they're completely legal, and when they actually move the needle.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "freelancer-income-verification",
    tag: "Income",
    tagColor: "bg-emerald-100 text-emerald-700",
    readTime: "6 min read",
    title: "Income Verification for Freelancers: How to Prove What You Earn to a Landlord",
    excerpt:
      "Pay stubs don't work for everyone. If you're self-employed, a contractor, or a gig worker, here's exactly how to document your income in a way that landlords and screening software accept.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "co-signers-explained",
    tag: "Co-Signers",
    tagColor: "bg-primary/10 text-primary",
    readTime: "5 min read",
    title: "Co-Signers Explained: When You Actually Need One and How to Find One",
    excerpt:
      "A co-signer can be the difference between rejection and a signed lease. But not all co-signers are equal — here's what landlords require, how to ask someone, and when professional co-signer services make more sense.",
    image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Blog() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 text-center">
        <div className="container max-w-3xl">
          <span className="inline-block bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Resources
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Knowledge is your best tool.
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Free guides, tips, and breakdowns written by credit consultants who know the rental approval system from the inside.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <article className="bg-card border rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow h-full group">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>
                        {post.tag}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="font-bold text-foreground text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Read article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="container max-w-2xl">
          <ScrollReveal>
            <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">
              Get the free guide: 5 Steps to Rental Approval
            </h2>
            <p className="text-primary-foreground/70 mb-8">
              A concise PDF covering the five things that move the needle most — covering credit, documentation, and presentation. Free, no spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 shrink-0">
                Send my guide
              </Button>
            </div>
            <p className="text-primary-foreground/40 text-xs mt-3">No spam. Unsubscribe any time.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA to book */}
      <section className="py-16 bg-background text-center">
        <div className="container max-w-xl">
          <ScrollReveal>
            <p className="text-muted-foreground mb-4">
              Ready to stop reading and start getting approved?
            </p>
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/book">Book a Free Consultation</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
