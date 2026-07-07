import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPackages } from "@workspace/api-client-react";
import type { Package } from "@workspace/api-client-react";
import { ChevronDown, ChevronUp, Package as PackageIcon } from "lucide-react";

const TIER_ORDER = ["starter", "standard", "premium", "profile_standard", "profile_expedited", "done_for_you", "addon"];

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  standard: "Standard",
  premium: "Premium",
  profile_standard: "Profile Standard",
  profile_expedited: "Profile Expedited",
  done_for_you: "Done For You",
  addon: "Add-On",
};

function TierBadge({ tier }: { tier: string }) {
  const colorMap: Record<string, string> = {
    starter: "bg-blue-100 text-blue-800",
    standard: "bg-indigo-100 text-indigo-800",
    premium: "bg-purple-100 text-purple-800",
    profile_standard: "bg-green-100 text-green-800",
    profile_expedited: "bg-emerald-100 text-emerald-800",
    done_for_you: "bg-amber-100 text-amber-800",
    addon: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[tier] || "bg-gray-100 text-gray-800"}`}>
      {TIER_LABELS[tier] || tier}
    </span>
  );
}

export default function Packages() {
  const { data: packages, isLoading } = useListPackages();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group packages by tier
  const grouped = packages?.reduce((acc: Record<string, Package[]>, pkg: Package) => {
    const tier = pkg.tier || "other";
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>) ?? {};

  const tiers = Object.keys(grouped).sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a);
    const bi = TIER_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Package Management</h1>
        <p className="text-muted-foreground mt-2">View all service packages grouped by tier.</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                {[1, 2].map((j) => <Skeleton key={j} className="h-16 w-full" />)}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tiers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <PackageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No packages found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tiers.map((tier) => (
            <Card key={tier} className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <TierBadge tier={tier} />
                  <span className="text-muted-foreground text-sm font-normal">
                    {grouped[tier].length} package{grouped[tier].length !== 1 ? "s" : ""}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {/* Table header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {grouped[tier].map((pkg: Package) => (
                    <div key={pkg.id}>
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
                        <div className="col-span-8 sm:col-span-4">
                          <p className="font-medium text-sm">{pkg.name}</p>
                          {pkg.slug && (
                            <p className="text-xs text-muted-foreground font-mono">{pkg.slug}</p>
                          )}
                        </div>
                        <div className="hidden sm:block col-span-2">
                          <span className="text-sm text-muted-foreground capitalize">
                            {pkg.category?.replace(/_/g, " ") || "—"}
                          </span>
                        </div>
                        <div className="hidden sm:block col-span-2">
                          <span className="text-sm font-medium">
                            {pkg.price != null
                              ? `$${Number(pkg.price).toLocaleString()}`
                              : pkg.priceLabel || "—"}
                          </span>
                        </div>
                        <div className="hidden sm:block col-span-2">
                          {pkg.isActive !== false ? (
                            <Badge className="bg-green-500 text-white">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="col-span-4 sm:col-span-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => toggleExpand(pkg.id)}
                            aria-label={expandedIds.has(pkg.id) ? "Collapse" : "View Details"}
                          >
                            {expandedIds.has(pkg.id) ? (
                              <><ChevronUp className="w-4 h-4 mr-1" /> Hide</>
                            ) : (
                              <><ChevronDown className="w-4 h-4 mr-1" /> Details</>
                            )}
                          </Button>
                        </div>
                      </div>

                      {expandedIds.has(pkg.id) && (
                        <div className="px-6 pb-5 bg-muted/20 border-t">
                          <div className="pt-4 space-y-4">
                            <div className="flex flex-wrap gap-4 text-sm sm:hidden">
                              <div>
                                <span className="text-muted-foreground">Category: </span>
                                <span className="capitalize">{pkg.category?.replace(/_/g, " ") || "—"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-medium">
                                  {pkg.price != null ? `$${Number(pkg.price).toLocaleString()}` : pkg.priceLabel || "—"}
                                </span>
                              </div>
                              <div>
                                {pkg.isActive !== false ? (
                                  <Badge className="bg-green-500 text-white">Active</Badge>
                                ) : (
                                  <Badge variant="outline">Inactive</Badge>
                                )}
                              </div>
                            </div>

                            {pkg.description && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                                <p className="text-sm text-foreground">{pkg.description}</p>
                              </div>
                            )}

                            {pkg.features && pkg.features.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Features</p>
                                <ul className="space-y-1">
                                  {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="text-primary mt-0.5">✓</span>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground italic">
                              To modify packages, update them directly in the database or contact a developer.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
