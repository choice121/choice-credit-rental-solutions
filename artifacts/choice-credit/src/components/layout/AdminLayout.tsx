import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useListAdminMessages } from "@workspace/api-client-react";
import type { Message } from "@workspace/api-client-react";
import {
  Building2,
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  DollarSign,
  LogOut,
  Menu,
  ImagePlay,
  FileText,
  Package,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: UserPlus },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/documents", label: "Doc Generator", icon: FileText },
  { href: "/admin/image-generator", label: "Image Generator", icon: ImagePlay },
];

function NavItem({ href, label, icon: Icon, location, badge, onClick }: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  location: string;
  badge?: number;
  onClick?: () => void;
}) {
  const isActive =
    location === href || (location.startsWith(href) && href !== "/admin");

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: messages } = useListAdminMessages();

  // Count threads with unread messages from clients
  const unreadCount = (() => {
    if (!messages) return 0;
    const threadUnread: Record<string, boolean> = {};
    messages.forEach((msg: Message) => {
      if (msg.clientId && msg.senderRole === "client" && !msg.readAt) {
        threadUnread[msg.clientId] = true;
      }
    });
    return Object.keys(threadUnread).length;
  })();

  const navItemsWithBadge = navItems.map((item) =>
    item.href === "/admin/messages" ? { ...item, badge: unreadCount } : item
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-sidebar-foreground">
              Choice Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItemsWithBadge.map((item) => (
            <NavItem key={item.href} {...item} location={location} />
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-sidebar">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sidebar-primary" />
            <span className="font-serif text-lg font-bold text-sidebar-foreground">
              Choice Admin
            </span>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar pt-8">
              <nav className="flex flex-col gap-1 px-2">
                {navItemsWithBadge.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    location={location}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  onClick={() => { signOut(); setMobileOpen(false); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
