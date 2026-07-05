import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookConsultation, useListPackages } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { RENTER_CHALLENGES } from "@/components/RenterChallenges";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  situation: z.string().min(10, "Please briefly describe your situation"),
  preferredTime: z.string().optional(),
  packageId: z.string().optional()
});

export default function Book() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: packages } = useListPackages();
  const bookConsultation = useBookConsultation();

  const searchParams = new URLSearchParams(window.location.search);
  const defaultPackageId = searchParams.get("package") || undefined;
  const challengeSlug = searchParams.get("challenge") || undefined;
  const matchedChallenge = RENTER_CHALLENGES.find((c) => c.slug === challengeSlug);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      situation: matchedChallenge ? matchedChallenge.situationPrefill : "",
      preferredTime: "morning",
      packageId: defaultPackageId
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    bookConsultation.mutate({
      data: values
    }, {
      onSuccess: () => {
        toast({
          title: "Request Received",
          description: "We'll be in touch shortly to schedule your consultation.",
        });
        setLocation("/");
      },
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
      <div className="container max-w-3xl py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Request a Consultation</h1>
          <p className="text-lg text-muted-foreground">
            Take the first step toward approval. Tell us about your situation and we'll craft a plan.
          </p>
        </div>

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

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
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
                          <Input placeholder="John Doe" {...field} />
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
                          <Input type="email" placeholder="john@example.com" {...field} />
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

                <Button type="submit" className="w-full h-12 text-base" disabled={bookConsultation.isPending}>
                  {bookConsultation.isPending ? "Submitting..." : "Request Consultation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
