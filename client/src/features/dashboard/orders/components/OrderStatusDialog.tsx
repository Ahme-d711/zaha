import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";

const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

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
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm appearance-none"
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Status"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
