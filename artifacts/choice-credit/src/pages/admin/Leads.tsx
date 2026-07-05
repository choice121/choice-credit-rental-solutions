import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListLeads, useUpdateLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LeadUpdateStatus } from "@workspace/api-client-react";

export default function Leads() {
  const [filter, setFilter] = useState<string>("all");
  const { data: leads, isLoading, refetch } = useListLeads({ status: filter === "all" ? undefined : filter });
  const updateLead = useUpdateLead();
  const { toast } = useToast();

  const handleStatusUpdate = (id: string, status: string) => {
    updateLead.mutate({
      id,
      data: { status: status as LeadUpdateStatus }
    }, {
      onSuccess: () => {
        toast({ title: "Lead status updated" });
        refetch();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <Badge className="bg-blue-500">New</Badge>;
      case 'contacted': return <Badge variant="secondary">Contacted</Badge>;
      case 'converted': return <Badge className="bg-green-500">Converted</Badge>;
      case 'closed': return <Badge variant="outline">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-2">Manage consultation requests.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1,2,3].map(i => <Card key={i} className="h-48 animate-pulse bg-muted/50" />)
        ) : !leads || leads.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No leads found.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{lead.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{lead.email} • {lead.phone}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-2">
                          {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                        </div>
                        {getStatusBadge(lead.status)}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg text-sm border border-border/50">
                      <span className="font-semibold block mb-1">Situation:</span>
                      {lead.situation}
                    </div>
                    
                    {lead.preferredTime && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Preferred Contact:</span> {lead.preferredTime}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-48 shrink-0 flex flex-col gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Update Status</p>
                    <Select 
                      value={lead.status} 
                      onValueChange={(val) => handleStatusUpdate(lead.id, val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
