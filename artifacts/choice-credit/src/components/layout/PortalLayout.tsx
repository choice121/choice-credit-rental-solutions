import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Building2, LayoutDashboard, FileText, CheckSquare, MessageSquare, CreditCard, Settings, LogOut, Home } from "lucide-react";
import { useListMyMessages } from "@workspace/api-client-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const [location] = useLocation();
  const { data: messages } = useListMyMessages();

  const unreadCount = messages
    ? messages.filter((m) => m.senderRole !== "client" && !m.readAt).length
    : 0;

  const navItems = [
    { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/documents", label: "Documents", icon: FileText },
    { href: "/portal/plan", label: "Approval Plan", icon: CheckSquare },
    { href: "/portal/messages", label: "Messages", icon: MessageSquare, badge: unreadCount },
    { href: "/portal/billing", label: "Billing", icon: CreditCard },
    { href: "/portal/rental-history", label: "Rental History", icon: Home },
    { href: "/portal/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-sidebar-foreground">Choice Credit</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                location === item.href || (location.startsWith(item.href) && item.href !== "/portal")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
