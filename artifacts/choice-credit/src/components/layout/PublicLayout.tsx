import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Building2, Menu, X, Phone, Instagram, Facebook, Twitter,
  Youtube, Mail, MapPin, ArrowRight
} from "lucide-react";
import FloatingContact from "@/components/FloatingContact";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/tradeline-calculator", label: "Calculator" },
  { href: "/blog", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ANNOUNCEMENT_KEY = "announcement-dismissed-v2";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  useEffect(() => {
    // Check after mount so SSR/hydration is safe
    setAnnouncementVisible(!localStorage.getItem(ANNOUNCEMENT_KEY));
  }, []);

  function dismissAnnouncement() {
    localStorage.setItem(ANNOUNCEMENT_KEY, "1");
    setAnnouncementVisible(false);
  }

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Announcement bar ──────────────────────────────────────────────── */}
      {announcementVisible && (
        <div className="bg-accent text-accent-foreground text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative z-50">
          <span className="font-medium text-center">
            🏠 Now accepting new clients — advisors available Mon–Sat, 9AM–7PM EST.{" "}
            <Link href="/book" className="underline underline-offset-2 font-bold hover:no-underline">
              Book your free call →
            </Link>
          </span>
          <button
            onClick={dismissAnnouncement}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary">
              Choice Credit
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a
              href="tel:18005550198"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              1 (800) 555-0198
            </a>
            {user ? (
              <Link href="/portal" className="text-sm font-medium text-primary hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Client Login
              </Link>
            )}
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/book">Book Free Consultation</Link>
            </Button>
          </div>

          {/* Mobile: login + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a href="tel:18005550198" aria-label="Call us" className="text-foreground/70 hover:text-foreground">
              <Phone className="w-4.5 h-4.5" />
            </a>
            {user ? (
              <Link href="/portal" className="text-sm font-medium text-primary">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-foreground/70">Login</Link>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-serif text-lg font-bold text-primary">Choice Credit</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="tel:18005550198"
                    className="flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium text-foreground/70 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" /> 1 (800) 555-0198
                  </a>
                  <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/book">Book Your Free Consultation</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t bg-sidebar text-sidebar-foreground">
        {/* Newsletter bar */}
        <div className="border-b border-sidebar-border bg-sidebar-accent/30">
          <div className="container py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-sidebar-foreground">Get the free guide: 5 Steps to Rental Approval</p>
                <p className="text-sm text-sidebar-foreground/60 mt-0.5">
                  No spam. A concise PDF you'll actually use.
                </p>
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

        {/* Main footer grid */}
        <div className="container py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-sidebar-primary" />
              <span className="font-serif text-xl font-bold tracking-tight">Choice Credit</span>
            </div>
            <p className="text-sm text-sidebar-foreground/65 leading-relaxed mb-5 max-w-xs">
              Professional credit and rental approval consulting. We help you go from denied to approved with legal, ethical strategies grounded in over 30 years of combined experience.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
                { icon: <Facebook className="w-4 h-4" />, href: "#", label: "Facebook" },
                { icon: <Twitter className="w-4 h-4" />, href: "#", label: "X / Twitter" },
                { icon: <Youtube className="w-4 h-4" />, href: "#", label: "YouTube" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-sidebar-accent/60 flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/65">
              {[
                { href: "/services", label: "All Packages" },
                { href: "/services#consulting", label: "Consulting Packages" },
                { href: "/services#profile", label: "Profile Building" },
                { href: "/services#done-for-you", label: "Done-For-You" },
                { href: "/tradeline-calculator", label: "Tradeline Calculator" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sidebar-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/65">
              {[
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Resources & Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/book", label: "Book a Consultation" },
                { href: "/login", label: "Client Portal" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sidebar-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-foreground text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/65 mb-6">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <a href="tel:18005550198" className="hover:text-sidebar-foreground transition-colors">
                  1 (800) 555-0198
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href="mailto:support@choicecredit.com" className="hover:text-sidebar-foreground transition-colors">
                  support@choicecredit.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>100 Financial District Blvd, Suite 300, New York, NY 10005</span>
              </li>
            </ul>
            <h4 className="font-semibold mb-3 text-sidebar-foreground text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/65">
              <li>
                <Link href="/privacy" className="hover:text-sidebar-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sidebar-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sidebar-border">
          <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
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

      {/* ── Floating contact button ───────────────────────────────────────── */}
      <FloatingContact />

      {/* ── Sticky mobile CTA bar ────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-background/95 backdrop-blur border-t border-border px-3 py-2.5 flex gap-2.5 shadow-lg">
        <Button asChild className="flex-1 h-10 text-sm bg-primary text-primary-foreground">
          <Link href="/book">Book Free Consultation</Link>
        </Button>
        <a
          href="tel:18005550198"
          className="flex items-center justify-center gap-1.5 px-4 h-10 rounded-md border border-border text-sm font-medium text-foreground/80 hover:border-primary hover:text-primary transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
}
