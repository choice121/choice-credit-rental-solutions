import { useState, useEffect, useCallback } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useListAdminClients } from "@workspace/api-client-react";
import type { AdminClient } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  Search, Download, FileText, ChevronRight, User,
  Settings, BookOpen, Home,
} from "lucide-react";
import RentalHistoryPanel from "./RentalHistoryPanel";
import { fetchRentalHistory, saveGeneratedDocument } from "./supabase-queries";
import {
  DOC_FIELDS,
  DOCUMENT_TEMPLATES,
  CATEGORY_LABELS,
  DEFAULT_ADVISOR,
  getDefaultFormData,
  getDocumentComponent,
  getDocumentFileName,
} from "./templates/index";
import type { RentalHistoryEntry, AdvisorInfo, DocumentTypeId, DocumentTemplate } from "./types";

const CATEGORY_ORDER: DocumentTemplate["category"][] = [
  "rental_package",
  "explanation",
  "support",
  "credit",
];

export default function DocumentGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Client selection
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const { data: clients, isLoading: clientsLoading } = useListAdminClients({ search });

  // Rental history
  const [rentalHistory, setRentalHistory] = useState<RentalHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Document generation
  const [selectedDocType, setSelectedDocType] = useState<DocumentTypeId | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [advisorInfo, setAdvisorInfo] = useState<AdvisorInfo>(DEFAULT_ADVISOR);
  const [saving, setSaving] = useState(false);

  // Load rental history when client changes
  useEffect(() => {
    if (!selectedClient) { setRentalHistory([]); return; }
    setHistoryLoading(true);
    fetchRentalHistory(selectedClient.id)
      .then(setRentalHistory)
      .catch((err) => console.error("Failed to load rental history:", err))
      .finally(() => setHistoryLoading(false));
  }, [selectedClient?.id]);

  // Pre-fill form when doc type or client changes
  useEffect(() => {
    if (!selectedClient || !selectedDocType) return;
    setFormData(getDefaultFormData(selectedDocType, selectedClient, rentalHistory));
  }, [selectedDocType, selectedClient?.id]);

  const handleSelectClient = useCallback((client: AdminClient) => {
    setSelectedClient(client);
    setSelectedDocType(null);
    setFormData({});
  }, []);

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveToProfile = async () => {
    if (!selectedClient || !selectedDocType) return;
    setSaving(true);
    const template = DOCUMENT_TEMPLATES.find((t) => t.id === selectedDocType);
    try {
      await saveGeneratedDocument({
        client_id: selectedClient.id,
        document_type: selectedDocType,
        document_name: template?.name ?? selectedDocType,
        data_snapshot: { formData, advisorInfo } as Record<string, unknown>,
        created_by: user?.id,
      });
      toast({ title: "Saved to client profile", description: `${template?.name} has been saved to ${selectedClient.fullName}'s documents.` });
    } catch (err: unknown) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const fields = selectedDocType ? DOC_FIELDS[selectedDocType] : [];
  const generationDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const selectedTemplate = DOCUMENT_TEMPLATES.find((t) => t.id === selectedDocType);

  const pdfDocument =
    selectedClient && selectedDocType
      ? getDocumentComponent(selectedDocType, selectedClient, rentalHistory, advisorInfo, formData, generationDate)
      : null;

  const fileName = selectedClient && selectedDocType
    ? getDocumentFileName(selectedDocType, selectedClient.fullName)
    : "document.pdf";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Document Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate professional PDF documents for client rental applications and credit work.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Panel: Client + Rental History + Advisor ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Tabs defaultValue="clients">
            <TabsList className="w-full">
              <TabsTrigger value="clients" className="flex-1">
                <User className="w-3.5 h-3.5 mr-1.5" />
                Client
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1" disabled={!selectedClient}>
                <Home className="w-3.5 h-3.5 mr-1.5" />
                History
              </TabsTrigger>
              <TabsTrigger value="advisor" className="flex-1">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Advisor
              </TabsTrigger>
            </TabsList>

            {/* Client Tab */}
            <TabsContent value="clients" className="mt-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {clientsLoading ? (
                    <div className="p-4 space-y-2">
                      {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />)}
                    </div>
                  ) : !clients?.length ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">No clients found.</div>
                  ) : (
                    <div className="divide-y max-h-96 overflow-y-auto">
                      {clients.map((client: { id: string; email: string; fullName: string; phone?: string | null }) => (
                        <button
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between gap-2 ${selectedClient?.id === client.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{client.fullName}</div>
                            <div className="text-xs text-muted-foreground truncate">{client.email}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedClient && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-0.5">Selected Client</div>
                  <div className="font-semibold text-sm">{selectedClient.fullName}</div>
                  <div className="text-xs text-muted-foreground">{selectedClient.email}</div>
                </div>
              )}
            </TabsContent>

            {/* Rental History Tab */}
            <TabsContent value="history" className="mt-3">
              {selectedClient ? (
                <RentalHistoryPanel
                  clientId={selectedClient.id}
                  entries={rentalHistory}
                  onEntriesChange={setRentalHistory}
                  loading={historyLoading}
                />
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">Select a client first.</div>
              )}
            </TabsContent>

            {/* Advisor Info Tab */}
            <TabsContent value="advisor" className="mt-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Advisor Information</CardTitle>
                  <CardDescription className="text-xs">Appears on all letters and reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(["name", "title", "company", "phone", "email", "address"] as const).map((key) => (
                    <div key={key}>
                      <Label className="capitalize text-xs">{key}</Label>
                      <Input
                        value={advisorInfo[key]}
                        onChange={(e) => setAdvisorInfo((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Right Panel: Document Type + Form + Download ── */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {!selectedClient ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-xl text-muted-foreground">
              <FileText className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">Select a client to get started</p>
              <p className="text-sm mt-1">Choose a client from the left panel to generate documents.</p>
            </div>
          ) : (
            <>
              {/* Document Type Selector */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Select Document Type
                </h2>
                <div className="space-y-4">
                  {CATEGORY_ORDER.map((category) => {
                    const templates = DOCUMENT_TEMPLATES.filter((t) => t.category === category);
                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                            {CATEGORY_LABELS[category]}
                          </span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {templates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => setSelectedDocType(template.id)}
                              className={`text-left p-3 rounded-lg border transition-all hover:border-primary/50 hover:bg-primary/5 ${
                                selectedDocType === template.id
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{template.emoji}</span>
                                <span className="font-medium text-sm leading-tight">{template.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Fields */}
              {selectedDocType && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedTemplate?.emoji}</span>
                      <div>
                        <CardTitle className="text-base">{selectedTemplate?.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Pre-filled from {selectedClient.fullName}'s profile. Review and adjust before downloading.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No additional fields needed. This document is fully generated from client data.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map((field) => {
                          const value = formData[field.key] ?? "";
                          const isFullWidth = field.type === "textarea" || (fields.length % 2 === 1 && fields.indexOf(field) === fields.length - 1);

                          const input = (() => {
                            if (field.type === "textarea") {
                              return (
                                <Textarea
                                  value={value}
                                  onChange={(e) => handleFormChange(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  rows={field.rows ?? 3}
                                  className="text-sm"
                                />
                              );
                            }
                            if (field.type === "select" && field.options) {
                              return (
                                <Select value={value} onValueChange={(v) => handleFormChange(field.key, v)}>
                                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }
                            return (
                              <Input
                                type={field.type}
                                value={value}
                                onChange={(e) => handleFormChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="h-9 text-sm"
                              />
                            );
                          })();

                          return (
                            <div key={field.key} className={isFullWidth ? "sm:col-span-2" : ""}>
                              <Label className="text-xs mb-1.5 block">
                                {field.label}
                                {field.required && <span className="text-destructive ml-1">*</span>}
                              </Label>
                              {input}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <Separator className="my-4" />

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {pdfDocument && (
                        <PDFDownloadLink
                          document={pdfDocument as React.ReactElement<DocumentProps>}
                          fileName={fileName}
                          className="flex-1"
                        >
                          {({ loading: pdfLoading }) => (
                            <Button className="w-full" disabled={pdfLoading}>
                              <Download className="w-4 h-4 mr-2" />
                              {pdfLoading ? "Generating PDF..." : "Download PDF"}
                            </Button>
                          )}
                        </PDFDownloadLink>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleSaveToProfile}
                        disabled={saving || !pdfDocument}
                        className="flex-1 sm:flex-none"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save to Client Profile"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      "Save to Client Profile" lets the client see this document in their portal.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
