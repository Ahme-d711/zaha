import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  minimal?: boolean;
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
  minimal = false,
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
        {!minimal && <>
          <Label>Category Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => onImageChange?.(e.target.files?.[0] ?? null)} />
        </>}
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
