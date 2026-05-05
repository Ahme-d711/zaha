import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats as StatsData } from "@/api/dashboard.service";

interface DashboardChartsProps {
  revenueData?: StatsData["charts"]["dailyRevenue"];
  categoryData?: StatsData["charts"]["ordersByCategory"];
}

/** Chart label for a YYYY-MM-DD key (UTC) — weekday + day number */
function formatDayLabel(dateKey: string) {
  const d = new Date(`${dateKey}T12:00:00.000Z`);
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

export const DashboardCharts = ({ revenueData, categoryData }: DashboardChartsProps) => {
  const formattedRevenue =
    revenueData?.map((item) => ({
      name: formatDayLabel(item.date),
      value: item.revenue,
      date: item.date,
    })) || [];

  const formattedCategories =
    categoryData?.map((item) => ({
      name: item.nameEn || item.nameAr || "—",
      value: item.value,
    })) || [];

  const COLORS = ["#D4AF37", "#1A1A1A", "#71717A", "#A1A1AA", "#22C55E", "#3B82F6"];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-playfair tracking-tight">Revenue Overview</CardTitle>
          <CardDescription>Last 7 days · delivered orders · daily totals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedRevenue}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#888", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#888", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
                  }} 
                  formatter={(value: number) => [`${value}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-playfair tracking-tight">Sales by Category</CardTitle>
          <CardDescription>
            Delivered orders · counts each order line toward its product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedCategories} margin={{ bottom: 8, left: 8, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.45} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  dy={10}
                  interval={0}
                  angle={formattedCategories.length > 4 ? -20 : 0}
                  textAnchor={formattedCategories.length > 4 ? "end" : "middle"}
                  height={formattedCategories.length > 4 ? 56 : 32}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderRadius: "12px", 
                    border: "1px solid hsl(var(--border))", 
                    color: "hsl(var(--foreground))",
                  }} 
                  formatter={(value: number) => [value, "Line items"]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {formattedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
