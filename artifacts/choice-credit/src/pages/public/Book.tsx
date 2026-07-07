import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookConsultation, useListPackages } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { RENTER_CHALLENGES } from "@/components/RenterChallenges";
import Testimonials from "@/components/Testimonials";
import { CheckCircle2, Clock, Phone, Mail, Lock, Star } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  situation: z.string().min(10, "Please briefly describe your situation"),
  preferredTime: z.string().optional(),
  packageId: z.string().optional()
});

function TrustPanel() {
  const steps = [
    { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, text: "We review your submission within 24 hours" },
    { icon: <Phone className="w-4 h-4 text-blue-500" />, text: "An advisor calls you to discuss your situation" },
    { icon: <CheckCircle2 className="w-4 h-4 text-accent" />, text: "We present your personalized approval plan" },
  ];

  return (
    <div className="space-y-5">
      {/* Mini testimonial */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />)}
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed italic mb-3">
          "I had an eviction from 2021 that kept showing up on every background check. My advisor knew exactly how to handle it. I was in my new place in under 3 weeks. Worth every penny."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">DR</div>
          <div>
            <p className="text-xs font-semibold text-foreground">Destiny R.</p>
            <p className="text-xs text-muted-foreground">Houston, TX · Approved in 17 days</p>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">What happens after you submit</h3>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{s.icon}</div>
              <span className="text-sm text-muted-foreground">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Response time */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Average response: under 24 hours</p>
          <p className="text-xs text-emerald-600">Mon–Sat, 9AM–7PM EST</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2">
        <a href="tel:18005550198" className="flex items-center gap-3 text-sm text-foreground/70 hover:text-primary transition-colors">
          <Phone className="w-4 h-4 shrink-0" />
          1 (800) 555-0198
        </a>
        <a href="mailto:support@choicecredit.com" className="flex items-center gap-3 text-sm text-foreground/70 hover:text-primary transition-colors">
          <Mail className="w-4 h-4 shrink-0" />
          support@choicecredit.com
        </a>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        Your information is 100% confidential and never shared.
      </div>
    </div>
  );
}

export default function Book() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: packages } = useListPackages();
  const bookConsultation = useBookConsultation();

  const searchParams = new URLSearchParams(window.location.search);
  const defaultPackageId = searchParams.get("package") || undefined;
  const serviceSlug = searchParams.get("service") || undefined;
  const challengeSlug = searchParams.get("challenge") || undefined;
  const matchedChallenge = RENTER_CHALLENGES.find((c) => c.slug === challengeSlug);

  const fromCalculator = {
    score: searchParams.get("score"),
    estimate: searchParams.get("estimate"),
  };

  const calculatorSituationPrefill = fromCalculator.score
    ? `My current credit score is ${fromCalculator.score}${fromCalculator.estimate ? ` and I'd like to reach ${fromCalculator.estimate}` : ""}. `
    : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      situation: matchedChallenge
        ? matchedChallenge.situationPrefill
        : calculatorSituationPrefill,
      preferredTime: "morning",
      packageId: defaultPackageId
    }
  });

  // Auto-select the matching package when packages load and a ?service= slug is present
  useEffect(() => {
    if (!packages || !serviceSlug || defaultPackageId) return;
    const match = (packages as { id: string; slug?: string | null }[]).find(
      (p) => p.slug === serviceSlug
    );
    if (match) {
      form.setValue("packageId", match.id, { shouldValidate: false });
    }
  }, [packages, serviceSlug, defaultPackageId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Map sentinel "none" back to undefined so the backend receives null/undefined, not an invalid UUID
    const payload = {
      ...values,
      packageId: values.packageId === "none" ? undefined : values.packageId,
    };
    bookConsultation.mutate({ data: payload }, {
      onSuccess: () => { setLocation("/book/confirmation"); },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  }

  return (
    <PublicLayout>
      {/* Hero strip */}
      <div className="bg-primary py-12 md:py-16 text-center">
        <div className="container max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <span>★★★★★</span>
            <span className="text-primary-foreground/80">98% approval rate · 500+ families housed</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Request a Free Consultation
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">
            Evictions, bad credit, criminal history, income gaps — we specialize in exactly these situations. Tell us where you are and we'll map out how to get you approved.
          </p>
        </div>
      </div>

      {/* Serious clients notice */}
      <div className="bg-foreground text-background py-4 border-b border-background/10">
        <div className="container max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-background">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            We only work with clients who are ready to take action now.
          </div>
          <span className="hidden sm:block text-background/30">·</span>
          <span className="text-xs text-background/60">If you're still researching, review our <Link href="/services" className="underline underline-offset-2 hover:text-background transition-colors">services page</Link> first.</span>
        </div>
      </div>

      <div className="container max-w-6xl py-14 md:py-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* ── Form (left, takes 3 of 5 cols) ── */}
          <div className="lg:col-span-3">
            {fromCalculator.score && (
              <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 flex items-start gap-3">
                <div className="mt-0.5 text-teal-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm text-teal-800">
                  Based on your estimate, your current score of{" "}
                  <span className="font-semibold">{fromCalculator.score}</span>
                  {fromCalculator.estimate && (
                    <>
                      {" "}could reach{" "}
                      <span className="font-semibold">{fromCalculator.estimate}</span>
                    </>
                  )}
                  . Our advisor will review your full profile.
                </p>
              </div>
            )}

            {serviceSlug && !matchedChallenge && (
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground/80">
              You selected <span className="font-semibold capitalize">{serviceSlug.replace(/-/g, " ")}</span>. 
              Your advisor will review your interest in this service during your consultation.
            </p>
          </div>
        )}

        {matchedChallenge && (
              <div className="mb-8 rounded-xl border border-border overflow-hidden">
                <div className={`bg-gradient-to-r ${matchedChallenge.accentColor} px-5 py-3 flex items-center gap-3`}>
                  <div className="text-white">{matchedChallenge.icon}</div>
                  <div>
                    <p className="text-white font-semibold text-sm uppercase tracking-wide">{matchedChallenge.label}</p>
                    <p className="text-white/90 text-xs">{matchedChallenge.headline}</p>
                  </div>
                </div>
                <div className="bg-card px-5 py-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    We specialize in this. Your situation description is pre-filled below — edit it to match your details.
                  </p>
                  <span className="text-xs font-medium text-accent ml-4 shrink-0">✓ Matched</span>
                </div>
              </div>
            )}

            <Card className="shadow-md border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-xl">Your Information</CardTitle>
                <CardDescription>All information is kept strictly confidential.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                                <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                                <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="packageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interested Package (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="I'm not sure yet" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">I'm not sure yet</SelectItem>
                              {Array.isArray(packages) && packages.map(pkg => (
                                <SelectItem key={pkg.id} value={pkg.id}>{pkg.name} - ${pkg.price}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="situation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Briefly describe your situation</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="I was recently denied for an apartment due to a past eviction and low credit score..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 text-base"
                      disabled={bookConsultation.isPending}
                    >
                      {bookConsultation.isPending ? "Submitting..." : "Request My Free Consultation"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to be contacted by a Choice Credit advisor.
                      We never share your information.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* ── Trust panel (right, takes 2 of 5 cols) ── */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <TrustPanel />
          </div>
        </div>
      </div>

      {/* Testimonials below the form for reassurance */}
      <Testimonials />
    </PublicLayout>
  );
}
