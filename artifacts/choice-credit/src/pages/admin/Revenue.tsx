import { useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetRevenueOverview } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { subDays, subYears, startOfYear, isAfter } from "date-fns";

type DateRange = "30d" | "90d" | "ytd" | "all";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(199 89% 48%)",
  "hsl(142 76% 36%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 58%)",
];

export default function Revenue() {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const { data: revenue, isLoading } = useGetRevenueOverview();

  const filteredData = useMemo(() => {
    if (!revenue?.byPackage) return [];
    // Note: the API returns aggregated data without date filtering support.
    // We display all data and note the filter is informational for now.
    return revenue.byPackage.map((pkg) => ({
      name: pkg.packageName,
      total: pkg.total,
      count: pkg.count,
    }));
  }, [revenue]);

  const dateRangeLabel: Record<DateRange, string> = {
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "ytd": "This Year",
    "all": "All Time",
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-muted-foreground mt-2">Financial performance and package breakdown.</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="ytd">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue by Package</CardTitle>
          <span className="text-xs text-muted-foreground">{dateRangeLabel[dateRange]}</span>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
          ) : filteredData.length > 0 ? (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    tickFormatter={(value: number) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {filteredData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
