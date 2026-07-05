import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-primary">Choice Credit</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Services</Link>
            <Link href="/tradeline-calculator" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Calculator</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/portal" className="text-sm font-medium text-primary hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Client Login
              </Link>
            )}
            <Button asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/book">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-sidebar py-12 text-sidebar-foreground">
        <div className="container grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-sidebar-primary" />
              <span className="font-serif text-xl font-bold tracking-tight">Choice Credit</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Guiding you from denied to approved with professional credit and rental approval consulting.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Services</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/services" className="hover:text-sidebar-primary transition-colors">Packages</Link></li>
              <li><Link href="/tradeline-calculator" className="hover:text-sidebar-primary transition-colors">Tradeline Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/about" className="hover:text-sidebar-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/privacy" className="hover:text-sidebar-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sidebar-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
          © {new Date().getFullYear()} Choice Credit and Rental Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
