import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Testimonial {
  name: string;
  location: string;
  challenge: string;
  challengeColor: string;
  outcome: string;
  package: string;
  stars: number;
  quote: string;
  initials: string;
  avatarBg: string;
  photo?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marcus T.",
    location: "Atlanta, GA",
    challenge: "Bad Credit",
    challengeColor: "bg-rose-100 text-rose-700",
    outcome: "Approved in 22 days",
    package: "Guided Approval Package",
    stars: 5,
    quote: "I had a 524 credit score and two collections accounts. Three different apartments turned me down before I found Choice Credit. Within 22 days of working with them, I was approved for a 2-bedroom in Midtown. I honestly didn't think it was possible.",
    initials: "MT",
    avatarBg: "bg-blue-600",
    photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Destiny R.",
    location: "Houston, TX",
    challenge: "Eviction Record",
    challengeColor: "bg-amber-100 text-amber-700",
    outcome: "Approved in 17 days",
    package: "Full-Service Approval",
    stars: 5,
    quote: "I had an eviction from 2021 that kept showing up on every background check. My advisor knew exactly how to handle it. They drafted a dispute letter, helped me find second-chance landlords, and I was in my new place in under 3 weeks. Worth every penny.",
    initials: "DR",
    avatarBg: "bg-violet-600",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "James & Sofia K.",
    location: "Phoenix, AZ",
    challenge: "Income Verification",
    challengeColor: "bg-blue-100 text-blue-700",
    outcome: "Approved in 30 days",
    package: "Standard Housing Package",
    stars: 5,
    quote: "Both of us are freelancers. We make great money but no landlord would accept our bank statements as proof. Choice Credit formatted our income documentation the right way — we got approved for a townhome with a pool. Incredible service.",
    initials: "JK",
    avatarBg: "bg-emerald-600",
    photo: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Aaliyah M.",
    location: "Chicago, IL",
    challenge: "Bad Credit",
    challengeColor: "bg-rose-100 text-rose-700",
    outcome: "Approved in 19 days",
    package: "Expedited Housing Package",
    stars: 5,
    quote: "I needed to move quickly after leaving a difficult situation. My credit was a mess and I had no time. The expedited package got my profile into the 720-range and I was in a safe apartment in under 3 weeks. I can't thank this team enough.",
    initials: "AM",
    avatarBg: "bg-pink-600",
    photo: "https://images.pexels.com/photos/7552075/pexels-photo-7552075.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    name: "Darnell W.",
    location: "Dallas, TX",
    challenge: "Broken Lease",
    challengeColor: "bg-purple-100 text-purple-700",
    outcome: "Approved in 25 days",
    package: "Co-Signer Program",
    stars: 5,
    quote: "I broke my lease due to job loss and had a $3,200 balance in collections. No one would rent to me. The co-signer program was exactly what I needed. The process was smooth and completely professional. I'm in my new apartment and rebuilding my life.",
    initials: "DW",
    avatarBg: "bg-indigo-600",
    photo: "https://images.pexels.com/photos/7061992/pexels-photo-7061992.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    name: "Priya N.",
    location: "Los Angeles, CA",
    challenge: "First-Time Renter",
    challengeColor: "bg-emerald-100 text-emerald-700",
    outcome: "Approved in 14 days",
    package: "Readiness Report",
    stars: 5,
    quote: "I moved from overseas and had zero rental history in the US. Every application was rejected immediately. Choice Credit built a rental readiness profile that actually made sense to American landlords. I got approved for my first US apartment in 2 weeks.",
    initials: "PN",
    avatarBg: "bg-orange-600",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Terrence & Maya B.",
    location: "Miami, FL",
    challenge: "Bad Credit",
    challengeColor: "bg-rose-100 text-rose-700",
    outcome: "Approved in 28 days",
    package: "Full-Service Approval",
    stars: 5,
    quote: "My wife and I were denied for 4 apartments in a row. Our advisor at Choice Credit reviewed our entire profile, disputed 3 incorrect items, added tradelines, and packaged our application beautifully. We're now in a gorgeous place near the beach.",
    initials: "TB",
    avatarBg: "bg-teal-600",
    photo: "https://images.unsplash.com/photo-1522529599102-193144843773?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Rashida J.",
    location: "Atlanta, GA",
    challenge: "Eviction Record",
    challengeColor: "bg-amber-100 text-amber-700",
    outcome: "Approved in 21 days",
    package: "Instant Approval Service",
    stars: 5,
    quote: "I was completely out of options and needed housing fast. The Instant Approval service was a lifesaver — no screening, no rejection risk. The team was professional and kept me updated every step of the way. My kids and I are safe and settled.",
    initials: "RJ",
    avatarBg: "bg-rose-600",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

export default function Testimonials({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const count = TESTIMONIALS.length;
  const mountedRef = useRef(true);

  // Track mounted state so timer callbacks don't update unmounted component
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const go = useCallback((next: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setActive((next + count) % count);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating, count]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => go(active + 1), 6000);
    return () => clearInterval(timer);
  }, [active, go]);

  const t = TESTIMONIALS[active];

  if (compact) {
    // Compact version for Book page sidebar — single static card
    const pick = TESTIMONIALS[1]; // Destiny R. — great eviction story
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
        <Quote className="w-6 h-6 text-accent mb-3" />
        <p className="text-sm text-foreground/80 leading-relaxed italic mb-4">
          "{pick.quote.slice(0, 180)}…"
        </p>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${pick.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden`}>
            {pick.photo
              ? <img src={pick.photo} alt={`${pick.name} profile photo`} className="w-full h-full object-cover" />
              : pick.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{pick.name}</p>
            <p className="text-xs text-muted-foreground">{pick.location} · {pick.outcome}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-accent/20 text-accent font-semibold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Client Stories
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Real people. Real approvals.
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Over 500 families housed across all 50 states. Here's what they say about the journey.
          </p>
        </div>

        {/* Main card */}
        <div className="relative">
          <div
            className="transition-opacity duration-200"
            style={{ opacity: isAnimating ? 0 : 1 }}
          >
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-lg overflow-hidden`}>
                      {t.photo
                        ? <img src={t.photo} alt={`${t.name} profile photo`} className="w-full h-full object-cover" />
                        : t.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-primary">
                      <BadgeCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-primary-foreground text-lg">{t.name}</p>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full tracking-wide uppercase">Verified Client</span>
                    </div>
                    <p className="text-primary-foreground/60 text-sm">{t.location}</p>
                    <StarRating count={t.stars} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:text-right">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.challengeColor}`}>
                    {t.challenge}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    ✓ {t.outcome}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="absolute -top-2 -left-1 w-10 h-10 text-accent/30" />
                <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed font-serif italic pl-8">
                  "{t.quote}"
                </p>
              </div>

              {/* Package tag */}
              <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex items-center justify-between flex-wrap gap-3">
                <span className="text-sm text-primary-foreground/50">
                  Package: <span className="text-primary-foreground/80 font-medium">{t.package}</span>
                </span>
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/book">Get the same result →</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => go(active - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/20 flex items-center justify-center text-primary-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(active + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/20 flex items-center justify-center text-primary-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-accent"
                  : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Mini grid of all names */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {TESTIMONIALS.map((tm, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === active
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20"
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${tm.avatarBg} flex items-center justify-center text-white text-[8px] font-bold overflow-hidden`}>
                {tm.photo
                  ? <img src={tm.photo} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  : tm.initials[0]}
              </span>
              {tm.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
