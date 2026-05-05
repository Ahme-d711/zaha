import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const OrderStatusDialog = ({
  open,
  onOpenChange,
  status,
  onStatusChange,
  isSubmitting,
  onSubmit,
}: OrderStatusDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Order Status</DialogTitle>
        <DialogDescription>Update order workflow state.</DialogDescription>
      </DialogHeader>
      <Input value={status} onChange={(e) => onStatusChange(e.target.value.toUpperCase())} />
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Status"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
