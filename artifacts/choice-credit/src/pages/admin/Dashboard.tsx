import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Users, UserPlus, FileText, DollarSign, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetAdminDashboard();

  const statCards = [
    { title: "Total Clients", value: stats?.totalClients, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Cases", value: stats?.activeClients, icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "New Leads", value: stats?.newLeads, icon: UserPlus, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Pending Docs", value: stats?.pendingDocuments, icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of firm performance and activities.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent activity.</div>
            ) : (
              <div className="space-y-6">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Revenue Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expected Revenue</p>
                  <div className="text-3xl font-bold font-mono">
                    ${stats?.totalRevenue?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Collected Revenue</p>
                  <div className="text-2xl font-bold font-mono text-green-600">
                    ${stats?.paidRevenue?.toLocaleString()}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${(stats?.paidRevenue || 0) / (stats?.totalRevenue || 1) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Collected</span>
                    <span>Expected</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
