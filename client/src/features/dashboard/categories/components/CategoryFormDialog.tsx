import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveMediaUrl } from "@/lib/media-url";
import { CategoryFormState } from "./categories.types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onImageChange?: (file: File | null) => void;
  /** Shown when editing — current image from API (path or URL) */
  existingImageUrl?: string;
}

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  setForm,
  isSubmitting,
  submitLabel,
  onSubmit,
  onImageChange,
  existingImageUrl,
}: CategoryFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3">
        <Label>Name</Label>
        <Input value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <Label>Description</Label>
        <Textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <Label>Priority</Label>
        <Input type="number" value={form.priority ?? 0} onChange={(e) => setForm((p) => ({ ...p, priority: Number(e.target.value) }))} />
        <Label>Visible</Label>
        <Input type="checkbox" checked={form.isShow ?? false} onChange={(e) => setForm((p) => ({ ...p, isShow: e.target.checked }))} />
        <>
          <Label>Category image {existingImageUrl ? "(optional — upload to replace)" : ""}</Label>
          {existingImageUrl ? (
            <img
              src={resolveMediaUrl(existingImageUrl)}
              alt=""
              className="h-20 w-20 rounded-xl object-cover border border-border/50"
            />
          ) : null}
          <Input type="file" accept="image/*" onChange={(e) => onImageChange?.(e.target.files?.[0] ?? null)} />
        </>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
