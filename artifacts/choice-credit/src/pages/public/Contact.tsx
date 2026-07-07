import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "wouter";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", phone: "", message: "" }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We'll get back to you within 24 hours." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      }
    });
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=1400')",
            opacity: 0.1,
            mixBlendMode: "overlay",
          }}
        />
        <div className="container max-w-3xl text-center relative z-10">
          <span className="inline-block bg-accent/20 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            We respond within 24 hours
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            We're here to help.
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Questions about which service fits your situation? Reach out — no pressure, no commitment.
          </p>
        </div>
      </section>

      {/* Quick contact badges */}
      <div className="bg-card border-b py-5">
        <div className="container max-w-5xl">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="sms:7070631370" className="flex items-center gap-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              (707) 063-1370 · Text only
            </a>
            <a href="mailto:choicecreditandrentalsolutions@gmail.com" className="flex items-center gap-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              choicecreditandrentalsolutions@gmail.com
            </a>
            <span className="flex items-center gap-2.5 text-sm text-foreground/60">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              Mon–Sat, 9AM–7PM EST
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-16 md:py-24 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: info + trust */}
          <div>
            <ScrollReveal direction="left">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Whether you have questions about a specific service, want to understand your options before booking, or just need to talk through your situation — we're here.
              </p>
            </ScrollReveal>

            <div className="space-y-6">
              {[
                {
                  icon: <Phone className="w-5 h-5 text-primary" />,
                  title: "Text (no calls)",
                  sub: "Mon–Sat from 9AM to 7PM EST",
                  value: "(707) 063-1370",
                  href: "sms:7070631370",
                },
                {
                  icon: <Mail className="w-5 h-5 text-primary" />,
                  title: "Email",
                  sub: "We respond within 24 hours",
                  value: "choicecreditandrentalsolutions@gmail.com",
                  href: "mailto:choicecreditandrentalsolutions@gmail.com",
                },
                {
                  icon: <MessageCircle className="w-5 h-5 text-primary" />,
                  title: "Text / SMS",
                  sub: "Fastest way to reach us",
                  value: "Text (707) 063-1370",
                  href: "sms:7070631370",
                },
                {
                  icon: <MapPin className="w-5 h-5 text-primary" />,
                  title: "Office",
                  sub: "By appointment only",
                  value: "100 Financial District Blvd, Suite 300, New York, NY 10005",
                  href: undefined,
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 80} direction="left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-primary hover:underline mt-1 block text-sm">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium mt-1 text-sm text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Trust points */}
            <ScrollReveal delay={400} direction="left">
              <div className="mt-10 bg-primary/5 border border-primary/15 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Why people contact us first</h3>
                <ul className="space-y-3">
                  {[
                    "Free to ask questions — no obligation to purchase",
                    "Real advisors, not chatbots or call centers",
                    "We'll tell you honestly if we can help",
                    "All information shared is 100% confidential",
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t">
                  <p className="text-sm text-muted-foreground">
                    Ready to move forward?{" "}
                    <Link href="/book" className="text-primary font-semibold hover:underline">
                      Book a free consultation →
                    </Link>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: form */}
          <ScrollReveal direction="right">
            <Card className="shadow-xl border-t-4 border-t-primary">
              <CardHeader className="bg-muted/40 border-b">
                <CardTitle className="text-xl">Send a Message</CardTitle>
                <CardDescription>Fill out the form and we'll respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    <div className="grid md:grid-cols-2 gap-5">
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
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help you? Describe your situation briefly..."
                              className="min-h-[140px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12" disabled={submitContact.isPending}>
                      {submitContact.isPending ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your information is 100% confidential. We never share or sell your data.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </PublicLayout>
  );
}
