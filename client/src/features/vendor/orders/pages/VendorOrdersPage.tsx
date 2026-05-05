import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@/api/vendor.service";
import { OrdersHeader } from "@/features/dashboard/orders/components/OrdersHeader";
import { OrdersTable } from "@/features/dashboard/orders/components/OrdersTable";
import { OrderDetailsDialog } from "@/features/dashboard/orders/components/OrderDetailsDialog";
import { dashboardManagementService } from "@/api/dashboard-management.service";

export const VendorOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-orders", search],
    queryFn: () => vendorService.getOrders(),
  });

  const selectedOrderQuery = useQuery({
    queryKey: ["dashboard-order", selectedOrderId],
    queryFn: () => dashboardManagementService.getOrderById(selectedOrderId as string),
    enabled: !!selectedOrderId,
  });

  const orders = data?.data?.orders ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrdersHeader />
        <OrdersTable
          orders={orders}
          search={search}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={(id) => {
            setSelectedOrderId(id);
            setViewOpen(true);
          }}
          onEdit={() => {}}
        />
      </div>

      <OrderDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedOrderQuery.isLoading}
        order={selectedOrderQuery.data?.data.order}
      />
    </DashboardLayout>
  );
};
