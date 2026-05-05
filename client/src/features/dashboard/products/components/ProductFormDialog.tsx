import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormState } from "./products.types";
import { CategoryListItem } from "@/api/dashboard-management.service";
import { resolveMediaUrl } from "@/lib/media-url";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: ProductFormState;
  setForm: Dispatch<SetStateAction<ProductFormState>>;
  categories: CategoryListItem[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onMainImageChange: (file: File | null) => void;
  onGalleryChange: (files: File[]) => void;
  showMainImageField: boolean;
  existingMainImageUrl?: string;
  existingGalleryImageUrls?: string[];
}

export const ProductFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  setForm,
  categories,
  isSubmitting,
  submitLabel,
  onSubmit,
  onMainImageChange,
  onGalleryChange,
  showMainImageField,
  existingMainImageUrl,
  existingGalleryImageUrls = [],
}: ProductFormDialogProps) => {
  const MAX_GALLERY_IMAGES = 4;
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string>("");
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [galleryLimitError, setGalleryLimitError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (mainPreviewUrl) URL.revokeObjectURL(mainPreviewUrl);
      galleryPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainPreviewUrl, galleryPreviewUrls]);

  const handleMainImageChange = (file: File | null) => {
    if (mainPreviewUrl) URL.revokeObjectURL(mainPreviewUrl);
    setMainPreviewUrl(file ? URL.createObjectURL(file) : "");
    onMainImageChange(file);
  };

  const handleGalleryChange = (files: File[]) => {
    const mergedFiles = [...selectedGalleryFiles, ...files];
    const uniqueFiles = mergedFiles.filter(
      (file, index, arr) =>
        index ===
        arr.findIndex(
          (candidate) =>
            candidate.name === file.name &&
            candidate.size === file.size &&
            candidate.lastModified === file.lastModified
        )
    );
    const limitedFiles = uniqueFiles.slice(0, MAX_GALLERY_IMAGES);

    if (uniqueFiles.length > MAX_GALLERY_IMAGES) {
      setGalleryLimitError(`Maximum ${MAX_GALLERY_IMAGES} images are allowed. First ${MAX_GALLERY_IMAGES} were selected.`);
    } else {
      setGalleryLimitError("");
    }

    setSelectedGalleryFiles(limitedFiles);

    galleryPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviewUrls(urls);
    onGalleryChange(limitedFiles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {(category as { name?: string; nameEn?: string }).name ?? category.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label>Old Price</Label>
            <Input type="number" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label>Best Seller</Label>
            <Input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm((p) => ({ ...p, isBestSeller: e.target.checked }))} />
          </div>
          <div className="space-y-2">
            <Label>Battery Life</Label>
            <Input value={form.batteryLife} onChange={(e) => setForm((p) => ({ ...p, batteryLife: e.target.value }))} placeholder="30h" />
          </div>
          <div className="space-y-2">
            <Label>Noise Cancelling</Label>
            <Input type="checkbox" checked={form.noiseCancelling} onChange={(e) => setForm((p) => ({ ...p, noiseCancelling: e.target.checked }))} />
          </div>
          <div className="space-y-2">
            <Label>Audio Features (comma separated)</Label>
            <Input value={form.audioFeatures} onChange={(e) => setForm((p) => ({ ...p, audioFeatures: e.target.value }))} placeholder="Adaptive EQ, Spatial Audio" />
          </div>
          <div className="space-y-2">
            <Label>Free Shipping</Label>
            <Input type="checkbox" checked={form.freeShipping} onChange={(e) => setForm((p) => ({ ...p, freeShipping: e.target.checked }))} />
          </div>
          <div className="space-y-2">
            <Label>Shipping Condition</Label>
            <Input value={form.shippingCondition} onChange={(e) => setForm((p) => ({ ...p, shippingCondition: e.target.value }))} placeholder="Orders over $50" />
          </div>
          <div className="space-y-2">
            <Label>Warranty</Label>
            <Input value={form.warranty} onChange={(e) => setForm((p) => ({ ...p, warranty: e.target.value }))} placeholder="2 years" />
          </div>
          <div className="space-y-2">
            <Label>Returns</Label>
            <Input value={form.returns} onChange={(e) => setForm((p) => ({ ...p, returns: e.target.value }))} placeholder="30 days" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Main Image</Label>
            {showMainImageField && (
              <Input type="file" accept="image/*" onChange={(e) => handleMainImageChange(e.target.files?.[0] ?? null)} />
            )}
            {mainPreviewUrl ? (
              <img
                src={mainPreviewUrl}
                alt="Main preview"
                className="w-32 h-32 rounded-md object-cover border border-border/50"
              />
            ) : (
              existingMainImageUrl && (
                <img
                  src={resolveMediaUrl(existingMainImageUrl)}
                  alt="Current main image"
                  className="w-32 h-32 rounded-md object-cover border border-border/50"
                />
              )
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Gallery Images</Label>
            <Input type="file" accept="image/*" multiple onChange={(e) => handleGalleryChange(Array.from(e.target.files ?? []))} />
            {galleryLimitError && <p className="text-xs text-amber-500">{galleryLimitError}</p>}
            {galleryPreviewUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {galleryPreviewUrls.map((url, idx) => (
                  <img
                    key={`${url}-${idx}`}
                    src={url}
                    alt={`Gallery preview ${idx + 1}`}
                    className="w-24 h-24 rounded-md object-cover border border-border/50"
                  />
                ))}
              </div>
            ) : (
              existingGalleryImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {existingGalleryImageUrls.map((url, idx) => (
                    <img
                      key={`${url}-${idx}`}
                      src={resolveMediaUrl(url)}
                      alt={`Current gallery image ${idx + 1}`}
                      className="w-24 h-24 rounded-md object-cover border border-border/50"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
