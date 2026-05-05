import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { ProductDetailsDialog } from "../components/ProductDetailsDialog";
import { ProductFormDialog } from "../components/ProductFormDialog";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductsTable } from "../components/ProductsTable";
import {
  ProductFormState,
  defaultProductFormState,
  type DashboardProductFilterTab,
} from "../components/products.types";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const toPayload = (form: ProductFormState, mainImageFile: File | null, galleryFiles: File[], id?: string) => {
  const discountPercentage =
    form.originalPrice > 0 ? Math.round((1 - form.price / form.originalPrice) * 100) : 0;
  const payload = new FormData();

  payload.append("id", id ?? `prod_${Date.now()}`);
  payload.append("name", form.name || form.nameEn);
  payload.append("price", String(form.price));
  payload.append("old_price", String(form.originalPrice));
  payload.append("discount_percentage", String(Math.max(discountPercentage, 0)));
  payload.append("categoryId", form.categoryId);
  payload.append("description", form.descriptionEn.trim() || form.description.trim());
  // Rating and reviews are computed by backend logic.
  payload.append("rating", "0");
  payload.append("reviews_count", "0");
  payload.append("stock", String(form.stock));
  payload.append("is_best_seller", String(form.isBestSeller));
  payload.append("warranty", form.warranty);
  payload.append("returns", form.returns);
  payload.append(
    "features",
    JSON.stringify({
      battery_life: form.batteryLife,
      noise_cancelling: form.noiseCancelling,
      audio: form.audioFeatures.split(",").map((item) => item.trim()).filter(Boolean),
    })
  );
  payload.append(
    "shipping",
    JSON.stringify({
      free_shipping: form.freeShipping,
      condition: form.shippingCondition,
    })
  );
  if (mainImageFile) {
    payload.append(
      "images",
      JSON.stringify({
        main: mainImageFile.name,
        gallery: galleryFiles.map((file) => file.name),
      })
    );
    payload.append("mainImage", mainImageFile);
  }
  galleryFiles.forEach((file) => payload.append("images", file));

  return payload;
};

export const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterTab, setFilterTab] = useState<DashboardProductFilterTab>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string>("");
  const [existingGalleryImageUrls, setExistingGalleryImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState<ProductFormState>(defaultProductFormState);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productIdPendingDelete, setProductIdPendingDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const productsQueryParams = useMemo(() => {
    const p: Parameters<typeof dashboardManagementService.getProducts>[0] = {
      limit: 50,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(categoryFilter ? { categoryId: categoryFilter } : {}),
    };
    if (filterTab === "bestseller") p.is_best_seller = true;
    if (filterTab === "in_stock") p.stockGte = 1;
    if (filterTab === "out_of_stock") p.stock = 0;
    return p;
  }, [debouncedSearch, filterTab, categoryFilter]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-products", debouncedSearch, filterTab, categoryFilter],
    queryFn: () => dashboardManagementService.getProducts(productsQueryParams),
  });
  const categoriesQuery = useQuery({
    queryKey: ["dashboard-product-categories"],
    queryFn: () => dashboardManagementService.getCategories({ limit: 50 }),
  });
  const selectedProductQuery = useQuery({
    queryKey: ["dashboard-product", selectedProductId],
    queryFn: () => dashboardManagementService.getProductById(selectedProductId as string),
    enabled: !!selectedProductId,
  });
  const createProductMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createProduct(payload),
    onSuccess: () => {
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
  });
  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateProduct(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      if (selectedProductId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-product", selectedProductId] });
      }
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => dashboardManagementService.deleteProduct(id),
    onSuccess: (_data, deletedId) => {
      toast.success("Product deleted successfully");
      setDeleteConfirmOpen(false);
      setProductIdPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      queryClient.removeQueries({ queryKey: ["dashboard-product", deletedId] });
      if (selectedProductId === deletedId) {
        setViewOpen(false);
        setEditOpen(false);
        setSelectedProductId(null);
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? "Failed to delete product");
    },
  });

  const handleDeleteProduct = (id: string) => {
    setProductIdPendingDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productIdPendingDelete) {
      deleteProductMutation.mutate(productIdPendingDelete);
    }
  };

  const products = data?.data?.products ?? [];
  const categories = categoriesQuery.data?.data?.categories ?? [];

  const getCategoryLabel = (
    categoryId?: string | { _id?: string; name?: string; nameEn?: string }
  ) => {
    if (!categoryId) return "-";
    if (typeof categoryId !== "string") {
      return categoryId.name ?? categoryId.nameEn ?? "-";
    }
    const matchedCategory = categories.find((category) => category._id === categoryId) as
      | { name?: string; nameEn?: string }
      | undefined;
    return matchedCategory?.name ?? matchedCategory?.nameEn ?? "-";
  };

  const openViewDialog = (id: string) => {
    setSelectedProductId(id);
    setViewOpen(true);
  };

  const openEditDialog = async (id: string) => {
    setSelectedProductId(id);
    setEditOpen(true);

    try {
      const response = await dashboardManagementService.getProductById(id);
      const product = response?.data?.product as {
        name?: string;
        nameEn?: string;
        nameAr?: string;
        price?: number;
        old_price?: number;
        stock?: number;
        is_best_seller?: boolean;
        categoryId?: string | { _id?: string };
        features?: {
          battery_life?: string;
          noise_cancelling?: boolean;
          audio?: string[];
        };
        shipping?: {
          free_shipping?: boolean;
          condition?: string;
        };
        warranty?: string;
        returns?: string;
        images?: {
          main?: string;
          gallery?: string[];
        };
        description?: string;
        descriptionEn?: string;
        descriptionAr?: string;
      };

      const resolvedCategoryId =
        typeof product?.categoryId === "string"
          ? product.categoryId
          : product?.categoryId?._id ?? "";

      const desc =
        product?.descriptionEn?.trim() ||
        product?.description?.trim() ||
        product?.descriptionAr?.trim() ||
        "";

      setForm({
        ...defaultProductFormState,
        name: product?.name ?? product?.nameEn ?? "",
        nameEn: product?.nameEn ?? product?.name ?? "",
        nameAr: product?.nameAr ?? product?.name ?? "",
        description: desc,
        descriptionEn: desc,
        descriptionAr: desc,
        price: product?.price ?? 0,
        originalPrice: product?.old_price ?? 0,
        stock: product?.stock ?? 0,
        inStock: (product?.stock ?? 0) > 0,
        isBestSeller: product?.is_best_seller ?? false,
        batteryLife: product?.features?.battery_life ?? "",
        noiseCancelling: product?.features?.noise_cancelling ?? false,
        audioFeatures: (product?.features?.audio ?? []).join(", "),
        freeShipping: product?.shipping?.free_shipping ?? false,
        shippingCondition: product?.shipping?.condition ?? "",
        warranty: product?.warranty ?? "",
        returns: product?.returns ?? "",
        categoryId: resolvedCategoryId,
      });
      setExistingMainImageUrl(product?.images?.main ?? "");
      setExistingGalleryImageUrls(product?.images?.gallery ?? []);
    } catch {
      const current = products.find((p) => p._id === id);
      if (current) {
        setForm({
          ...defaultProductFormState,
          name: current.nameEn,
          nameEn: current.nameEn,
          nameAr: current.nameAr,
          price: current.price,
          stock: current.stock,
          inStock: current.stock > 0,
          categoryId: current.categoryId?._id ?? "",
          isShow: current.isShow,
        });
        setExistingMainImageUrl(current.mainImage ?? "");
        setExistingGalleryImageUrls([]);
      }
    }
  };

  const submitAddProduct = () => {
    if (!mainImageFile) return;
    createProductMutation.mutate(toPayload(form, mainImageFile, galleryFiles));
  };

  const submitEditProduct = () => {
    if (!selectedProductId) return;
    updateProductMutation.mutate({
      id: selectedProductId,
      payload: toPayload(form, mainImageFile, galleryFiles, `prod_${selectedProductId}`),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProductsHeader onAddClick={() => setAddOpen(true)} />
        <ProductsTable
          products={products}
          search={search}
          filterTab={filterTab}
          onFilterTabChange={setFilterTab}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={openViewDialog}
          onEdit={openEditDialog}
          onDelete={handleDeleteProduct}
          deletingId={deleteProductMutation.isPending ? deleteProductMutation.variables : null}
          getCategoryLabel={getCategoryLabel}
        />
      </div>

      <ProductDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedProductQuery.isLoading}
        product={selectedProductQuery.data?.data.product}
      />

      <ProductFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Product"
        description="Create a product from dashboard table."
        form={form}
        setForm={setForm}
        categories={categories}
        isSubmitting={createProductMutation.isPending}
        submitLabel="Create Product"
        onSubmit={submitAddProduct}
        onMainImageChange={setMainImageFile}
        onGalleryChange={setGalleryFiles}
        showMainImageField
        existingMainImageUrl=""
        existingGalleryImageUrls={[]}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setProductIdPendingDelete(null);
        }}
        title="Delete this product?"
        description="It will be removed from the catalog. You can restore it from the server if needed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={deleteProductMutation.isPending}
        onConfirm={confirmDeleteProduct}
      />

      <ProductFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Product"
        description="Update key product fields."
        form={form}
        setForm={setForm}
        categories={categories}
        isSubmitting={updateProductMutation.isPending}
        submitLabel="Save Changes"
        onSubmit={submitEditProduct}
        onMainImageChange={setMainImageFile}
        onGalleryChange={setGalleryFiles}
        showMainImageField={false}
        existingMainImageUrl={existingMainImageUrl}
        existingGalleryImageUrls={existingGalleryImageUrls}
      />
    </DashboardLayout>
  );
};
