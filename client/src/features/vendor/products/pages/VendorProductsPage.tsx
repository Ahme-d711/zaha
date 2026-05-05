import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@/api/vendor.service";
import { ProductsHeader } from "@/features/dashboard/products/components/ProductsHeader";
import { ProductsTable } from "@/features/dashboard/products/components/ProductsTable";
import { ProductDetailsDialog } from "@/features/dashboard/products/components/ProductDetailsDialog";
import { dashboardManagementService } from "@/api/dashboard-management.service";

export const VendorProductsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-products", search],
    queryFn: () => vendorService.getProducts(),
  });

  const selectedProductQuery = useQuery({
    queryKey: ["dashboard-product", selectedProductId],
    queryFn: () => dashboardManagementService.getProductById(selectedProductId as string),
    enabled: !!selectedProductId,
  });

  const products = data?.data?.products ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProductsHeader onAddClick={() => {}} />
        <ProductsTable
          products={products}
          search={search}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={(id) => {
            setSelectedProductId(id);
            setViewOpen(true);
          }}
          onEdit={() => {}}
        />
      </div>

      <ProductDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedProductQuery.isLoading}
        product={selectedProductQuery.data?.data.product}
      />
    </DashboardLayout>
  );
};
