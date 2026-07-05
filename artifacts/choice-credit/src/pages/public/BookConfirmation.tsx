import { Link } from "wouter";
import { CheckCircle, Clock, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

export default function BookConfirmation() {
  return (
    <PublicLayout>
      <section className="py-20 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-5">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            You're Booked!
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Your consultation request has been received. We'll review your information and reach out within{" "}
            <strong className="text-foreground">1 business day</strong> to confirm your appointment.
          </p>

          {/* Next steps */}
          <div className="grid gap-4 mb-10 text-left">
            <h2 className="text-xl font-semibold text-center text-foreground mb-2">What happens next?</h2>

            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardContent className="flex items-start gap-4 pt-5">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">
                    A confirmation email is on its way. Check your spam folder if you don't see it within a few minutes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardContent className="flex items-start gap-4 pt-5">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">We'll reach out within 24 hours</p>
                  <p className="text-sm text-muted-foreground">
                    An advisor will contact you at your preferred time to discuss your situation and next steps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardContent className="flex items-start gap-4 pt-5">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Have questions in the meantime?</p>
                  <p className="text-sm text-muted-foreground">
                    Reach us anytime through our{" "}
                    <Link href="/contact" className="text-primary underline underline-offset-2">
                      contact page
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/services">
                Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
