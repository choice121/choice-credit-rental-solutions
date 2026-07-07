import { useState, useEffect } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListMyDocuments, useUploadDocument } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, Download, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { GeneratedDocument } from "@/doc-generator/types";

// ── Fetch generated documents via Supabase directly ──────────
async function fetchMyGeneratedDocs(userId: string): Promise<GeneratedDocument[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("generated_documents")
    .select("*")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load generated documents:", error.message);
    return [];
  }
  return (data ?? []) as GeneratedDocument[];
}

const docTypeLabels: Record<string, string> = {
  rental_history_report: "Rental History Report",
  advisor_cover_letter: "Advisor Cover Letter",
  client_personal_statement: "Personal Statement",
  eviction_explanation: "Eviction Explanation",
  income_verification: "Income Verification",
  credit_progress_report: "Credit Progress Report",
  character_reference_template: "Character Reference",
  rental_app_cover_letter: "Rental App Cover Letter",
  criminal_history_letter: "Criminal History Letter",
  credit_dispute_letter: "Credit Dispute Letter",
  debt_validation_letter: "Debt Validation Letter",
  goodwill_deletion_request: "Goodwill Deletion Request",
  housing_voucher_letter: "Housing Voucher Letter",
};

const docTypeEmoji: Record<string, string> = {
  rental_history_report: "🏠",
  advisor_cover_letter: "✉️",
  client_personal_statement: "📝",
  eviction_explanation: "⚖️",
  income_verification: "💰",
  credit_progress_report: "📈",
  character_reference_template: "🤝",
  rental_app_cover_letter: "📋",
  criminal_history_letter: "📖",
  credit_dispute_letter: "🏦",
  debt_validation_letter: "🔍",
  goodwill_deletion_request: "🙏",
  housing_voucher_letter: "🏡",
};

export default function Documents() {
  const { data: documents, isLoading, refetch } = useListMyDocuments();
  const uploadDocument = useUploadDocument();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Generated documents
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);
  const [generatedLoading, setGeneratedLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setGeneratedLoading(true);
    fetchMyGeneratedDocs(user.id)
      .then(setGeneratedDocs)
      .finally(() => setGeneratedLoading(false));
  }, [user?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      toast({
        title: "Storage not configured",
        description: "File uploads require Supabase to be configured. Contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${user?.id ?? "anon"}/${Date.now()}-${safeFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: false, contentType: file.type || "application/octet-stream" });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(uploadData.path);

      uploadDocument.mutate(
        { data: { name: file.name, fileType: file.type || "application/octet-stream", fileUrl: publicUrl } },
        {
          onSuccess: () => {
            toast({ title: "Document Uploaded", description: "Your document has been submitted for review." });
            refetch();
            setIsUploading(false);
            if (e.target) e.target.value = "";
          },
          onError: () => {
            toast({ title: "Upload Failed", description: "There was an error saving your document record.", variant: "destructive" });
            setIsUploading(false);
          },
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      toast({ title: "Upload Failed", description: msg, variant: "destructive" });
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "rejected": return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "reviewing": return <Clock className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      case "reviewing": return <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">Reviewing</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <PortalLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-2">Upload files and access documents prepared by your advisor.</p>
        </div>
        <div className="relative">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
          />
          <Button disabled={isUploading} className="w-full md:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generated">
        <TabsList className="mb-6">
          <TabsTrigger value="generated" className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Prepared for You
            {generatedDocs.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">{generatedDocs.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="uploaded" className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            My Uploads
            {documents && documents.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">{documents.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Generated Documents Tab */}
        <TabsContent value="generated">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Documents Prepared by Your Advisor</CardTitle>
              <CardDescription>
                Letters, reports, and other documents generated by your advisor to support your rental applications and credit improvement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : generatedDocs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <h3 className="font-semibold text-lg mb-1">No prepared documents yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Your advisor will generate rental letters, credit reports, and other documents here as your case progresses.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {generatedDocs.map((doc) => (
                    <div key={doc.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0 text-lg">
                          {docTypeEmoji[doc.document_type] ?? "📄"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate text-foreground">
                            {doc.document_name}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {docTypeLabels[doc.document_type] ?? doc.document_type} · Prepared {format(new Date(doc.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                          Ready
                        </Badge>
                        {doc.file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={doc.file_url} target="_blank" rel="noreferrer">
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Uploaded Documents Tab */}
        <TabsContent value="uploaded">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Your Uploaded Files</CardTitle>
              <CardDescription>Documents you have submitted for review.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : !documents || documents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold text-lg mb-1">No documents yet</h3>
                  <p className="text-muted-foreground">Upload your first document to get started.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {documents.map((doc: { id: string; name: string; fileUrl: string; uploadedAt: string; status: string; advisorNotes?: string }) => (
                    <div key={doc.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium truncate hover:underline text-foreground block"
                          >
                            {doc.name}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                          </p>
                          {doc.advisorNotes && (
                            <p className="text-sm mt-1 text-muted-foreground bg-muted p-2 rounded">
                              <span className="font-semibold">Note:</span> {doc.advisorNotes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {getStatusIcon(doc.status)}
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalLayout>
  );
}
