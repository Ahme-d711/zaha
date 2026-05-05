import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { OrderDetailsDialog } from "../components/OrderDetailsDialog";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrderStatusDialog } from "../components/OrderStatusDialog";
import { OrdersTable, type OrdersStatusTab } from "../components/OrdersTable";
import { defaultOrderStatusFormState } from "../components/orders.types";
import { downloadOrdersCsv, printOrdersShippingLabels } from "../utils/order-export";

function buildOrdersQueryParams(
  debouncedSearch: string,
  tab: OrdersStatusTab
): Parameters<typeof dashboardManagementService.getOrders>[0] {
  const params: Parameters<typeof dashboardManagementService.getOrders>[0] = { limit: 50 };
  if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
  if (tab === "processing") params.group = "processing";
  else if (tab === "shipped") params.status = "SHIPPED";
  else if (tab === "delivered") params.status = "DELIVERED";
  else if (tab === "cancelled") params.status = "CANCELLED";
  return params;
}

export const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrdersStatusTab>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState(defaultOrderStatusFormState.status);
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const queryParams = useMemo(
    () => buildOrdersQueryParams(debouncedSearch, statusTab),
    [debouncedSearch, statusTab]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-orders", debouncedSearch, statusTab],
    queryFn: () => dashboardManagementService.getOrders(queryParams),
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
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? "Failed to update status");
    },
  });

  const handleExportCsv = useCallback(() => {
    if (orders.length === 0) {
      toast.message("No orders to export");
      return;
    }
    downloadOrdersCsv(orders);
    toast.success("CSV downloaded");
  }, [orders]);

  const handlePrintLabels = useCallback(() => {
    if (orders.length === 0) {
      toast.message("No orders to print");
      return;
    }
    const ok = printOrdersShippingLabels(orders);
    if (!ok) toast.error("Could not open print window — check popup settings");
  }, [orders]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrdersHeader
          onExportCsv={handleExportCsv}
          onPrintLabels={handlePrintLabels}
          actionsDisabled={isLoading || orders.length === 0}
        />
        <OrdersTable
          orders={orders}
          search={search}
          statusTab={statusTab}
          onStatusTabChange={setStatusTab}
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
