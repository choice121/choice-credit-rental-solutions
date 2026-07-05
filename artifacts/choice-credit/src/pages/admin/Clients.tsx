import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useListAdminClients } from "@workspace/api-client-react";
import { Search, ChevronRight, User } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Clients() {
  const [search, setSearch] = useState("");
  const { data: clients, isLoading } = useListAdminClients({ search });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2">Manage all active and past clients.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Package</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 bg-muted rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4 hidden md:table-cell"><div className="h-6 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-muted rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : !clients || clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{client.fullName}</div>
                            <div className="text-xs text-muted-foreground">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={client.caseStatus === 'approved' ? 'default' : 'secondary'}>
                          {client.caseStatus ? client.caseStatus.replace('_', ' ') : 'No Case'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{client.packageName || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                        {format(new Date(client.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
