import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu, X, Phone, Instagram, Facebook, Twitter,
  Youtube, Mail, MapPin, ArrowRight, ChevronRight,
} from "lucide-react";
import FloatingContact from "@/components/FloatingContact";

const navLinks = [
  { href: "/services",              label: "Services"   },
  { href: "/tradeline-calculator",  label: "Calculator" },
  { href: "/blog",                  label: "Resources"  },
  { href: "/about",                 label: "About"      },
  { href: "/contact",               label: "Contact"    },
];

const ANNOUNCEMENT_KEY = "announcement-dismissed-v2";

/* ─────────────────────────────────────────────────────────────────────────────
   Logo
   • Icon: hardcoded deep-navy square + gold "C" — pops on every background
   • "CHOICE" pill in gold — unmissable in any mode
   • "CREDIT & RENTAL SOLUTIONS" in foreground — adapts cleanly
   ───────────────────────────────────────────────────────────────────────────── */
/* Brand constants — never affected by light/dark theme flips */
const NAVY = "hsl(222 47% 11%)";
const GOLD = "hsl(45 90% 50%)";
const SERIF = "'Playfair Display', Georgia, serif";

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cfg = {
    sm: { icon: "w-8 h-8",   cSize: "text-lg",   name: "text-[18px]", sub: "text-[9px]",  gap: "gap-2.5" },
    md: { icon: "w-10 h-10", cSize: "text-xl",   name: "text-[21px]", sub: "text-[10px]", gap: "gap-3"   },
    lg: { icon: "w-12 h-12", cSize: "text-2xl",  name: "text-[25px]", sub: "text-[11px]", gap: "gap-3.5" },
  }[size];

  return (
    <div className={`flex items-center ${cfg.gap} select-none`}>

      {/* Icon — navy tile, gold C — readable on any background */}
      <div
        className={`${cfg.icon} rounded-xl shrink-0 flex items-center justify-center`}
        style={{ background: NAVY, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
      >
        <span
          className={`${cfg.cSize} font-black leading-none`}
          style={{ color: GOLD, fontFamily: SERIF }}
        >
          C
        </span>
      </div>

      {/* Text block */}
      <div className="flex flex-col leading-none">
        {/* Main wordmark — one bold line */}
        <div
          className={`${cfg.name} font-black tracking-tight leading-tight`}
          style={{ fontFamily: SERIF }}
        >
          <span style={{ color: GOLD }}>Choice</span>
          {/* text-foreground adapts: dark navy in light mode, near-white in dark mode */}
          <span className="text-foreground"> Credit</span>
        </div>
        {/* Subtitle — muted-foreground adapts cleanly in both modes */}
        <div className={`${cfg.sub} font-semibold uppercase tracking-[0.18em] mt-[3px] text-muted-foreground`}>
          &amp; Rental Solutions
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Layout
   ───────────────────────────────────────────────────────────────────────────── */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setAnnouncementVisible(!localStorage.getItem(ANNOUNCEMENT_KEY));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, "1");
    setAnnouncementVisible(false);
  };

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Announcement bar ──────────────────────────────────────────── */}
      {announcementVisible && (
        <div
          className="relative z-50 flex items-center justify-center gap-2 px-10 py-2.5 text-sm font-medium text-center"
          style={{
            background: "hsl(45 93% 47%)",
            color: "hsl(222 47% 11%)",
          }}
        >
          <span>
            🏠 Now accepting new clients — advisors available Mon–Sat, 9AM–7PM EST.{" "}
            <Link
              href="/book"
              className="font-bold underline underline-offset-2 hover:no-underline"
            >
              Book your free call →
            </Link>
          </span>
          <button
            onClick={dismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full bg-background transition-all duration-200 ${
          scrolled
            ? "border-b border-border shadow-sm"
            : "border-b border-border/50"
        }`}
      >
        <div className="container flex h-[62px] items-center justify-between gap-4 px-4 sm:px-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute bottom-1 left-3.5 right-3.5 h-[2px] rounded-full"
                    style={{ background: "hsl(45 93% 47%)" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:18005550198"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              1 (800) 555-0198
            </a>

            {user ? (
              <Link href="/portal" className="text-sm font-semibold text-foreground hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Client Login
              </Link>
            )}

            <Button
              asChild
              size="sm"
              className="font-semibold text-sm"
              style={{
                background: "hsl(45 93% 47%)",
                color: "hsl(222 47% 11%)",
              }}
            >
              <Link href="/book">Book Free Consultation</Link>
            </Button>
          </div>

          {/* Mobile right actions */}
          <div className="flex lg:hidden items-center gap-1">
            <a
              href="tel:18005550198"
              aria-label="Call us"
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>

            {user ? (
              <Link href="/portal" className="text-sm font-semibold text-foreground px-2">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 transition-colors">
                Login
              </Link>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              {/* ── Mobile drawer ──────────────────────────────────── */}
              <SheetContent side="right" className="w-[288px] p-0 flex flex-col bg-background border-l border-border">

                {/* Drawer top */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col px-3 pt-2 pb-1 gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive(link.href) && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "hsl(45 93% 47%)" }}
                        />
                      )}
                      {!isActive(link.href) && (
                        <ChevronRight className="w-4 h-4 opacity-30" />
                      )}
                    </Link>
                  ))}
                </nav>

                <div className="mx-4 my-3 border-t border-border" />

                {/* CTAs */}
                <div className="px-4 flex flex-col gap-2.5 pb-4">
                  <Button
                    asChild
                    className="w-full h-11 font-semibold text-sm"
                    style={{
                      background: "hsl(45 93% 47%)",
                      color: "hsl(222 47% 11%)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/book">Book Free Consultation</Link>
                  </Button>
                  <a
                    href="tel:18005550198"
                    className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-muted/40 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    1 (800) 555-0198
                  </a>
                </div>

                {/* Trust badges */}
                <div className="mt-auto px-4 pb-5 flex items-center justify-center gap-3">
                  <span className="text-[11px] text-muted-foreground border border-border rounded px-2 py-1">🔒 SSL</span>
                  <span className="text-[11px] text-muted-foreground border border-border rounded px-2 py-1">⚖️ FCRA</span>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t bg-sidebar text-sidebar-foreground">

        {/* Newsletter bar */}
        <div className="border-b border-sidebar-border bg-sidebar-accent/30">
          <div className="container py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-sidebar-foreground">Get the free guide: 5 Steps to Rental Approval</p>
                <p className="text-sm text-sidebar-foreground/60 mt-0.5">No spam. A concise PDF you'll actually use.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto md:max-w-sm">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 h-10 px-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 h-10">
                  Send it <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer grid */}
        <div className="container py-12 px-4 sm:px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-sidebar-foreground/65 leading-relaxed mb-5 max-w-xs">
              Professional credit and rental approval consulting. We help you go from denied to approved with legal, ethical strategies grounded in over 30 years of combined experience.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
                { icon: <Facebook className="w-4 h-4" />,  href: "#", label: "Facebook"  },
                { icon: <Twitter className="w-4 h-4" />,   href: "#", label: "Twitter"   },
                { icon: <Youtube className="w-4 h-4" />,   href: "#", label: "YouTube"   },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-sidebar-accent/60 flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/65">
              {[
                { href: "/services",               label: "All Packages"          },
                { href: "/services#consulting",    label: "Consulting Packages"   },
                { href: "/services#profile",       label: "Profile Building"      },
                { href: "/services#done-for-you",  label: "Done-For-You"          },
                { href: "/tradeline-calculator",   label: "Tradeline Calculator"  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sidebar-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/65">
              {[
                { href: "/about",   label: "About Us"            },
                { href: "/blog",    label: "Resources & Blog"    },
                { href: "/contact", label: "Contact"             },
                { href: "/book",    label: "Book a Consultation" },
                { href: "/login",   label: "Client Portal"       },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sidebar-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/65 mb-6">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <a href="tel:18005550198" className="hover:text-sidebar-foreground transition-colors">1 (800) 555-0198</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href="mailto:support@choicecredit.com" className="hover:text-sidebar-foreground transition-colors">support@choicecredit.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>100 Financial District Blvd, Suite 300, New York, NY 10005</span>
              </li>
            </ul>
            <h4 className="font-semibold mb-3 text-sidebar-foreground text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/65">
              <li><Link href="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms"   className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sidebar-border">
          <div className="container py-6 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-sidebar-foreground/45 text-center md:text-left max-w-2xl leading-relaxed">
              © {new Date().getFullYear()} Choice Credit & Rental Solutions. All rights reserved. We are a credit and rental approval consulting company. We are not a law firm, credit repair organization under the Credit Repair Organizations Act, or a HUD-approved housing counseling agency. Results vary and are not guaranteed. All strategies comply with the Fair Credit Reporting Act (FCRA).
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-sidebar-foreground/40 border border-sidebar-border rounded px-2 py-1">🔒 SSL Secured</span>
              <span className="text-xs text-sidebar-foreground/40 border border-sidebar-border rounded px-2 py-1">⚖️ FCRA Compliant</span>
            </div>
          </div>
        </div>
      </footer>

      <FloatingContact />

      {/* ── Sticky mobile CTA bar ────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-background border-t border-border px-3 py-2.5 flex gap-2 shadow-lg">
        <Button
          asChild
          className="flex-1 h-11 text-sm font-semibold"
          style={{
            background: "hsl(45 93% 47%)",
            color: "hsl(222 47% 11%)",
          }}
        >
          <Link href="/book">Book Free Consultation</Link>
        </Button>
        <a
          href="tel:18005550198"
          className="flex items-center justify-center gap-1.5 px-4 h-11 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Call</span>
        </a>
      </div>
    </div>
  );
}
