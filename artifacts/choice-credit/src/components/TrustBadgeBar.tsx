import { Shield, Star, Lock, Scale, Award, CheckCircle } from "lucide-react";

const BADGES = [
  {
    icon: <Star className="w-5 h-5 text-accent" />,
    label: "4.9★ Google Rating",
    sub: "500+ reviews",
  },
  {
    icon: <Shield className="w-5 h-5 text-blue-500" />,
    label: "BBB Accredited",
    sub: "A+ rating",
  },
  {
    icon: <Scale className="w-5 h-5 text-emerald-500" />,
    label: "FCRA Compliant",
    sub: "Fully legal & ethical",
  },
  {
    icon: <Lock className="w-5 h-5 text-violet-500" />,
    label: "SSL Secured",
    sub: "256-bit encryption",
  },
  {
    icon: <Award className="w-5 h-5 text-rose-500" />,
    label: "Licensed Advisors",
    sub: "Credit consulting pros",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-primary" />,
    label: "98% Approval Rate",
    sub: "Across all client types",
  },
];

export default function TrustBadgeBar() {
  return (
    <div className="bg-card border-b">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BADGES.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-foreground">{b.label}</p>
                <p className="text-[10px] text-muted-foreground">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
