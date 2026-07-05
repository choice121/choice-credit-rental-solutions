import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRevenueOverview } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Revenue() {
  const { data: revenue, isLoading } = useGetRevenueOverview();

  const chartData = revenue?.byPackage?.map(pkg => ({
    name: pkg.packageName,
    total: pkg.total,
    count: pkg.count
  })) || [];

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(199 89% 48%)"];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-2">Financial performance and package breakdown.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Collected</span>
            </div>
            {isLoading ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-4xl font-bold font-mono">
                ${revenue?.paidRevenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Expected / Pending</span>
            </div>
            {isLoading ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-4xl font-bold font-mono text-muted-foreground">
                ${revenue?.pendingRevenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <PieChart className="w-5 h-5" />
              <span className="font-medium">Total Invoices</span>
            </div>
            {isLoading ? <Skeleton className="h-10 w-16" /> : (
              <div className="text-4xl font-bold">
                {revenue?.invoiceCount}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Revenue by Package</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
          ) : chartData.length > 0 ? (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No revenue data available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
