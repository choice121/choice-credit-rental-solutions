import { useState } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Home, Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface RentalEntry {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  move_in_date: string;
  move_out_date?: string | null;
  is_current: boolean;
  monthly_rent?: number | null;
  landlord_name?: string | null;
  landlord_phone?: string | null;
  landlord_email?: string | null;
  payment_history?: string | null;
}

const paymentHistoryOptions = [
  { value: "always_on_time", label: "Always on time" },
  { value: "mostly_on_time", label: "Mostly on time" },
  { value: "sometimes_late", label: "Sometimes late" },
  { value: "often_late", label: "Often late" },
];

const emptyForm = {
  address: "",
  city: "",
  state: "",
  zip_code: "",
  move_in_date: "",
  move_out_date: "",
  is_current: false,
  monthly_rent: "",
  landlord_name: "",
  landlord_phone: "",
  landlord_email: "",
  payment_history: "",
};

async function getToken() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export default function RentalHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: entries = [], isLoading } = useQuery<RentalEntry[]>({
    queryKey: ["rental-history"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/me/rental-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch rental history");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const token = await getToken();
      const res = await fetch("/api/me/rental-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save rental history entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-history"] });
      toast({ title: "Entry saved", description: "Rental history entry has been saved." });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save entry. Please try again.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: Record<string, unknown> }) => {
      const token = await getToken();
      const res = await fetch(`/api/me/rental-history/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-history"] });
      toast({ title: "Entry updated" });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update entry.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`/api/me/rental-history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-history"] });
      toast({ title: "Entry deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete entry.", variant: "destructive" });
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (entry: RentalEntry) => {
    setEditingId(entry.id);
    setForm({
      address: entry.address ?? "",
      city: entry.city ?? "",
      state: entry.state ?? "",
      zip_code: entry.zip_code ?? "",
      move_in_date: entry.move_in_date ?? "",
      move_out_date: entry.move_out_date ?? "",
      is_current: entry.is_current ?? false,
      monthly_rent: entry.monthly_rent != null ? String(entry.monthly_rent) : "",
      landlord_name: entry.landlord_name ?? "",
      landlord_phone: entry.landlord_phone ?? "",
      landlord_email: entry.landlord_email ?? "",
      payment_history: entry.payment_history ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !form.move_in_date) {
      toast({ title: "Required fields missing", description: "Address, city, state, and move-in date are required.", variant: "destructive" });
      return;
    }
    const body: Record<string, unknown> = {
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip_code: form.zip_code.trim(),
      move_in_date: form.move_in_date,
      move_out_date: form.is_current ? null : (form.move_out_date || null),
      is_current: form.is_current,
      monthly_rent: form.monthly_rent ? parseFloat(form.monthly_rent) : null,
      landlord_name: form.landlord_name.trim() || null,
      landlord_phone: form.landlord_phone.trim() || null,
      landlord_email: form.landlord_email.trim() || null,
      payment_history: form.payment_history || null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, body });
    } else {
      addMutation.mutate(body);
    }
  };

  const paymentLabel = (val?: string | null) =>
    paymentHistoryOptions.find((o) => o.value === val)?.label ?? val ?? "—";

  return (
    <PortalLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Rental History</h1>
          <p className="text-muted-foreground mt-2">Your residential history for rental applications.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-foreground">No rental history</p>
          <p className="text-sm text-muted-foreground">Add your residential addresses to strengthen rental applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base">{entry.address}</h4>
                        {entry.is_current && (
                          <Badge className="bg-green-500 text-white text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.city}, {entry.state} {entry.zip_code}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.move_in_date ? format(new Date(entry.move_in_date), "MMM yyyy") : "?"}
                        {" — "}
                        {entry.is_current ? "Present" : entry.move_out_date ? format(new Date(entry.move_out_date), "MMM yyyy") : "?"}
                      </p>
                      {entry.monthly_rent != null && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Rent: <span className="font-medium">${entry.monthly_rent.toFixed(2)}/mo</span>
                        </p>
                      )}
                      {(entry.landlord_name || entry.landlord_phone || entry.landlord_email) && (
                        <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                          {entry.landlord_name && <p>Landlord: <span className="font-medium text-foreground">{entry.landlord_name}</span></p>}
                          {entry.landlord_phone && <p>Phone: {entry.landlord_phone}</p>}
                          {entry.landlord_email && <p>Email: {entry.landlord_email}</p>}
                        </div>
                      )}
                      {entry.payment_history && (
                        <p className="text-xs mt-1">
                          Payment history: <span className="font-medium text-foreground">{paymentLabel(entry.payment_history)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openEdit(entry)}>
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(entry.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditingId(null); setForm(emptyForm); } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{editingId ? "Edit Address" : "Add Address"}</DialogTitle>
            <DialogDescription>Enter the details of your rental address.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Atlanta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="GA" maxLength={2} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input id="zip_code" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} placeholder="30301" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="move_in_date">Move-in Date *</Label>
                <Input id="move_in_date" type="date" value={form.move_in_date} onChange={(e) => setForm({ ...form, move_in_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="move_out_date">Move-out Date</Label>
                <Input id="move_out_date" type="date" value={form.move_out_date} onChange={(e) => setForm({ ...form, move_out_date: e.target.value })} disabled={form.is_current} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_current"
                checked={form.is_current}
                onCheckedChange={(checked) => setForm({ ...form, is_current: !!checked, move_out_date: checked ? "" : form.move_out_date })}
              />
              <Label htmlFor="is_current" className="cursor-pointer">This is my current residence</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
              <Input id="monthly_rent" type="number" value={form.monthly_rent} onChange={(e) => setForm({ ...form, monthly_rent: e.target.value })} placeholder="1200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landlord_name">Landlord Name</Label>
              <Input id="landlord_name" value={form.landlord_name} onChange={(e) => setForm({ ...form, landlord_name: e.target.value })} placeholder="John Smith" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="landlord_phone">Landlord Phone</Label>
                <Input id="landlord_phone" value={form.landlord_phone} onChange={(e) => setForm({ ...form, landlord_phone: e.target.value })} placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlord_email">Landlord Email</Label>
                <Input id="landlord_email" type="email" value={form.landlord_email} onChange={(e) => setForm({ ...form, landlord_email: e.target.value })} placeholder="landlord@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_history">Payment History</Label>
              <Select value={form.payment_history} onValueChange={(val) => setForm({ ...form, payment_history: val })}>
                <SelectTrigger id="payment_history">
                  <SelectValue placeholder="Select payment history" />
                </SelectTrigger>
                <SelectContent>
                  {paymentHistoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                {addMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Save Changes" : "Add Entry"}
              </Button>
              <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
