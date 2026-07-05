import { useState } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useListMyInvoices, useSelectPaymentMethod } from "@workspace/api-client-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Receipt } from "lucide-react";
import { PaymentSelectionMethod } from "@workspace/api-client-react";

export default function Billing() {
  const { data: invoices, isLoading, refetch } = useListMyInvoices();
  const selectPaymentMethod = useSelectPaymentMethod();
  const { toast } = useToast();
  
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'cashapp' as PaymentSelectionMethod, name: 'Cash App', color: 'bg-[#00D632] hover:bg-[#00D632]/90 text-white' },
    { id: 'paypal' as PaymentSelectionMethod, name: 'PayPal', color: 'bg-[#00457C] hover:bg-[#00457C]/90 text-white' },
    { id: 'zelle' as PaymentSelectionMethod, name: 'Zelle', color: 'bg-[#7411E3] hover:bg-[#7411E3]/90 text-white' },
    { id: 'applepay' as PaymentSelectionMethod, name: 'Apple Pay', color: 'bg-black hover:bg-black/90 text-white' },
    { id: 'googlepay' as PaymentSelectionMethod, name: 'Google Pay', color: 'bg-white hover:bg-gray-100 text-gray-900 border' },
    { id: 'venmo' as PaymentSelectionMethod, name: 'Venmo', color: 'bg-[#008CFF] hover:bg-[#008CFF]/90 text-white' },
  ];

  const handlePaymentSelect = (method: PaymentSelectionMethod) => {
    if (!selectedInvoice) return;

    selectPaymentMethod.mutate({
      data: { invoiceId: selectedInvoice, method }
    }, {
      onSuccess: (data) => {
        toast({
          title: "Payment Method Selected",
          description: data.message,
        });
        setSelectedInvoice(null);
        refetch();
      }
    });
  };

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-2">Manage your invoices and payments.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and pay your consulting package invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="text-center py-16">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground">No invoices</p>
              <p className="text-sm text-muted-foreground">You do not have any pending invoices.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-lg border gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Receipt className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{invoice.packageName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Issued {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
                      </p>
                      {invoice.paymentMethod && invoice.status === 'pending' && (
                        <p className="text-xs font-medium text-primary mt-1">
                          Payment via {invoice.paymentMethod} requested
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-2xl font-bold font-mono">
                      ${invoice.amount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' : 
                        invoice.status === 'cancelled' ? 'destructive' : 'secondary'
                      } className={invoice.status === 'paid' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                      
                      {invoice.status === 'pending' && (
                        <Button size="sm" onClick={() => setSelectedInvoice(invoice.id)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay. Your advisor will contact you with specific payment details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {paymentMethods.map(method => (
              <Button
                key={method.id}
                className={`h-16 text-lg font-bold shadow-sm ${method.color}`}
                onClick={() => handlePaymentSelect(method.id)}
                disabled={selectPaymentMethod.isPending}
              >
                {method.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
