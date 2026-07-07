import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { useParams } from "wouter";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPostData {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  categoryColor: string;
  readTime: string;
  image: string;
  content: string[];
}

const BLOG_POSTS: BlogPostData[] = [
  {
    slug: "5-reasons-rental-denied",
    title: "5 Reasons Your Rental Application Keeps Getting Denied (And How to Fix Each One)",
    date: "January 15, 2025",
    author: "Choice Credit Team",
    category: "Credit Tips",
    categoryColor: "bg-rose-100 text-rose-700",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560518846-cebc533b6271?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Getting denied for an apartment is frustrating — especially when the rejection letter gives you almost no useful information. The truth is, most landlords use automated tenant screening software that scores your application based on a complex set of criteria. Understanding exactly what those systems flag is the first step toward getting approved.",
      "The five most common reasons applications are denied are: a credit score below the landlord's threshold (usually 620–650), a prior eviction on your record, insufficient income relative to rent (most landlords require 2.5–3x monthly rent in verifiable income), a criminal background entry, and negative rental history such as late payments or a broken lease. Each of these can be addressed — but you need to know which one is blocking you.",
      "For credit score issues, the fastest legitimate path is adding authorized user tradelines to your credit file. A well-aged account with low utilization can add 40–80+ points in as little as 30 days. For income verification, freelancers and gig workers need to present bank statements, tax returns (Schedule C), and sometimes a CPA letter — pay stubs alone won't work. For evictions, the approach depends on whether the record is accurate. Inaccurate or outdated evictions can often be disputed off the major reporting agencies.",
      "If your criminal history or broken lease is the obstacle, your best path is a combination of finding second-chance landlords and preparing a strong presentation package — a personal statement, reference letters, and a clear narrative that shows you've moved forward. Our advisors specialize in exactly these scenarios. Book a free consultation and we'll identify which factor is blocking you and give you a concrete plan to address it.",
    ],
  },
  {
    slug: "credit-score-to-rent",
    title: "What Credit Score Do You Need to Rent an Apartment in 2025?",
    date: "January 22, 2025",
    author: "Choice Credit Team",
    category: "Credit Score",
    categoryColor: "bg-blue-100 text-blue-700",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
    content: [
      "The commonly cited number is 650, but the reality in 2025 is more nuanced. Large institutional landlords — the ones managing hundreds of units — often require 680–700 and have hard cutoffs enforced by their screening software. Smaller independent landlords tend to be more flexible, sometimes approving applicants with scores in the 580–620 range if other factors are strong. Luxury apartments in major metros can require 720+.",
      "What matters almost as much as the score itself is the trend and the story behind it. A score of 620 that was 580 six months ago tells a very different story than a 620 that's been declining. Lenders and landlords increasingly look at score trajectory, and some screening platforms show score history. If you've been actively improving your credit, make sure that narrative is visible in your application.",
      "For most applicants trying to get into standard apartments, getting your score to 650+ removes the majority of automatic disqualifiers. The most reliable way to achieve that quickly is a combination of reducing utilization (paying down revolving balances below 30% of the limit) and adding positive tradeline history through authorized user accounts. A single well-aged tradeline with low utilization can add 40–80 points within 30–45 days.",
      "The bottom line: you don't necessarily need a perfect score to rent, but you need to meet the threshold for your target property type. If you're below 650 and facing repeated rejections, the fastest path is tradeline strategy combined with a targeted application approach — focusing on independent landlords, second-chance properties, and presenting the strongest possible supporting documentation. Our calculator can give you an estimate of how much your score could improve.",
    ],
  },
  {
    slug: "eviction-records",
    title: "Eviction Records: How Long They Stay on Your Record & What You Can Actually Do",
    date: "February 3, 2025",
    author: "Choice Credit Team",
    category: "Evictions",
    categoryColor: "bg-amber-100 text-amber-700",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    content: [
      "An eviction can technically stay visible on your rental history for up to 7 years — but 'technically' is the key word. The reporting of eviction records is far less consistent than credit reporting, and there are several pathways to getting them addressed or removed. Understanding these options can dramatically change your rental prospects.",
      "Eviction records appear in two places: the court record itself (which is a matter of public record in most states) and third-party tenant screening databases like RentBureau, CoreLogic SafeRent, and Experian RentBureau. The credit bureaus also report eviction-related judgments. Each of these sources has its own dispute process. If the eviction was filed in error, dismissed, or contains inaccurate information, you have the right to dispute it under the Fair Credit Reporting Act.",
      "Even accurate evictions are not necessarily fatal to your rental applications. Some states — including California, Colorado, and several others — have enacted protections limiting when eviction history can be used in screening decisions. Sealed or expunged court records cannot be reported by screening companies. And if the eviction is more than 3–4 years old, many independent landlords will not weigh it heavily if your current profile is otherwise strong.",
      "The practical strategy is layered: first, check all the major tenant screening databases for your own record (you're entitled to a free copy annually). Dispute any inaccuracies. If the record is accurate, shift your focus to second-chance landlords who explicitly advertise willingness to work with applicants who have eviction history, and prepare a strong personal statement explaining the circumstances and what has changed. Our advisors have helped hundreds of clients navigate this exact situation — often getting them approved within weeks.",
    ],
  },
  {
    slug: "authorized-user-tradelines",
    title: "The Truth About Authorized User Tradelines: Legal, Effective, and Widely Misunderstood",
    date: "February 14, 2025",
    author: "Choice Credit Team",
    category: "Tradelines",
    categoryColor: "bg-violet-100 text-violet-700",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Authorized user tradelines are one of the most powerful and least understood tools in credit consulting — and also one of the most misrepresented. The basic mechanism is simple: when you're added as an authorized user on someone else's credit card account, that account's history appears on your credit report. If the account is old, has a high limit, and has low utilization, it can significantly boost your score.",
      "This practice is completely legal. The FTC, CFPB, and all three major credit bureaus have acknowledged authorized user accounts as a legitimate part of the credit system. FICO's scoring models include authorized user accounts in their calculations — this isn't a loophole, it's a feature. Authorized user status is regularly used by parents adding children to their accounts, spouses sharing credit history, and business partners. The tradeline rental industry simply applies this same mechanism in a more systematic way.",
      "The key factors that determine how much an authorized user tradeline moves your score are: the age of the account (older is better — 10+ year accounts have the most impact), the credit limit (higher limits reduce your overall utilization ratio), the utilization rate on the account (under 10% is ideal), and the payment history (it must be perfect — any late payments can hurt rather than help). Not all tradelines are equal, and choosing the right ones for your specific profile is critical.",
      "What tradelines can and can't do: they can meaningfully raise your score, sometimes by 40–100+ points depending on your baseline profile. They work best when your credit report has limited positive history. They do not remove negative items — late payments, collections, and derogatory marks remain on your report and may still affect screening decisions. The most effective credit improvement strategy typically combines tradeline addition with active dispute work on any inaccurate negative items.",
    ],
  },
  {
    slug: "freelancer-income-verification",
    title: "Income Verification for Freelancers: How to Prove What You Earn to a Landlord",
    date: "February 28, 2025",
    author: "Choice Credit Team",
    category: "Income",
    categoryColor: "bg-emerald-100 text-emerald-700",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Pay stubs are the standard income verification method that tenant screening software is designed around — but they don't work for the 59 million Americans who are self-employed, freelance, or gig workers. If you earn income outside of traditional W-2 employment, you need a different documentation strategy.",
      "The most accepted alternatives for self-employed applicants are: the last two years of federal tax returns (Form 1040 with Schedule C), three to six months of bank statements showing consistent deposits, a CPA or accountant letter confirming your income and business stability, and 1099 forms from clients. The bank statements are often the most persuasive document — they show actual cash flow, not just reported income, and landlords can verify them quickly.",
      "One critical pitfall: many self-employed people reduce their taxable income through legitimate business deductions. This is smart tax strategy but terrible for rental applications, because landlords look at your reported net income — not gross revenue. If your Schedule C shows $35,000 after deductions but you actually deposited $85,000, you need to lead with bank statements and explain the discrepancy clearly. Consider working with an accountant to prepare a profit and loss statement that presents your income in the most landlord-friendly format.",
      "For gig workers specifically (Uber, DoorDash, freelance platforms), the annual earnings summaries from the platforms themselves — combined with bank statements — form the most credible income package. If your income is irregular month to month, include a 12-month average and highlight your strongest 6-month period. A well-prepared income verification package can overcome a lot of skepticism. Our advisors can help you assemble exactly the right documentation for your specific situation.",
    ],
  },
  {
    slug: "co-signers-explained",
    title: "Co-Signers Explained: When You Actually Need One and How to Find One",
    date: "March 8, 2025",
    author: "Choice Credit Team",
    category: "Co-Signers",
    categoryColor: "bg-primary/10 text-primary",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=1200",
    content: [
      "A co-signer is someone who agrees to be legally responsible for your rent if you fail to pay it. For landlords, a creditworthy co-signer dramatically reduces their risk — which is why offering one can turn a rejection into an approval. But not every co-signer situation works, and understanding the requirements prevents wasted time and awkward conversations.",
      "Most landlords who accept co-signers require the co-signer to meet even stricter criteria than they require of the primary tenant: typically 700+ credit score, income of 4–5x the monthly rent, no negative rental history, and no recent major derogatory marks. The co-signer's full credit and income profile will be screened just like any other applicant. This means a family member with good intentions but borderline credit may not actually qualify as your co-signer.",
      "If you don't have a qualified personal co-signer, professional co-signer services are a legitimate alternative. Companies like Leap (formerly The Guarantors) and Insurent act as institutional co-signers for a fee — typically one month's rent or a percentage of the annual lease value. Many large apartment complexes in major cities actively partner with these services and will accept them in lieu of a personal co-signer. It's worth asking the leasing office directly.",
      "When asking someone to co-sign for you personally, be direct and comprehensive: show them your current credit report, explain exactly what you're asking them to take on legally, and offer them a written agreement about how you'll communicate if any payment issues arise. Most people are more willing to help when they understand the full picture and feel respected in the process. Our advisors can help you evaluate whether a co-signer is the right strategy for your situation or whether improving your credit profile directly would be faster.",
    ],
  },
];

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PublicLayout>
        <div className="container max-w-3xl py-24 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find an article with that address.
          </p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero image */}
      <div className="w-full h-64 md:h-96 overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container max-w-3xl py-12 md:py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.categoryColor}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-3 pb-8 border-b mb-8">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.date}</p>
          </div>
        </div>

        {/* Article body */}
        <div className="prose prose-slate max-w-none space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base text-foreground/85 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary-foreground mb-3">
            Ready to take action?
          </h2>
          <p className="text-primary-foreground/75 mb-6 text-sm">
            Get a free consultation with one of our credit and rental advisors.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Book My Free Consultation
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
