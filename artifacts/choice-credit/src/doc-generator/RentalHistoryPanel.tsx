import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Home, MapPin } from "lucide-react";
import { format } from "date-fns";
import type { RentalHistoryEntry, RentalHistoryInsert } from "./types";
import {
  insertRentalHistoryEntry,
  updateRentalHistoryEntry,
  deleteRentalHistoryEntry,
} from "./supabase-queries";

const EMPTY_FORM: Omit<RentalHistoryInsert, "client_id"> = {
  address: "",
  city: "",
  state: "GA",
  zip_code: "",
  move_in_date: "",
  move_out_date: "",
  is_current: false,
  monthly_rent: undefined,
  landlord_name: "",
  landlord_phone: "",
  landlord_email: "",
  reason_for_leaving: "",
  payment_history: "good",
  had_eviction: false,
  eviction_explanation: "",
  notes: "",
};

const paymentOptions = [
  { value: "excellent", label: "Excellent — No late payments" },
  { value: "good", label: "Good — Rare late payments" },
  { value: "fair", label: "Fair — Occasional late payments" },
  { value: "poor", label: "Poor — Frequent late payments" },
];

const paymentColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
};

interface Props {
  clientId: string;
  entries: RentalHistoryEntry[];
  onEntriesChange: (entries: RentalHistoryEntry[]) => void;
  loading?: boolean;
}

export default function RentalHistoryPanel({ clientId, entries, onEntriesChange, loading }: Props) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RentalHistoryEntry | null>(null);
  const [form, setForm] = useState<Omit<RentalHistoryInsert, "client_id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openAdd() {
    setEditingEntry(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(entry: RentalHistoryEntry) {
    setEditingEntry(entry);
    setForm({
      address: entry.address,
      city: entry.city,
      state: entry.state,
      zip_code: entry.zip_code ?? "",
      move_in_date: entry.move_in_date,
      move_out_date: entry.move_out_date ?? "",
      is_current: entry.is_current,
      monthly_rent: entry.monthly_rent ?? undefined,
      landlord_name: entry.landlord_name ?? "",
      landlord_phone: entry.landlord_phone ?? "",
      landlord_email: entry.landlord_email ?? "",
      reason_for_leaving: entry.reason_for_leaving ?? "",
      payment_history: entry.payment_history,
      had_eviction: entry.had_eviction,
      eviction_explanation: entry.eviction_explanation ?? "",
      notes: entry.notes ?? "",
    });
    setDialogOpen(true);
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.address || !form.city || !form.move_in_date) {
      toast({ title: "Required fields missing", description: "Address, city, and move-in date are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload: RentalHistoryInsert = {
        ...form,
        client_id: clientId,
        zip_code: form.zip_code || undefined,
        move_out_date: form.is_current ? undefined : (form.move_out_date || undefined),
        monthly_rent: form.monthly_rent || undefined,
        landlord_name: form.landlord_name || undefined,
        landlord_phone: form.landlord_phone || undefined,
        landlord_email: form.landlord_email || undefined,
        reason_for_leaving: form.reason_for_leaving || undefined,
        eviction_explanation: form.had_eviction ? (form.eviction_explanation || undefined) : undefined,
        notes: form.notes || undefined,
      };

      if (editingEntry) {
        const updated = await updateRentalHistoryEntry(editingEntry.id, payload);
        onEntriesChange(entries.map((e) => (e.id === updated.id ? updated : e)));
        toast({ title: "Entry updated" });
      } else {
        const created = await insertRentalHistoryEntry(payload);
        onEntriesChange([created, ...entries]);
        toast({ title: "Entry added" });
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      toast({
        title: "Error saving entry",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRentalHistoryEntry(id);
      onEntriesChange(entries.filter((e) => e.id !== id));
      toast({ title: "Entry deleted" });
    } catch (err: unknown) {
      toast({
        title: "Error deleting entry",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.move_in_date).getTime() - new Date(a.move_in_date).getTime()
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Rental History</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {entries.length} {entries.length === 1 ? "address" : "addresses"} on record
              </CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-10 px-6 border-t">
              <Home className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No rental history recorded.</p>
              <p className="text-xs text-muted-foreground mt-1">Add addresses to enable the Rental History Report.</p>
            </div>
          ) : (
            <div className="divide-y border-t">
              {sorted.map((entry) => {
                const moveIn = (() => { try { return format(new Date(entry.move_in_date), "MMM yyyy"); } catch { return entry.move_in_date; } })();
                const moveOut = entry.is_current ? "Present" : entry.move_out_date ? (() => { try { return format(new Date(entry.move_out_date), "MMM yyyy"); } catch { return entry.move_out_date; } })() : "—";

                return (
                  <div key={entry.id} className="px-4 py-3 flex items-start gap-3 group hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {entry.address}, {entry.city}, {entry.state}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {moveIn} – {moveOut}
                        {entry.monthly_rent ? ` · $${entry.monthly_rent.toLocaleString()}/mo` : ""}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${paymentColors[entry.payment_history] ?? ""}`}>
                          {entry.payment_history}
                        </span>
                        {entry.had_eviction && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-800">
                            eviction
                          </span>
                        )}
                        {entry.is_current && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-green-100 text-green-800">
                            current
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(entry)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(entry.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Rental Address" : "Add Rental Address"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Address */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label>Street Address *</Label>
                <Input value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="123 Oak Street" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Label>City *</Label>
                  <Input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Atlanta" />
                </div>
                <div>
                  <Label>State</Label>
                  <Input value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder="GA" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>ZIP Code</Label>
                  <Input value={form.zip_code ?? ""} onChange={(e) => setField("zip_code", e.target.value)} placeholder="30301" />
                </div>
                <div>
                  <Label>Monthly Rent ($)</Label>
                  <Input type="number" value={form.monthly_rent ?? ""} onChange={(e) => setField("monthly_rent", e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="1200" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Move-in Date *</Label>
                <Input type="date" value={form.move_in_date} onChange={(e) => setField("move_in_date", e.target.value)} />
              </div>
              <div>
                <Label>Move-out Date</Label>
                <Input type="date" value={form.move_out_date ?? ""} onChange={(e) => setField("move_out_date", e.target.value)} disabled={form.is_current} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_current} onCheckedChange={(v) => setField("is_current", v)} />
              <Label>Current address</Label>
            </div>

            {/* Landlord */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label>Landlord / Property Manager Name</Label>
                <Input value={form.landlord_name ?? ""} onChange={(e) => setField("landlord_name", e.target.value)} placeholder="James Wilson or ABC Property Mgmt" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Landlord Phone</Label>
                  <Input value={form.landlord_phone ?? ""} onChange={(e) => setField("landlord_phone", e.target.value)} placeholder="(404) 555-0100" />
                </div>
                <div>
                  <Label>Landlord Email</Label>
                  <Input value={form.landlord_email ?? ""} onChange={(e) => setField("landlord_email", e.target.value)} placeholder="landlord@email.com" />
                </div>
              </div>
            </div>

            {/* Reason & Payment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Reason for Leaving</Label>
                <Input value={form.reason_for_leaving ?? ""} onChange={(e) => setField("reason_for_leaving", e.target.value)} placeholder="Job relocation, unit sold..." />
              </div>
              <div>
                <Label>Payment History</Label>
                <Select value={form.payment_history} onValueChange={(v) => setField("payment_history", v as RentalHistoryInsert["payment_history"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Eviction */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Switch checked={form.had_eviction} onCheckedChange={(v) => setField("had_eviction", v)} />
                <Label>There was an eviction at this address</Label>
              </div>
              {form.had_eviction && (
                <div>
                  <Label>Eviction Explanation</Label>
                  <Textarea
                    value={form.eviction_explanation ?? ""}
                    onChange={(e) => setField("eviction_explanation", e.target.value)}
                    placeholder="Brief explanation of the circumstances..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label>Advisor Notes (optional)</Label>
              <Textarea value={form.notes ?? ""} onChange={(e) => setField("notes", e.target.value)} placeholder="Any additional context..." rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Entry"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this rental history entry. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
