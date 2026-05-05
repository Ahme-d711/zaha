import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { OrderDetailsDialog } from "../components/OrderDetailsDialog";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrderStatusDialog } from "../components/OrderStatusDialog";
import { OrdersTable } from "../components/OrdersTable";
import { defaultOrderStatusFormState } from "../components/orders.types";

export const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState(defaultOrderStatusFormState.status);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-orders", search],
    queryFn: () => dashboardManagementService.getOrders({ search, limit: 50 }),
  });
  const orders = data?.data?.orders ?? [];

  const selectedOrderQuery = useQuery({
    queryKey: ["dashboard-order", selectedOrderId],
    queryFn: () => dashboardManagementService.getOrderById(selectedOrderId as string),
    enabled: !!selectedOrderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      dashboardManagementService.updateOrderStatus(id, value),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-order", selectedOrderId] });
      }
    },
  });

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
          onEdit={(id, currentStatus) => {
            setSelectedOrderId(id);
            setStatus(currentStatus);
            setEditOpen(true);
          }}
        />
      </div>

      <OrderDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedOrderQuery.isLoading}
        order={selectedOrderQuery.data?.data.order}
      />

      <OrderStatusDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        status={status}
        onStatusChange={setStatus}
        isSubmitting={updateStatusMutation.isPending}
        onSubmit={() =>
          selectedOrderId && updateStatusMutation.mutate({ id: selectedOrderId, value: status })
        }
      />
    </DashboardLayout>
  );
};
