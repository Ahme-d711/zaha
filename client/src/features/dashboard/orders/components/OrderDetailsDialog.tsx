import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  order?: {
    trackingNumber?: string;
    recipientName?: string;
    totalAmount?: number;
    paymentStatus?: string;
    status?: string;
  };
}

export const OrderDetailsDialog = ({
  open,
  onOpenChange,
  isLoading,
  order,
}: OrderDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>View complete order information.</DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
      ) : (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Tracking:</span> {order?.trackingNumber ?? "-"}</p>
          <p><span className="font-semibold">Recipient:</span> {order?.recipientName}</p>
          <p><span className="font-semibold">Total:</span> ${order?.totalAmount?.toFixed(2)}</p>
          <p><span className="font-semibold">Payment:</span> {order?.paymentStatus}</p>
          <p><span className="font-semibold">Status:</span> {order?.status}</p>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
