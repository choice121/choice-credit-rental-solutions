import { useState, useEffect } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMyProfile, useUpdateMyProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const { data: profile, isLoading, refetch } = useGetMyProfile();
  const updateProfile = useUpdateMyProfile();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = () => {
    if (!fullName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    updateProfile.mutate(
      { data: { fullName: fullName.trim(), phone: phone.trim() || null } },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
          refetch();
        },
        onError: () => {
          toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Update your profile information.</p>
      </div>

      <div className="max-w-lg space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>This information is used by your advisor to contact you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="pl-9 bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed here. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="w-full"
                >
                  {saved ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Saved
                    </span>
                  ) : updateProfile.isPending ? (
                    "Saving..."
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle className="text-base">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
