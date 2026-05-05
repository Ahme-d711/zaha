import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { dashboardService } from "@/api/dashboard.service";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, Plus, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
  });

  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 border-border/50">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
              <Plus className="w-4 h-4" />
              New Product
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardStats data={stats?.summary} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardCharts 
            revenueData={stats?.charts.monthlyRevenue} 
            categoryData={stats?.charts.ordersByCategory} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DashboardTable orders={stats?.recentOrders} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
