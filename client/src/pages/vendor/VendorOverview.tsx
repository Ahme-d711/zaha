import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { vendorService } from "@/api/vendor.service";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ShoppingCart, Package, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const VendorOverview = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["vendor-stats"],
    queryFn: () => vendorService.getStats(),
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

  // Map vendor stats to the DashboardStats format
  const summaryData = {
    totalProducts: stats?.summary.totalProducts ?? 0,
    totalOrders: stats?.summary.totalOrders ?? 0,
    totalRevenue: stats?.summary.totalRevenue ?? 0,
    newUsersLast30Days: 0, // Not applicable for vendor but keeps UI consistent
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-tight">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your products and orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="flex items-center gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
              <Link to="/vendor/products/new">
                <Plus className="w-4 h-4" />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                   <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                   <DollarSign className="h-4 w-4 text-accent" />
                </div>
                <div className="mt-2">
                   <h3 className="text-2xl font-bold font-playfair">${summaryData.totalRevenue.toLocaleString()}</h3>
                </div>
             </div>
             <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                   <p className="text-sm font-medium text-muted-foreground">My Orders</p>
                   <ShoppingCart className="h-4 w-4 text-accent" />
                </div>
                <div className="mt-2">
                   <h3 className="text-2xl font-bold font-playfair">{summaryData.totalOrders}</h3>
                </div>
             </div>
             <div className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                   <p className="text-sm font-medium text-muted-foreground">My Products</p>
                   <Package className="h-4 w-4 text-accent" />
                </div>
                <div className="mt-2">
                   <h3 className="text-2xl font-bold font-playfair">{summaryData.totalProducts}</h3>
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-playfair">Recent Orders</h2>
            <DashboardTable orders={stats?.recentOrders} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default VendorOverview;
