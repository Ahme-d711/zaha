import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { dashboardManagementService } from "@/api/dashboard-management.service";
import { CategoriesGrid } from "../components/CategoriesGrid";
import { CategoriesHeader } from "../components/CategoriesHeader";
import { CategoryDetailsDialog } from "../components/CategoryDetailsDialog";
import { CategoryFormDialog } from "../components/CategoryFormDialog";
import { CategoryFormState, defaultCategoryFormState } from "../components/categories.types";

const toPayload = (form: CategoryFormState, imageFile: File | null) => {
  const payload = new FormData();
  payload.append("name", form.name);
  payload.append("description", form.description);
  payload.append("priority", String(form.priority));
  payload.append("isShow", String(form.isShow));
  if (imageFile) payload.append("image", imageFile);
  return payload;
};

export const CategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<CategoryFormState>(defaultCategoryFormState);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryIdPendingDelete, setCategoryIdPendingDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-categories", search],
    queryFn: () => dashboardManagementService.getCategories({ search, limit: 30 }),
  });

  const selectedCategoryQuery = useQuery({
    queryKey: ["dashboard-category", selectedCategoryId],
    queryFn: () => dashboardManagementService.getCategoryById(selectedCategoryId as string),
    enabled: !!selectedCategoryId,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: FormData) => dashboardManagementService.createCategory(payload),
    onSuccess: () => {
      setAddOpen(false);
      setImageFile(null);
      setForm(defaultCategoryFormState);
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? "Failed to create category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      dashboardManagementService.updateCategory(id, payload),
    onSuccess: () => {
      setEditOpen(false);
      setImageFile(null);
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
      if (selectedCategoryId) {
        queryClient.invalidateQueries({ queryKey: ["dashboard-category", selectedCategoryId] });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? "Failed to update category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => dashboardManagementService.deleteCategory(id),
    onSuccess: (_data, deletedId) => {
      toast.success("Category deleted");
      setDeleteConfirmOpen(false);
      setCategoryIdPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
      queryClient.removeQueries({ queryKey: ["dashboard-category", deletedId] });
      if (selectedCategoryId === deletedId) {
        setViewOpen(false);
        setEditOpen(false);
        setSelectedCategoryId(null);
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? "Failed to delete category");
    },
  });

  const categories = data?.data?.categories ?? [];

  const editingCategoryImage =
    categories.find((c) => c._id === selectedCategoryId)?.image ?? "";

  const handleRequestDelete = (id: string) => {
    setCategoryIdPendingDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryIdPendingDelete) {
      deleteCategoryMutation.mutate(categoryIdPendingDelete);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CategoriesHeader onAdd={() => setAddOpen(true)} />
        <CategoriesGrid
          categories={categories}
          search={search}
          isLoading={isLoading}
          isError={isError}
          onSearchChange={setSearch}
          onView={(id) => {
            setSelectedCategoryId(id);
            setViewOpen(true);
          }}
          onEdit={(id) => {
            const current = categories.find((c) => c._id === id);
            if (!current) return;
            setImageFile(null);
            setForm({
              name: (current as { name?: string; nameEn?: string }).name ?? current.nameEn ?? "",
              description:
                (current as { description?: string; descriptionEn?: string }).description ??
                current.descriptionEn ??
                "",
              priority: current.priority ?? 0,
              isShow: current.isShow ?? true,
            });
            setSelectedCategoryId(id);
            setEditOpen(true);
          }}
          onDelete={handleRequestDelete}
          deletingId={deleteCategoryMutation.isPending ? deleteCategoryMutation.variables : null}
        />
      </div>

      <CategoryDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        isLoading={selectedCategoryQuery.isLoading}
        category={selectedCategoryQuery.data?.data.category}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setCategoryIdPendingDelete(null);
        }}
        title="Delete this category?"
        description="It will be hidden from the catalog. Products already in this category are unchanged; reassign them if needed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={deleteCategoryMutation.isPending}
        onConfirm={confirmDeleteCategory}
      />

      <CategoryFormDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) {
            setImageFile(null);
            setForm(defaultCategoryFormState);
          }
        }}
        title="Add Category"
        description="Create a new category."
        form={form}
        setForm={setForm}
        isSubmitting={createCategoryMutation.isPending}
        submitLabel="Create Category"
        onSubmit={() => createCategoryMutation.mutate(toPayload(form, imageFile))}
        onImageChange={setImageFile}
      />

      <CategoryFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setImageFile(null);
        }}
        title="Edit Category"
        description="Update selected category."
        form={form}
        setForm={setForm}
        isSubmitting={updateCategoryMutation.isPending}
        submitLabel="Save Changes"
        onSubmit={() =>
          selectedCategoryId &&
          updateCategoryMutation.mutate({ id: selectedCategoryId, payload: toPayload(form, imageFile) })
        }
        onImageChange={setImageFile}
        existingImageUrl={editOpen ? editingCategoryImage : undefined}
      />
    </DashboardLayout>
  );
};
