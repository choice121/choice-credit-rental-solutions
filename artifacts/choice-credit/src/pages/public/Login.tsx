import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { signIn, signUp, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setLocation(isAdmin ? "/admin" : "/portal");
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Welcome to Choice Credit and Rental Solutions.",
        });
        setLocation("/portal");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      if (!supabase) throw new Error("Auth not configured.");
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: window.location.origin + "/login",
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Choice Credit</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground mt-2">Enter your email to receive a reset link.</p>
          </div>

          <Card className="shadow-2xl border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                We'll send a password reset link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forgotSent ? (
                <div className="text-center py-4 space-y-4">
                  <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                    Check your email for a password reset link.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSent(false);
                      setForgotEmail("");
                    }}
                    className="text-sm"
                  >
                    ← Back to sign in
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail">Email Address</Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 mt-6" disabled={forgotLoading}>
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
            </CardContent>
            {!forgotSent && (
              <CardFooter className="flex justify-center border-t pt-6 bg-muted/20">
                <Button
                  variant="link"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm"
                >
                  ← Back to sign in
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">Choice Credit</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your client portal to manage your case.</p>
        </div>

        <Card className="shadow-2xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your email and password to access your account."
                : "Enter your details to create a new client account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full h-12 mt-6" disabled={loading}>
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6 bg-muted/20">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
