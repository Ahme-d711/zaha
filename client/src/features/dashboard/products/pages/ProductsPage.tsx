import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { ProductDetailsDialog } from "../components/ProductDetailsDialog";
import { ProductFormDialog } from "../components/ProductFormDialog";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductsTable } from "../components/ProductsTable";
import { ProductFormState, defaultProductFormState } from "../components/products.types";

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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string>("");
  const [existingGalleryImageUrls, setExistingGalleryImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState<ProductFormState>(defaultProductFormState);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-products", search],
    queryFn: () => dashboardManagementService.getProducts({ search, limit: 50 }),
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
      };

      const resolvedCategoryId =
        typeof product?.categoryId === "string"
          ? product.categoryId
          : product?.categoryId?._id ?? "";

      setForm({
        ...defaultProductFormState,
        name: product?.name ?? product?.nameEn ?? "",
        nameEn: product?.nameEn ?? product?.name ?? "",
        nameAr: product?.nameAr ?? product?.name ?? "",
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
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={openViewDialog}
          onEdit={openEditDialog}
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
