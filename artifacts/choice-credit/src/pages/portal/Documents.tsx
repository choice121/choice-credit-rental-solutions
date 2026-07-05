import { useState } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useListMyDocuments, useUploadDocument } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Documents() {
  const { data: documents, isLoading, refetch } = useListMyDocuments();
  const uploadDocument = useUploadDocument();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      uploadDocument.mutate({
        data: {
          name: file.name,
          fileType: file.type,
          fileUrl: `https://fake-storage.com/${file.name}`
        }
      }, {
        onSuccess: () => {
          toast({
            title: "Document Uploaded",
            description: "Your document has been submitted for review."
          });
          refetch();
          setIsUploading(false);
          // Reset input
          if (e.target) e.target.value = '';
        },
        onError: () => {
          toast({
            title: "Upload Failed",
            description: "There was an error uploading your document.",
            variant: "destructive"
          });
          setIsUploading(false);
        }
      });
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'reviewing': return <Clock className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'reviewing': return <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">Reviewing</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <PortalLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-2">Upload and track required documents for your case.</p>
        </div>
        <div>
          <div className="relative">
            <Input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button disabled={isUploading} className="w-full md:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>Documents you have submitted</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
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
              {documents.map(doc => (
                <div key={doc.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium truncate">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                      </p>
                      {doc.advisorNotes && (
                        <p className="text-sm mt-1 text-muted-foreground bg-muted p-2 rounded">
                          <span className="font-semibold">Note:</span> {doc.advisorNotes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
