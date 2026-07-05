import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building2, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/tradeline-calculator", label: "Calculator" },
  { href: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary">
              Choice Credit
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
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
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/book">Book Your Free Consultation</Link>
            </Button>
          </div>

          {/* Mobile: login link + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {user ? (
              <Link href="/portal" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-foreground/70">
                Login
              </Link>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                  >
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

                <div className="mt-8 flex flex-col gap-3">
                  <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/book">Book Your Free Consultation</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-sidebar py-12 text-sidebar-foreground">
        <div className="container grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-sidebar-primary" />
              <span className="font-serif text-xl font-bold tracking-tight">Choice Credit</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Guiding you from denied to approved with professional credit and rental approval
              consulting.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Services</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <Link href="/services" className="hover:text-sidebar-primary transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/tradeline-calculator"
                  className="hover:text-sidebar-primary transition-colors"
                >
                  Tradeline Calculator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <Link href="/contact" className="hover:text-sidebar-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <Link href="/privacy" className="hover:text-sidebar-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sidebar-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t border-sidebar-border">
          <p className="text-sm text-sidebar-foreground/50 text-center">
            © {new Date().getFullYear()} Choice Credit and Rental Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
