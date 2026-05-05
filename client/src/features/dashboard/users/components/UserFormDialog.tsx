import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserFormState } from "./users.types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  form: UserFormState;
  setForm: Dispatch<SetStateAction<UserFormState>>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: () => void;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  form,
  setForm,
  isSubmitting,
  submitLabel,
  onSubmit,
}: UserFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <Label>Email</Label>
        <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <Label>Phone</Label>
        <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
