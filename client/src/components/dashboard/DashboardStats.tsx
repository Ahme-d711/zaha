import React from "react";
import { ArrowUpRight, ArrowDownRight, Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DashboardStats as StatsData } from "@/api/dashboard.service";

interface DashboardStatsProps {
  data?: StatsData["summary"];
}

export const DashboardStats = ({ data }: DashboardStatsProps) => {
  const stats = [
    {
      label: "Total Revenue",
      value: data ? `$${data.totalRevenue.toLocaleString()}` : "$0",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders.toLocaleString() || "0",
      change: "+12.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Customers",
      value: data?.totalUsers.toLocaleString() || "0",
      change: "+3.1%",
      trend: "up",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Total Products",
      value: data?.totalProducts.toLocaleString() || "0",
      change: "+4.5%",
      trend: "up",
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-border/50 hover:border-accent/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={stat.bg + " p-3 rounded-2xl " + stat.color}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-500" : "text-destructive"
                }`}>
                  {stat.change}
                  {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
